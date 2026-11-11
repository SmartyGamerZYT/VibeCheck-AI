'use client';

import React, { useState } from 'react';
import {
  ContentSubmission,
  SubmissionStatus,
  UserAccount,
  UserRole,
} from '@/lib/types';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  User,
  ExternalLink,
  ChevronRight,
  Send,
  History,
} from 'lucide-react';

interface SubmissionQueueProps {
  submissions: ContentSubmission[];
  currentUser: UserAccount;
  onUpdateSubmission: (updated: ContentSubmission) => void;
  onLogAudit: (action: string, details: string, category: any) => void;
}

export const SubmissionQueue: React.FC<SubmissionQueueProps> = ({
  submissions,
  currentUser,
  onUpdateSubmission,
  onLogAudit,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSub, setSelectedSub] = useState<ContentSubmission | null>(null);
  
  // Comment input state
  const [newComment, setNewComment] = useState('');
  // Signature modal state
  const [showSignModal, setShowSignModal] = useState(false);
  const [signRemarks, setSignRemarks] = useState('Reviewed and approved for production syndication.');

  const filtered = submissions.filter((sub) => {
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    const matchesSearch =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.rawText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'changes_requested':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'in_review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-sand-200 text-sand-800 border-sand-300';
    }
  };

  const handleAddComment = async (sub: ContentSubmission) => {
    if (!newComment.trim()) return;

    const commentObj = {
      id: `c_${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated: ContentSubmission = {
      ...sub,
      comments: [...sub.comments, commentObj],
      updatedAt: new Date().toISOString(),
    };

    onUpdateSubmission(updated);
    setSelectedSub(updated);
    setNewComment('');

    // Trigger email notification to submission author
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: sub.author.email,
          subject: `[VibeCheck AI] New comment on "${sub.title}" by ${currentUser.name}`,
          heading: `New Feedback Received`,
          message: `${currentUser.name} (${currentUser.role}) wrote: "${commentObj.text}"`,
          actionUrl: 'http://localhost:3000',
          actionLabel: 'Respond to Feedback',
        }),
      });
    } catch (e) {
      console.warn('Comment email alert warning:', e);
    }

    onLogAudit(
      'Review Feedback Appended',
      `Appended comment to submission "${sub.title}".`,
      'workflow'
    );
  };

  const handleRequestRevision = (sub: ContentSubmission) => {
    const updated: ContentSubmission = {
      ...sub,
      status: 'changes_requested',
      updatedAt: new Date().toISOString(),
    };
    onUpdateSubmission(updated);
    setSelectedSub(updated);
    onLogAudit('Changes Requested', `Reviewer requested revisions on "${sub.title}".`, 'workflow');
  };

  const handleApproveSignature = async (sub: ContentSubmission) => {
    const dummyHash = `SHA256:${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    const updated: ContentSubmission = {
      ...sub,
      status: 'approved',
      updatedAt: new Date().toISOString(),
      approvalSignature: {
        signedBy: currentUser.name,
        signerEmail: currentUser.email,
        role: currentUser.role,
        timestamp: new Date().toISOString(),
        hash: dummyHash,
        remarks: signRemarks,
      },
    };

    // Notify author of approval via Resend
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: sub.author.email,
          subject: `[VibeCheck AI] Content Approved: "${sub.title}"`,
          heading: `Final Approval Sign-Off Granted`,
          message: `Your submission "${sub.title}" has received formal sign-off from ${currentUser.name} (${currentUser.role}). Digital Signature: ${dummyHash}. You are now authorized to publish.`,
          actionUrl: 'http://localhost:3000',
          actionLabel: 'View Approved Asset',
        }),
      });
    } catch (e) {
      console.warn('Approval email notification:', e);
    }

    onUpdateSubmission(updated);
    setSelectedSub(updated);
    setShowSignModal(false);
    onLogAudit(
      'Cryptographic Approval Sign-Off',
      `Approved "${sub.title}" with hash ${dummyHash}.`,
      'workflow'
    );
  };

  const handleReject = (sub: ContentSubmission) => {
    const updated: ContentSubmission = {
      ...sub,
      status: 'rejected',
      updatedAt: new Date().toISOString(),
    };
    onUpdateSubmission(updated);
    setSelectedSub(updated);
    onLogAudit('Submission Rejected', `Rejected submission "${sub.title}".`, 'workflow');
  };

  const canSign = currentUser.role === 'manager' || currentUser.role === 'admin';
  const canReview = currentUser.role === 'reviewer' || canSign;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-sand-900">
            Review & Approval Workflow Queue
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-sand-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search submissions..."
              className="pl-8 pr-3 py-1.5 text-xs text-sand-900 bg-white border border-sand-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sand-500 shadow-2xs w-48 sm:w-60"
            />
          </div>

          <select
            aria-label="Filter submissions by status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold text-sand-800 bg-white border border-sand-300 rounded-lg py-1.5 px-3 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-sand-500"
          >
            <option value="all">All Statuses</option>
            <option value="in_review">In Review</option>
            <option value="changes_requested">Changes Requested</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Grid / Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (5 cols or 12 cols if nothing selected) */}
        <div className={`${selectedSub ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-sand-300 text-sand-500 text-xs">
              No submissions match the current filter.
            </div>
          ) : (
            filtered.map((sub) => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sand-100/90 border-sand-500 shadow-sm'
                      : 'bg-white hover:border-sand-400 border-sand-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                            sub.status
                          )}`}
                        >
                          {sub.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sand-100 text-sand-600 border border-sand-200">
                          v{sub.version}
                        </span>
                        <span className="text-[11px] text-sand-500 uppercase font-semibold">
                          {sub.format}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-sand-900 leading-snug">
                        {sub.title}
                      </h4>
                      <p className="text-[11px] text-sand-600 line-clamp-2">
                        {sub.currentText}
                      </p>
                    </div>

                    {/* Overall Score Badge */}
                    {sub.reviewResult && (
                      <div className="shrink-0 text-center px-2 py-1 bg-sand-50 border border-sand-200 rounded-lg">
                        <div className="text-xs font-extrabold text-sand-900">
                          {sub.reviewResult.overallScore}%
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-sand-500 font-bold">
                          Score
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-sand-100 text-[11px] text-sand-500">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      <span>{sub.author.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {sub.comments.length}
                      </span>
                      <span>
                        {new Date(sub.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Drawer (7 cols) */}
        {selectedSub && (
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-sand-300 shadow-xs space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-sand-200">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                      selectedSub.status
                    )}`}
                  >
                    {selectedSub.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-sand-500">
                    Submitted by <strong>{selectedSub.author.name}</strong> ({selectedSub.author.role})
                  </span>
                </div>
                <h3 className="text-base font-bold text-sand-900 font-serif">
                  {selectedSub.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedSub(null)}
                className="text-xs text-sand-400 hover:text-sand-700 font-bold"
              >
                Close ✕
              </button>
            </div>

            {/* Cryptographic Sign-Off Banner if Approved */}
            {selectedSub.approvalSignature && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Legally Verified Brand Approval Signature</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Signed by <strong>{selectedSub.approvalSignature.signedBy}</strong> ({selectedSub.approvalSignature.role}) on{' '}
                  {new Date(selectedSub.approvalSignature.timestamp).toLocaleString()}
                </p>
                <div className="text-[10px] font-mono text-emerald-700 break-all bg-emerald-100/60 p-1.5 rounded">
                  {selectedSub.approvalSignature.hash}
                </div>
                {selectedSub.approvalSignature.remarks && (
                  <p className="text-xs italic text-emerald-900">
                    &ldquo;{selectedSub.approvalSignature.remarks}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Content Display */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-sand-700">
                Current Content Copy
              </label>
              <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs font-normal leading-relaxed text-sand-900 whitespace-pre-wrap max-h-56 overflow-y-auto">
                {selectedSub.currentText}
              </div>
            </div>

            {/* Review Score Summary */}
            {selectedSub.reviewResult && (
              <div className="p-3.5 rounded-xl bg-sand-100/70 border border-sand-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-sand-900">Compliance Score:</span>{' '}
                  <span className="font-extrabold text-sand-950">
                    {selectedSub.reviewResult.overallScore}/100
                  </span>{' '}
                  • {selectedSub.reviewResult.issues.length} flagged issues
                </div>
                <span className="text-[11px] text-sand-600 font-medium">
                  {selectedSub.reviewResult.aiDisclosure}
                </span>
              </div>
            )}

            {/* Workflow Action Buttons for Reviewer / Manager */}
            {selectedSub.status !== 'approved' && (
              <div className="p-4 rounded-xl bg-sand-50 border border-sand-300 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-sand-700">
                  Workflow Actions ({currentUser.role} permissions):
                </span>
                <div className="flex items-center gap-2">
                  {canReview && (
                    <button
                      onClick={() => handleRequestRevision(selectedSub)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
                    >
                      Request Revisions
                    </button>
                  )}
                  {canSign && (
                    <>
                      <button
                        onClick={() => setShowSignModal(true)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs flex items-center gap-1.5"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Approve & Sign
                      </button>
                      <button
                        onClick={() => handleReject(selectedSub)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-900 border border-rose-300 hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Threaded Comments & Collaborative Discussion */}
            <div className="space-y-3 pt-2 border-t border-sand-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sand-700 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-sand-500" />
                Collaborative Discussion ({selectedSub.comments.length})
              </h4>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {selectedSub.comments.length === 0 ? (
                  <p className="text-xs text-sand-500 italic">No comments yet. Start the conversation below.</p>
                ) : (
                  selectedSub.comments.map((c) => (
                    <div key={c.id} className="p-3 rounded-lg bg-sand-50 border border-sand-200 text-xs space-y-1">
                      <div className="flex justify-between items-center text-[11px] text-sand-500">
                        <span className="font-bold text-sand-900">
                          {c.authorName} <span className="font-normal uppercase text-sand-600">({c.authorRole})</span>
                        </span>
                        <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sand-800 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(selectedSub);
                  }}
                  placeholder="Leave an inline review note or guidance..."
                  className="flex-1 text-xs text-sand-900 bg-sand-50/50 border border-sand-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sand-500 focus:outline-hidden"
                />
                <button
                  onClick={() => handleAddComment(selectedSub)}
                  disabled={!newComment.trim()}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-sand-900 hover:bg-sand-800 text-sand-50 flex items-center gap-1 disabled:opacity-40"
                >
                  <Send className="h-3 w-3" />
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approval Cryptographic Signature Modal */}
      {showSignModal && selectedSub && (
        <div className="fixed inset-0 z-50 bg-sand-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-sand-300 shadow-modal max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-800">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <h3 className="text-base font-bold text-sand-900 font-serif">
                Manager Publication Sign-Off
              </h3>
            </div>
            <p className="text-xs text-sand-600 leading-relaxed">
              You are applying an immutable cryptographic governance signature to{' '}
              <strong>&ldquo;{selectedSub.title}&rdquo;</strong>. This certifies compliance with approved brand guidelines and releases the content for publishing.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-sand-700">
                Signer
              </label>
              <div className="p-2.5 rounded-lg bg-sand-50 border border-sand-200 text-xs font-medium text-sand-800">
                {currentUser.name} ({currentUser.email}) • {currentUser.role.toUpperCase()}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-sand-700">
                Approval Remarks / Release Notes
              </label>
              <textarea
                value={signRemarks}
                onChange={(e) => setSignRemarks(e.target.value)}
                rows={3}
                className="w-full text-xs text-sand-900 bg-sand-50 border border-sand-200 rounded-lg p-2.5 focus:ring-2 focus:ring-sand-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-sand-100 text-sand-700 hover:bg-sand-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproveSignature(selectedSub)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
              >
                Confirm Sign-Off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

