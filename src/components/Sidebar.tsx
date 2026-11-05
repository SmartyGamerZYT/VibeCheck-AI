'use client';

import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ListTodo,
  BookOpenCheck,
  FolderGit2,
  BarChart3,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export type NavTab =
  | 'dashboard'
  | 'review'
  | 'queue'
  | 'guidelines'
  | 'assets'
  | 'analytics'
  | 'audit'
  | 'team';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingQueueCount: number;
  userRole: UserRole;
  orgName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingQueueCount,
  userRole,
  orgName,
}) => {
  // Define items tailored to each role
  const getNavItems = () => {
    const common = [
      {
        id: 'dashboard' as NavTab,
        label: 'Dashboard',
        icon: LayoutDashboard,
        badge: null,
      },
    ];

    if (userRole === 'admin') {
      return [
        ...common,
        {
          id: 'guidelines' as NavTab,
          label: 'Brand Guidelines',
          icon: BookOpenCheck,
          badge: null,
        },
        {
          id: 'queue' as NavTab,
          label: 'All Submissions',
          icon: ListTodo,
          badge: pendingQueueCount > 0 ? pendingQueueCount : null,
        },
        {
          id: 'team' as NavTab,
          label: 'Team & Org Key',
          icon: Users,
          badge: null,
        },
        {
          id: 'assets' as NavTab,
          label: 'Asset Library',
          icon: FolderGit2,
          badge: null,
        },
        {
          id: 'analytics' as NavTab,
          label: 'Governance Insights',
          icon: BarChart3,
          badge: null,
        },
        {
          id: 'audit' as NavTab,
          label: 'Security & Audit Logs',
          icon: ShieldAlert,
          badge: null,
        },
      ];
    }

    if (userRole === 'manager') {
      return [
        ...common,
        {
          id: 'queue' as NavTab,
          label: 'Sign-Off Queue',
          icon: ListTodo,
          badge: pendingQueueCount > 0 ? pendingQueueCount : null,
        },
        {
          id: 'review' as NavTab,
          label: 'Content Reviewer',
          icon: Sparkles,
          badge: null,
        },
        {
          id: 'guidelines' as NavTab,
          label: 'Brand Guidelines',
          icon: BookOpenCheck,
          badge: null,
        },
        {
          id: 'analytics' as NavTab,
          label: 'Team Insights',
          icon: BarChart3,
          badge: null,
        },
      ];
    }

    if (userRole === 'reviewer') {
      return [
        ...common,
        {
          id: 'queue' as NavTab,
          label: 'Review Queue',
          icon: ListTodo,
          badge: pendingQueueCount > 0 ? pendingQueueCount : null,
        },
        {
          id: 'review' as NavTab,
          label: 'AI Content Scan',
          icon: Sparkles,
          badge: null,
        },
        {
          id: 'guidelines' as NavTab,
          label: 'Brand Guidelines',
          icon: BookOpenCheck,
          badge: null,
        },
      ];
    }

    // Default Creator
    return [
      ...common,
      {
        id: 'review' as NavTab,
        label: 'Draft & AI Review',
        icon: Sparkles,
        badge: null,
      },
      {
        id: 'queue' as NavTab,
        label: 'My Submissions',
        icon: ListTodo,
        badge: null,
      },
      {
        id: 'guidelines' as NavTab,
        label: 'Brand Guidelines',
        icon: BookOpenCheck,
        badge: null,
      },
      {
        id: 'assets' as NavTab,
        label: 'Brand Assets',
        icon: FolderGit2,
        badge: null,
      },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-56 border-r border-sand-200 bg-[#FAF8F5] flex flex-col justify-between p-3.5 shrink-0">
      <div className="space-y-4">
        <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-sand-500">
          Navigation
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-sand-900 text-sand-50 shadow-xs'
                    : 'text-sand-700 hover:bg-sand-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-sand-300' : 'text-sand-600'
                    }`}
                  />
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-sand-100 text-sand-900'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Workspace Footer Indicator */}
      <div className="pt-3 border-t border-sand-200 px-2.5">
        <div className="text-[10px] uppercase font-bold tracking-wider text-sand-400">
          Role Scope
        </div>
        <div className="text-xs font-bold text-sand-900 capitalize mt-0.5">
          {userRole}
        </div>
      </div>
    </aside>
  );
};
