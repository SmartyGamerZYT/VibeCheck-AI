import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { audioBase64, mimeType = 'audio/mp3', apiKey } = body;

    if (!audioBase64) {
      return NextResponse.json({ error: 'Missing audio data' }, { status: 400 });
    }

    const envKey = (process.env.OPENROUTER_API_KEY || '').trim().replace(/['"]/g, '');
    const userKey = (apiKey || '').trim().replace(/['"]/g, '');
    const candidateKeys = [userKey, envKey].filter((k) => k && k.startsWith('sk-or-v1-'));

    if (candidateKeys.length === 0) {
      return NextResponse.json(
        { error: 'OpenRouter API key is missing or invalid' },
        { status: 401 }
      );
    }

    const activeKey = candidateKeys[0];
    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
    const audioDataUrl = `data:${mimeType};base64,${cleanBase64}`;

    // Prompt Gemini via OpenRouter to transcribe the audio verbatim
    const prompt = `You are an expert speech-to-text transcriber. 
Transcribe the speech in this audio file verbatim without omitting words, stutters, grammar mistakes, or slang.
If there is no clear speech, transcribe any audible words or provide a concise transcription of the speech.
Return ONLY valid JSON with this exact format:
{
  "transcript": "Verbatim transcript of the speech here"
}`;

    // Try multimodal call to OpenRouter with Gemini
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeKey}`,
        'HTTP-Referer': 'https://vibecheck.ai',
        'X-Title': 'VibeCheck AI Speech Transcriber',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url', // OpenRouter supports data URLs for audio under image_url or input_audio
                image_url: {
                  url: audioDataUrl,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('OpenRouter audio transcription error:', response.status, errText);

      // Attempt fallback with alternative payload structure
      const fallbackResp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeKey}`,
          'HTTP-Referer': 'https://vibecheck.ai',
          'X-Title': 'VibeCheck AI Speech Transcriber',
        },
        body: JSON.stringify({
          model: 'google/gemini-1.5-flash',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'input_audio',
                  input_audio: {
                    data: cleanBase64,
                    format: mimeType.includes('wav') ? 'wav' : 'mp3',
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
        }),
      });

      if (!fallbackResp.ok) {
        return NextResponse.json({
          success: false,
          error: 'Could not automatically transcribe audio stream via API. You can record live or edit the transcript directly.',
        });
      }

      const fbData = await fallbackResp.json();
      const rawFb = fbData?.choices?.[0]?.message?.content || '';
      const cleanFb = rawFb.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedFb = JSON.parse(cleanFb);
      return NextResponse.json({ success: true, transcript: parsedFb.transcript || cleanFb });
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || '';
    const cleanContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(cleanContent);
      return NextResponse.json({ success: true, transcript: parsed.transcript || cleanContent });
    } catch {
      return NextResponse.json({ success: true, transcript: cleanContent });
    }
  } catch (err: any) {
    console.error('API /transcribe-audio error:', err);
    return NextResponse.json({ error: err.message || 'Audio transcription error' }, { status: 500 });
  }
}

