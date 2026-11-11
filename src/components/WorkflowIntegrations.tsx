'use client';

import React, { useState, useEffect } from 'react';
import {
  ConnectedPlatform,
  SupportedIntegrationPlatform,
  UserAccount,
} from '@/lib/types';
import { INITIAL_INTEGRATIONS } from '@/lib/default-data';
import {
  Workflow,
  CheckCircle2,
  Sliders,
  FileCode,
  Palette,
  MessageSquare,
  Video,
  Share2,
  X,
  ShieldCheck,
  ExternalLink,
  RotateCw,
} from 'lucide-react';

interface WorkflowIntegrationsProps {
  currentUser: UserAccount;
  onLogAudit: (action: string, details: string, category: any) => void;
}

export const WorkflowIntegrations: React.FC<WorkflowIntegrationsProps> = ({
  currentUser,
  onLogAudit,
}) => {
  const [integrations, setIntegrations] = useState<ConnectedPlatform[]>(() => {
    try {
      const saved = localStorage.getItem('vibecheck_integrations');
      return saved ? JSON.parse(saved) : INITIAL_INTEGRATIONS;
    } catch {
      return INITIAL_INTEGRATIONS;
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Google OAuth Flow Modal State
  const [googleOAuthPlatform, setGoogleOAuthPlatform] = useState<ConnectedPlatform | null>(null);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState<string>(
    currentUser.email || 'kshitij.dev@gmail.com'
  );
  const [customGoogleEmail, setCustomGoogleEmail] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Platform Config Modal
  const [selectedPlatform, setSelectedPlatform] = useState<ConnectedPlatform | null>(null);
  const [editWebhookUrl, setEditWebhookUrl] = useState('');
  const [editChannel, setEditChannel] = useState('');
  const [editAutoSync, setEditAutoSync] = useState(true);

  // Save to localStorage whenever integrations change
  useEffect(() => {
    try {
      localStorage.setItem('vibecheck_integrations', JSON.stringify(integrations));
    } catch (e) {}
  }, [integrations]);

  // Initiate Connect -> Redirect / Open Google OAuth
  const handleInitiateConnect = (platform: ConnectedPlatform) => {
    if (platform.isConnected) {
      // Disconnect directly
      setIntegrations((prev) =>
        prev.map((p) =>
          p.id === platform.id
            ? {
                ...p,
                isConnected: false,
                connectedAccount: undefined,
                connectedAt: undefined,
              }
            : p
        )
      );
      onLogAudit(
        'Platform Disconnected',
        `${currentUser.name} revoked Google integration with ${platform.name}.`,
        'workflow'
      );
      setNotificationToast(`Disconnected from ${platform.name}`);
      setTimeout(() => setNotificationToast(null), 3000);
      return;
    }

    // Open Google Account Authorization Modal
    setGoogleOAuthPlatform(platform);
  };

  // Complete Google Account OAuth Connection
  const handleAuthorizeWithGoogle = () => {
    if (!googleOAuthPlatform) return;
    setIsAuthenticating(true);

    const emailToConnect = customGoogleEmail.trim() || selectedGoogleEmail;

    setTimeout(() => {
      setIsAuthenticating(false);

      setIntegrations((prev) =>
        prev.map((p) =>
          p.id === googleOAuthPlatform.id
            ? {
                ...p,
                isConnected: true,
                connectedAccount: `${emailToConnect} (Google Account)`,
                connectedAt: new Date().toISOString(),
                lastSyncAt: new Date().toISOString(),
              }
            : p
        )
      );

      onLogAudit(
        'Google OAuth Connected',
        `Authorized ${googleOAuthPlatform.name} using Google Account: ${emailToConnect}.`,
        'workflow'
      );

      setNotificationToast(`Connected ${googleOAuthPlatform.name} via ${emailToConnect}!`);
      setTimeout(() => setNotificationToast(null), 3500);

      setGoogleOAuthPlatform(null);
      setCustomGoogleEmail('');
    }, 1200);
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'video', label: 'Video & Audio' },
    { id: 'design', label: 'Design' },
    { id: 'collaboration', label: 'Communication' },
    { id: 'code', label: 'Code & CI/CD' },
    { id: 'marketing', label: 'Marketing' },
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
      {/* Toast Notification */}
      {notificationToast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {notificationToast}
          </span>
          <button onClick={() => setNotificationToast(null)} className="font-bold">×</button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-sand-300 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-sand-100 text-[#3C311F]">
            <Workflow className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-sand-950 flex items-center gap-2">
              Workflow Integrations
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sand-100 text-sand-800 border border-sand-300">
                {integrations.filter((p) => p.isConnected).length} Connected
              </span>
            </h2>
          </div>
        </div>

        <div className="font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-sand-100 border border-sand-200 text-sand-800 font-bold">
            {integrations.filter((p) => p.isConnected).length} of {integrations.length} Active
          </span>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-[#3C311F] text-white shadow-2xs'
                : 'bg-white text-sand-600 hover:text-sand-900 border border-sand-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* PLATFORMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((platform) => (
          <div
            key={platform.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 bg-white ${
              platform.isConnected
                ? 'border-sand-300 shadow-xs'
                : 'border-sand-200 bg-sand-50/30'
            }`}
          >
            <div className="space-y-3">
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

              <p className="text-xs text-sand-600">
                {platform.description}
              </p>

              {platform.isConnected && (
                <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1 text-xs">
                  <div className="text-[11px] font-bold text-sand-900 truncate flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{platform.connectedAccount}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-sand-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleInitiateConnect(platform)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  platform.isConnected
                    ? 'border-sand-300 text-sand-700 hover:bg-sand-100'
                    : 'bg-[#3C311F] text-white hover:bg-[#2B2316] border-transparent shadow-2xs'
                }`}
              >
                {platform.isConnected ? (
                  'Disconnect'
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Connect with Google
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* GOOGLE OAUTH AUTHORIZATION MODAL */}
      {googleOAuthPlatform && (
        <div className="fixed inset-0 z-50 bg-sand-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-sand-300 shadow-2xl space-y-5 animate-fadeIn">
            {/* Google OAuth Header */}
            <div className="text-center space-y-2">
              <svg className="h-8 w-8 mx-auto" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <h3 className="font-serif font-bold text-base text-sand-950">
                Sign in with Google
              </h3>
              <p className="text-xs text-sand-600">
                Choose an account to connect <strong>{googleOAuthPlatform.name}</strong> to VibeCheck AI
              </p>
            </div>

            {/* Google Accounts Selection */}
            <div className="divide-y divide-sand-200 border border-sand-300 rounded-xl overflow-hidden text-xs">
              <label
                onClick={() => {
                  setSelectedGoogleEmail(currentUser.email);
                  setCustomGoogleEmail('');
                }}
                className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                  selectedGoogleEmail === currentUser.email && !customGoogleEmail
                    ? 'bg-sand-50 font-bold'
                    : 'hover:bg-sand-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#3C311F] text-sand-50 flex items-center justify-center font-bold text-xs uppercase">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sand-950">{currentUser.name}</div>
                    <div className="text-sand-500 font-mono text-[11px]">{currentUser.email}</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="google_acc"
                  checked={selectedGoogleEmail === currentUser.email && !customGoogleEmail}
                  onChange={() => {}}
                  className="accent-[#3C311F]"
                />
              </label>

              <label
                onClick={() => {
                  setSelectedGoogleEmail('kshitij.dev@gmail.com');
                  setCustomGoogleEmail('');
                }}
                className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                  selectedGoogleEmail === 'kshitij.dev@gmail.com' && !customGoogleEmail
                    ? 'bg-sand-50 font-bold'
                    : 'hover:bg-sand-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                    K
                  </div>
                  <div>
                    <div className="font-bold text-sand-950">Kshitij (Google Account)</div>
                    <div className="text-sand-500 font-mono text-[11px]">kshitij.dev@gmail.com</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="google_acc"
                  checked={selectedGoogleEmail === 'kshitij.dev@gmail.com' && !customGoogleEmail}
                  onChange={() => {}}
                  className="accent-[#3C311F]"
                />
              </label>
            </div>

            {/* Custom Google Email Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-sand-700 block">
                Or enter another Google Account:
              </label>
              <input
                type="email"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full p-2.5 rounded-xl border border-sand-300 text-xs text-sand-950 focus:outline-none focus:ring-1 focus:ring-[#3C311F]"
              />
            </div>

            {/* Permissions summary */}
            <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-[11px] text-sand-600 space-y-1">
              <div className="font-bold text-sand-800 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Permissions granted to VibeCheck AI:
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Verify certified compliance status for {googleOAuthPlatform.name}</li>
                <li>Bi-directional publishing and brand sync</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-sand-200">
              <button
                type="button"
                onClick={() => setGoogleOAuthPlatform(null)}
                disabled={isAuthenticating}
                className="px-4 py-2 rounded-xl border border-sand-300 text-xs font-semibold text-sand-700 hover:bg-sand-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorizeWithGoogle}
                disabled={isAuthenticating}
                className="px-5 py-2 rounded-xl bg-[#3C311F] hover:bg-[#2B2316] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                {isAuthenticating ? (
                  <>
                    <RotateCw className="h-3.5 w-3.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Authorize & Connect
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
