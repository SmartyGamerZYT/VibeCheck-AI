'use client';

import React, { useState, useEffect } from 'react';
import {
  UserAccount,
  Organization,
  ContentSubmission,
  BrandGuidelineConfig,
  MemberMistakeRecord,
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
  Activity,
  AlertOctagon,
  RotateCcw,
  Plus,
  ChevronDown,
  ChevronUp,
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

  const pendingApprovals = submissions.filter(
    (s) => s.status === 'in_review' || s.status === 'draft'
  );
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const changesRequested = submissions.filter(
    (s) => s.status === 'changes_requested'
  );
  const mySubmissions = submissions.filter(
    (s) => s.author?.id === currentUser.id || s.author?.email === currentUser.email
  );

  const [memberMistakes, setMemberMistakes] = useState<MemberMistakeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vibecheck_member_mistakes');
      if (saved) return JSON.parse(saved);
    } catch { }
    return [
      {
        id: 'mst_1',
        memberId: 'usr_creator',
        memberName: 'Maya Lin',
        memberRole: 'creator',
        submissionTitle: 'Metabolic Support Social Ad',
        category: 'spelling',
        mistakeText: 'yesterdae',
        suggestedCorrection: 'yesterday',
        timestamp: '2026-11-09T14:32:00Z',
      },
      {
        id: 'mst_2',
        memberId: 'usr_creator',
        memberName: 'Maya Lin',
        memberRole: 'creator',
        submissionTitle: 'Metabolic Support Social Ad',
        category: 'grammar',
        mistakeText: 'I decides to went',
        suggestedCorrection: 'I decided to go',
        timestamp: '2026-11-09T14:32:00Z',
      },
      {
        id: 'mst_3',
        memberId: 'usr_creator',
        memberName: 'Maya Lin',
        memberRole: 'creator',
        submissionTitle: 'Clinical Trial Press Release',
        category: 'claims',
        mistakeText: 'cures all symptoms instantly',
        suggestedCorrection: 'reduces symptom onset by 34% within 14 days',
        timestamp: '2026-11-10T11:15:00Z',
      },
      {
        id: 'mst_4',
        memberId: 'usr_reviewer',
        memberName: 'Julian Vance',
        memberRole: 'reviewer',
        submissionTitle: 'Video Lower-Third Review',
        category: 'tone',
        mistakeText: 'Hear is the story about a man',
        suggestedCorrection: 'Lumina Health: Dedicated to evidence-based wellness',
        timestamp: '2026-11-08T16:05:00Z',
      },
    ];
  });

  const [expandedMemberId, setExpandedMemberId] = useState<string | null>('usr_creator');
  const [loggingMistakeForUser, setLoggingMistakeForUser] = useState<UserAccount | null>(null);
  const [newMistakeCategory, setNewMistakeCategory] = useState<'grammar' | 'tone' | 'claims' | 'spelling' | 'terminology'>('grammar');
  const [newMistakeText, setNewMistakeText] = useState('');
  const [newMistakeCorrection, setNewMistakeCorrection] = useState('');

  // Persist member mistakes
  useEffect(() => {
    try {
      localStorage.setItem('vibecheck_member_mistakes', JSON.stringify(memberMistakes));
    } catch (e) { }
  }, [memberMistakes]);

  // Handle adding a mistake to a member
  const handleSaveMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingMistakeForUser || !newMistakeText.trim()) return;

    const newRecord: MemberMistakeRecord = {
      id: `mst_${Date.now()}`,
      memberId: loggingMistakeForUser.id,
      memberName: loggingMistakeForUser.name,
      memberRole: loggingMistakeForUser.role,
      submissionTitle: 'Manual Review Audit',
      category: newMistakeCategory,
      mistakeText: newMistakeText.trim(),
      suggestedCorrection: newMistakeCorrection.trim() || 'Compliant format',
      timestamp: new Date().toISOString(),
    };

    setMemberMistakes((prev) => [newRecord, ...prev]);
    setLoggingMistakeForUser(null);
    setNewMistakeText('');
    setNewMistakeCorrection('');
  };

  // Reset mistakes for a member
  const handleResetMemberMistakes = (memberId: string) => {
    setMemberMistakes((prev) => prev.filter((m) => m.memberId !== memberId));
  };

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
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Pending Approvals</div>
            <div className="text-2xl font-serif font-bold text-amber-700 mt-1">
              {pendingApprovals.length}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Approved Content</div>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
              {approvedCount}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Glossary Rules</div>
            <div className="text-2xl font-serif font-bold text-sand-900 mt-1">
              {guidelines.approvedGlossary.length}
            </div>
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
          </div>
        </div>

        {/* 1.5 MEMBER ANALYSIS & MISTAKE METER SECTION */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-sand-950 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#3C311F]" />
                Member Analysis
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sand-100 text-sand-800 border border-sand-300">
                  Performance & Mistake Meter
                </span>
              </h3>
            </div>

            <span className="text-xs font-mono font-bold text-sand-700 bg-white px-3 py-1.5 rounded-xl border border-sand-200 shadow-2xs self-start sm:self-auto">
              {memberMistakes.length} Total Mistakes Logged
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {teamMembers.map((member) => {
              const mistakes = memberMistakes.filter((m) => m.memberId === member.id);
              const mistakeCount = mistakes.length;
              const meterPercent = Math.max(40, Math.min(100, 100 - mistakeCount * 7));
              const isGood = meterPercent >= 90;
              const isModerate = meterPercent >= 75 && meterPercent < 90;

              const grammarCount = mistakes.filter((m) => m.category === 'grammar').length;
              const toneCount = mistakes.filter((m) => m.category === 'tone').length;
              const claimsCount = mistakes.filter((m) => m.category === 'claims').length;
              const spellingCount = mistakes.filter((m) => m.category === 'spelling').length;
              const isExpanded = expandedMemberId === member.id;

              return (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl bg-white border border-sand-300 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#3C311F] text-sand-50 flex items-center justify-center font-bold text-sm uppercase">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-sand-950 flex items-center gap-1.5">
                          {member.name}
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-sand-100 text-sand-700">
                            {member.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-sand-500 font-mono">{member.email}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-2xl font-serif font-extrabold ${isGood ? 'text-emerald-700' : isModerate ? 'text-amber-700' : 'text-rose-700'
                          }`}
                      >
                        {meterPercent}%
                      </div>
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${isGood
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isModerate
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                      >
                        {isGood ? 'High Quality' : isModerate ? 'Moderate Errors' : 'Frequent Mistakes'}
                      </span>
                    </div>
                  </div>

                  {/* Meter Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-sand-600 font-semibold">
                      <span>Work Compliance Meter</span>
                      <span>{mistakeCount} Mistake(s)</span>
                    </div>
                    <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isGood ? 'bg-emerald-600' : isModerate ? 'bg-amber-600' : 'bg-rose-600'
                          }`}
                        style={{ width: `${meterPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Category Mistake Breakdown Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-sand-100 text-sand-800 font-medium">
                      Grammar: <strong>{grammarCount}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sand-100 text-sand-800 font-medium">
                      Tone: <strong>{toneCount}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sand-100 text-sand-800 font-medium">
                      Claims: <strong>{claimsCount}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sand-100 text-sand-800 font-medium">
                      Spelling: <strong>{spellingCount}</strong>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setExpandedMemberId(isExpanded ? null : member.id)}
                      className="text-sand-700 hover:text-sand-950 font-semibold flex items-center gap-1"
                    >
                      <span>Mistake History ({mistakeCount})</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setLoggingMistakeForUser(member)}
                        className="px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-800 font-semibold text-[11px] flex items-center gap-1 border border-sand-200 transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Log Mistake
                      </button>
                      {mistakeCount > 0 && (
                        <button
                          onClick={() => handleResetMemberMistakes(member.id)}
                          className="p-1 text-sand-400 hover:text-rose-600 transition-colors"
                          title="Reset Mistakes & Restore Meter to 100%"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Mistake History */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-sand-100 space-y-2">
                      {mistakes.length === 0 ? (
                        <div className="text-[11px] text-emerald-800 font-medium py-1">
                          Zero mistakes recorded for {member.name}. Meter is at 100%!
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {mistakes.map((m) => (
                            <div
                              key={m.id}
                              className="p-2.5 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold uppercase px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                                  {m.category}
                                </span>
                                <span className="text-sand-500 font-mono">
                                  {new Date(m.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-[11px] text-sand-900 leading-relaxed">
                                <span className="line-through text-rose-700 font-mono">&ldquo;{m.mistakeText}&rdquo;</span>
                                <span className="mx-1">→</span>
                                <span className="font-semibold text-emerald-800 font-mono">&ldquo;{m.suggestedCorrection}&rdquo;</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* LOG MISTAKE MODAL */}
          {loggingMistakeForUser && (
            <div className="fixed inset-0 z-50 bg-sand-950/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-sand-300 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                  <h4 className="font-serif font-bold text-sm text-sand-950">
                    Log Mistake for {loggingMistakeForUser.name}
                  </h4>
                  <button onClick={() => setLoggingMistakeForUser(null)} className="font-bold text-sand-500">×</button>
                </div>

                <form onSubmit={handleSaveMistake} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-sand-800 block mb-1">Mistake Category</label>
                    <select
                      value={newMistakeCategory}
                      onChange={(e: any) => setNewMistakeCategory(e.target.value)}
                      className="w-full p-2 rounded-xl border border-sand-300 bg-white"
                    >
                      <option value="grammar">Grammar Mistake</option>
                      <option value="tone">Tone Violation</option>
                      <option value="claims">Claim Boundary Error</option>
                      <option value="spelling">Spelling Typo</option>
                      <option value="terminology">Barred Terminology</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-sand-800 block mb-1">Flagged Mistake Text</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. yesterdae / incorrect medical claim"
                      value={newMistakeText}
                      onChange={(e) => setNewMistakeText(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-sand-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-sand-800 block mb-1">Suggested Correction</label>
                    <input
                      type="text"
                      placeholder="e.g. yesterday / approved claim wording"
                      value={newMistakeCorrection}
                      onChange={(e) => setNewMistakeCorrection(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-sand-300"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-sand-200">
                    <button
                      type="button"
                      onClick={() => setLoggingMistakeForUser(null)}
                      className="px-3.5 py-1.5 rounded-xl border border-sand-300 text-sand-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#3C311F] text-white font-bold"
                    >
                      Record Mistake
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Revisions Requested</div>
            <div className="text-2xl font-serif font-bold text-sand-800 mt-1">
              {changesRequested.length}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Signed Off & Released</div>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
              {approvedCount}
            </div>
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
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Approved</div>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
              {approvedCount}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
            <div className="text-xs font-semibold text-sand-600">Revisions Requested</div>
            <div className="text-2xl font-serif font-bold text-amber-700 mt-1">
              {changesRequested.length}
            </div>
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
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
          <div className="text-xs font-semibold text-sand-600">In Review</div>
          <div className="text-2xl font-serif font-bold text-blue-700 mt-1">
            {mySubmissions.filter((s) => s.status === 'in_review').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs">
          <div className="text-xs font-semibold text-sand-600">Approved & Ready</div>
          <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
            {mySubmissions.filter((s) => s.status === 'approved').length}
          </div>
        </div>
      </div>

      {/* Quick Start Composer Card */}
      <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
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

