'use client';

import React, { useState } from 'react';
import { Organization, UserAccount } from '@/lib/types';
import { KeyRound, Copy, Check, Users, Building2, Shield, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization;
  currentUser: UserAccount;
  teamMembers: UserAccount[];
  onUpdateOrgName?: (newName: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  organization,
  currentUser,
  teamMembers,
  onUpdateOrgName,
}) => {
  const [copied, setCopied] = useState(false);
  const [editingName, setEditingName] = useState(organization?.name || '');

  if (!isOpen) return null;

  const handleCopyKey = () => {
    if (organization?.adminKey) {
      navigator.clipboard.writeText(organization.adminKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 bg-sand-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-sand-300 shadow-modal max-w-lg w-full p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-sand-200">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-sand-800" />
            <h3 className="text-base font-serif font-bold text-sand-900">
              Workspace Settings & Organization Key
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-sand-400 hover:text-sand-800 p-1 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ADMIN KEY DISPLAY SECTION */}
        {isAdmin ? (
          <div className="p-4 rounded-xl bg-sand-50 border border-sand-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
                <KeyRound className="h-4 w-4 text-amber-700" />
                Admin Organization Key
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Active Key
              </span>
            </div>

            <p className="text-xs text-sand-600">
              Share this key with your team. When Managers, Reviewers, or Creators register an account, they enter this key to be directly linked to <strong>{organization.name}</strong>.
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 p-2.5 rounded-lg bg-white border border-sand-300 font-mono font-bold text-sm tracking-wider text-sand-900 select-all">
                {organization?.adminKey || 'N/A'}
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
              You are connected under <strong>{organization.name}</strong> as a{' '}
              <strong className="capitalize">{currentUser.role}</strong>.
            </div>
          </div>
        )}

        {/* TEAM MEMBERS LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sand-700 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-sand-500" />
              Connected Team Members ({teamMembers.length})
            </h4>
            <span className="text-[11px] text-sand-500">
              Joined via Organization Key
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto divide-y divide-sand-100 border border-sand-200 rounded-xl bg-sand-50/40">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-sand-900 flex items-center gap-1.5">
                    {member.name}
                    {member.id === currentUser.id && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-sand-200 text-sand-700">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-sand-500">{member.email}</div>
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

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

