'use client';

import React, { useState } from 'react';
import { BrandAsset, UserAccount } from '@/lib/types';
import {
  Upload,
  Lock,
  Eye,
  Shield,
} from 'lucide-react';
import { getWatermarkedUrl } from '@/lib/cloudinary';

interface AssetLibraryProps {
  assets: BrandAsset[];
  currentUser: UserAccount;
  onAddAsset: (asset: BrandAsset) => void;
  onLogAudit: (action: string, details: string, category: any) => void;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({
  assets,
  currentUser,
  onAddAsset,
  onLogAudit,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<BrandAsset | null>(null);

  const canViewConfidential = currentUser.role === 'admin' || currentUser.role === 'manager';

  const filtered = assets.filter((a) => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64,
            fileName: file.name,
            folder: 'vibecheck_assets',
          }),
        });
        const data = await res.json();

        const newAsset: BrandAsset = {
          id: `ast_${Date.now()}`,
          orgId: currentUser.orgId,
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: file.type.includes('image') ? 'image' : 'guideline_doc',
          url: data.asset?.secure_url || base64,
          format: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          sizeBytes: file.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: currentUser.name,
          isConfidential: false,
        };

        onAddAsset(newAsset);
        onLogAudit(
          'Brand Asset Uploaded to Cloudinary',
          `Uploaded "${file.name}" to Cloudinary asset storage.`,
          'asset'
        );
      } catch (err) {
        console.error('Asset upload error:', err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sand-100 to-sand-50 border border-sand-300">
        <div>
          <h2 className="text-xl font-serif font-bold text-sand-900">
            Brand Asset Library & Media CDN
          </h2>
          <p className="text-xs text-sand-600">
            Cloudinary-backed storage with role-based watermark enforcement for sensitive media.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-4 py-2 text-xs font-semibold rounded-xl bg-sand-900 hover:bg-sand-800 text-sand-50 flex items-center gap-1.5 shadow-sm">
            <Upload className="h-3.5 w-3.5 text-sand-300" />
            {isUploading ? 'Uploading to Cloudinary...' : 'Upload Media Asset'}
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Security Notice for Confidential Assets */}
      <div className="p-3.5 rounded-xl bg-sand-100 border border-sand-300 flex items-center justify-between text-xs text-sand-800">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-amber-700" />
          <span>
            Current viewing clearance: <strong className="capitalize">{currentUser.role}</strong>
          </span>
        </div>
        <span className="text-[11px] text-sand-600">
          {canViewConfidential
            ? 'Full unwatermarked access authorized.'
            : 'Confidential assets will render with security watermark overlays.'}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-sand-200 gap-2 pb-1">
        {['all', 'logo', 'image', 'color_swatch', 'guideline_doc'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all ${
              filterType === type
                ? 'bg-sand-900 text-sand-50'
                : 'text-sand-600 hover:bg-sand-100'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((asset) => {
          const isGated = asset.isConfidential && !canViewConfidential;
          const displayUrl = isGated ? getWatermarkedUrl(asset.url) : asset.url;

          return (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-sand-300 overflow-hidden shadow-xs hover:border-sand-400 transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 bg-sand-100 flex items-center justify-center overflow-hidden">
                <img
                  src={displayUrl}
                  alt={asset.title}
                  className="w-full h-full object-cover"
                />

                {asset.isConfidential && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-900/80 text-amber-100 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Confidential
                  </span>
                )}

                {isGated && (
                  <div className="absolute inset-0 bg-sand-950/40 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
                    <div className="text-white text-xs font-bold uppercase tracking-wider bg-sand-950/80 px-2.5 py-1.5 rounded-lg border border-white/20">
                      Watermark Enforced
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sand-100 text-sand-700">
                    {asset.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-sand-500">
                    {asset.format} • {(asset.sizeBytes / 1024).toFixed(0)} KB
                  </span>
                </div>

                <h4 className="text-xs font-bold text-sand-900 line-clamp-1">
                  {asset.title}
                </h4>

                <div className="flex items-center justify-between pt-1 border-t border-sand-100 text-[11px] text-sand-500">
                  <span>By {asset.uploadedBy}</span>
                  <button
                    onClick={() => setPreviewAsset(asset)}
                    className="text-sand-700 hover:text-sand-950 font-semibold flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Asset Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-sand-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-sand-300 shadow-modal max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <h3 className="text-base font-bold text-sand-900 font-serif">
                {previewAsset.title}
              </h3>
              <button
                onClick={() => setPreviewAsset(null)}
                className="text-xs text-sand-400 hover:text-sand-800 font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="max-h-96 overflow-hidden rounded-xl bg-sand-100 flex items-center justify-center">
              <img
                src={previewAsset.url}
                alt={previewAsset.title}
                className="max-h-96 w-auto object-contain"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs bg-sand-50 p-3 rounded-xl border border-sand-200">
              <div>
                <span className="text-sand-500 font-medium block">Format:</span>
                <span className="font-bold text-sand-900">{previewAsset.format}</span>
              </div>
              <div>
                <span className="text-sand-500 font-medium block">File Size:</span>
                <span className="font-bold text-sand-900">
                  {(previewAsset.sizeBytes / 1024).toFixed(0)} KB
                </span>
              </div>
              <div>
                <span className="text-sand-500 font-medium block">Confidentiality:</span>
                <span className="font-bold text-sand-900">
                  {previewAsset.isConfidential ? 'Restricted Asset' : 'Public Asset'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

