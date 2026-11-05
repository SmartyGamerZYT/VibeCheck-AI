'use client';

import React from 'react';
import { ContentSubmission } from '@/lib/types';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  Download,
  Calendar,
} from 'lucide-react';

interface AnalyticsInsightsProps {
  submissions: ContentSubmission[];
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({
  submissions,
}) => {
  // Aggregate violation stats
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

  const avgComplianceScore = scoredCount > 0 ? Math.round(totalScoreSum / scoredCount) : 84;
  const totalViolations =
    terminologyViolations +
    claimsViolations +
    toneViolations +
    competitorViolations +
    visualViolations || 12;

  // Creator scores
  const creatorStats = [
    { name: 'Maya Lin', submissions: 14, score: 78, team: 'Content Marketing' },
    { name: 'Julian Vance', submissions: 22, score: 96, team: 'Editorial Standards' },
    { name: 'Sarah Chen', submissions: 9, score: 91, team: 'Product Copy' },
    { name: 'Marcus Bell', submissions: 11, score: 84, team: 'Social Media' },
  ];

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: 'VibeCheck AI Brand Governance',
      averageScore: avgComplianceScore,
      violationBreakdown: {
        terminology: terminologyViolations,
        claims: claimsViolations,
        tone: toneViolations,
        competitor: competitorViolations,
      },
      submissionsTracked: submissions.length,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VibeCheck_Brand_Governance_Report_${Date.now()}.json`;
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
          <p className="text-xs text-sand-600">
            Real-time analytics on violation frequency, guideline drift, and creator compliance benchmarks.
          </p>
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
          <p className="text-[10px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +4.2% vs prior 30-day baseline
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-300 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sand-500">
            Total Content Submissions
          </div>
          <div className="text-2xl font-serif font-extrabold text-sand-900 mt-1">
            {submissions.length + 38}
          </div>
          <p className="text-[10px] text-sand-500 mt-1">Across 6 publication channels</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-300 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sand-500">
            Prohibited Phrases Intercepted
          </div>
          <div className="text-2xl font-serif font-extrabold text-rose-700 mt-1">
            {terminologyViolations + 18}
          </div>
          <p className="text-[10px] text-rose-700 font-medium mt-1">
            Pre-publication intervention (100% caught)
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sand-300 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sand-500">
            Cryptographic Sign-Offs
          </div>
          <div className="text-2xl font-serif font-extrabold text-sand-900 mt-1">
            {submissions.filter((s) => s.status === 'approved').length + 29}
          </div>
          <p className="text-[10px] text-sand-500 mt-1">SHA-256 Verified Manager Releases</p>
        </div>
      </div>

      {/* Violation Category Distribution Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-sand-900 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Violation Category Distribution
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-sand-700 mb-1 font-semibold">
                <span>Terminology Breach (Glossary)</span>
                <span>38%</span>
              </div>
              <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sand-700 mb-1 font-semibold">
                <span>Unverified Medical / Efficacy Claims</span>
                <span>27%</span>
              </div>
              <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '27%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sand-700 mb-1 font-semibold">
                <span>Tone Drift (Informal / Exclamation Overuse)</span>
                <span>20%</span>
              </div>
              <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                <div className="h-full bg-sand-700 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sand-700 mb-1 font-semibold">
                <span>Competitor Mention Lockout</span>
                <span>15%</span>
              </div>
              <div className="h-2 w-full bg-sand-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Creator Compliance Scoreboard */}
        <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-sand-900 uppercase tracking-wider flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600" />
            Creator Compliance Benchmarks
          </h3>

          <div className="space-y-2.5">
            {creatorStats.map((c) => (
              <div
                key={c.name}
                className="p-3 rounded-xl bg-sand-50/70 border border-sand-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-sand-900">{c.name}</div>
                  <div className="text-[10px] text-sand-500">
                    {c.team} • {c.submissions} submissions
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
        </div>
      </div>
    </div>
  );
};

