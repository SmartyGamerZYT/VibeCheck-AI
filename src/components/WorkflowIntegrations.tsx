'use client';

import React, { useState } from 'react';
import {
  ConnectedPlatform,
  SupportedIntegrationPlatform,
  UserAccount,
} from '@/lib/types';
import { INITIAL_INTEGRATIONS } from '@/lib/default-data';
import {
  Workflow,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Plus,
  Send,
  Sliders,
  ShieldCheck,
  Radio,
  FileCode,
  Palette,
  MessageSquare,
  Video,
  Share2,
  Check,
  AlertCircle,
} from 'lucide-react';

interface WorkflowIntegrationsProps {
  currentUser: UserAccount;
  onLogAudit: (action: string, details: string, category: any) => void;
}

export const WorkflowIntegrations: React.FC<WorkflowIntegrationsProps> = ({
  currentUser,
  onLogAudit,
}) => {
  const [integrations, setIntegrations] = useState<ConnectedPlatform[]>(INITIAL_INTEGRATIONS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [syncingPlatform, setSyncingPlatform] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Modal State for platform settings
  const [selectedPlatform, setSelectedPlatform] = useState<ConnectedPlatform | null>(null);
  const [editWebhookUrl, setEditWebhookUrl] = useState('');
  const [editChannel, setEditChannel] = useState('');
  const [editAutoSync, setEditAutoSync] = useState(true);

  // Toggle connection
  const handleToggleConnection = (platformId: SupportedIntegrationPlatform) => {
    setIntegrations((prev) =>
      prev.map((p) => {
        if (p.id === platformId) {
          const nextState = !p.isConnected;
          onLogAudit(
            nextState ? 'Platform Connected' : 'Platform Disconnected',
            `${currentUser.name} ${nextState ? 'authorized' : 'revoked'} integration with ${p.name}.`,
            'workflow'
          );
          return {
            ...p,
            isConnected: nextState,
            connectedAt: nextState ? new Date().toISOString() : undefined,
            connectedAccount: nextState ? `${currentUser.orgName} Official` : undefined,
          };
        }
        return p;
      })
    );
  };

  // Trigger manual sync
  const handleSyncPlatform = (platform: ConnectedPlatform) => {
    setSyncingPlatform(platform.id);
    setTimeout(() => {
      setSyncingPlatform(null);
      setNotificationToast(`Successfully synced latest compliant brand assets with ${platform.name}!`);
      setTimeout(() => setNotificationToast(null), 3500);

      onLogAudit(
        'Platform Assets Synced',
        `Dispatched certified guidelines & approved copy to ${platform.name}.`,
        'workflow'
      );
    }, 1200);
  };

  // Open modal
  const handleOpenConfig = (p: ConnectedPlatform) => {
    setSelectedPlatform(p);
    setEditWebhookUrl(p.webhookUrl || '');
    setEditChannel(p.channelOrWorkspace || '');
    setEditAutoSync(p.autoSyncApprovedContent);
  };

  const handleSaveConfig = () => {
    if (!selectedPlatform) return;
    setIntegrations((prev) =>
      prev.map((p) =>
        p.id === selectedPlatform.id
          ? {
              ...p,
              webhookUrl: editWebhookUrl,
              channelOrWorkspace: editChannel,
              autoSyncApprovedContent: editAutoSync,
            }
          : p
      )
    );
    setSelectedPlatform(null);
    setNotificationToast(`Updated connection settings for ${selectedPlatform.name}`);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  const categories = [
    { id: 'all', label: 'All Integrations' },
    { id: 'video', label: 'Video & Audio' },
    { id: 'design', label: 'Design & Templates' },
    { id: 'collaboration', label: 'Team Communication' },
    { id: 'code', label: 'CI/CD & Code' },
    { id: 'marketing', label: 'Marketing Automation' },
  ];

  const filtered =
    activeCategory === 'all'
      ? integrations
      : integrations.filter((p) => p.category === activeCategory);

  const getPlatformIcon = (id: SupportedIntegrationPlatform) => {
    switch (id) {
      case 'youtube':
        return <Video className="h-5 w-5 text-red-600" />;
      case 'canva':
        return <Palette className="h-5 w-5 text-sky-600" />;
      case 'teams':
        return <MessageSquare className="h-5 w-5 text-indigo-600" />;
      case 'github':
        return <FileCode className="h-5 w-5 text-stone-900" />;
      case 'slack':
        return <Share2 className="h-5 w-5 text-amber-600" />;
      case 'figma':
        return <Palette className="h-5 w-5 text-purple-600" />;
      case 'hubspot':
        return <Workflow className="h-5 w-5 text-orange-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notificationToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {notificationToast}
          </span>
          <button onClick={() => setNotificationToast(null)} className="font-bold">×</button>
        </div>
      )}

      {/* 1. TOP BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-sand-300 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sand-100 text-[#3C311F]">
              <Workflow className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-serif font-bold text-sand-950 flex items-center gap-2">
                Workflow & Direct Platform Integrations
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Real-Time Sync Active
                </span>
              </h2>
              <p className="text-xs text-sand-600">
                Connect external publishing channels, design suites, and team chat to automate compliance verification.
              </p>
            </div>
          </div>
        </div>

        {/* Sync Summary Count */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-sand-100 border border-sand-200 text-sand-800 font-bold">
            {integrations.filter((p) => p.isConnected).length} of {integrations.length} Platforms Connected
          </span>
        </div>
      </div>

      {/* 2. CATEGORY FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-[#3C311F] text-white shadow-2xs'
                : 'bg-white text-sand-600 hover:text-sand-900 border border-sand-200 hover:border-sand-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. INTEGRATION PLATFORM CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((platform) => {
          const isSyncing = syncingPlatform === platform.id;
          return (
            <div
              key={platform.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 bg-white ${
                platform.isConnected
                  ? 'border-sand-300 shadow-xs hover:border-sand-400'
                  : 'border-sand-200 bg-sand-50/40 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Platform Icon, Name & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-center shadow-2xs">
                      {getPlatformIcon(platform.id)}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-sand-950">
                        {platform.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-sand-500 font-mono">
                        {platform.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      platform.isConnected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}
                  >
                    {platform.isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <p className="text-xs text-sand-600 leading-relaxed">
                  {platform.description}
                </p>

                {/* Connection Meta */}
                {platform.isConnected && (
                  <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 space-y-1 text-xs">
                    {platform.connectedAccount && (
                      <div className="text-[11px] font-bold text-sand-900 truncate">
                        Account: {platform.connectedAccount}
                      </div>
                    )}
                    {platform.channelOrWorkspace && (
                      <div className="text-[10px] text-sand-600 font-mono truncate">
                        Target: {platform.channelOrWorkspace}
                      </div>
                    )}
                    {platform.lastSyncAt && (
                      <div className="text-[10px] text-sand-400 font-mono">
                        Last Synced: {new Date(platform.lastSyncAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-sand-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleConnection(platform.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    platform.isConnected
                      ? 'border-sand-300 text-sand-700 hover:bg-sand-100'
                      : 'bg-[#3C311F] text-white hover:bg-[#2B2316] border-transparent shadow-2xs'
                  }`}
                >
                  {platform.isConnected ? 'Disconnect' : 'Connect Platform'}
                </button>

                {platform.isConnected && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenConfig(platform)}
                      className="p-1.5 rounded-lg border border-sand-300 text-sand-600 hover:text-sand-900 hover:bg-sand-50 transition-colors"
                      title="Settings & Webhook"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleSyncPlatform(platform)}
                      disabled={isSyncing}
                      className="px-3 py-1.5 rounded-lg bg-sand-900 text-sand-50 hover:bg-sand-800 text-xs font-bold flex items-center gap-1 shadow-2xs disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? 'Syncing...' : 'Sync Now'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. PLATFORM SETTINGS MODAL */}
      {selectedPlatform && (
        <div className="fixed inset-0 z-50 bg-sand-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-sand-300 max-w-md w-full p-6 shadow-xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-sand-200">
              <div className="flex items-center gap-2">
                {getPlatformIcon(selectedPlatform.id)}
                <h3 className="font-serif font-bold text-base text-sand-950">
                  {selectedPlatform.name} Settings
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlatform(null)}
                className="text-sand-400 hover:text-sand-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-sand-700 uppercase text-[11px]">
                  Target Channel / Workspace / Repo
                </label>
                <input
                  type="text"
                  value={editChannel}
                  onChange={(e) => setEditChannel(e.target.value)}
                  placeholder="e.g. #marketing-approved or main branch"
                  className="w-full p-2.5 rounded-lg border border-sand-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-sand-700 uppercase text-[11px]">
                  Webhook / Endpoint URL (Optional)
                </label>
                <input
                  type="url"
                  value={editWebhookUrl}
                  onChange={(e) => setEditWebhookUrl(e.target.value)}
                  placeholder="https://webhook.office.com/..."
                  className="w-full p-2.5 rounded-lg border border-sand-300 bg-white font-mono text-[11px]"
                />
              </div>

              <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sand-900">Auto-Publish on Approval</div>
                  <div className="text-[11px] text-sand-500">
                    Directly export content when cryptographically certified by Manager.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={editAutoSync}
                  onChange={(e) => setEditAutoSync(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#3C311F] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-sand-200">
              <button
                onClick={() => setSelectedPlatform(null)}
                className="px-4 py-2 rounded-lg border border-sand-300 text-sand-700 hover:bg-sand-100 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 rounded-lg bg-[#3C311F] text-white hover:bg-[#2B2316] font-semibold text-xs shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
