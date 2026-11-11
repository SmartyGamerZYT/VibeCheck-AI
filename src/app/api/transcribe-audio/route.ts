import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { audioBase64, mimeType = 'audio/mp3', apiKey, googleGeminiKey } = body;

    if (!audioBase64) {
      return NextResponse.json({ error: 'Missing audio data' }, { status: 400 });
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');

    // 1. If user provided a free Google Gemini API Key (from aistudio.google.com)
    const directGeminiKey = (
      googleGeminiKey ||
      process.env.GEMINI_API_KEY ||
      ''
    ).trim();

    if (directGeminiKey && directGeminiKey.startsWith('AIza')) {
      try {
        const geminiResp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${directGeminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: 'Transcribe the following audio recording verbatim. Output ONLY the transcribed text.',
                    },
                    {
                      inline_data: {
                        mime_type: mimeType.includes('wav') ? 'audio/wav' : 'audio/mp3',
                        data: cleanBase64,
                      },
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiResp.ok) {
          const gData = await geminiResp.json();
          const transcript =
            gData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          if (transcript) {
            return NextResponse.json({ success: true, transcript });
          }
        }
      } catch (e) {
        console.warn('Direct Google Gemini API transcription error:', e);
      }
    }

    // 2. OpenRouter with active key
    const envKey = (process.env.OPENROUTER_API_KEY || '').trim().replace(/['"]/g, '');
    const userKey = (apiKey || '').trim().replace(/['"]/g, '');
    const candidateKeys = [userKey, envKey].filter((k) => k && k.startsWith('sk-or-v1-'));

    if (candidateKeys.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            'API key missing. Use the Record Live Voice button or enter a key in Settings.',
        },
        { status: 401 }
      );
    }

    const activeKey = candidateKeys[0];

    const prompt = `You are an expert speech transcriber. Transcribe the speech in this audio file verbatim without omitting words.
Return ONLY valid JSON:
{
  "transcript": "Verbatim transcript of speech"
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeKey}`,
        'HTTP-Referer': 'https://vibecheck.ai',
        'X-Title': 'VibeCheck AI Speech Transcriber',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        max_tokens: 1500,
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
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      const errMsg = errJson?.error?.message || '';

      if (errMsg.includes('requires at least $0.50 in balance for audio') || response.status === 402) {
        return NextResponse.json({
          success: false,
          requiresCredit: true,
          error:
            'OpenRouter charges $0.50 minimum balance for binary audio uploads. Use the built-in free "Record Live Voice" button (0 API keys required) or add a free Google Gemini key from aistudio.google.com in Settings.',
        });
      }

      return NextResponse.json({
        success: false,
        error: errMsg || 'Speech transcription failed via API.',
      });
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
