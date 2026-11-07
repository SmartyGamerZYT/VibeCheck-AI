'use client';

import React from 'react';
import { UserAccount, Organization, UserRole } from '@/lib/types';
import { ShieldCheck, LogOut, Settings, Building2, Menu } from 'lucide-react';

interface NavbarProps {
  currentUser: UserAccount;
  organization?: Organization;
  onLogout: () => void;
  onOpenSettings: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  organization,
  onLogout,
  onOpenSettings,
  onToggleMobileMenu,
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
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-sand-200 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between">
        {/* Brand & Organization Identity */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 text-sand-700 hover:text-sand-950 rounded-lg hover:bg-sand-100 transition-colors"
              title="Toggle Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div className="h-8 w-8 rounded-lg bg-sand-900 flex items-center justify-center text-sand-50 shadow-xs shrink-0">
            <ShieldCheck className="h-4 w-4 text-amber-200" />
          </div>

          <div className="flex items-center space-x-2 truncate">
            <span className="font-serif font-bold text-base tracking-tight text-sand-900 shrink-0">
              VibeCheck<span className="text-[#9C8561] font-sans ml-0.5">AI</span>
            </span>
            <span className="text-sand-300 hidden sm:inline">/</span>
            <span className="text-xs font-semibold text-sand-800 hidden sm:flex items-center gap-1 truncate">
              <Building2 className="h-3 w-3 text-sand-500 shrink-0" />
              {organization?.name || currentUser?.orgName || 'Workspace'}
            </span>
          </div>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* User Profile Pill - Clicking opens Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-sand-100 border border-transparent hover:border-sand-200 transition-all text-left"
            title="Edit Profile & Settings"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full object-cover border border-sand-300 shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-sand-800 text-sand-50 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-sand-900 leading-tight">
                {currentUser?.name}
              </div>
              <div className="flex items-center space-x-1 mt-0.5">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${getRoleBadge(
                    currentUser?.role || 'creator'
                  )}`}
                >
                  {currentUser?.role}
                </span>
              </div>
            </div>
          </button>

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
