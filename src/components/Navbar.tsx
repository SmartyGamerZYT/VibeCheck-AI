'use client';

import React from 'react';
import { UserAccount, Organization, UserRole } from '@/lib/types';
import { ShieldCheck, LogOut, Settings, Building2 } from 'lucide-react';

interface NavbarProps {
  currentUser: UserAccount;
  organization: Organization;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  organization,
  onLogout,
  onOpenSettings,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'manager':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'reviewer':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'creator':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-sand-200 text-sand-800 border-sand-300';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-sand-200 px-6 py-3 transition-all">
      <div className="flex items-center justify-between">
        {/* Brand & Organization Identity */}
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-sand-900 flex items-center justify-center text-sand-50 shadow-xs">
            <ShieldCheck className="h-4 w-4 text-sand-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-base tracking-tight text-sand-900">
                VibeCheck<span className="text-sand-600 font-sans ml-0.5">AI</span>
              </span>
              <span className="text-sand-300">/</span>
              <span className="text-xs font-semibold text-sand-800 flex items-center gap-1">
                <Building2 className="h-3 w-3 text-sand-500" />
                {organization?.name || currentUser.orgName}
              </span>
            </div>
          </div>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-sand-900 leading-tight">
              {currentUser.name}
            </div>
            <div className="flex items-center justify-end space-x-1 mt-0.5">
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${getRoleBadge(
                  currentUser.role
                )}`}
              >
                {currentUser.role}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-1.5 text-sand-600 hover:text-sand-950 rounded-lg hover:bg-sand-100 transition-all border border-sand-200 shadow-2xs"
            title="Workspace Settings & Organization Key"
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            onClick={onLogout}
            className="p-1.5 text-sand-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-all border border-sand-200 shadow-2xs"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
