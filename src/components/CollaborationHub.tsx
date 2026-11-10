'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Project,
  ProjectStatus,
  ProjectMilestone,
  TeamChangeRecord,
  UserAccount,
  UserRole,
  HuddleCallSession,
} from '@/lib/types';
import {
  FolderKanban,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Video,
  Mic,
  MicOff,
  VideoOff,
  MonitorUp,
  PhoneOff,
  History,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Send,
  Radio,
  FileEdit,
  Shield,
  Layers,
  Calendar,
  Check,
  Eye,
  Activity,
  Maximize2,
} from 'lucide-react';

interface CollaborationHubProps {
  currentUser: UserAccount;
  teamMembers: UserAccount[];
  projects: Project[];
  changeRecords: TeamChangeRecord[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onAddChangeRecord: (record: TeamChangeRecord) => void;
  onLogAudit: (action: string, details: string, category: any) => void;
}

export const CollaborationHub: React.FC<CollaborationHubProps> = ({
  currentUser,
  teamMembers,
  projects,
  changeRecords,
  onAddProject,
  onUpdateProject,
  onAddChangeRecord,
  onLogAudit,
}) => {
  // Selected project state
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'timeline' | 'changes' | 'huddle' | 'team'>('timeline');

  // New Project Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-12-15');
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([currentUser.id]);
  const [selectedReviewerIds, setSelectedReviewerIds] = useState<string[]>([]);
  const [newChannels, setNewChannels] = useState('LinkedIn, YouTube, Newsletter');

  // Interactive Live Huddle / Video Call State
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callMessages, setCallMessages] = useState<
    Array<{ id: string; sender: string; role: string; text: string; time: string }>
  >([
    {
      id: 'm1',
      sender: 'Julian Vance',
      role: 'reviewer',
      text: 'Checking the revised metabolic claims on slide 4 now.',
      time: '11:42 AM',
    },
    {
      id: 'm2',
      sender: 'Maya Lin',
      role: 'creator',
      text: 'Great, I aligned all percentages with the approved clinical dataset.',
      time: '11:43 AM',
    },
  ]);
  const [newCallMsg, setNewCallMsg] = useState('');
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Live presence ticker simulation
  const [liveBeacons, setLiveBeacons] = useState<Array<{ name: string; action: string; time: string }>>([
    { name: 'Maya Lin', action: 'edited headline in Draft #2', time: 'Just now' },
    { name: 'Julian Vance', action: 'validated Journal citation #LH-2024', time: '2m ago' },
  ]);

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  // Filter creators and reviewers from teamMembers
  const creators = teamMembers.filter((m) => m.role === 'creator');
  const reviewers = teamMembers.filter((m) => m.role === 'reviewer' || m.role === 'manager');

  const statusConfig: Record<
    ProjectStatus,
    { label: string; bg: string; text: string; border: string; stepIdx: number }
  > = {
    just_started: {
      label: 'Just Started',
      bg: 'bg-stone-100',
      text: 'text-stone-800',
      border: 'border-stone-300',
      stepIdx: 0,
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-300',
      stepIdx: 1,
    },
    under_review: {
      label: 'Under Review',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      stepIdx: 2,
    },
    revisions: {
      label: 'Revisions Requested',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
      stepIdx: 3,
    },
    completed: {
      label: 'Completed & Certified',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      stepIdx: 4,
    },
  };

  const timelineStages: ProjectStatus[] = [
    'just_started',
    'in_progress',
    'under_review',
    'revisions',
    'completed',
  ];

  // Handle stage advancement
  const handleAdvanceStage = (nextStatus: ProjectStatus) => {
    if (!selectedProject) return;
    const progressMap: Record<ProjectStatus, number> = {
      just_started: 15,
      in_progress: 50,
      under_review: 75,
      revisions: 60,
      completed: 100,
    };
    const updated: Project = {
      ...selectedProject,
      status: nextStatus,
      progressPercent: progressMap[nextStatus],
    };
    onUpdateProject(updated);

    onAddChangeRecord({
      id: `chg_${Date.now()}`,
      projectId: selectedProject.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      changeType: 'status_change',
      description: `Advanced project stage to "${statusConfig[nextStatus].label}".`,
    });

    onLogAudit(
      'Project Stage Updated',
      `Moved "${selectedProject.title}" to ${statusConfig[nextStatus].label}`,
      'collaboration'
    );
  };

  // Handle Milestone Toggle
  const handleToggleMilestone = (milestoneId: string) => {
    if (!selectedProject) return;
    const updatedMilestones = selectedProject.milestones.map((m) => {
      if (m.id === milestoneId) {
        const isDone = m.status === 'completed';
        return {
          ...m,
          status: isDone ? ('pending' as const) : ('completed' as const),
          completedAt: isDone ? undefined : new Date().toISOString().split('T')[0],
          completedBy: isDone ? undefined : currentUser.name,
        };
      }
      return m;
    });

    const completedCount = updatedMilestones.filter((m) => m.status === 'completed').length;
    const progress = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);

    const updated: Project = {
      ...selectedProject,
      milestones: updatedMilestones,
      progressPercent: progress,
    };
    onUpdateProject(updated);

    onAddChangeRecord({
      id: `chg_${Date.now()}`,
      projectId: selectedProject.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      changeType: 'status_change',
      description: `Toggled milestone completion status in "${selectedProject.title}".`,
    });
  };

  // Handle Screen Share Trigger
  const handleToggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          localStreamRef.current = stream;
          if (screenShareVideoRef.current) {
            screenShareVideoRef.current.srcObject = stream;
            screenShareVideoRef.current.play();
          }
          setIsScreenSharing(true);
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
          };
        } else {
          setIsScreenSharing(true);
        }
      } catch (err) {
        console.warn('Screen share cancelled or not permitted:', err);
        setIsScreenSharing(true);
      }
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      setIsScreenSharing(false);
    }
  };

  // Send Huddle In-Call message
  const handleSendCallMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCallMsg.trim()) return;
    setCallMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        sender: currentUser.name,
        role: currentUser.role,
        text: newCallMsg.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewCallMsg('');
  };

  // Handle Create Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: Project = {
      id: `proj_${Date.now()}`,
      orgId: currentUser.orgId,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Multi-stakeholder brand compliance project.',
      status: 'just_started',
      progressPercent: 10,
      startDate: new Date().toISOString().split('T')[0],
      targetDeadline: newDeadline || '2026-12-31',
      assignedCreators: selectedCreatorIds,
      assignedReviewers: selectedReviewerIds.length > 0 ? selectedReviewerIds : ['usr_reviewer'],
      submissionIds: [],
      channels: newChannels.split(',').map((c) => c.trim()).filter(Boolean),
      tags: ['Cross-Functional', 'New Initiative'],
      milestones: [
        {
          id: `m_${Date.now()}_1`,
          title: 'Brand Brief & Claims Calibration',
          description: 'Establish factual citations and boundary claims.',
          status: 'in_progress',
          targetDate: newDeadline,
        },
        {
          id: `m_${Date.now()}_2`,
          title: 'Drafting & Multi-Factor Review',
          description: 'Run automated AI checks for spelling, tone, and WCAG contrast.',
          status: 'pending',
          targetDate: newDeadline,
        },
        {
          id: `m_${Date.now()}_3`,
          title: 'Executive Sign-Off & Distribution',
          description: 'Grant cryptographic signature and sync to connected platforms.',
          status: 'pending',
          targetDate: newDeadline,
        },
      ],
    };

    onAddProject(newProj);
    setSelectedProjectId(newProj.id);
    setIsNewProjectModalOpen(false);
    setNewTitle('');
    setNewDesc('');

    onAddChangeRecord({
      id: `chg_${Date.now()}`,
      projectId: newProj.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      changeType: 'status_change',
      description: `Created new project "${newProj.title}" with ${selectedCreatorIds.length} creators and ${selectedReviewerIds.length} reviewers.`,
    });

    onLogAudit('Project Created', `Initiated "${newProj.title}"`, 'collaboration');
  };

  // Filter change records for current project
  const projectChanges = changeRecords.filter(
    (c) => !selectedProject || c.projectId === selectedProject.id
  );

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & PROJECT SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-sand-300 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sand-100 text-[#3C311F]">
              <FolderKanban className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-serif font-bold text-sand-950 flex items-center gap-2">
                Collaboration Hub
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Live Multi-User Sync
                </span>
              </h2>
              <p className="text-xs text-sand-600">
                Manage concurrent projects, track granular author edits, and huddle live with video and screen share.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Huddle Call Trigger */}
          <button
            onClick={() => {
              setIsInCall(!isInCall);
              if (!isInCall) setActiveTab('huddle');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isInCall
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-[#3C311F] hover:bg-[#2B2316] text-white'
            }`}
          >
            {isInCall ? (
              <>
                <PhoneOff className="h-3.5 w-3.5" />
                Leave Call (Live)
              </>
            ) : (
              <>
                <Video className="h-3.5 w-3.5" />
                Join Team Huddle
              </>
            )}
          </button>

          {/* New Project Button */}
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-sand-900 border border-sand-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5 text-sand-700" />
            New Project
          </button>
        </div>
      </div>

      {/* 2. MULTI-PROJECTS SELECTOR CAROUSEL / STRIP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-sand-700 uppercase tracking-wider px-1">
          <span>Active Team Projects ({projects.length})</span>
          <span className="text-[11px] font-normal text-sand-500 lowercase">
            click a project to inspect timeline & edits
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {projects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            const status = statusConfig[proj.status];
            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all text-left relative overflow-hidden ${
                  isSelected
                    ? 'bg-white border-[#3C311F] shadow-sm ring-1 ring-[#3C311F]/20'
                    : 'bg-sand-50/70 border-sand-200 hover:bg-white hover:border-sand-300 shadow-2xs'
                }`}
              >
                {/* Top status & progress */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}
                  >
                    {status.label}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-sand-700">
                    {proj.progressPercent}%
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xs sm:text-sm text-sand-950 truncate mb-1" title={proj.title}>
                  {proj.title}
                </h3>
                <p className="text-[11px] text-sand-600 line-clamp-2 leading-relaxed mb-3">
                  {proj.description}
                </p>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-sand-200 rounded-full overflow-hidden mb-2.5">
                  <div
                    className="h-full bg-[#3C311F] rounded-full transition-all duration-500"
                    style={{ width: `${proj.progressPercent}%` }}
                  />
                </div>

                {/* Team Avatars & Deadline */}
                <div className="flex items-center justify-between text-[10px] text-sand-500 pt-1 border-t border-sand-100">
                  <div className="flex items-center -space-x-1.5">
                    {proj.assignedCreators.concat(proj.assignedReviewers).slice(0, 3).map((uid, i) => (
                      <span
                        key={i}
                        className="h-5 w-5 rounded-full bg-sand-300 text-[9px] font-bold text-sand-900 border border-white flex items-center justify-center uppercase shadow-2xs"
                        title={teamMembers.find((m) => m.id === uid)?.name || 'Member'}
                      >
                        {(teamMembers.find((m) => m.id === uid)?.name || 'M').charAt(0)}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="h-3 w-3 text-sand-400" />
                    {proj.targetDeadline}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE PROJECT WORKBENCH */}
      {selectedProject && (
        <div className="bg-white rounded-2xl border border-sand-300 shadow-xs overflow-hidden">
          {/* Project Details Banner */}
          <div className="p-5 border-b border-sand-200 bg-sand-50/50 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-sand-950">
                    {selectedProject.title}
                  </h3>
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                      statusConfig[selectedProject.status].bg
                    } ${statusConfig[selectedProject.status].text} ${
                      statusConfig[selectedProject.status].border
                    }`}
                  >
                    {statusConfig[selectedProject.status].label}
                  </span>
                </div>
                <p className="text-xs text-sand-600 max-w-3xl leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Fast Stage Advance Control */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-sand-600">Advance Stage:</span>
                <select
                  value={selectedProject.status}
                  onChange={(e) => handleAdvanceStage(e.target.value as ProjectStatus)}
                  className="text-xs p-1.5 rounded-lg border border-sand-300 bg-white font-semibold text-sand-900 cursor-pointer shadow-2xs"
                >
                  <option value="just_started">01. Just Started</option>
                  <option value="in_progress">02. In Progress</option>
                  <option value="under_review">03. Under Review</option>
                  <option value="revisions">04. Revisions Requested</option>
                  <option value="completed">05. Completed & Certified</option>
                </select>
              </div>
            </div>

            {/* Channels & Team Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-sand-500 font-medium">Channels:</span>
              {selectedProject.channels.map((ch, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-sand-100 text-sand-800 text-[11px] font-semibold"
                >
                  {ch}
                </span>
              ))}

              <span className="text-sand-300">|</span>

              <span className="text-sand-500 font-medium">Assigned Team:</span>
              <span className="text-[11px] font-semibold text-sand-800">
                {selectedProject.assignedCreators.length} Creator(s), {selectedProject.assignedReviewers.length} Reviewer(s)
              </span>
            </div>
          </div>

          {/* Subtabs Bar */}
          <div className="flex border-b border-sand-200 px-5 bg-white overflow-x-auto">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'border-[#3C311F] text-[#3C311F]'
                  : 'border-transparent text-sand-600 hover:text-sand-900'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Project Timeline & Milestones
            </button>

            <button
              onClick={() => setActiveTab('changes')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'changes'
                  ? 'border-[#3C311F] text-[#3C311F]'
                  : 'border-transparent text-sand-600 hover:text-sand-900'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              Author Change Tracking ({projectChanges.length})
            </button>

            <button
              onClick={() => setActiveTab('huddle')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'huddle'
                  ? 'border-[#3C311F] text-[#3C311F]'
                  : 'border-transparent text-sand-600 hover:text-sand-900'
              }`}
            >
              <Video className="h-3.5 w-3.5 text-rose-600" />
              Live Huddle & Screen Share
              {isInCall && (
                <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'team'
                  ? 'border-[#3C311F] text-[#3C311F]'
                  : 'border-transparent text-sand-600 hover:text-sand-900'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Team Roster & Roles
            </button>
          </div>

          {/* TAB 1: INTERACTIVE PROJECT TIMELINE & MILESTONES */}
          {activeTab === 'timeline' && (
            <div className="p-6 space-y-6">
              {/* Visual Stage Progress Stepper */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-sand-700">
                  Project Lifecycle Stage
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {timelineStages.map((st, i) => {
                    const currentIdx = statusConfig[selectedProject.status].stepIdx;
                    const isPassed = i <= currentIdx;
                    const isCurrent = i === currentIdx;

                    return (
                      <div
                        key={st}
                        onClick={() => handleAdvanceStage(st)}
                        className={`cursor-pointer p-3 rounded-xl border transition-all text-center relative ${
                          isCurrent
                            ? 'bg-[#3C311F] text-white border-[#3C311F] shadow-xs'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-sand-50/50 text-sand-500 border-sand-200'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold mb-0.5 opacity-80">
                          STAGE 0{i + 1}
                        </div>
                        <div className="text-xs font-bold truncate">
                          {statusConfig[st].label}
                        </div>
                        {isPassed && !isCurrent && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mx-auto mt-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Milestones Checklist */}
              <div className="space-y-3 pt-4 border-t border-sand-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sand-700">
                    Milestones & Approval Gates ({selectedProject.milestones.length})
                  </h4>
                  <span className="text-xs font-bold text-sand-700 font-mono">
                    {selectedProject.milestones.filter((m) => m.status === 'completed').length} of{' '}
                    {selectedProject.milestones.length} Completed
                  </span>
                </div>

                <div className="divide-y divide-sand-200 border border-sand-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                  {selectedProject.milestones.map((m, idx) => {
                    const isDone = m.status === 'completed';
                    return (
                      <div
                        key={m.id}
                        className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                          isDone ? 'bg-emerald-50/30' : 'hover:bg-sand-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleMilestone(m.id)}
                            className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-emerald-600 border-emerald-700 text-white'
                                : 'bg-white border-sand-400 hover:border-sand-600 text-transparent'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>

                          <div className="space-y-0.5">
                            <span
                              className={`text-xs font-bold block ${
                                isDone ? 'line-through text-sand-500' : 'text-sand-950'
                              }`}
                            >
                              {idx + 1}. {m.title}
                            </span>
                            <p className="text-xs text-sand-600 leading-relaxed">
                              {m.description}
                            </p>
                            {isDone && m.completedBy && (
                              <span className="text-[10px] text-emerald-800 font-medium block pt-0.5">
                                Verified by {m.completedBy} on {m.completedAt}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            {isDone ? 'Completed' : 'Pending'}
                          </span>
                          <span className="text-[10px] text-sand-500 font-mono block mt-1">
                            Due {m.targetDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED AUTHOR CHANGE TRACKING ("WHO CHANGED WHAT") */}
          {activeTab === 'changes' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sand-800">
                    Team Audit Changelog & Version Diff
                  </h4>
                  <p className="text-xs text-sand-600">
                    Transparent log of every content alteration, guideline override, and status promotion.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-sand-500">
                  {projectChanges.length} Entries Recorded
                </span>
              </div>

              {projectChanges.length === 0 ? (
                <div className="p-8 text-center bg-sand-50/50 rounded-xl border border-sand-200 text-xs text-sand-500">
                  No content changes recorded yet for this project.
                </div>
              ) : (
                <div className="space-y-3">
                  {projectChanges.map((change) => {
                    const badgeTypeMap: Record<
                      string,
                      { label: string; bg: string; text: string }
                    > = {
                      text_edit: { label: 'Content Edit', bg: 'bg-blue-100', text: 'text-blue-900' },
                      guideline_override: { label: 'Claims Calibration', bg: 'bg-purple-100', text: 'text-purple-900' },
                      status_change: { label: 'Workflow Advance', bg: 'bg-emerald-100', text: 'text-emerald-900' },
                      media_upload: { label: 'Media Upload', bg: 'bg-amber-100', text: 'text-amber-900' },
                      comment: { label: 'Reviewer Note', bg: 'bg-stone-100', text: 'text-stone-900' },
                    };
                    const typeBadge = badgeTypeMap[change.changeType] || {
                      label: change.changeType,
                      bg: 'bg-sand-100',
                      text: 'text-sand-900',
                    };

                    return (
                      <div
                        key={change.id}
                        className="p-4 rounded-xl border border-sand-200 bg-white shadow-2xs space-y-3"
                      >
                        {/* Header: Member info & timestamp */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-[#3C311F] text-sand-50 flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                              {change.authorName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-sand-950 flex items-center gap-1.5">
                                {change.authorName}
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-sand-100 text-sand-700">
                                  {change.authorRole}
                                </span>
                              </div>
                              <div className="text-[10px] text-sand-500 font-mono">
                                {new Date(change.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${typeBadge.bg} ${typeBadge.text}`}
                            >
                              {typeBadge.label}
                            </span>
                            {change.charDelta !== undefined && change.charDelta !== 0 && (
                              <span
                                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  change.charDelta > 0
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : 'bg-rose-50 text-rose-800'
                                }`}
                              >
                                {change.charDelta > 0 ? `+${change.charDelta}` : change.charDelta} chars
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-sand-800 font-medium">
                          {change.description}
                        </p>

                        {/* Before & After Diff Box */}
                        {(change.contentSnippetBefore || change.contentSnippetAfter) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                            {change.contentSnippetBefore && (
                              <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200 text-xs">
                                <span className="text-[10px] font-bold text-rose-700 uppercase block mb-1">
                                  Prior Version:
                                </span>
                                <span className="text-rose-950 line-through leading-relaxed whitespace-pre-wrap">
                                  {change.contentSnippetBefore}
                                </span>
                              </div>
                            )}

                            {change.contentSnippetAfter && (
                              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs">
                                <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                                  Updated Content:
                                </span>
                                <span className="text-emerald-950 font-medium leading-relaxed whitespace-pre-wrap">
                                  {change.contentSnippetAfter}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE HUDDLE, SCREEN SHARE, AUDIO & VIDEO CALL */}
          {activeTab === 'huddle' && (
            <div className="p-6 space-y-6">
              <div className="p-4 rounded-xl bg-sand-50 border border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sand-900">
                      Live Collaborative Huddle Room
                    </h4>
                  </div>
                  <p className="text-xs text-sand-600">
                    Real-time video & audio call with screen sharing for simultaneous editorial reviews.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsInCall(!isInCall)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all ${
                      isInCall
                        ? 'bg-rose-700 text-white hover:bg-rose-800'
                        : 'bg-[#3C311F] text-white hover:bg-[#2B2316]'
                    }`}
                  >
                    {isInCall ? 'End Call' : 'Join Huddle Room'}
                  </button>
                </div>
              </div>

              {/* Main Call Grid & Screen Share Stage */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* 2 Cols: Video Tiles & Screen Share */}
                <div className="lg:col-span-2 space-y-3">
                  {/* Screen Share Stage */}
                  <div className="relative rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden min-h-[300px] flex items-center justify-center text-center p-4">
                    {isScreenSharing ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <video
                          ref={screenShareVideoRef}
                          autoPlay
                          playsInline
                          className="w-full max-h-[360px] object-contain rounded-lg"
                        />
                        <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 border border-emerald-500/30">
                          <Radio className="h-3 w-3 animate-pulse" />
                          Screen Sharing Active: {currentUser.name}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 max-w-sm">
                        <div className="h-16 w-16 rounded-2xl bg-stone-800 flex items-center justify-center text-sand-300 mx-auto border border-stone-700 shadow-md">
                          <MonitorUp className="h-8 w-8" />
                        </div>
                        <div>
                          <h5 className="text-sand-100 font-serif font-bold text-sm">
                            Presentation & Screen Share Stage
                          </h5>
                          <p className="text-xs text-stone-400 mt-1">
                            Click &ldquo;Share Screen&rdquo; below to broadcast your document editor, video timeline, or Canva designs directly to team members.
                          </p>
                        </div>
                        <button
                          onClick={handleToggleScreenShare}
                          disabled={!isInCall}
                          className="px-4 py-2 rounded-xl bg-sand-100 hover:bg-white text-sand-950 font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs"
                        >
                          Start Screen Sharing
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Participant Video Tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {/* User 1: Current User */}
                    <div className="relative rounded-xl bg-stone-800 border border-stone-700 aspect-video flex items-center justify-center overflow-hidden">
                      {isVideoOn ? (
                        <div className="text-center space-y-1">
                          <div className="h-10 w-10 rounded-full bg-[#3C311F] text-sand-50 flex items-center justify-center font-bold text-xs mx-auto border border-sand-400">
                            {currentUser.name.charAt(0)}
                          </div>
                          <div className="text-[10px] text-sand-200 font-bold">{currentUser.name} (You)</div>
                        </div>
                      ) : (
                        <div className="text-stone-400 text-xs flex items-center gap-1">
                          <VideoOff className="h-4 w-4" />
                          Camera Off
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-stone-900/80 px-1.5 py-0.5 rounded text-[9px] text-sand-200">
                        {isMuted ? <MicOff className="h-2.5 w-2.5 text-rose-400" /> : <Mic className="h-2.5 w-2.5 text-emerald-400" />}
                        <span>{currentUser.role}</span>
                      </div>
                    </div>

                    {/* User 2: Maya Lin (Creator) */}
                    <div className="relative rounded-xl bg-stone-800 border border-stone-700 aspect-video flex items-center justify-center overflow-hidden">
                      <div className="text-center space-y-1">
                        <div className="h-10 w-10 rounded-full bg-emerald-800 text-sand-50 flex items-center justify-center font-bold text-xs mx-auto border border-emerald-400">
                          M
                        </div>
                        <div className="text-[10px] text-sand-200 font-bold">Maya Lin</div>
                      </div>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-stone-900/80 px-1.5 py-0.5 rounded text-[9px] text-sand-200">
                        <Mic className="h-2.5 w-2.5 text-emerald-400 animate-pulse" />
                        <span>Creator</span>
                      </div>
                    </div>

                    {/* User 3: Julian Vance (Reviewer) */}
                    <div className="relative rounded-xl bg-stone-800 border border-stone-700 aspect-video flex items-center justify-center overflow-hidden">
                      <div className="text-center space-y-1">
                        <div className="h-10 w-10 rounded-full bg-amber-800 text-sand-50 flex items-center justify-center font-bold text-xs mx-auto border border-amber-400">
                          J
                        </div>
                        <div className="text-[10px] text-sand-200 font-bold">Julian Vance</div>
                      </div>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-stone-900/80 px-1.5 py-0.5 rounded text-[9px] text-sand-200">
                        <Mic className="h-2.5 w-2.5 text-emerald-400" />
                        <span>Reviewer</span>
                      </div>
                    </div>
                  </div>

                  {/* Call Controls Bar */}
                  <div className="p-3 rounded-xl bg-sand-100 border border-sand-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-2.5 rounded-full border transition-all ${
                        isMuted
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-white text-sand-800 border-sand-300 hover:bg-sand-50'
                      }`}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`p-2.5 rounded-full border transition-all ${
                        !isVideoOn
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-white text-sand-800 border-sand-300 hover:bg-sand-50'
                      }`}
                      title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
                    >
                      {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={handleToggleScreenShare}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                        isScreenSharing
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-white text-sand-800 border-sand-300 hover:bg-sand-50'
                      }`}
                    >
                      <MonitorUp className="h-4 w-4" />
                      {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                    </button>

                    <button
                      onClick={() => setIsInCall(false)}
                      className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <PhoneOff className="h-4 w-4" />
                      End
                    </button>
                  </div>
                </div>

                {/* 1 Col: In-Call Collaborative Chat & Live Presence Notes */}
                <div className="bg-sand-50/70 rounded-2xl border border-sand-300 p-4 flex flex-col justify-between h-[480px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                      <span className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-sand-600" />
                        In-Call Team Notes
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                        3 Online
                      </span>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1 text-xs">
                      {callMessages.map((msg) => (
                        <div key={msg.id} className="p-2.5 rounded-xl bg-white border border-sand-200 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-sand-900">{msg.sender}</span>
                            <span className="text-sand-400 font-mono">{msg.time}</span>
                          </div>
                          <p className="text-sand-700 leading-relaxed text-[11px]">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendCallMsg} className="flex gap-2 pt-2 border-t border-sand-200">
                    <input
                      type="text"
                      placeholder="Share timestamp or note..."
                      value={newCallMsg}
                      onChange={(e) => setNewCallMsg(e.target.value)}
                      className="flex-1 text-xs p-2 rounded-lg border border-sand-300 bg-white"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-lg bg-[#3C311F] text-white text-xs font-bold hover:bg-[#2B2316] shrink-0"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEAM ROSTER & MULTIPLE CREATORS / REVIEWERS */}
          {activeTab === 'team' && (
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sand-800">
                  Project Stakeholders & Role Matrix
                </h4>
                <p className="text-xs text-sand-600">
                  Multiple creators draft and iterate on assets, while designated reviewers verify clinical accuracy and sign approvals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Creators Column */}
                <div className="p-4 rounded-xl border border-sand-300 bg-sand-50/60 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                    <span className="text-xs font-bold uppercase text-sand-900 flex items-center gap-1.5">
                      <FileEdit className="h-4 w-4 text-sand-700" />
                      Assigned Creators
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sand-200 text-sand-800">
                      Draft Authors
                    </span>
                  </div>

                  <div className="space-y-2">
                    {creators.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-lg bg-white border border-sand-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-[#3C311F] text-sand-50 flex items-center justify-center font-bold text-xs uppercase">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-sand-900">{c.name}</div>
                            <div className="text-[10px] text-sand-500">{c.email}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Online
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviewers Column */}
                <div className="p-4 rounded-xl border border-sand-300 bg-sand-50/60 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                    <span className="text-xs font-bold uppercase text-sand-900 flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-[#3C311F]" />
                      Assigned Reviewers & Managers
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sand-200 text-sand-800">
                      Compliance Certifiers
                    </span>
                  </div>

                  <div className="space-y-2">
                    {reviewers.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-lg bg-white border border-sand-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-sand-800 text-sand-50 flex items-center justify-center font-bold text-xs uppercase">
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-sand-900">{r.name}</div>
                            <div className="text-[10px] text-sand-500">{r.department || 'Editorial'}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-sand-600 capitalize">
                          {r.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. NEW PROJECT MODAL */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-sand-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-sand-300 max-w-lg w-full p-6 shadow-xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-sand-200">
              <h3 className="font-serif font-bold text-base text-sand-950">
                Create New Collaborative Project
              </h3>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-sand-400 hover:text-sand-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-sand-700 uppercase text-[11px]">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q1 Global Webinar Campaign & Video Suite"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-lg border border-sand-300 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-sand-700 uppercase text-[11px]">
                  Campaign Objective & Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe content goals, target claims to prove, and governance rules..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-sand-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-sand-700 uppercase text-[11px]">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2 rounded-lg border border-sand-300 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-sand-700 uppercase text-[11px]">
                    Target Channels
                  </label>
                  <input
                    type="text"
                    value={newChannels}
                    onChange={(e) => setNewChannels(e.target.value)}
                    placeholder="LinkedIn, YouTube, Newsletter"
                    className="w-full p-2 rounded-lg border border-sand-300 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-sand-300 text-sand-700 hover:bg-sand-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#3C311F] text-white hover:bg-[#2B2316] font-semibold text-xs shadow-xs"
                >
                  Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
