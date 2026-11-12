'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_ORGS,
  INITIAL_ACCOUNTS,
  DEFAULT_BRAND_GUIDELINES,
  INITIAL_SUBMISSIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PROJECTS,
  INITIAL_CHANGE_RECORDS,
} from '@/lib/default-data';
import {
  Organization,
  UserAccount,
  ContentSubmission,
  BrandGuidelineConfig,
  BrandAsset,
  AuditLogEntry,
  Project,
  TeamChangeRecord,
} from '@/lib/types';
import { AuthScreen } from '@/components/AuthScreen';
import { LandingPage } from '@/components/LandingPage';
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
import { CollaborationHub } from '@/components/CollaborationHub';
import { MediaAudit } from '@/components/MediaAudit';
import { WorkflowIntegrations } from '@/components/WorkflowIntegrations';
import { LegalSupportModal, LegalTab } from '@/components/LegalSupportModal';
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import { SubscriptionCheckoutModal } from '@/components/SubscriptionCheckoutModal';
import { AlertTriangle, Lock, CreditCard } from 'lucide-react';

export default function Home() {
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGS);
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [viewMode, setViewMode] = useState<'landing' | 'auth'>('landing');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Legal & Support Modal State
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('about');

  // Subscription Renewal Modal State
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  const handleOpenLegal = (tab: LegalTab) => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  const [guidelines, setGuidelines] = useState<BrandGuidelineConfig>(DEFAULT_BRAND_GUIDELINES);
  const [submissions, setSubmissions] = useState<ContentSubmission[]>(INITIAL_SUBMISSIONS);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [changeRecords, setChangeRecords] = useState<TeamChangeRecord[]>(INITIAL_CHANGE_RECORDS);

  // Load persisted session & state if available
  useEffect(() => {
    try {
      const savedOrgs = localStorage.getItem('vibecheck_orgs');
      if (savedOrgs) setOrganizations(JSON.parse(savedOrgs));

      const savedAccounts = localStorage.getItem('vibecheck_accounts');
      if (savedAccounts) setAccounts(JSON.parse(savedAccounts));

      const savedUser = localStorage.getItem('vibecheck_session_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedProjects = localStorage.getItem('vibecheck_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedChanges = localStorage.getItem('vibecheck_changes');
      if (savedChanges) setChangeRecords(JSON.parse(savedChanges));
    } catch (e) {
      console.warn('Storage load error:', e);
    }
  }, []);

  const handleAddProject = (newProj: Project) => {
    const projectWithOrg = {
      ...newProj,
      orgId: currentUser?.orgId || newProj.orgId,
    };
    setProjects((prev) => {
      const updated = [projectWithOrg, ...prev];
      try {
        localStorage.setItem('vibecheck_projects', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleUpdateProject = (updatedProj: Project) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === updatedProj.id ? updatedProj : p));
      try {
        localStorage.setItem('vibecheck_projects', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleAddChangeRecord = (record: TeamChangeRecord) => {
    setChangeRecords((prev) => {
      const updated = [record, ...prev];
      try {
        localStorage.setItem('vibecheck_changes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

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
    setViewMode('landing');
    try {
      localStorage.removeItem('vibecheck_session_user');
    } catch (e) {}
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedUser.id ? updatedUser : acc))
    );
    try {
      localStorage.setItem('vibecheck_session_user', JSON.stringify(updatedUser));
      const savedAccounts = accounts.map((acc) =>
        acc.id === updatedUser.id ? updatedUser : acc
      );
      localStorage.setItem('vibecheck_accounts', JSON.stringify(savedAccounts));
    } catch (e) {}
  };

  const handleResetPassword = (email: string, newPass: string): boolean => {
    const user = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return false;
    const updatedUser = { ...user, password: newPass };
    const updatedAccounts = accounts.map((a) => (a.id === user.id ? updatedUser : a));
    setAccounts(updatedAccounts);
    try {
      localStorage.setItem('vibecheck_accounts', JSON.stringify(updatedAccounts));
    } catch (e) {}
    return true;
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

  // Filter projects by current org
  const orgProjects = useMemo(() => {
    if (!currentOrg) return [];
    return projects.filter((p) => p.orgId === currentOrg.id);
  }, [projects, currentOrg]);

  // Filter change records by current org projects
  const orgChangeRecords = useMemo(() => {
    const orgProjIds = new Set(orgProjects.map((p) => p.id));
    return changeRecords.filter((c) => orgProjIds.has(c.projectId));
  }, [changeRecords, orgProjects]);

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

  // Subscription Renewal handler
  const handleSubscriptionRenewSuccess = (details: {
    txnId: string;
    amount: number;
    paymentMethod: string;
    billingDate: string;
  }) => {
    setOrganizations((prev) => {
      const updated = prev.map((o) =>
        o.id === currentOrg.id
          ? {
              ...o,
              subscriptionStatus: 'active' as const,
              subscriptionPrice: details.amount,
              nextBillingDate: details.billingDate,
              lastPaymentTxnId: details.txnId,
            }
          : o
      );
      try {
        localStorage.setItem('vibecheck_orgs', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setIsRenewModalOpen(false);
  };

  const isOrgSubscriptionInactive =
    currentOrg.subscriptionStatus === 'unpaid' || currentOrg.subscriptionStatus === 'past_due';

  // If not logged in, render the clean landing page or login / registration screen
  if (!currentUser) {
    if (viewMode === 'landing') {
      return (
        <>
          <LandingPage
            onExploreWorkspace={() => setViewMode('auth')}
            onLoginClick={() => setViewMode('auth')}
            onOpenLegal={handleOpenLegal}
          />
          <CookieConsentBanner onOpenPrivacy={() => handleOpenLegal('privacy')} />
          <LegalSupportModal
            isOpen={isLegalModalOpen}
            initialTab={legalModalTab}
            onClose={() => setIsLegalModalOpen(false)}
          />
        </>
      );
    }

    return (
      <>
        <AuthScreen
          organizations={organizations}
          accounts={accounts}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onResetPassword={handleResetPassword}
          onBackToLanding={() => setViewMode('landing')}
          onOpenLegal={handleOpenLegal}
        />
        <CookieConsentBanner onOpenPrivacy={() => handleOpenLegal('privacy')} />
        <LegalSupportModal
          isOpen={isLegalModalOpen}
          initialTab={legalModalTab}
          onClose={() => setIsLegalModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        organization={currentOrg}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
      />

      {/* Admin Subscription Past-Due Banner */}
      {isOrgSubscriptionInactive && currentUser.role === 'admin' && (
        <div className="bg-amber-600 text-white px-5 py-2.5 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-200" />
            <span>
              Organization Subscription Required: Workspace services are suspended for all members of {currentOrg.name}. Pay ₹5,000/month to restore access.
            </span>
          </div>
          <button
            onClick={() => setIsRenewModalOpen(true)}
            className="px-3 py-1 bg-white text-sand-950 font-bold rounded-lg text-xs hover:bg-sand-100 transition-all shadow-2xs"
          >
            Renew ₹5,000 Plan
          </button>
        </div>
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar tailored by Role */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingQueueCount={pendingReviewCount}
          userRole={currentUser.role}
          orgName={currentOrg.name}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Dynamic Workspace Area */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1 p-5 md:p-7">
            <div className="max-w-6xl mx-auto">
            {/* If Non-Admin and subscription is unpaid: Render Lock Screen */}
            {isOrgSubscriptionInactive && currentUser.role !== 'admin' ? (
              <div className="p-12 text-center max-w-lg mx-auto my-12 bg-white rounded-3xl border border-sand-300 shadow-card space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-sand-950">
                    Workspace Access Suspended
                  </h3>
                  <p className="text-xs text-sand-600">
                    Your company workspace ({currentOrg.name}) requires an active ₹5,000/month subscription. Service is currently stopped for all team members.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-[11px] text-sand-700 font-mono">
                  Only your organization Admin ({currentOrg.adminEmail}) has to pay to restore workspace access.
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-[#3C311F] hover:bg-[#2B2316] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Sign Out / Switch Account
                </button>
              </div>
            ) : (
              <>
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

            {/* 1.5 COLLABORATION HUB (MULTIPLE PROJECTS, TIMELINES, TEAM CHANGES & HUDDLE) */}
            {activeTab === 'collaboration' && (
              <CollaborationHub
                currentUser={currentUser}
                teamMembers={orgTeamMembers}
                projects={orgProjects}
                changeRecords={orgChangeRecords}
                onAddProject={handleAddProject}
                onUpdateProject={handleUpdateProject}
                onAddChangeRecord={handleAddChangeRecord}
                onLogAudit={handleLogAudit}
                onSwitchUser={handleLogin}
              />
            )}

            {/* 1.6 MULTIMEDIA (AUDIO & VIDEO) AUDIT */}
            {activeTab === 'media-audit' && (
              <MediaAudit
                guidelines={guidelines}
                currentUser={currentUser}
                onLogAudit={handleLogAudit}
              />
            )}

            {/* 1.7 WORKFLOW PLATFORM INTEGRATIONS (YouTube, Canva, Teams, GitHub, etc.) */}
            {activeTab === 'integrations' && (
              <WorkflowIntegrations
                currentUser={currentUser}
                onLogAudit={handleLogAudit}
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
              <AnalyticsInsights
                submissions={orgSubmissions}
                teamMembers={orgTeamMembers}
                organization={currentOrg}
              />
            )}

            {/* 8. AUDIT LOGS */}
            {activeTab === 'audit' && <AuditLogs logs={auditLogs} />}
              </>
            )}
            </div>
          </div>

          {/* DASHBOARD FOOTER - ALWAYS PINNED AT THE END OF EVERY PAGE */}
          <footer className="mt-auto border-t border-sand-200/80 bg-white/80 py-4 px-4 sm:px-8 text-xs text-sand-600 shrink-0">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="font-medium text-sand-700">
                © 2026 VibeCheck AI. All rights reserved.
              </div>
              <div className="flex flex-wrap items-center justify-center gap-5 font-medium">
                <button
                  onClick={() => handleOpenLegal('about')}
                  className="hover:text-sand-950 transition-colors"
                >
                  About Us
                </button>
                <button
                  onClick={() => handleOpenLegal('contact')}
                  className="hover:text-sand-950 transition-colors"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => handleOpenLegal('privacy')}
                  className="hover:text-sand-950 transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => handleOpenLegal('terms')}
                  className="hover:text-sand-950 transition-colors"
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Workspace & Key Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        organization={currentOrg}
        currentUser={currentUser}
        teamMembers={orgTeamMembers}
        onUpdateUser={handleUpdateUser}
      />

      {/* Legal & Support Modal (About Us, Contact Us, Privacy, Terms, Copyright) */}
      <LegalSupportModal
        isOpen={isLegalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setIsLegalModalOpen(false)}
      />

      {/* Cookie Consent Floating Banner */}
      <CookieConsentBanner onOpenPrivacy={() => handleOpenLegal('privacy')} />

      {/* Subscription Renewal Modal for Admin */}
      {isRenewModalOpen && (
        <SubscriptionCheckoutModal
          isOpen={isRenewModalOpen}
          orgName={currentOrg.name}
          adminEmail={currentOrg.adminEmail}
          amount={5000}
          onClose={() => setIsRenewModalOpen(false)}
          onPaymentSuccess={handleSubscriptionRenewSuccess}
        />
      )}
    </div>
  );
}
