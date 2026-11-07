'use client';

import React, { useState, useRef } from 'react';
import { Organization, UserAccount } from '@/lib/types';
import {
  KeyRound,
  Copy,
  Check,
  Users,
  Building2,
  Shield,
  X,
  User,
  Camera,
  Mail,
  Briefcase,
  Sparkles,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization?: Organization;
  currentUser: UserAccount;
  teamMembers?: UserAccount[];
  onUpdateUser?: (updated: UserAccount) => void;
  onUpdateOrgName?: (newName: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  organization,
  currentUser,
  teamMembers = [],
  onUpdateUser,
  onUpdateOrgName,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'ai' | 'team'>('profile');

  // Profile Edit State
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Admin Key Copy State
  const [copied, setCopied] = useState(false);

  // API Key State
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vibecheck_openrouter_key') || '';
    }
    return '';
  });
  const [keySaved, setKeySaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Safe Fallback Org
  const safeOrg = organization || {
    id: currentUser?.orgId || 'org_lumina',
    name: currentUser?.orgName || 'Workspace',
    adminKey: 'ORG-KEY',
    createdAt: new Date().toISOString(),
    adminId: currentUser?.id || 'usr_1',
    adminEmail: currentUser?.email || 'admin@vibecheck.ai',
  };

  const isAdmin = currentUser?.role === 'admin';

  // Copy Key Handler
  const handleCopyKey = () => {
    if (safeOrg.adminKey) {
      navigator.clipboard.writeText(safeOrg.adminKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Avatar Upload Handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  // Save Profile Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser: UserAccount = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      department: department.trim(),
      avatar: avatar || currentUser.avatar,
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    try {
      localStorage.setItem('vibecheck_session_user', JSON.stringify(updatedUser));
    } catch (err) {}

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // Save API Key Handler
  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibecheck_openrouter_key', apiKeyInput.trim());
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-sand-950/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl border border-sand-300 shadow-modal max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-sand-200 flex items-center justify-between bg-sand-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-sand-900 text-sand-50 flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-sand-950 leading-tight">
                Settings & Preferences
              </h3>
              <p className="text-[11px] text-sand-500">
                {safeOrg.name} • Connected as <span className="capitalize font-semibold">{currentUser?.role}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sand-400 hover:text-sand-800 p-1.5 rounded-lg hover:bg-sand-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-sand-200 px-6 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'profile'
                ? 'border-sand-900 text-sand-950'
                : 'border-transparent text-sand-400 hover:text-sand-700'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Profile & Avatar
          </button>

          <button
            onClick={() => setActiveTab('organization')}
            className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'organization'
                ? 'border-sand-900 text-sand-950'
                : 'border-transparent text-sand-400 hover:text-sand-700'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            Admin Org Key
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ai'
                ? 'border-sand-900 text-sand-950'
                : 'border-transparent text-sand-400 hover:text-sand-700'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI & API Key
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'team'
                ? 'border-sand-900 text-sand-950'
                : 'border-transparent text-sand-400 hover:text-sand-700'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Team ({teamMembers?.length || 1})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: PROFILE & AVATAR */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {profileSaved && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Profile updated successfully!
                </div>
              )}

              {/* Avatar Selector */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-sand-50/70 border border-sand-200">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-sand-400 shadow-xs"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-sand-800 text-sand-50 flex items-center justify-center font-serif text-xl font-bold border-2 border-sand-400 shadow-xs">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-sand-900 text-sand-50 hover:bg-[#9C6342] shadow-xs transition-colors"
                    title="Change Profile Picture"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-sand-900 block">Profile Picture</span>
                  <p className="text-[11px] text-sand-500">
                    Upload a JPEG, PNG or SVG image to display in your navigation bar.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded bg-white border border-sand-300 hover:bg-sand-50 text-sand-800"
                    >
                      Upload Image
                    </button>
                    {avatar && (
                      <button
                        type="button"
                        onClick={() => setAvatar('')}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-sand-600 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-sand-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold text-sand-900 bg-sand-50/50 border border-sand-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-sand-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-sand-600 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-sand-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold text-sand-900 bg-sand-50/50 border border-sand-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-sand-500"
                  required
                />
              </div>

              {/* Department / Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-sand-600 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-sand-500" />
                  Department / Title
                </label>
                <input
                  type="text"
                  value={department}
                  placeholder="e.g. Content Marketing, Brand Editorial, Legal Review"
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs text-sand-900 bg-sand-50/50 border border-sand-200 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-sand-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sand-900 hover:bg-sand-800 text-white text-xs font-semibold transition-all shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ORGANIZATION & ADMIN KEY */}
          {activeTab === 'organization' && (
            <div className="space-y-4">
              {isAdmin ? (
                <div className="p-4 rounded-xl bg-sand-50 border border-sand-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
                      <KeyRound className="h-4 w-4 text-[#9C6342]" />
                      Admin Organization Key
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-sand-600 leading-relaxed">
                    Share this key with team members. When Managers, Reviewers, or Creators register an account, they enter this key to be directly linked to <strong>{safeOrg.name}</strong>.
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-2.5 rounded-lg bg-white border border-sand-300 font-mono font-bold text-sm tracking-wider text-sand-900 select-all">
                      {safeOrg.adminKey || 'N/A'}
                    </div>
                    <button
                      onClick={handleCopyKey}
                      className="px-3.5 py-2.5 rounded-lg bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800 flex items-center gap-1.5 transition-all shadow-2xs"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-sand-300" />
                          Copy Key
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-sand-50 border border-sand-300 space-y-2">
                  <span className="text-xs font-bold text-sand-800 block">
                    Connected Organization
                  </span>
                  <div className="text-xs text-sand-700">
                    You are connected under <strong>{safeOrg.name}</strong> as a{' '}
                    <strong className="capitalize">{currentUser?.role}</strong>.
                  </div>
                  <p className="text-[11px] text-sand-500">
                    Only organization Admins can view and regenerate the team registration key.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI & API KEY */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sand-50 border border-sand-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-sand-700" />
                    OpenRouter AI Key (Optional)
                  </span>
                  {keySaved && (
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Saved!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-sand-600 leading-relaxed">
                  Provide your personal OpenRouter API key to route reviews directly through external LLMs (Meta Llama 3.3 70B & Gemini Vision). If empty, the built-in multi-factor NLP & grammar engine is used.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="flex-1 text-xs p-2.5 rounded-lg border border-sand-300 bg-white font-mono"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="px-3.5 py-2 rounded-lg bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEAM MEMBERS */}
          {activeTab === 'team' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sand-700 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-sand-500" />
                  Connected Team Members ({teamMembers?.length || 1})
                </h4>
                <span className="text-[11px] text-sand-500">
                  Joined via Organization Key
                </span>
              </div>

              <div className="max-h-52 overflow-y-auto divide-y divide-sand-100 border border-sand-200 rounded-xl bg-sand-50/40">
                {(teamMembers || []).map((member) => (
                  <div
                    key={member.id}
                    className="p-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-8 w-8 rounded-full object-cover border border-sand-300"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-sand-700 text-sand-50 flex items-center justify-center font-bold text-xs">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-sand-900 flex items-center gap-1.5">
                          {member.name}
                          {member.id === currentUser?.id && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sand-200 text-sand-700">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-sand-500">{member.email}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                        member.role === 'admin'
                          ? 'bg-purple-100 text-purple-900 border-purple-300'
                          : member.role === 'manager'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : member.role === 'reviewer'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-sand-200 flex justify-end bg-sand-50/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
