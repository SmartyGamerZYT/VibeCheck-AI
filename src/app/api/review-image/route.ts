import { NextResponse } from 'next/server';
import { analyzeImageWithVisionAI } from '@/lib/image-analysis';
import { DEFAULT_BRAND_GUIDELINES } from '@/lib/default-data';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, guidelines, apiKey } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'imageBase64 is required' }, { status: 400 });
    }

    const brandGuidelines = guidelines || DEFAULT_BRAND_GUIDELINES;
    const result = await analyzeImageWithVisionAI(imageBase64, brandGuidelines, apiKey);

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error('API /review-image error:', err);
    return NextResponse.json({ error: err.message || 'Image analysis error' }, { status: 500 });
  }
}

