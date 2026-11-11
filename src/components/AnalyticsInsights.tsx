'use client';

import React from 'react';
import { ContentSubmission, UserAccount, Organization } from '@/lib/types';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  Download,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface AnalyticsInsightsProps {
  submissions: ContentSubmission[];
  teamMembers?: UserAccount[];
  organization?: Organization;
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({
  submissions,
  teamMembers = [],
  organization,
}) => {
  // Aggregate real violation stats from current organization's submissions
  let terminologyViolations = 0;
  let claimsViolations = 0;
  let toneViolations = 0;
  let competitorViolations = 0;
  let visualViolations = 0;

  let totalScoreSum = 0;
  let scoredCount = 0;

  submissions.forEach((sub) => {
    if (sub.reviewResult) {
      totalScoreSum += sub.reviewResult.overallScore;
      scoredCount++;
      sub.reviewResult.issues.forEach((iss) => {
        if (iss.category === 'terminology') terminologyViolations++;
        else if (iss.category === 'claims') claimsViolations++;
        else if (iss.category === 'tone') toneViolations++;
        else if (iss.category === 'competitor') competitorViolations++;
        else if (iss.category === 'visual') visualViolations++;
      });
    }
  });

  const avgComplianceScore = scoredCount > 0 ? Math.round(totalScoreSum / scoredCount) : 100;
  const totalViolations =
    terminologyViolations +
    claimsViolations +
    toneViolations +
    competitorViolations +
    visualViolations;

  const termPct = totalViolations > 0 ? Math.round((terminologyViolations / totalViolations) * 100) : 0;
  const claimsPct = totalViolations > 0 ? Math.round((claimsViolations / totalViolations) * 100) : 0;
  const tonePct = totalViolations > 0 ? Math.round((toneViolations / totalViolations) * 100) : 0;
  const competitorPct = totalViolations > 0 ? Math.round((competitorViolations / totalViolations) * 100) : 0;

  const activeChannels = Array.from(
    new Set(submissions.map((s) => s.channel).filter(Boolean))
  );

  // Dynamic Creator Stats from current organization members and real submissions
  const creatorStats = teamMembers.length > 0
    ? teamMembers.map((member) => {
        const memberSubs = submissions.filter(
          (s) => s.author?.id === member.id || s.author?.name?.toLowerCase() === member.name?.toLowerCase()
        );
        const scoredSubs = memberSubs.filter((s) => s.reviewResult);
        const memberAvg =
          scoredSubs.length > 0
            ? Math.round(
                scoredSubs.reduce((acc, s) => acc + (s.reviewResult?.overallScore || 0), 0) /
                  scoredSubs.length
              )
            : 100;

        return {
          name: member.name,
          submissions: memberSubs.length,
          score: memberAvg,
          team: member.role.toUpperCase(),
        };
      })
    : [];

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      organization: organization?.name || 'My Organization',
      platform: 'VibeCheck AI Brand Governance',
      averageScore: avgComplianceScore,
      violationBreakdown: {
        terminology: terminologyViolations,
        claims: claimsViolations,
        tone: toneViolations,
        competitor: competitorViolations,
        visual: visualViolations,
      },
      totalViolations,
      submissionsTracked: submissions.length,
      activeChannels,
      teamMemberCount: teamMembers.length,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VibeCheck_Brand_Governance_Report_${(organization?.name || 'org').replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sand-100 to-sand-50 border border-sand-300">
        <div>
          <h2 className="text-xl font-serif font-bold text-sand-900">
            Brand Governance & Compliance Insights
          </h2>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-sand-900 hover:bg-sand-800 text-sand-50 flex items-center gap-1.5 shadow-sm"
        >
          <Download className="h-3.5 w-3.5 text-sand-300" />
          Export Audit Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-sand-300 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sand-500">
            Average Brand Health
          </div>
          <div className="text-2xl font-serif font-extrabold text-emerald-800 mt-1">
            {avgComplianceScore}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-300 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sand-500">
            Total Content Submissions
          </div>
          <div className="text-2xl font-serif font-extrabold text-sand-900 mt-1">
            {submissions.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-300 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sand-500">
            Prohibited Phrases Intercepted
          </div>
          <div className="text-2xl font-serif font-extrabold text-rose-700 mt-1">
            {terminologyViolations}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-300 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sand-500">
            Cryptographic Sign-Offs
          </div>
          <div className="text-2xl font-serif font-extrabold text-sand-900 mt-1">
            {submissions.filter((s) => s.status === 'approved').length}
          </div>
        </div>
      </div>

      {/* Violation Category Distribution Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-sand-900 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Violation Category Distribution
          </h3>

          {totalViolations === 0 ? (
            <div className="p-6 rounded-xl bg-sand-50/60 border border-sand-200 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-sand-900">100% Brand Compliant</div>
              <p className="text-[11px] text-sand-600">
                Zero guideline violations recorded across all audited content for {organization?.name || 'your organization'}.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-sand-700 mb-1 font-semibold">
                  <span>Terminology Breach (Glossary)</span>
                  <span>{termPct}% ({terminologyViolations})</span>
                </div>
                <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${termPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sand-700 mb-1 font-semibold">
                  <span>Unverified Medical / Efficacy Claims</span>
                  <span>{claimsPct}% ({claimsViolations})</span>
                </div>
                <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${claimsPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sand-700 mb-1 font-semibold">
                  <span>Tone Drift (Informal / Exclamation Overuse)</span>
                  <span>{tonePct}% ({toneViolations})</span>
                </div>
                <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sand-700 rounded-full" style={{ width: `${tonePct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sand-700 mb-1 font-semibold">
                  <span>Competitor Mention Lockout</span>
                  <span>{competitorPct}% ({competitorViolations})</span>
                </div>
                <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${competitorPct}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Creator Compliance Scoreboard */}
        <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-sand-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600" />
            Creator Compliance Benchmarks
          </h3>

          {creatorStats.length === 0 ? (
            <div className="p-6 rounded-xl bg-sand-50/60 border border-sand-200 text-center space-y-2">
              <Users className="h-8 w-8 text-sand-400 mx-auto" />
              <div className="text-xs font-bold text-sand-900">No Team Members Found</div>
              <p className="text-[11px] text-sand-600">
                Invite creators and reviewers with your company key to populate team compliance benchmarks.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {creatorStats.map((c) => (
                <div
                  key={c.name}
                  className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-sand-900">{c.name}</div>
                    <div className="text-[10px] text-sand-500">
                      {c.team} • {c.submissions} submission{c.submissions === 1 ? '' : 's'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-serif font-extrabold text-sm ${
                        c.score >= 90
                          ? 'text-emerald-800'
                          : c.score >= 80
                          ? 'text-amber-800'
                          : 'text-rose-800'
                      }`}
                    >
                      {c.score}%
                    </div>
                    <div className="text-[9px] uppercase font-bold text-sand-400">Avg Score</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


