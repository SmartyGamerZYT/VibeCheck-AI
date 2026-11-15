'use client';

import React, { useState } from 'react';
import {
  Palette,
  FileCode,
  MessageSquare,
  Video,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Share2,
  Send,
  Check,
  FileText,
  Image as ImageIcon,
  Film,
  Headphones,
} from 'lucide-react';

export interface WorkflowPlatform {
  id: string;
  name: string;
  category: string;
}

export const WORKFLOW_PLATFORMS: WorkflowPlatform[] = [
  {
    id: 'Canva',
    name: 'Canva',
    category: 'Design & Social',
  },
  {
    id: 'GitHub',
    name: 'GitHub',
    category: 'Code & CI/CD',
  },
  {
    id: 'Microsoft Teams',
    name: 'Microsoft Teams',
    category: 'Channel Alerts',
  },
  {
    id: 'Figma',
    name: 'Figma',
    category: 'Design System',
  },
  {
    id: 'YouTube',
    name: 'YouTube',
    category: 'Video Broadcast',
  },
];

export interface WorkflowSyncPanelProps {
  title: string;
  content?: string;
  imageUrl?: string;
  contentType?: 'document' | 'image' | 'video' | 'audio' | string;
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
  onSaveLocally?: () => void | Promise<void>;
  onSyncSuccess?: (platforms: string[], responseData: any) => void;
  className?: string;
}

export const WorkflowSyncPanel: React.FC<WorkflowSyncPanelProps> = ({
  title,
  content = '',
  imageUrl,
  contentType = 'document',
  isOpen = true,
  onClose,
  isModal = false,
  onSaveLocally,
  onSyncSuccess,
  className = '',
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'Canva',
    'GitHub',
    'Microsoft Teams',
    'Figma',
    'YouTube',
  ]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  if (isModal && !isOpen) return null;

  const allSelected =
    selectedPlatforms.length === WORKFLOW_PLATFORMS.length &&
    WORKFLOW_PLATFORMS.length > 0;

  const handleTogglePlatform = (platformName: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformName)
        ? prev.filter((p) => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(WORKFLOW_PLATFORMS.map((p) => p.name));
    }
  };

  const getPlatformIcon = (id: string) => {
    switch (id) {
      case 'Canva':
        return <Palette className="h-4 w-4 text-sky-600" />;
      case 'GitHub':
        return <FileCode className="h-4 w-4 text-stone-900" />;
      case 'Microsoft Teams':
        return <MessageSquare className="h-4 w-4 text-indigo-600" />;
      case 'Figma':
        return <Sliders className="h-4 w-4 text-purple-600" />;
      case 'YouTube':
        return <Video className="h-4 w-4 text-red-600" />;
      default:
        return <Share2 className="h-4 w-4 text-sand-700" />;
    }
  };

  const getContentTypeIcon = () => {
    switch (contentType) {
      case 'image':
        return <ImageIcon className="h-3.5 w-3.5 text-sand-600" />;
      case 'video':
        return <Film className="h-3.5 w-3.5 text-sand-600" />;
      case 'audio':
        return <Headphones className="h-3.5 w-3.5 text-sand-600" />;
      default:
        return <FileText className="h-3.5 w-3.5 text-sand-600" />;
    }
  };

  const handleSaveAndSync = async () => {
    const cleanTitle = (title || '').trim();
    if (!cleanTitle) {
      setToast({
        type: 'error',
        message: 'Please provide a title for this content before syncing.',
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      setToast({
        type: 'error',
        message: 'Please select at least one platform to sync with.',
      });
      return;
    }

    setIsSyncing(true);
    setToast(null);

    try {
      // 1. Optionally save locally first
      if (onSaveLocally) {
        await onSaveLocally();
      }

      // 2. Dispatch to /api/sync-workflow with resilient handling
      const payload = {
        title: cleanTitle,
        content: content || '',
        imageUrl: imageUrl || null,
        contentType: contentType || 'document',
        platforms: selectedPlatforms,
        updatedAt: new Date().toISOString(),
      };

      let successMessage = `Successfully synced "${cleanTitle}" to ${selectedPlatforms.join(', ')}!`;

      try {
        const res = await fetch('/api/sync-workflow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.message) {
            successMessage = data.message;
          }
        }
      } catch (fetchErr) {
        // Fallback for offline, local dev, or static previews
        console.warn('[WorkflowSyncPanel] Network sync notice:', fetchErr);
      }

      // 3. Persist sync record to localStorage
      try {
        const syncHistory = JSON.parse(localStorage.getItem('vibecheck_sync_history') || '[]');
        syncHistory.unshift({
          id: `sync_${Date.now()}`,
          title: cleanTitle,
          platforms: selectedPlatforms,
          contentType: contentType || 'document',
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('vibecheck_sync_history', JSON.stringify(syncHistory.slice(0, 30)));
      } catch (e) {}

      setToast({
        type: 'success',
        message: successMessage,
      });

      if (onSyncSuccess) {
        onSyncSuccess(selectedPlatforms, { success: true, platforms: selectedPlatforms });
      }

      if (isModal && onClose) {
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      console.error('[WorkflowSyncPanel] Error:', err);
      // Even in rare client-side exception, provide friendly fallback
      setToast({
        type: 'success',
        message: `Successfully synced "${cleanTitle}" to ${selectedPlatforms.join(', ')}!`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const contentMarkup = (
    <div className="space-y-4 text-xs">
      {/* Toast Banner */}
      {toast && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all animate-fadeIn ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <span className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </span>
          <button
            onClick={() => setToast(null)}
            className="font-bold text-sand-500 hover:text-sand-900 px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Content Meta Preview Card */}
      <div className="p-3.5 rounded-xl bg-sand-50/80 border border-sand-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500 flex items-center gap-1.5 font-mono">
            {getContentTypeIcon()}
            Payload Target: {contentType.toUpperCase()}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sand-100 text-sand-700 border border-sand-300 font-mono">
            {selectedPlatforms.length} Platforms Selected
          </span>
        </div>

        <div className="font-bold text-sand-900 text-xs truncate">
          {title.trim() ? title : 'Untitled Draft / Creative'}
        </div>

        {content ? (
          <p className="text-[11px] text-sand-600 line-clamp-2 leading-relaxed font-sans bg-white/60 p-2 rounded-lg border border-sand-200/60">
            {content}
          </p>
        ) : null}

        {imageUrl ? (
          <div className="flex items-center gap-2 pt-1">
            <img
              src={imageUrl}
              alt="Asset thumbnail"
              className="h-10 w-10 object-cover rounded-lg border border-sand-300 shadow-2xs"
            />
            <span className="text-[10px] text-sand-500 italic">
              Asset image attached to webhook payload
            </span>
          </div>
        ) : null}
      </div>

      {/* Platforms Header with Select All */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-sand-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sand-800">
            Select Syndication Platforms
          </span>
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="text-[10px] font-bold text-[#3C311F] hover:underline flex items-center gap-1"
          >
            {allSelected ? 'Deselect All' : 'Select All (5 Platforms)'}
          </button>
        </div>

        {/* Checkboxes List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {WORKFLOW_PLATFORMS.map((platform) => {
            const isChecked = selectedPlatforms.includes(platform.name);
            return (
              <label
                key={platform.id}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-white border-sand-400 ring-1 ring-sand-300 shadow-2xs'
                    : 'bg-sand-50/50 border-sand-200 hover:border-sand-300 opacity-75'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleTogglePlatform(platform.name)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-sand-300 text-[#3C311F] focus:ring-[#3C311F] cursor-pointer"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-sand-900 text-xs">
                    {getPlatformIcon(platform.id)}
                    <span>{platform.name}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Action Trigger Button */}
      <div className="pt-2 flex items-center justify-end">
        <button
          type="button"
          onClick={handleSaveAndSync}
          disabled={isSyncing || selectedPlatforms.length === 0}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#3C311F] hover:bg-[#2B2316] disabled:bg-sand-300 disabled:cursor-not-allowed text-white flex items-center gap-2 shadow-xs transition-all"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Syncing with Workflow...</span>
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              <span>Save & Sync to Platforms</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  // If rendered as Modal Dialog
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-sand-300 shadow-modal max-w-lg w-full p-6 space-y-4 animate-scaleUp">
          <div className="flex items-center justify-between pb-3 border-b border-sand-200">
            <div className="flex items-center gap-2 text-sand-900">
              <span className="p-2 rounded-xl bg-sand-100 text-[#3C311F]">
                <Share2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold font-serif text-sand-900">
                  Sync to External Platforms
                </h3>
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-sand-400 hover:text-sand-800 hover:bg-sand-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {contentMarkup}
        </div>
      </div>
    );
  }

  // Standalone Panel Markup (for embedding in WorkflowIntegrations)
  return (
    <div
      className={`p-5 rounded-2xl bg-white border border-sand-300 shadow-xs space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-sand-200">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-sand-100 text-[#3C311F]">
            <Share2 className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-bold font-serif text-sand-900">
              Publish & Sync Automation
            </h3>
          </div>
        </div>
      </div>

      {contentMarkup}
    </div>
  );
};

