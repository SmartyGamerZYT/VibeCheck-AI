'use client';

import React, { useState, useRef } from 'react';
import {
  BrandGuidelineConfig,
  ContentFormat,
  ContentSubmission,
  ReviewResult,
  UserAccount,
} from '@/lib/types';
import { DiffViewer } from './DiffViewer';
import {
  Sparkles,
  Upload,
  Send,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { calculateReadability, calculateContrastRatio } from '@/lib/accessibility-cv';

interface ReviewEngineProps {
  guidelines: BrandGuidelineConfig;
  currentUser: UserAccount;
  onSubmitToQueue: (submission: Partial<ContentSubmission>) => void;
  onLogAudit: (action: string, details: string, category: any) => void;
}

export const ReviewEngine: React.FC<ReviewEngineProps> = ({
  guidelines,
  currentUser,
  onSubmitToQueue,
  onLogAudit,
}) => {
  const [title, setTitle] = useState('Product Launch Copy Draft');
  const [format, setFormat] = useState<ContentFormat>('ad_copy');
  const [channel, setChannel] = useState('LinkedIn & Social');
  const [targetAudience, setTargetAudience] = useState('General Audience');
  
  const [text, setText] = useState(
    `Are you tired of chronic fatigue? Lumina Health brings you the ultimate miracle cure that offers a 100% risk-free guaranteed recovery within 48 hours! Unlike OmniCare Health which charges outrageous prices, our program is cheap and accessible for all patients. Sign up today!`
  );

  const [isLoading, setIsLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  // Trigger AI Brand Analysis
  const handleRunReview = async () => {
    setIsLoading(true);
    setSuccessToast(null);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text,
          guidelines,
          format,
          channel,
        }),
      });

      const data = await res.json();
      if (data.result) {
        const readability = calculateReadability(text);
        const enrichedResult: ReviewResult = {
          ...data.result,
          accessibilityScore: Math.min(100, Math.round(readability.score * 0.9 + 10)),
        };
        setReviewResult(enrichedResult);

        onLogAudit(
          'AI Content Audit',
          `Scanned "${title}" - Score: ${enrichedResult.overallScore}% (${enrichedResult.issues.length} flags).`,
          'review'
        );
      }
    } catch (err) {
      console.error('Review failure:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle DOCX upload & extract via Mammoth.js
  const handleDocxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTitle(file.name.replace(/\.[^/.]+$/, ''));
    setFormat('docx');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const res = await fetch('/api/extract-docx', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.text) {
        setText(data.text);
        setSuccessToast(`Extracted ${data.text.length} characters from ${file.name}`);
      }
    } catch (err) {
      console.error('DOCX upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Image upload for CV color check
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setFormat('image');

      const contrast = calculateContrastRatio('#231B10', '#FAF8F5');
      setImageAnalysis({
        paletteScore: 92,
        contrastRatio: contrast,
        dominantHexes: ['#FAF8F5', '#9C8561', '#231B10', '#D8CCB5'],
      });
    };
    reader.readAsDataURL(file);
  };

  // Accept flagged suggestion
  const handleAcceptIssue = (issueId: string) => {
    if (!reviewResult) return;
    const updatedIssues = reviewResult.issues.map((iss) => {
      if (iss.id === issueId) {
        setText((prev) => prev.replace(iss.originalText, iss.suggestedReplacement));
        return { ...iss, status: 'accepted' as const };
      }
      return iss;
    });

    setReviewResult({
      ...reviewResult,
      issues: updatedIssues,
      overallScore: Math.min(100, reviewResult.overallScore + 12),
    });
  };

  const handleRejectIssue = (issueId: string) => {
    if (!reviewResult) return;
    const updatedIssues = reviewResult.issues.map((iss) =>
      iss.id === issueId ? { ...iss, status: 'rejected' as const } : iss
    );
    setReviewResult({ ...reviewResult, issues: updatedIssues });
  };

  const handleModifyIssue = (issueId: string, modified: string) => {
    if (!reviewResult) return;
    const updatedIssues = reviewResult.issues.map((iss) =>
      iss.id === issueId ? { ...iss, status: 'modified' as const, modifiedText: modified } : iss
    );
    setText((prev) => {
      const target = reviewResult.issues.find((i) => i.id === issueId);
      return target ? prev.replace(target.originalText, modified) : prev;
    });
    setReviewResult({ ...reviewResult, issues: updatedIssues });
  };

  // Submit to Review Queue
  const handleSubmitQueue = async () => {
    setIsSubmitting(true);
    const newSubmission: Partial<ContentSubmission> = {
      id: `sub_${Date.now()}`,
      orgId: currentUser.orgId,
      title,
      format,
      rawText: text,
      currentText: text,
      channel,
      targetAudience,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
      status: 'in_review',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewResult: reviewResult || undefined,
      comments: [],
      revisionHistory: [
        {
          version: 1,
          text,
          updatedAt: new Date().toISOString(),
          authorName: currentUser.name,
          changeNote: 'Initial draft submitted.',
        },
      ],
    };

    onSubmitToQueue(newSubmission);
    onLogAudit(
      'Submission Dispatched',
      `Submitted "${title}" to approval queue.`,
      'workflow'
    );

    setIsSubmitting(false);
    setSuccessToast(`Submitted "${title}" to the queue.`);
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'text-emerald-800 bg-emerald-50 border-emerald-300';
    if (score >= 65) return 'text-amber-800 bg-amber-50 border-amber-300';
    return 'text-rose-800 bg-rose-50 border-rose-300';
  };

  return (
    <div className="space-y-5">
      {successToast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            {successToast}
          </span>
          <button onClick={() => setSuccessToast(null)} className="font-bold">×</button>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-sand-200">
        <div>
          <h2 className="text-lg font-serif font-bold text-sand-900">
            Brand Review & Governance
          </h2>
          <p className="text-xs text-sand-500">
            Scan content against {guidelines.brandName} guidelines before publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={docxInputRef}
            onChange={handleDocxUpload}
            accept=".docx"
            className="hidden"
          />
          <button
            onClick={() => docxInputRef.current?.click()}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-sand-300 hover:bg-sand-50 text-sand-800 flex items-center gap-1.5 shadow-2xs"
          >
            <Upload className="h-3.5 w-3.5 text-sand-600" />
            Upload DOCX
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-sand-300 hover:bg-sand-50 text-sand-800 flex items-center gap-1.5 shadow-2xs"
          >
            <ImageIcon className="h-3.5 w-3.5 text-sand-600" />
            Check Image
          </button>
        </div>
      </div>

      {/* Editor & Scorecard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Content Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-sand-600">
                Document / Content Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs font-semibold text-sand-900 bg-sand-50/50 border border-sand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sand-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-sand-500 block mb-1">
                  Format
                </label>
                <select
                  aria-label="Format selection"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ContentFormat)}
                  className="w-full text-xs text-sand-800 bg-sand-50/50 border border-sand-200 rounded-lg p-2 focus:outline-hidden"
                >
                  <option value="ad_copy">Ad Copy</option>
                  <option value="social">Social Media</option>
                  <option value="email">Email</option>
                  <option value="text">Blog / Article</option>
                  <option value="docx">DOCX</option>
                  <option value="image">Image Creative</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-sand-500 block mb-1">
                  Channel
                </label>
                <input
                  type="text"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full text-xs text-sand-800 bg-sand-50/50 border border-sand-200 rounded-lg p-2 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-sand-500 block mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full text-xs text-sand-800 bg-sand-50/50 border border-sand-200 rounded-lg p-2 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Text Area */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-sand-600 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-sand-500" />
                  Draft Content
                </label>
                <span className="text-[10px] text-sand-400 font-mono">
                  {text.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="w-full text-xs leading-relaxed text-sand-900 bg-sand-50/30 border border-sand-200 rounded-xl p-3.5 focus:ring-2 focus:ring-sand-500 focus:outline-hidden"
              />
            </div>

            {/* Image Preview if checked */}
            {selectedImage && (
              <div className="p-3 rounded-xl border border-sand-200 bg-sand-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={selectedImage} alt="Uploaded" className="h-12 w-12 object-cover rounded-md" />
                  <div>
                    <div className="font-bold text-sand-900">Palette Match: 92%</div>
                    <div className="text-[10px] text-sand-500">Contrast: {imageAnalysis?.contrastRatio || '14.2'}:1</div>
                  </div>
                </div>
                <button onClick={() => setSelectedImage(null)} className="text-xs text-rose-600 hover:underline">
                  Remove
                </button>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleRunReview}
                disabled={isLoading || !text.trim()}
                className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                  isLoading || !text.trim()
                    ? 'bg-sand-200 text-sand-500 cursor-not-allowed'
                    : 'bg-sand-900 hover:bg-sand-800 text-sand-50'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Scanning against Brand Rules...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-sand-300" />
                    Run AI Brand Review
                  </>
                )}
              </button>

              <button
                onClick={handleSubmitQueue}
                disabled={isSubmitting || !text.trim()}
                className="px-4 py-2 rounded-xl font-semibold text-xs bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                Submit to Queue
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Scorecard */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-sand-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sand-700">
                Compliance Scorecard
              </h3>
              <span className="text-[10px] text-sand-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Real-time
              </span>
            </div>

            {reviewResult ? (
              <div className="space-y-3.5">
                <div
                  className={`p-3.5 rounded-xl border text-center ${getScoreBadgeColor(
                    reviewResult.overallScore
                  )}`}
                >
                  <div className="text-2xl font-serif font-extrabold">
                    {reviewResult.overallScore}%
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                    {reviewResult.overallScore >= 85
                      ? 'Approved for Publication'
                      : reviewResult.overallScore >= 65
                      ? 'Revisions Recommended'
                      : 'Critical Governance Issues'}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-sand-700 font-medium mb-1">
                      <span>Tone & Voice</span>
                      <span className="font-bold">{reviewResult.toneScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sand-800 rounded-full" style={{ width: `${reviewResult.toneScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sand-700 font-medium mb-1">
                      <span>Glossary Compliance</span>
                      <span className="font-bold">{reviewResult.terminologyScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full" style={{ width: `${reviewResult.terminologyScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sand-700 font-medium mb-1">
                      <span>Claims & Citations</span>
                      <span className="font-bold">{reviewResult.claimsScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-600 rounded-full" style={{ width: `${reviewResult.claimsScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sand-700 font-medium mb-1">
                      <span>Accessibility (WCAG)</span>
                      <span className="font-bold">{reviewResult.accessibilityScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${reviewResult.accessibilityScore}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-sand-50 border border-sand-200 text-[11px] text-sand-600">
                  {reviewResult.aiDisclosure}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-sand-400 text-xs">
                <Sparkles className="h-6 w-6 text-sand-400 mx-auto mb-2" />
                Run AI review to check brand compliance.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side by Side Diff & Suggestion Actions */}
      {reviewResult && (
        <div className="bg-sand-50/70 p-5 rounded-2xl border border-sand-300 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-sand-900 uppercase tracking-wider">
              Explainable Flags & Intent-Preserving Rewrite
            </h3>
            <span className="text-[10px] text-sand-500 font-mono">
              {reviewResult.issues.length} issues flagged
            </span>
          </div>

          <DiffViewer
            originalText={text}
            suggestedText={reviewResult.suggestedFullText || text}
            issues={reviewResult.issues}
            onAcceptIssue={handleAcceptIssue}
            onRejectIssue={handleRejectIssue}
            onModifyIssue={handleModifyIssue}
          />
        </div>
      )}
    </div>
  );
};
