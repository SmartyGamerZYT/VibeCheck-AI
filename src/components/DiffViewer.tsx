'use client';

import React from 'react';
import { ComplianceIssue } from '@/lib/types';
import { Check, X, Edit3, ArrowRight } from 'lucide-react';

interface DiffViewerProps {
  originalText: string;
  suggestedText: string;
  issues: ComplianceIssue[];
  onAcceptIssue: (issueId: string) => void;
  onRejectIssue: (issueId: string) => void;
  onModifyIssue: (issueId: string, modified: string) => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalText,
  suggestedText,
  issues,
  onAcceptIssue,
  onRejectIssue,
  onModifyIssue,
}) => {
  return (
    <div className="space-y-4">
      {/* Side by Side Preview Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Original Draft */}
        <div className="bg-white rounded-xl border border-sand-300 shadow-xs flex flex-col">
          <div className="px-4 py-2.5 border-b border-sand-200 bg-sand-50/80 rounded-t-xl flex items-center justify-between">
            <span className="text-xs font-bold text-sand-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Original Submission (Draft)
            </span>
            <span className="text-[11px] text-sand-500 font-mono">
              {originalText.length} chars
            </span>
          </div>
          <div className="p-4 text-xs font-normal leading-relaxed text-sand-800 whitespace-pre-wrap min-h-[160px] max-h-[360px] overflow-y-auto">
            {originalText}
          </div>
        </div>

        {/* Right Column: AI Compliant Suggested Rewrite */}
        <div className="bg-white rounded-xl border border-sand-300 shadow-xs flex flex-col">
          <div className="px-4 py-2.5 border-b border-sand-200 bg-sand-50/80 rounded-t-xl flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Compliant Recommended Rewrite
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Preserves Intent • 100% On-Brand
            </span>
          </div>
          <div className="p-4 text-xs font-normal leading-relaxed text-sand-900 bg-emerald-50/20 whitespace-pre-wrap min-h-[160px] max-h-[360px] overflow-y-auto">
            {suggestedText || 'Run AI Review to generate full compliant rewrite.'}
          </div>
        </div>
      </div>

      {/* Flagged Item Granular Decision Cards */}
      <div className="space-y-2.5 mt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sand-700">
            Detected Brand Violations ({issues.length})
          </h4>
          <span className="text-[11px] text-sand-500">
            Review and resolve each item individually
          </span>
        </div>

        {issues.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-xl border border-sand-200 text-sand-500 text-xs">
            No brand compliance issues detected in this piece!
          </div>
        ) : (
          issues.map((issue) => {
            const severityColors = {
              critical: 'border-l-4 border-l-rose-500 bg-rose-50/30 border-rose-200',
              warning: 'border-l-4 border-l-amber-500 bg-amber-50/30 border-amber-200',
              suggestion: 'border-l-4 border-l-sky-500 bg-sky-50/30 border-sky-200',
            }[issue.severity];

            const severityBadge = {
              critical: 'bg-rose-100 text-rose-800 border-rose-300',
              warning: 'bg-amber-100 text-amber-800 border-amber-300',
              suggestion: 'bg-sky-100 text-sky-800 border-sky-300',
            }[issue.severity];

            return (
              <div
                key={issue.id}
                className={`p-3.5 rounded-xl border transition-all ${severityColors} bg-white shadow-xs`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${severityBadge}`}
                      >
                        {issue.severity}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-sand-100 text-sand-700 rounded border border-sand-200">
                        {issue.guidelineRef}
                      </span>
                      <span className="text-[11px] uppercase font-bold text-sand-500 tracking-wider">
                        Category: {issue.category}
                      </span>
                      {issue.status !== 'pending' && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            issue.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : issue.status === 'rejected'
                              ? 'bg-stone-200 text-stone-700'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          Status: {issue.status}
                        </span>
                      )}
                    </div>

                    {/* Side-by-side diff snippet */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-1">
                      <div className="p-2 rounded bg-rose-50 border border-rose-200 text-xs">
                        <span className="text-[10px] font-bold text-rose-700 block mb-0.5 uppercase">
                          Flagged Text:
                        </span>
                        <span className="line-through text-rose-900 font-medium">
                          &ldquo;{issue.originalText}&rdquo;
                        </span>
                      </div>
                      <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-xs">
                        <span className="text-[10px] font-bold text-emerald-700 block mb-0.5 uppercase">
                          Suggested Replacement:
                        </span>
                        <span className="text-emerald-950 font-medium">
                          &ldquo;{issue.suggestedReplacement}&rdquo;
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-sand-700 mt-2">
                      <strong className="text-sand-900">Why flagged:</strong> {issue.explanation}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0 self-center">
                    <button
                      onClick={() => onAcceptIssue(issue.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                        issue.status === 'accepted'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      Accept
                    </button>
                    <button
                      onClick={() => onRejectIssue(issue.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                        issue.status === 'rejected'
                          ? 'bg-stone-800 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300'
                      }`}
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

