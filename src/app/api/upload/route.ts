import { NextResponse } from 'next/server';
import { uploadAssetToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileBase64, fileName, folder } = body;

    if (!fileBase64) {
      return NextResponse.json({ error: 'fileBase64 is required' }, { status: 400 });
    }

    const uploadRes = await uploadAssetToCloudinary(fileBase64, fileName || 'asset', folder);

    return NextResponse.json({ success: true, asset: uploadRes });
  } catch (err: any) {
    console.error('API /upload error:', err);
    return NextResponse.json({ error: err.message || 'Asset upload failed' }, { status: 500 });
  }
}

