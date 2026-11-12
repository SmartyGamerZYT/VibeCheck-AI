import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { audioBase64, mimeType = 'audio/mp3', apiKey } = body;

    if (!audioBase64) {
      return NextResponse.json({ error: 'Missing audio data' }, { status: 400 });
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');

    // 1. Check for API key if provided
    const envKey = (process.env.OPENROUTER_API_KEY || '').trim().replace(/['"]/g, '');
    const userKey = (apiKey || '').trim().replace(/['"]/g, '');
    const candidateKeys = [userKey, envKey].filter((k) => k && k.startsWith('sk-or-v1-'));

    let lastError = '';

    if (candidateKeys.length > 0) {
      const activeKey = candidateKeys[0];
      const prompt = `Transcribe the speech in this audio recording verbatim. Return ONLY valid JSON:
{
  "transcript": "Verbatim transcript of speech"
}`;

      const audioModels = [
        'google/gemini-2.0-flash-001',
        'google/gemini-flash-1.5',
        'meta-llama/llama-3.2-11b-vision-instruct',
      ];

      for (const model of audioModels) {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${activeKey}`,
              'HTTP-Referer': 'https://vibecheck.ai',
              'X-Title': 'VibeCheck AI Speech Transcriber',
            },
            body: JSON.stringify({
              model,
              max_tokens: 1500,
              messages: [
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: prompt },
                    {
                      type: 'image_url',
                      image_url: {
                        url: `data:${mimeType};base64,${cleanBase64}`,
                      },
                    },
                  ],
                },
              ],
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const rawContent = data?.choices?.[0]?.message?.content || '';
            const cleanContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
              const parsed = JSON.parse(cleanContent);
              if (parsed.transcript) {
                return NextResponse.json({
                  success: true,
                  transcript: parsed.transcript,
                  modelUsed: model,
                });
              }
            } catch {
              if (cleanContent) {
                return NextResponse.json({
                  success: true,
                  transcript: cleanContent,
                  modelUsed: model,
                });
              }
            }
          } else {
            const errJson = await response.json().catch(() => null);
            lastError = errJson?.error?.message || response.statusText;
          }
        } catch (mErr: any) {
          lastError = mErr.message || 'Network error';
        }
      }
    }

    // If external key not configured or failed, inform client to use puter.js client-side transcription
    return NextResponse.json(
      {
        success: false,
        error: lastError || 'Server-side key unavailable. Puter.js will transcribe on client.',
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('API /transcribe-audio error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Audio transcription error' },
      { status: 500 }
    );
  }
}
