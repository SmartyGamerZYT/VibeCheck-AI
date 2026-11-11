'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Project,
  ProjectStatus,
  TeamChangeRecord,
  UserAccount,
} from '@/lib/types';
import {
  FolderKanban,
  Plus,
  Clock,
  CheckCircle2,
  Users,
  Video,
  Mic,
  MicOff,
  VideoOff,
  MonitorUp,
  PhoneOff,
  PhoneCall,
  History,
  MessageSquare,
  Radio,
  Check,
  UserPlus,
  X,
  Loader2,
  ArrowRightLeft,
  Tv,
} from 'lucide-react';

export interface CallInvitation {
  id: string;
  projectId: string;
  projectTitle: string;
  fromUser: UserAccount;
  toUserId: string;
  toUserName: string;
  toUserRole: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

interface CollaborationHubProps {
  currentUser: UserAccount;
  teamMembers: UserAccount[];
  projects: Project[];
  changeRecords: TeamChangeRecord[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onAddChangeRecord: (record: TeamChangeRecord) => void;
  onLogAudit: (action: string, details: string, category: any) => void;
  onSwitchUser?: (user: UserAccount) => void;
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
  onSwitchUser,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'timeline' | 'changes' | 'huddle' | 'team'>('timeline');

  // Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-12-15');
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([currentUser.id]);
  const [selectedReviewerIds, setSelectedReviewerIds] = useState<string[]>([]);
  const [newChannels, setNewChannels] = useState('LinkedIn, YouTube, Newsletter');

  // Video Call State
  const [isInCall, setIsInCall] = useState(false);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isCamActive, setIsCamActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [camStream, setCamStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);

  // Synchronized Screen Sharing from other participants
  const [remoteScreenShare, setRemoteScreenShare] = useState<{
    userId: string;
    userName: string;
    userRole: string;
    isSharing: boolean;
  } | null>(null);

  // Dynamic Call Participants (ONLY actual joined users appear in the call grid)
  const [callParticipants, setCallParticipants] = useState<UserAccount[]>([]);
  const [callHost, setCallHost] = useState<UserAccount | null>(null);

  // Track member camera states (id -> boolean)
  const [memberCamStates, setMemberCamStates] = useState<Record<string, boolean>>({});

  // Call Invitations
  const [outgoingInvites, setOutgoingInvites] = useState<CallInvitation[]>([]);
  const [incomingInvite, setIncomingInvite] = useState<CallInvitation | null>(null);

  // In-call messages
  const [callMessages, setCallMessages] = useState<
    Array<{ id: string; sender: string; role: string; text: string; time: string }>
  >([]);
  const [newCallMsg, setNewCallMsg] = useState('');

  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  // Cleanup media streams on unmount
  useEffect(() => {
    return () => {
      if (camStream) camStream.getTracks().forEach((t) => t.stop());
      if (screenStream) screenStream.getTracks().forEach((t) => t.stop());
    };
  }, [camStream, screenStream]);

    // Synchronize Screen Sharing and Call State across users/tabs
    const syncCallState = () => {
      try {
        // 1. Invitations sync
        const raw = localStorage.getItem('vibecheck_call_invitations');
        if (raw) {
          const allInvites: CallInvitation[] = JSON.parse(raw);

          // Check incoming invite for logged in user
          const toMe = allInvites.find(
            (inv) => inv.toUserId === currentUser.id && inv.status === 'pending'
          );
          setIncomingInvite(toMe || null);

          // Update outgoing invites sent by current user
          if (isInCall && selectedProject) {
            const myOutgoing = allInvites.filter(
              (inv) => inv.fromUser.id === currentUser.id && inv.projectId === selectedProject.id
            );
            setOutgoingInvites(myOutgoing);

            // If an invite was accepted, ensure that member is in the call
            myOutgoing.forEach((inv) => {
              if (inv.status === 'accepted') {
                const acceptedUser = teamMembers.find((m) => m.id === inv.toUserId);
                if (acceptedUser && !callParticipants.some((p) => p.id === acceptedUser.id)) {
                  setCallParticipants((prev) => [...prev, acceptedUser]);
                }
              }
            });
          }
        }

      // 2. Synchronized Screen Share Sync
      const pId = selectedProject?.id || 'default';
      const rawScreen = localStorage.getItem(`vibecheck_screen_share_${pId}`);
      if (rawScreen) {
        const sData = JSON.parse(rawScreen);
        if (sData.isSharing && sData.userId !== currentUser.id) {
          setRemoteScreenShare(sData);
        } else if (!sData.isSharing) {
          setRemoteScreenShare(null);
        }
      } else {
        setRemoteScreenShare(null);
      }
    } catch { }
  };

  useEffect(() => {
    syncCallState();

    const handleStorage = () => syncCallState();
    const handleCustomInvite = () => syncCallState();
    const handleCustomScreen = () => syncCallState();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('vibecheck_call_invite', handleCustomInvite);
    window.addEventListener('vibecheck_screen_share_update', handleCustomScreen);

    const interval = setInterval(syncCallState, 1500);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('vibecheck_call_invite', handleCustomInvite);
      window.removeEventListener('vibecheck_screen_share_update', handleCustomScreen);
      clearInterval(interval);
    };
  }, [currentUser.id, isInCall, selectedProject?.id, callParticipants.length]);

  // Keep screen video srcObject attached whenever active stream exists
  useEffect(() => {
    const activeStream =
      screenStream ||
      (typeof window !== 'undefined' ? (window as any).__vibecheck_screen_stream : null);

    if (screenVideoRef.current && activeStream) {
      screenVideoRef.current.srcObject = activeStream;
      screenVideoRef.current.play().catch(() => { });
    }
  }, [screenStream, remoteScreenShare, isScreenSharing]);

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
      label: 'Revisions',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
      stepIdx: 3,
    },
    completed: {
      label: 'Certified',
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

  // ==========================================
  // CALL JOIN / START / END
  // ==========================================
  const handleStartOrJoinCall = async () => {
    if (isInCall) {
      handleEndCall();
      return;
    }

    setIsInCall(true);
    setActiveTab('huddle');
    setCallHost(currentUser);
    setCallParticipants([currentUser]);
    setMediaNotice(null);

    setCallMessages([
      {
        id: `sys_${Date.now()}`,
        sender: 'System',
        role: 'system',
        text: `${currentUser.name} started review huddle for "${selectedProject?.title || 'Project'}".`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setCamStream(stream);
        setIsCamActive(true);
        setIsMicActive(true);

        if (typeof window !== 'undefined') {
          if (!(window as any).__vibecheck_cam_streams) (window as any).__vibecheck_cam_streams = {};
          (window as any).__vibecheck_cam_streams[currentUser.id] = stream;
        }
      }
    } catch {
      setIsCamActive(false);
    }

    onLogAudit(
      'Live Huddle Started',
      `${currentUser.name} opened call for "${selectedProject?.title || 'Project'}"`,
      'collaboration'
    );
  };

  const handleEndCall = () => {
    if (camStream) {
      camStream.getTracks().forEach((track) => track.stop());
      setCamStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }
    if (typeof window !== 'undefined') {
      (window as any).__vibecheck_screen_stream = null;
      if ((window as any).__vibecheck_cam_streams) {
        delete (window as any).__vibecheck_cam_streams[currentUser.id];
      }
      const pId = selectedProject?.id || 'default';
      localStorage.setItem(`vibecheck_screen_share_${pId}`, JSON.stringify({ isSharing: false }));
      window.dispatchEvent(new CustomEvent('vibecheck_screen_share_update'));
    }

    setIsScreenSharing(false);
    setRemoteScreenShare(null);
    setIsInCall(false);
    setCallParticipants([]);
    setCallHost(null);
    setOutgoingInvites([]);
    setMediaNotice(null);
  };

  const handleToggleCam = () => {
    if (camStream) {
      const videoTracks = camStream.getVideoTracks();
      videoTracks.forEach((t) => (t.enabled = !isCamActive));
      setIsCamActive(!isCamActive);
    } else {
      setIsCamActive(!isCamActive);
    }
  };

  const handleToggleMic = () => {
    if (camStream) {
      const audioTracks = camStream.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !isMicActive));
      setIsMicActive(!isMicActive);
    } else {
      setIsMicActive(!isMicActive);
    }
  };

  // Toggle remote member's simulated cam in view
  const handleToggleMemberCam = (memberId: string) => {
    setMemberCamStates((prev) => ({
      ...prev,
      [memberId]: prev[memberId] === false ? true : false,
    }));
  };

  // ==========================================
  // REAL SCREEN SHARING WITH SYNCHRONIZATION
  // ==========================================
  const handleToggleScreenShare = async () => {
    const pId = selectedProject?.id || 'default';

    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);

      if (typeof window !== 'undefined') {
        (window as any).__vibecheck_screen_stream = null;
        localStorage.setItem(`vibecheck_screen_share_${pId}`, JSON.stringify({ isSharing: false }));
        window.dispatchEvent(new CustomEvent('vibecheck_screen_share_update'));
      }
      return;
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        setScreenStream(stream);
        setIsScreenSharing(true);
        setMediaNotice(null);

        if (typeof window !== 'undefined') {
          (window as any).__vibecheck_screen_stream = stream;
          localStorage.setItem(
            `vibecheck_screen_share_${pId}`,
            JSON.stringify({
              userId: currentUser.id,
              userName: currentUser.name,
              userRole: currentUser.role,
              isSharing: true,
              timestamp: Date.now(),
            })
          );
          window.dispatchEvent(new CustomEvent('vibecheck_screen_share_update'));
        }

        stream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          setIsScreenSharing(false);
          if (typeof window !== 'undefined') {
            (window as any).__vibecheck_screen_stream = null;
            localStorage.setItem(
              `vibecheck_screen_share_${pId}`,
              JSON.stringify({ isSharing: false })
            );
            window.dispatchEvent(new CustomEvent('vibecheck_screen_share_update'));
          }
        };
      } else {
        setMediaNotice('Screen capture API is not supported in this browser.');
      }
    } catch {
      setIsScreenSharing(false);
    }
  };

  // ==========================================
  // INVITATION DISPATCH (DOES NOT DIRECTLY ADD MEMBER)
  // ==========================================
  const handleSendCallInvitation = (member: UserAccount) => {
    if (!selectedProject) return;

    const newInvite: CallInvitation = {
      id: `inv_${Date.now()}_${member.id}`,
      projectId: selectedProject.id,
      projectTitle: selectedProject.title,
      fromUser: currentUser,
      toUserId: member.id,
      toUserName: member.name,
      toUserRole: member.role,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem('vibecheck_call_invitations');
      const all: CallInvitation[] = raw ? JSON.parse(raw) : [];
      const filtered = all.filter(
        (i) => !(i.toUserId === member.id && i.status === 'pending')
      );
      filtered.push(newInvite);
      localStorage.setItem('vibecheck_call_invitations', JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('vibecheck_call_invite', { detail: newInvite }));
  } catch { }

  setOutgoingInvites((prev) => [...prev.filter((i) => i.toUserId !== member.id), newInvite]);

  onLogAudit(
    'Call Invitation Sent',
    `${currentUser.name} sent call invite to ${member.name} for "${selectedProject.title}".`,
    'collaboration'
  );
};

// Simulate invited user accepting and entering call
const handleSimulateAnswerAndJoin = (memberId: string) => {
  const member = teamMembers.find((m) => m.id === memberId);
  if (!member) return;

  try {
    const raw = localStorage.getItem('vibecheck_call_invitations');
    if (raw) {
      const all: CallInvitation[] = JSON.parse(raw);
      const updated = all.map((i) =>
        i.toUserId === memberId && i.status === 'pending'
          ? { ...i, status: 'accepted' as const }
          : i
      );
      localStorage.setItem('vibecheck_call_invitations', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('vibecheck_call_invite'));
    }
} catch { }

setOutgoingInvites((prev) =>
  prev.map((i) => (i.toUserId === memberId ? { ...i, status: 'accepted' } : i))
);

if (!callParticipants.some((p) => p.id === member.id)) {
  setCallParticipants((prev) => [...prev, member]);
}

setCallMessages((prev) => [
  ...prev,
  {
    id: `sys_${Date.now()}`,
    sender: 'System',
    role: 'system',
    text: `${member.name} (${member.role}) accepted call request and joined.`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
]);
  };

// Accept incoming call request
const handleAcceptIncomingCall = async () => {
  if (!incomingInvite) return;

  try {
    const raw = localStorage.getItem('vibecheck_call_invitations');
    if (raw) {
      const all: CallInvitation[] = JSON.parse(raw);
      const updated = all.map((i) =>
        i.id === incomingInvite.id ? { ...i, status: 'accepted' as const } : i
      );
      localStorage.setItem('vibecheck_call_invitations', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('vibecheck_call_invite'));
    }
} catch { }

setIsInCall(true);
setActiveTab('huddle');
setSelectedProjectId(incomingInvite.projectId);
setCallHost(incomingInvite.fromUser);
setCallParticipants([incomingInvite.fromUser, currentUser]);
setIncomingInvite(null);

setCallMessages([
  {
    id: `sys_${Date.now()}`,
    sender: 'System',
    role: 'system',
    text: `${currentUser.name} accepted call request from ${incomingInvite.fromUser.name}.`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
]);

try {
  if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setCamStream(stream);
    setIsCamActive(true);
    setIsMicActive(true);

    if (typeof window !== 'undefined') {
      if (!(window as any).__vibecheck_cam_streams) (window as any).__vibecheck_cam_streams = {};
      (window as any).__vibecheck_cam_streams[currentUser.id] = stream;
    }
  }
} catch {
  setIsCamActive(false);
}
  };

// Decline incoming call request
const handleDeclineIncomingCall = () => {
  if (!incomingInvite) return;
  try {
    const raw = localStorage.getItem('vibecheck_call_invitations');
    if (raw) {
      const all: CallInvitation[] = JSON.parse(raw);
      const updated = all.map((i) =>
        i.id === incomingInvite.id ? { ...i, status: 'declined' as const } : i
      );
      localStorage.setItem('vibecheck_call_invitations', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('vibecheck_call_invite'));
    }
} catch { }
setIncomingInvite(null);
  };

// Chat message
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

// Advance project stage
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
    description: `Moved stage to "${statusConfig[nextStatus].label}".`,
  });
};

// Milestone toggle
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

  onUpdateProject({
    ...selectedProject,
    milestones: updatedMilestones,
    progressPercent: progress,
  });
};

// Create project
const handleCreateProject = (e: React.FormEvent) => {
  e.preventDefault();
  if (!newTitle.trim()) return;

  const newProj: Project = {
    id: `proj_${Date.now()}`,
    orgId: currentUser.orgId,
    title: newTitle.trim(),
    description: newDesc.trim() || 'Brand compliance project.',
    status: 'just_started',
    progressPercent: 10,
    startDate: new Date().toISOString().split('T')[0],
    targetDeadline: newDeadline || '2026-12-31',
    assignedCreators: selectedCreatorIds,
    assignedReviewers: selectedReviewerIds.length > 0 ? selectedReviewerIds : ['usr_reviewer'],
    submissionIds: [],
    channels: newChannels.split(',').map((c) => c.trim()).filter(Boolean),
    tags: ['Active'],
    milestones: [
      {
        id: `m_${Date.now()}_1`,
        title: 'Brief & Claim Calibration',
        description: 'Establish citations and approved claims.',
        status: 'in_progress',
        targetDate: newDeadline,
      },
      {
        id: `m_${Date.now()}_2`,
        title: 'Drafting & AI Checks',
        description: 'Automated checks for spelling, tone, and grammar.',
        status: 'pending',
        targetDate: newDeadline,
      },
      {
        id: `m_${Date.now()}_3`,
        title: 'Final Sign-Off',
        description: 'Certified sign-off and push to platforms.',
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
};

const projectChanges = changeRecords.filter(
  (c) => !selectedProject || c.projectId === selectedProject.id
);

// Active Screen Share identification
const activeShareUser = isScreenSharing
  ? { userId: currentUser.id, userName: currentUser.name, userRole: currentUser.role }
  : remoteScreenShare?.isSharing
    ? remoteScreenShare
    : null;

const activeSharedStream =
  screenStream ||
  (typeof window !== 'undefined' ? (window as any).__vibecheck_screen_stream : null);

return (
  <div className="space-y-6">
    {/* INCOMING CALL MODAL BANNER */}
    {incomingInvite && (
      <div className="p-4 rounded-2xl bg-[#3C311F] text-white shadow-xl flex items-center justify-between border border-sand-600 animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <PhoneCall className="h-5 w-5 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>Incoming Call Request:</span>
              <span className="text-amber-300 font-semibold">{incomingInvite.fromUser.name}</span>
              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-white/20">
                {incomingInvite.fromUser.role}
              </span>
            </div>
            <div className="text-[11px] text-sand-300">
              Project: {incomingInvite.projectTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAcceptIncomingCall}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Video className="h-3.5 w-3.5" />
            Accept & Join
          </button>
          <button
            onClick={handleDeclineIncomingCall}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-sand-200 font-medium transition-all"
          >
            Decline
          </button>
        </div>
      </div>
    )}

    {/* TOP HEADER */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-sand-300 shadow-xs">
      <div className="flex items-center gap-2.5">
        <span className="p-2 rounded-xl bg-sand-100 text-[#3C311F]">
          <FolderKanban className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base sm:text-lg font-serif font-bold text-sand-950 flex items-center gap-2">
            Collaboration Hub
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Live
            </span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={handleStartOrJoinCall}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${isInCall
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              : 'bg-[#3C311F] hover:bg-[#2B2316] text-white'
            }`}
        >
          {isInCall ? (
            <>
              <PhoneOff className="h-3.5 w-3.5" />
              Leave Call
            </>
          ) : (
            <>
              <Video className="h-3.5 w-3.5" />
              Start Live Call
            </>
          )}
        </button>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-sand-900 border border-sand-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
        >
          <Plus className="h-3.5 w-3.5 text-sand-700" />
          New Project
        </button>
      </div>
    </div>

    {/* PROJECTS SELECTOR */}
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-sand-700 uppercase tracking-wider px-1">
        <span>Active Projects ({projects.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {projects.map((proj) => {
          const isSelected = proj.id === selectedProjectId;
          const status = statusConfig[proj.status];
          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all text-left relative overflow-hidden ${isSelected
                  ? 'bg-white border-[#3C311F] shadow-sm ring-1 ring-[#3C311F]/20'
                  : 'bg-sand-50/70 border-sand-200 hover:bg-white hover:border-sand-300 shadow-2xs'
                }`}
            >
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

              <h3 className="font-serif font-bold text-sm text-sand-950 truncate mb-1">
                {proj.title}
              </h3>

                <div className="h-1.5 w-full bg-sand-200 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-[#3C311F] rounded-full transition-all"
                    style={{ width: `${proj.progressPercent}%` }}
                  />
                </div>
              </div>
              );
          })}
            </div>
      </div>

      {/* PROJECT DETAILS & SUBTABS */}
      {selectedProject && (
        <div className="rounded-2xl bg-white border border-sand-300 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-sand-200 bg-sand-50/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-sand-950">
                    {selectedProject.title}
                  </h3>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusConfig[selectedProject.status].bg
                      } ${statusConfig[selectedProject.status].text} ${statusConfig[selectedProject.status].border
                      }`}
                  >
                    {statusConfig[selectedProject.status].label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-sand-600">Stage:</span>
                <select
                  value={selectedProject.status}
                  onChange={(e) => handleAdvanceStage(e.target.value as ProjectStatus)}
                  className="text-xs p-1.5 rounded-lg border border-sand-300 bg-white font-semibold text-sand-900 cursor-pointer shadow-2xs"
                >
                  <option value="just_started">01. Just Started</option>
                  <option value="in_progress">02. In Progress</option>
                  <option value="under_review">03. Under Review</option>
                  <option value="revisions">04. Revisions</option>
                  <option value="completed">05. Certified</option>
                </select>
              </div>
            </div>

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
              <span className="text-sand-500 font-medium">Deadline:</span>
              <span className="text-[11px] font-mono text-sand-700">{selectedProject.targetDeadline}</span>
            </div>
          </div>

          {/* Subtabs Bar */}
          <div className="flex border-b border-sand-200 px-5 bg-white overflow-x-auto">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'timeline'
                  ? 'border-[#3C311F] text-[#3C311F]'
                  : 'border-transparent text-sand-600 hover:text-sand-900'
                }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Timeline & Milestones
            </button>

            <button
              onClick={() => setActiveTab('changes')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'changes'
                  ? 'border-[#3C311F] text-[#3C311F]'
                  : 'border-transparent text-sand-600 hover:text-sand-900'
                }`}
            >
              <History className="h-3.5 w-3.5" />
              Author Changes ({projectChanges.length})
            </button>

            <button
              onClick={() => setActiveTab('huddle')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'huddle'
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
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'team'
                  ? 'border-[#3C311F] text-[#3C311F]'
                  : 'border-transparent text-sand-600 hover:text-sand-900'
                }`}
            >
              <Users className="h-3.5 w-3.5" />
              Team Roster ({teamMembers.length})
            </button>
          </div>

          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {timelineStages.map((st, i) => {
                  const currentIdx = statusConfig[selectedProject.status].stepIdx;
                  const isPassed = i <= currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div
                      key={st}
                      onClick={() => handleAdvanceStage(st)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all text-center relative ${isCurrent
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

              {/* Milestones Checklist */}
              <div className="space-y-3 pt-3 border-t border-sand-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sand-700">
                    Project Milestones ({selectedProject.milestones.length})
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
                        className={`p-4 flex items-start justify-between gap-4 transition-colors ${isDone ? 'bg-emerald-50/30' : 'hover:bg-sand-50/50'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleMilestone(m.id)}
                            className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-all ${isDone
                                ? 'bg-emerald-600 border-emerald-700 text-white'
                                : 'bg-white border-sand-400 hover:border-sand-600 text-transparent'
                              }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>

                          <div className="space-y-0.5">
                            <span
                              className={`text-xs font-bold block ${isDone ? 'line-through text-sand-500' : 'text-sand-950'
                                }`}
                            >
                              {idx + 1}. {m.title}
                            </span>
                            <p className="text-xs text-sand-600 leading-relaxed">
                              {m.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-sand-500 shrink-0">
                          {m.targetDate}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTHOR CHANGES */}
          {activeTab === 'changes' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sand-800">
                  Granular Change History
                </h4>
                <span className="text-[11px] text-sand-500 font-mono">
                  {projectChanges.length} Recorded Changes
                </span>
              </div>

              {projectChanges.length === 0 ? (
                <div className="p-8 text-center text-xs text-sand-500">
                  No author changes recorded for this project yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {projectChanges.map((change) => (
                    <div
                      key={change.id}
                      className="p-4 rounded-xl border border-sand-200 bg-white shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-[#3C311F] text-sand-50 flex items-center justify-center font-bold text-xs uppercase">
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

                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sand-100 text-sand-800">
                          {change.changeType}
                        </span>
                      </div>

                      <p className="text-xs text-sand-800 font-medium">
                        {change.description}
                      </p>

                      {(change.contentSnippetBefore || change.contentSnippetAfter) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
                          {change.contentSnippetBefore && (
                            <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-950 line-through">
                              {change.contentSnippetBefore}
                            </div>
                          )}
                          {change.contentSnippetAfter && (
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950 font-medium">
                              {change.contentSnippetAfter}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE HUDDLE, SCREEN SHARE, AUDIO & VIDEO CALL */}
          {activeTab === 'huddle' && (
            <div className="p-6 space-y-6">
              {mediaNotice && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between shadow-2xs">
                  <span>{mediaNotice}</span>
                  <button onClick={() => setMediaNotice(null)} className="font-bold">×</button>
                </div>
              )}

              {/* Top call action bar */}
              <div className="p-4 rounded-xl bg-sand-50 border border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {isInCall && <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping" />}
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sand-900">
                      Live Editorial Huddle Room
                    </h4>
                  </div>
                  {isInCall && (
                    <div className="text-xs text-sand-600">
                      Active call: {callParticipants.length} member(s) connected
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartOrJoinCall}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all ${isInCall
                        ? 'bg-rose-700 text-white hover:bg-rose-800'
                        : 'bg-[#3C311F] text-white hover:bg-[#2B2316]'
                      }`}
                  >
                    {isInCall ? (
                      <>
                        <PhoneOff className="h-3.5 w-3.5" />
                        End Call
                      </>
                    ) : (
                      <>
                        <Video className="h-3.5 w-3.5" />
                        Join Huddle Room
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Call Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-4">
                  {/* Screen Share Stage (Visible to EVERYONE in call when any member shares) */}
                  <div className="relative rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden min-h-[320px] flex items-center justify-center p-3">
                          {activeShareUser ? (
                            <div className="w-full h-full flex flex-col items-center justify-center relative">
                              {activeSharedStream ? (
                                <video
                                  ref={screenVideoRef}
                                  autoPlay
                                  playsInline
                                  muted
                                  className="w-full max-h-[360px] object-contain rounded-lg"
                                />
                              ) : (
                                // Interactive live broadcast preview when across tabs/simulated
                                <div className="w-full h-64 bg-stone-950 rounded-xl border border-stone-800 p-4 flex flex-col justify-between">
                                  <div className="flex items-center justify-between text-xs text-stone-300 border-b border-stone-800 pb-2">
                                    <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                                      <Radio className="h-3 w-3 animate-pulse" />
                                      Live Screen Broadcast
                                    </span>
                                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-sand-200">
                                      1080p 60FPS
                                    </span>
                                  </div>

                                  <div className="space-y-2 text-center py-6">
                                    <Tv className="h-10 w-10 text-emerald-400 mx-auto animate-pulse" />
                                    <div className="text-xs font-bold text-sand-100">
                                      Viewing {activeShareUser.userName}&apos;s Screen
                                    </div>
                                    <div className="text-[11px] text-stone-400 font-mono">
                                      Live document & timeline viewport actively broadcasting to all call participants
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-800">
                                    <span>Presenter: {activeShareUser.userName}</span>
                                    <span className="text-emerald-400 font-bold">Synchronized</span>
                                  </div>
                                </div>
                              )}

                              <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 border border-emerald-500/30 shadow-lg">
                                <Radio className="h-3 w-3 animate-pulse" />
                                <span>Screen Shared by {activeShareUser.userName} ({activeShareUser.userRole})</span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 max-w-sm text-center p-4">
                              <div className="h-14 w-14 rounded-2xl bg-stone-800 flex items-center justify-center text-sand-300 mx-auto border border-stone-700 shadow-md">
                                <MonitorUp className="h-7 w-7" />
                              </div>
                              <div>
                                <h5 className="text-sand-100 font-serif font-bold text-sm">
                                  Screen Share Stage
                                </h5>
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

                        {/* ACTIVE CALL PARTICIPANTS (BOTH LOCAL & REMOTE VIDEOS RENDER LIVE) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-sand-700">
                            <span>Active Call Participants ({callParticipants.length})</span>
                            {isInCall && (
                              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Live Connected
                              </span>
                            )}
                          </div>

                          {callParticipants.length === 0 ? (
                            <div className="p-6 rounded-xl border border-dashed border-sand-300 text-center text-xs text-sand-500">
                              No participants in call. Click &ldquo;Join Huddle Room&rdquo; to start.
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                              {callParticipants.map((member) => {
                                const isMe = member.id === currentUser.id;
                                const isRemoteCamOn = memberCamStates[member.id] !== false; // Remote cam defaults to ON
                                const hasRemoteStream =
                                  typeof window !== 'undefined' &&
                                  (window as any).__vibecheck_cam_streams?.[member.id];

                                return (
                                  <div
                                    key={member.id}
                                    className="relative rounded-xl bg-stone-800 border border-stone-700 aspect-video flex items-center justify-center overflow-hidden shadow-sm"
                                  >
                                    {/* 1. LOCAL USER VIDEO */}
                                    {isMe && isCamActive && camStream ? (
                                      <video
                                        autoPlay
                                        playsInline
                                        muted
                                        ref={(el) => {
                                          if (el) el.srcObject = camStream;
                                        }}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : !isMe && isRemoteCamOn ? (
                                      /* 2. REMOTE PARTICIPANT LIVE VIDEO */
                                      hasRemoteStream ? (
                                        <video
                                          autoPlay
                                          playsInline
                                          muted
                                          ref={(el) => {
                                            if (el && hasRemoteStream) el.srcObject = hasRemoteStream;
                                          }}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        /* Live Animated Feed for Remote Teammate */
                                        <div className="w-full h-full bg-gradient-to-b from-stone-800 to-stone-900 flex flex-col items-center justify-center relative p-2">
                                          <div className="relative">
                                            <div className="h-12 w-12 rounded-full bg-[#3C311F] text-sand-50 flex items-center justify-center font-bold text-sm border-2 border-emerald-500/60 shadow-lg">
                                              {member.name.charAt(0)}
                                            </div>
                                            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-stone-800 flex items-center justify-center">
                                              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                            </span>
                                          </div>

                                          {/* Audio reactivity equalizer bars */}
                                          <div className="flex items-center gap-0.5 mt-2 h-3">
                                            {[40, 75, 55, 90, 60, 80, 45].map((h, bIdx) => (
                                              <div
                                                key={bIdx}
                                                className="w-1 bg-emerald-400/80 rounded-full animate-pulse"
                                                style={{
                                                  height: `${h}%`,
                                                  animationDelay: `${bIdx * 0.15}s`,
                                                }}
                                              />
                                            ))}
                                          </div>

                                          <div className="text-[10px] text-emerald-400 font-mono font-bold mt-1">
                                            LIVE 720p HD
                                          </div>
                                        </div>
                                      )
                                    ) : (
                                      /* 3. CAMERA MUTED AVATAR */
                                      <div className="text-center space-y-1">
                                          <div className="h-10 w-10 rounded-full bg-stone-700 text-sand-300 flex items-center justify-center font-bold text-xs mx-auto border border-stone-600">
                                            {member.name.charAt(0)}
                                          </div>
                                            <div className="text-[10px] text-sand-400 font-medium">
                                              {member.name} (Cam Off)
                                            </div>
                                          </div>
                              )}

                                          {/* Participant Badges & Controls */}
                                          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-stone-900/80 px-2 py-0.5 rounded text-[9px] text-sand-200 backdrop-blur-xs">
                                            {isMe ? (
                                              isMicActive ? (
                                                <Mic className="h-2.5 w-2.5 text-emerald-400" />
                                              ) : (
                                                <MicOff className="h-2.5 w-2.5 text-rose-400" />
                                              )
                                            ) : (
                                              <Mic className="h-2.5 w-2.5 text-emerald-400" />
                                            )}
                                            <span>{member.name} {isMe && '(You)'}</span>
                                          </div>

                                          {!isMe && (
                                            <button
                                              onClick={() => handleToggleMemberCam(member.id)}
                                              className="absolute top-2 right-2 bg-stone-950/70 hover:bg-stone-900 text-stone-300 px-1.5 py-0.5 rounded text-[8px] font-mono border border-stone-700"
                                              title="Toggle video feed"
                                            >
                                              {isRemoteCamOn ? 'Video ON' : 'Video OFF'}
                                            </button>
                                          )}
                                        </div>
                                        );
                        })}
                                      </div>
                                    )}
                                  </div>

                  {/* Call Controls Bar */ }
                                {
                                  isInCall && (
                                    <div className="p-3 rounded-xl bg-sand-100 border border-sand-300 flex items-center justify-center gap-3">
                                      <button
                                        onClick={handleToggleMic}
                                        className={`p-2.5 rounded-full border transition-all ${!isMicActive
                                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                                            : 'bg-white text-sand-800 border-sand-300 hover:bg-sand-50'
                                          }`}
                                        title={isMicActive ? 'Mute' : 'Unmute'}
                                      >
                                        {isMicActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                                      </button>

                                      <button
                                        onClick={handleToggleCam}
                                        className={`p-2.5 rounded-full border transition-all ${!isCamActive
                                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                                            : 'bg-white text-sand-800 border-sand-300 hover:bg-sand-50'
                                          }`}
                                        title={isCamActive ? 'Camera Off' : 'Camera On'}
                                      >
                                        {isCamActive ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                                      </button>

                                      <button
                                        onClick={handleToggleScreenShare}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${isScreenSharing
                                            ? 'bg-emerald-600 text-white border-emerald-700'
                                            : 'bg-white text-sand-800 border-sand-300 hover:bg-sand-50'
                                          }`}
                                      >
                                        <MonitorUp className="h-4 w-4" />
                                        {isScreenSharing ? 'Stop Screen' : 'Share Screen'}
                                      </button>

                                      <button
                                        onClick={handleEndCall}
                                        className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                                      >
                                        <PhoneOff className="h-4 w-4" />
                                        End Call
                                      </button>
                                    </div>
                                  )
                                }

                                {/* REAL CALL INVITATIONS SECTION (SEND JOIN REQUEST TO THAT USER) */ }
                                {
                                  isInCall && (
                                    <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-sand-800 uppercase tracking-wider">
                                          Invite Teammates to Join Call:
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap gap-2">
                                        {teamMembers
                                          .filter((m) => m.id !== currentUser.id && !callParticipants.some((p) => p.id === m.id))
                                          .map((member) => {
                                            const invite = outgoingInvites.find((i) => i.toUserId === member.id);
                                            const isPending = invite?.status === 'pending';

                                            return (
                                              <div
                                                key={member.id}
                                                className="p-2.5 rounded-xl bg-white border border-sand-300 shadow-2xs flex items-center gap-2"
                                              >
                                                <div>
                                                  <div className="text-xs font-bold text-sand-900">{member.name}</div>
                                                  <div className="text-[10px] text-sand-500 capitalize">{member.role}</div>
                                                </div>

                                                {isPending ? (
                                                  <div className="flex items-center gap-1.5 pl-2 border-l border-sand-200">
                                                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                                                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                                      Request Sent...
                                                    </span>
                                                    <button
                                                      onClick={() => handleSimulateAnswerAndJoin(member.id)}
                                                      className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-2xs"
                                                      title="Simulate this member clicking Accept & Join"
                                                    >
                                                      Simulate Accept
                                                    </button>
                                                    {onSwitchUser && (
                                                      <button
                                                        onClick={() => onSwitchUser(member)}
                                                        className="px-2 py-1 rounded-md bg-sand-100 hover:bg-sand-200 text-sand-800 text-[10px] font-semibold border border-sand-300 flex items-center gap-1"
                                                        title="Switch account to this member"
                                                      >
                                                        <ArrowRightLeft className="h-2.5 w-2.5" />
                                                        Switch User
                                                      </button>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <button
                                                    onClick={() => handleSendCallInvitation(member)}
                                                    className="px-2.5 py-1 rounded-lg bg-[#3C311F] hover:bg-[#2B2316] text-white text-xs font-bold flex items-center gap-1 transition-all shadow-2xs"
                                                  >
                                                    <UserPlus className="h-3 w-3" />
                                                    Send Call Request
                                                  </button>
                                                )}
                                              </div>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  )
                                }
                </div>

                {/* In-Call Team Chat */}
                          <div className="bg-sand-50/70 rounded-2xl border border-sand-300 p-4 flex flex-col justify-between h-[520px]">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                                <span className="text-xs font-bold uppercase tracking-wider text-sand-800 flex items-center gap-1.5">
                                  <MessageSquare className="h-3.5 w-3.5 text-sand-600" />
                                  In-Call Team Notes
                                </span>
                                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                                  {callParticipants.length} Connected
                                </span>
                              </div>

                              <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1 text-xs">
                                {callMessages.length === 0 ? (
                                  <div className="p-4 text-center text-xs text-sand-500">
                                    No notes yet. Type below to share notes in call.
                                  </div>
                                ) : (
                                  callMessages.map((msg) => (
                                    <div
                                      key={msg.id}
                                      className={`p-2.5 rounded-xl border shadow-2xs space-y-1 ${msg.role === 'system'
                                          ? 'bg-amber-50/60 border-amber-200 text-amber-900 font-mono text-[11px]'
                                          : 'bg-white border-sand-200 text-sand-900'
                                        }`}
                                    >
                                      <div className="flex items-center justify-between text-[10px]">
                                        <span className="font-bold">{msg.sender}</span>
                                        <span className="text-sand-400 font-mono">{msg.time}</span>
                                      </div>
                                      <p className="leading-relaxed text-[11px]">{msg.text}</p>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>

                            <form onSubmit={handleSendCallMsg} className="pt-2 flex gap-1.5">
                              <input
                                type="text"
                                value={newCallMsg}
                                onChange={(e) => setNewCallMsg(e.target.value)}
                                placeholder="Add meeting note..."
                                className="flex-1 p-2 rounded-xl border border-sand-300 text-xs bg-white text-sand-900 focus:outline-none focus:ring-1 focus:ring-[#3C311F]"
                              />
                              <button
                                type="submit"
                                className="px-3.5 py-2 rounded-xl bg-[#3C311F] hover:bg-[#2B2316] text-white text-xs font-bold shadow-2xs"
                              >
                                Post
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 4: TEAM ROSTER */}
                    {activeTab === 'team' && (
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-sand-800">
                            Assigned Team Members ({teamMembers.length})
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {teamMembers.map((member) => (
                            <div
                              key={member.id}
                              className="p-4 rounded-xl border border-sand-200 bg-white shadow-2xs space-y-2 flex flex-col justify-between"
                            >
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[#3C311F] text-sand-50 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                      {member.name.charAt(0)}
                                    </div>
                                    <div className="space-y-0.5">
                                      <div className="text-xs font-bold text-sand-950 flex items-center gap-1.5">
                                        {member.name}
                                        {member.id === currentUser.id && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                            You
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-sand-500 font-mono">{member.email}</div>
                                    </div>
                                  </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-sand-100 text-[11px]">
                                      <span className="uppercase font-bold px-2 py-0.5 rounded bg-sand-100 text-sand-800">
                                        {member.role}
                                      </span>
                                      {onSwitchUser && member.id !== currentUser.id && (
                                        <button
                                          onClick={() => onSwitchUser(member)}
                                          className="px-2 py-0.5 rounded-lg border border-sand-300 hover:bg-sand-100 text-sand-700 font-semibold flex items-center gap-1"
                                        >
                                          <ArrowRightLeft className="h-3 w-3" />
                                          Switch User
                                        </button>
                                      )}
                                    </div>
                                  </div>
                ))}
                                </div>
                              </div>
          )}
                            </div>
                          )}

                          {/* NEW PROJECT MODAL */}
                          {isNewProjectModalOpen && (
                            <div className="fixed inset-0 z-50 bg-sand-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                                  <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-sand-300">
                                    <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                                      <h3 className="font-serif font-bold text-base text-sand-950">Create New Project</h3>
                                      <button
                                        onClick={() => setIsNewProjectModalOpen(false)}
                                        className="p-1 rounded-lg hover:bg-sand-100 text-sand-500"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>

                                        <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
                                          <div className="space-y-1">
                                            <label className="font-bold text-sand-800">Project Title</label>
                                            <input
                                              type="text"
                                              required
                                              value={newTitle}
                                              onChange={(e) => setNewTitle(e.target.value)}
                                              placeholder="e.g. Q1 Product Launch & Compliance Review"
                                              className="w-full p-2.5 rounded-xl border border-sand-300 text-sand-900 bg-sand-50/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3C311F]"
                                            />
                                          </div>

              <div className="space-y-1">
                                              <label className="font-bold text-sand-800">Target Deadline</label>
                                              <input
                                                type="date"
                                                value={newDeadline}
                                                onChange={(e) => setNewDeadline(e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-sand-300 text-sand-900 bg-sand-50/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3C311F]"
                                              />
                                            </div>

                                              <div className="space-y-1">
                                                <label className="font-bold text-sand-800">Publishing Channels</label>
                                                <input
                                                  type="text"
                                                  value={newChannels}
                                                  onChange={(e) => setNewChannels(e.target.value)}
                                                  placeholder="LinkedIn, YouTube, Canva, Teams"
                                                  className="w-full p-2.5 rounded-xl border border-sand-300 text-sand-900 bg-sand-50/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3C311F]"
                                                />
                                              </div>

                                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-sand-200">
                                                  <button
                                                    type="button"
                                                    onClick={() => setIsNewProjectModalOpen(false)}
                                                    className="px-4 py-2 rounded-xl text-sand-700 hover:bg-sand-100 font-semibold"
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    type="submit"
                                                    className="px-5 py-2 rounded-xl bg-[#3C311F] hover:bg-[#2B2316] text-white font-bold shadow-xs"
                                                  >
                                                    Create Project
                                                  </button>
                                                </div>
                                              </form>
                                            </div>
                                          </div>
      )}
                                      </div>
                                      );
};
