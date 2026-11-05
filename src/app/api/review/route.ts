import { NextResponse } from 'next/server';
import { analyzeContentWithOpenRouter } from '@/lib/openrouter';
import { DEFAULT_BRAND_GUIDELINES } from '@/lib/default-data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, guidelines, format, channel, apiKey } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Missing content string to review' }, { status: 400 });
    }

    const brandGuidelines = guidelines || DEFAULT_BRAND_GUIDELINES;
    const result = await analyzeContentWithOpenRouter(
      content,
      brandGuidelines,
      format || 'text',
      channel,
      apiKey
    );

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error('API /review error:', err);
    return NextResponse.json({ error: err.message || 'Internal review error' }, { status: 500 });
  }
}

