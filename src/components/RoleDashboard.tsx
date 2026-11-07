'use client';

import React, { useState } from 'react';
import {
  UserAccount,
  Organization,
  ContentSubmission,
  BrandGuidelineConfig,
} from '@/lib/types';
import {
  ShieldCheck,
  KeyRound,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertTriangle,
  PenTool,
  X,
} from 'lucide-react';
import { DocumentEditor } from './DocumentEditor';

interface RoleDashboardProps {
  currentUser: UserAccount;
  organization?: Organization;
  teamMembers: UserAccount[];
  submissions: ContentSubmission[];
  guidelines: BrandGuidelineConfig;
  onNavigate: (tab: any) => void;
  onOpenSettings: () => void;
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({
  currentUser,
  organization,
  teamMembers = [],
  submissions = [],
  guidelines,
  onNavigate,
  onOpenSettings,
}) => {
  const safeOrg = organization || {
    id: currentUser?.orgId || 'org_lumina',
    name: currentUser?.orgName || 'Workspace',
    adminKey: 'ORG-KEY',
    createdAt: new Date().toISOString(),
    adminId: currentUser?.id || 'usr_1',
    adminEmail: currentUser?.email || 'admin@vibecheck.ai',
  };

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorText, setEditorText] = useState(
    '### Welcome to VibeCheck AI Document Composer\n\nDraft your product launch copy, clinical announcements, or social posts here with full rich formatting before submitting for compliance audit.'
  );

  const pendingApprovals = submissions.filter((s) => s.status === 'in_review');
  const changesRequested = submissions.filter((s) => s.status === 'changes_requested');
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const mySubmissions = submissions.filter((s) => s.author.id === currentUser.id);

  // 1. ADMIN DASHBOARD
  if (currentUser.role === 'admin') {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="p-6 rounded-2xl bg-white border border-sand-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
              Admin Console
            </span>
            <h2 className="text-xl font-serif font-bold text-sand-900 mt-1">
              {safeOrg.name} Workspace
            </h2>
            <p className="text-xs text-sand-600 mt-0.5">
              Admin: <strong>{currentUser.name}</strong> ({currentUser.email})
            </p>
          </div>

          {/* Org Key Display */}
          <div className="p-3 rounded-xl bg-sand-50 border border-sand-300 flex items-center gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sand-500">
                Organization Invite Key
              </div>
              <div className="font-mono font-bold text-sm text-sand-900">
                {safeOrg.adminKey}
              </div>
            </div>
            <button
              onClick={onOpenSettings}
              className="px-3 py-1.5 rounded-lg bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800 transition-all shadow-2xs"
            >
              Manage Key
            </button>
          </div>
        </div>

        {/* Admin KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Connected Team</div>
            <div className="text-2xl font-serif font-bold text-sand-900 mt-1">
              {teamMembers.length}
            </div>
            <div className="text-[10px] text-sand-500 mt-0.5">Under this organization</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Pending Approvals</div>
            <div className="text-2xl font-serif font-bold text-amber-700 mt-1">
              {pendingApprovals.length}
            </div>
            <div className="text-[10px] text-sand-500 mt-0.5">Awaiting sign-off</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Approved Content</div>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
              {approvedCount}
            </div>
            <div className="text-[10px] text-sand-500 mt-0.5">Legally signed off</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Glossary Rules</div>
            <div className="text-2xl font-serif font-bold text-sand-900 mt-1">
              {guidelines.approvedGlossary.length}
            </div>
            <div className="text-[10px] text-sand-500 mt-0.5">Active policy constraints</div>
          </div>
        </div>

        {/* Quick Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center justify-between">
              <span>Brand Guidelines & Policy</span>
              <button
                onClick={() => onNavigate('guidelines')}
                className="text-sand-600 hover:text-sand-900 flex items-center gap-1 font-semibold text-xs"
              >
                Configure <ArrowRight className="h-3 w-3" />
              </button>
            </h3>
            <p className="text-xs text-sand-600">
              Manage forbidden vocabulary, clinical claim citations, and tone sliders for {safeOrg.name}.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center justify-between">
              <span>Team & Organization Key</span>
              <button
                onClick={onOpenSettings}
                className="text-sand-600 hover:text-sand-900 flex items-center gap-1 font-semibold text-xs"
              >
                View Roster <ArrowRight className="h-3 w-3" />
              </button>
            </h3>
            <p className="text-xs text-sand-600">
              Share <strong>{safeOrg.adminKey}</strong> with new team members so they join your company account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. MANAGER DASHBOARD
  if (currentUser.role === 'manager') {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white border border-sand-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              Manager Dashboard
            </span>
            <h2 className="text-xl font-serif font-bold text-sand-900 mt-1">
              Sign-Off & Publication Management
            </h2>
            <p className="text-xs text-sand-600 mt-0.5">
              Organization: <strong>{safeOrg.name}</strong> • Manager: <strong>{currentUser.name}</strong>
            </p>
          </div>

          <button
            onClick={() => onNavigate('queue')}
            className="px-4 py-2 rounded-xl bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800 flex items-center gap-1.5 shadow-xs"
          >
            Open Approval Queue ({pendingApprovals.length})
          </button>
        </div>

        {/* Manager KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Pending Sign-Offs</div>
            <div className="text-2xl font-serif font-bold text-amber-700 mt-1">
              {pendingApprovals.length}
            </div>
            <div className="text-[10px] text-sand-500 mt-0.5">Require final approval</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Revisions Requested</div>
            <div className="text-2xl font-serif font-bold text-sand-800 mt-1">
              {changesRequested.length}
            </div>
            <div className="text-[10px] text-sand-500 mt-0.5">Returned to creator</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Signed Off & Released</div>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
              {approvedCount}
            </div>
            <div className="text-[10px] text-sand-500 mt-0.5">With SHA-256 signatures</div>
          </div>
        </div>

        {/* Submissions Awaiting Sign-Off */}
        <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sand-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sand-800">
              Submissions Awaiting Manager Decision
            </h3>
            <button
              onClick={() => onNavigate('queue')}
              className="text-xs font-semibold text-sand-600 hover:text-sand-900"
            >
              View All
            </button>
          </div>

          {pendingApprovals.length === 0 ? (
            <p className="text-xs text-sand-500 py-4 text-center">No submissions waiting for sign-off right now.</p>
          ) : (
            <div className="space-y-2">
              {pendingApprovals.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onNavigate('queue')}
                  className="p-3 rounded-xl bg-sand-50/60 hover:bg-sand-100 border border-sand-200 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div>
                    <div className="font-bold text-xs text-sand-900">{sub.title}</div>
                    <div className="text-[11px] text-sand-500">
                      By {sub.author.name} • {sub.format}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {sub.reviewResult && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-sand-200 text-sand-900">
                        {sub.reviewResult.overallScore}% Score
                      </span>
                    )}
                    <span className="text-xs font-semibold text-sand-700">Review & Sign →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. REVIEWER DASHBOARD
  if (currentUser.role === 'reviewer') {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white border border-sand-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
              Reviewer Dashboard
            </span>
            <h2 className="text-xl font-serif font-bold text-sand-900 mt-1">
              Editorial Standards & Fact Verification
            </h2>
            <p className="text-xs text-sand-600 mt-0.5">
              Reviewing for <strong>{safeOrg.name}</strong> • Reviewer: <strong>{currentUser.name}</strong>
            </p>
          </div>

          <button
            onClick={() => onNavigate('queue')}
            className="px-4 py-2 rounded-xl bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800 flex items-center gap-1.5 shadow-xs"
          >
            Review Queue ({pendingApprovals.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">In Review Queue</div>
            <div className="text-2xl font-serif font-bold text-blue-800 mt-1">
              {pendingApprovals.length}
            </div>
            <div className="text-[10px] text-sand-500 mt-0.5">Assigned submissions</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Approved</div>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
              {approvedCount}
            </div>
            <div className="text-[10px] text-sand-500 mt-0.5">Passed review</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Revisions Requested</div>
            <div className="text-2xl font-serif font-bold text-amber-700 mt-1">
              {changesRequested.length}
            </div>
            <div className="text-[10px] text-sand-500 mt-0.5">With feedback</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center justify-between">
              <span>AI Content Reviewer</span>
              <button
                onClick={() => onNavigate('review')}
                className="text-sand-600 hover:text-sand-900 flex items-center gap-1 font-semibold text-xs"
              >
                Open Reviewer <ArrowRight className="h-3 w-3" />
              </button>
            </h3>
            <p className="text-xs text-sand-600">
              Run multi-factor AI scans on content drafts, documents, or ad copy against {safeOrg.name} guidelines.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center justify-between">
              <span>Brand Guidelines Reference</span>
              <button
                onClick={() => onNavigate('guidelines')}
                className="text-sand-600 hover:text-sand-900 flex items-center gap-1 font-semibold text-xs"
              >
                Inspect <ArrowRight className="h-3 w-3" />
              </button>
            </h3>
            <p className="text-xs text-sand-600">
              Reference approved glossary terms, clinical citations, and competitor lockout lists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. CREATOR DASHBOARD
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white border border-sand-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
            Creator Studio
          </span>
          <h2 className="text-xl font-serif font-bold text-sand-900 mt-1">
            Brand Governance & Content Composer
          </h2>
          <p className="text-xs text-sand-600 mt-0.5">
            Connected to: <strong>{safeOrg.name}</strong> • Creator: <strong>{currentUser.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-sand-300 hover:bg-sand-50 text-sand-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <PenTool className="h-3.5 w-3.5 text-[#9C6342]" />
            Quick Document Editor
          </button>
          <button
            onClick={() => onNavigate('review')}
            className="px-4 py-2 rounded-xl bg-sand-900 text-sand-50 text-xs font-semibold hover:bg-sand-800 flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-sand-300" />
            New Draft & AI Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
          <div className="text-xs font-semibold text-sand-600">My Submissions</div>
          <div className="text-2xl font-serif font-bold text-sand-900 mt-1">
            {mySubmissions.length}
          </div>
          <div className="text-[10px] text-sand-500 mt-0.5">Created by you</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
          <div className="text-xs font-semibold text-sand-600">In Review</div>
          <div className="text-2xl font-serif font-bold text-blue-700 mt-1">
            {mySubmissions.filter((s) => s.status === 'in_review').length}
          </div>
          <div className="text-[10px] text-sand-500 mt-0.5">With reviewer / manager</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
          <div className="text-xs font-semibold text-sand-600">Approved & Ready</div>
          <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
            {mySubmissions.filter((s) => s.status === 'approved').length}
          </div>
          <div className="text-[10px] text-sand-500 mt-0.5">Cleared for publication</div>
        </div>
      </div>

      {/* Quick Start Composer Card */}
      <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-sand-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Check Content Before Publishing
          </h3>
          <button
            onClick={() => onNavigate('review')}
            className="text-xs font-semibold text-sand-600 hover:text-sand-900"
          >
            Launch Reviewer →
          </button>
        </div>
        <p className="text-xs text-sand-600 leading-relaxed">
          Verify your text, DOCX document, social copy, or email against {safeOrg.name}&apos;s tone, glossary, and factual guidelines. Get instant explainable flags and intent-preserving rewrite suggestions.
        </p>
      </div>

      {/* Quick Document Composer / Scratchpad Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-sand-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-sand-300 shadow-modal max-w-2xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4 text-[#9C6342]" />
                <h3 className="font-serif font-bold text-base text-sand-900">
                  Quick Document Composer & Editor
                </h3>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-sand-400 hover:text-sand-800 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <DocumentEditor
              value={editorText}
              onChange={setEditorText}
              minRows={8}
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="px-3.5 py-2 rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-800 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsEditorOpen(false);
                  onNavigate('review');
                }}
                className="px-4 py-2 rounded-lg bg-[#9C6342] hover:bg-[#865133] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                Audit in Review Engine →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

