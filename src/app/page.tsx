'use client';

import React, { useState, useEffect } from 'react';
import {
  INITIAL_ORGS,
  INITIAL_ACCOUNTS,
  DEFAULT_BRAND_GUIDELINES,
  INITIAL_SUBMISSIONS,
  INITIAL_AUDIT_LOGS,
} from '@/lib/default-data';
import {
  Organization,
  UserAccount,
  ContentSubmission,
  BrandGuidelineConfig,
  BrandAsset,
  AuditLogEntry,
} from '@/lib/types';
import { AuthScreen } from '@/components/AuthScreen';
import { Navbar } from '@/components/Navbar';
import { Sidebar, NavTab } from '@/components/Sidebar';
import { RoleDashboard } from '@/components/RoleDashboard';
import { ReviewEngine } from '@/components/ReviewEngine';
import { SubmissionQueue } from '@/components/SubmissionQueue';
import { BrandGuidelinesBuilder } from '@/components/BrandGuidelinesBuilder';
import { AssetLibrary } from '@/components/AssetLibrary';
import { AnalyticsInsights } from '@/components/AnalyticsInsights';
import { AuditLogs } from '@/components/AuditLogs';
import { SettingsModal } from '@/components/SettingsModal';

export default function Home() {
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGS);
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [guidelines, setGuidelines] = useState<BrandGuidelineConfig>(DEFAULT_BRAND_GUIDELINES);
  const [submissions, setSubmissions] = useState<ContentSubmission[]>(INITIAL_SUBMISSIONS);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Load persisted session & state if available
  useEffect(() => {
    try {
      const savedOrgs = localStorage.getItem('vibecheck_orgs');
      if (savedOrgs) setOrganizations(JSON.parse(savedOrgs));

      const savedAccounts = localStorage.getItem('vibecheck_accounts');
      if (savedAccounts) setAccounts(JSON.parse(savedAccounts));

      const savedUser = localStorage.getItem('vibecheck_session_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      console.warn('Storage load error:', e);
    }
  }, []);

  // Save changes to localStorage
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    try {
      localStorage.setItem('vibecheck_session_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleRegister = (newAccount: UserAccount, newOrg?: Organization) => {
    let updatedOrgs = organizations;
    if (newOrg) {
      updatedOrgs = [newOrg, ...organizations];
      setOrganizations(updatedOrgs);
      try {
        localStorage.setItem('vibecheck_orgs', JSON.stringify(updatedOrgs));
      } catch (e) {}
    }

    const updatedAccounts = [newAccount, ...accounts];
    setAccounts(updatedAccounts);
    try {
      localStorage.setItem('vibecheck_accounts', JSON.stringify(updatedAccounts));
    } catch (e) {}

    setCurrentUser(newAccount);
    setActiveTab('dashboard');
    try {
      localStorage.setItem('vibecheck_session_user', JSON.stringify(newAccount));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('vibecheck_session_user');
    } catch (e) {}
  };

  // Find active organization for the logged in user
  const currentOrg = currentUser
    ? organizations.find((o) => o.id === currentUser.orgId) || {
        id: currentUser.orgId,
        name: currentUser.orgName,
        adminKey: 'ORG-KEY',
        createdAt: new Date().toISOString(),
        adminId: currentUser.id,
        adminEmail: currentUser.email,
      }
    : organizations[0];

  // Team members under this user's organization
  const orgTeamMembers = currentUser
    ? accounts.filter((a) => a.orgId === currentUser.orgId)
    : [];

  // Filter submissions by current org
  const orgSubmissions = currentUser
    ? submissions.filter((s) => s.orgId === currentUser.orgId)
    : submissions;

  // Audit Log Helper
  const handleLogAudit = (
    action: string,
    details: string,
    category: 'review' | 'workflow' | 'guideline' | 'security' | 'asset'
  ) => {
    if (!currentUser) return;
    const entry: AuditLogEntry = {
      id: `log_${Date.now()}`,
      orgId: currentUser.orgId,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      details,
      category,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const handleSubmitToQueue = (newSub: Partial<ContentSubmission>) => {
    setSubmissions((prev) => [newSub as ContentSubmission, ...prev]);
    setActiveTab('queue');
  };

  const handleUpdateSubmission = (updated: ContentSubmission) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === updated.id ? updated : sub))
    );
  };

  const handleAddAsset = (asset: BrandAsset) => {
    setAssets((prev) => [{ ...asset, orgId: currentUser?.orgId || 'org_lumina' }, ...prev]);
  };

  // Pending queue count for badges
  const pendingReviewCount = orgSubmissions.filter(
    (s) => s.status === 'in_review' || s.status === 'changes_requested'
  ).length;

  // If not logged in, render the clean login / registration screen
  if (!currentUser) {
    return (
      <AuthScreen
        organizations={organizations}
        accounts={accounts}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Navigation Bar: Cleaned up with no extra active badges or role selector */}
      <Navbar
        currentUser={currentUser}
        organization={currentOrg}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar tailored by Role */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingQueueCount={pendingReviewCount}
          userRole={currentUser.role}
          orgName={currentOrg.name}
        />

        {/* Dynamic Workspace Area */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="max-w-6xl mx-auto">
            {/* 1. ROLE-SPECIFIC DASHBOARDS */}
            {activeTab === 'dashboard' && (
              <RoleDashboard
                currentUser={currentUser}
                organization={currentOrg}
                teamMembers={orgTeamMembers}
                submissions={orgSubmissions}
                guidelines={guidelines}
                onNavigate={setActiveTab}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            )}

            {/* 2. AI CONTENT REVIEW ENGINE */}
            {activeTab === 'review' && (
              <ReviewEngine
                guidelines={guidelines}
                currentUser={currentUser}
                onSubmitToQueue={handleSubmitToQueue}
                onLogAudit={handleLogAudit}
              />
            )}

            {/* 3. SUBMISSION & APPROVAL QUEUE */}
            {activeTab === 'queue' && (
              <SubmissionQueue
                submissions={orgSubmissions}
                currentUser={currentUser}
                onUpdateSubmission={handleUpdateSubmission}
                onLogAudit={handleLogAudit}
              />
            )}

            {/* 4. BRAND GUIDELINES BUILDER */}
            {activeTab === 'guidelines' && (
              <BrandGuidelinesBuilder
                guidelines={guidelines}
                currentUser={currentUser}
                onUpdateGuidelines={setGuidelines}
                onLogAudit={handleLogAudit}
              />
            )}

            {/* 5. TEAM & ORG KEY (ADMIN VIEW) */}
            {activeTab === 'team' && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-white border border-sand-300 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                    <div>
                      <h2 className="text-base font-serif font-bold text-sand-900">
                        {currentOrg.name} — Team & Invite Key
                      </h2>
                      <p className="text-xs text-sand-600">
                        Share your Admin Organization Key so managers, reviewers, and creators can connect under your company.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-sand-50 border border-sand-300 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-sand-500">
                        Admin Organization Key
                      </div>
                      <div className="font-mono font-bold text-base text-sand-900">
                        {currentOrg.adminKey}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="px-3.5 py-2 rounded-lg bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800"
                    >
                      Copy & Manage Key
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-sand-700">
                      Active Team Members ({orgTeamMembers.length})
                    </h3>
                    <div className="divide-y divide-sand-100 border border-sand-200 rounded-xl bg-sand-50/30 overflow-hidden">
                      {orgTeamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-sand-900">{member.name}</div>
                            <div className="text-[11px] text-sand-500">{member.email}</div>
                          </div>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border bg-sand-100 text-sand-800 border-sand-300">
                            {member.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. ASSET LIBRARY */}
            {activeTab === 'assets' && (
              <AssetLibrary
                assets={assets}
                currentUser={currentUser}
                onAddAsset={handleAddAsset}
                onLogAudit={handleLogAudit}
              />
            )}

            {/* 7. GOVERNANCE ANALYTICS */}
            {activeTab === 'analytics' && (
              <AnalyticsInsights submissions={orgSubmissions} />
            )}

            {/* 8. AUDIT LOGS */}
            {activeTab === 'audit' && <AuditLogs logs={auditLogs} />}
          </div>
        </main>
      </div>

      {/* Workspace & Key Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        organization={currentOrg}
        currentUser={currentUser}
        teamMembers={orgTeamMembers}
      />
    </div>
  );
}
