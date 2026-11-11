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
  X,
  FolderKanban,
  Film,
  Workflow,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export type NavTab =
  | 'dashboard'
  | 'collaboration'
  | 'media-audit'
  | 'review'
  | 'queue'
  | 'guidelines'
  | 'integrations'
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenLegal?: (tab: 'about' | 'contact' | 'privacy' | 'terms' | 'copyright') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingQueueCount,
  userRole,
  orgName,
  isMobileOpen = false,
  onCloseMobile,
  onOpenLegal,
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
      {
        id: 'collaboration' as NavTab,
        label: 'Collaboration Hub',
        icon: FolderKanban,
        badge: null,
      },
      {
        id: 'media-audit' as NavTab,
        label: 'Audio & Video Audit',
        icon: Film,
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
          id: 'integrations' as NavTab,
          label: 'Workflow Integrations',
          icon: Workflow,
          badge: null,
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
          label: 'Team Approval Queue',
          icon: ListTodo,
          badge: pendingQueueCount > 0 ? pendingQueueCount : null,
        },
        {
          id: 'review' as NavTab,
          label: 'Draft & AI Review',
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
          id: 'integrations' as NavTab,
          label: 'Workflow Integrations',
          icon: Workflow,
          badge: null,
        },
        {
          id: 'assets' as NavTab,
          label: 'Brand Assets',
          icon: FolderGit2,
          badge: null,
        },
        {
          id: 'analytics' as NavTab,
          label: 'Compliance Analytics',
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
          label: 'Scan & Audit Draft',
          icon: Sparkles,
          badge: null,
        },
        {
          id: 'guidelines' as NavTab,
          label: 'Brand Rules Reference',
          icon: BookOpenCheck,
          badge: null,
        },
        {
          id: 'integrations' as NavTab,
          label: 'Workflow Integrations',
          icon: Workflow,
          badge: null,
        },
        {
          id: 'assets' as NavTab,
          label: 'Approved Assets',
          icon: FolderGit2,
          badge: null,
        },
      ];
    }

    // Default: Creator
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
        id: 'integrations' as NavTab,
        label: 'Workflow Integrations',
        icon: Workflow,
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

  const handleSelect = (tab: NavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col justify-between h-full p-3.5">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500">
            Navigation
          </span>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-sand-500 hover:text-sand-900 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-sand-900 text-sand-50 shadow-xs'
                    : 'text-sand-700 hover:bg-sand-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-amber-200' : 'text-sand-600'
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

      {/* Workspace Footer & Legal Navigation */}
      <div className="pt-3 border-t border-sand-200 px-2.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase font-bold tracking-wider text-sand-400">
            Role Scope
          </div>
          <div className="text-[11px] font-bold text-sand-900 capitalize">
            {userRole}
          </div>
        </div>

        {/* Downside Links for Every Dashboard */}
        <div className="pt-2 border-t border-sand-200/80 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onOpenLegal?.('about')}
              className="text-sand-600 hover:text-sand-950 font-medium transition-colors"
            >
              About Us
            </button>
            <span className="text-sand-300">•</span>
            <button
              onClick={() => onOpenLegal?.('contact')}
              className="text-sand-600 hover:text-sand-950 font-medium transition-colors"
            >
              Contact Us
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => onOpenLegal?.('privacy')}
              className="text-sand-600 hover:text-sand-950 font-medium transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-sand-300">•</span>
            <button
              onClick={() => onOpenLegal?.('terms')}
              className="text-sand-600 hover:text-sand-950 font-medium transition-colors"
            >
              Terms of Service
            </button>
          </div>

          <button
            onClick={() => onOpenLegal?.('copyright')}
            className="w-full text-center text-[10px] text-sand-400 hover:text-sand-700 font-mono pt-1 block transition-colors"
          >
            © 2026 VibeCheck AI
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 border-r border-sand-200 bg-[#FAF8F5] shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-sand-950/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-64 max-w-[80vw] h-full bg-[#FAF8F5] border-r border-sand-300 shadow-modal">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
