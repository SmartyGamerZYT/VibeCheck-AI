import { NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });

    return NextResponse.json({
      success: true,
      text: result.value,
      messages: result.messages,
    });
  } catch (err: any) {
    console.error('API /extract-docx error:', err);
    return NextResponse.json({ error: err.message || 'DOCX extraction failed' }, { status: 500 });
  }
}

