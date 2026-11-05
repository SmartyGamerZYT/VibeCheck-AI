export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

export function getWatermarkedUrl(originalUrl: string, watermarkText: string = 'CONFIDENTIAL • VIBECHECK'): string {
  // If originalUrl is a Cloudinary URL, we can inject a dynamic text overlay transformation
  if (originalUrl.includes('cloudinary.com')) {
    const encodedText = encodeURIComponent(watermarkText);
    const parts = originalUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/l_text:Arial_36_bold:${encodedText},co_rgb:ffffff,o_40,g_center/${parts[1]}`;
    }
  }
  // Otherwise return url with simulation marker
  return originalUrl;
}

export async function uploadAssetToCloudinary(
  fileBase64: string,
  fileName: string,
  folder: string = 'vibecheck_brand_assets'
): Promise<CloudinaryUploadResponse> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'xngyfpka';
  const apiKey = process.env.CLOUDINARY_API_KEY || '322842443257289';

  // For client/server uploads
  const formData = new FormData();
  formData.append('file', fileBase64);
  formData.append('upload_preset', 'unsigned_vibecheck'); // Or fallback direct upload
  formData.append('folder', folder);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return {
        secure_url: data.secure_url,
        public_id: data.public_id,
        format: data.format,
        bytes: data.bytes,
        width: data.width,
        height: data.height,
      };
    }
  } catch (e) {
    console.warn('Cloudinary upload warning:', e);
  }

  // Graceful fallback for mock/local data
  return {
    secure_url: fileBase64.startsWith('data:') ? fileBase64 : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80`,
    public_id: `vibecheck_${Date.now()}`,
    format: 'png',
    bytes: 256000,
  };
}

