export type UserRole = 'creator' | 'reviewer' | 'manager' | 'admin';

export interface Organization {
  id: string;
  name: string;
  adminKey: string;
  createdAt: string;
  adminId: string;
  adminEmail: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  orgId: string;
  orgName: string;
  department?: string;
  avatar?: string;
  createdAt: string;
}

export interface MemberMistakeRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberRole: UserRole;
  submissionId?: string;
  submissionTitle?: string;
  category: 'spelling' | 'grammar' | 'tone' | 'claims' | 'terminology' | 'safety' | 'contrast';
  mistakeText: string;
  suggestedCorrection: string;
  timestamp: string;
}

export interface MemberPerformanceStats {
  memberId: string;
  memberName: string;
  memberRole: UserRole;
  email: string;
  totalSubmissions: number;
  totalMistakes: number;
  complianceMeterPercent: number; // 0 - 100%
  mistakeBreakdown: {
    grammar: number;
    tone: number;
    claims: number;
    spelling: number;
    terminology: number;
  };
  recentMistakes: MemberMistakeRecord[];
}

export type IssueSeverity = 'critical' | 'warning' | 'suggestion';
export type IssueCategory =
  | 'tone'
  | 'terminology'
  | 'claims'
  | 'visual'
  | 'accessibility'
  | 'competitor'
  | 'grammar'
  | 'spelling'
  | 'safety'
  | 'copyright';

export interface ImageAnalysisResult {
  extractedText: string;
  paletteScore: number;
  dominantHexes: string[];
  contrastRatio: number;
  isInappropriate: boolean;
  inappropriateExplanation?: string;
  copyrightRiskLevel: 'low' | 'medium' | 'high';
  copyrightExplanation?: string;
  watermarksDetected: string[];
  recommendations: string[];
  skinToneCoverage?: number;
  brightness?: number;
  isBlurry?: boolean;
  cvQualityScore?: number;
}

export interface ComplianceIssue {
  id: string;
  guidelineRef: string;
  category: IssueCategory;
  severity: IssueSeverity;
  originalText: string;
  suggestedReplacement: string;
  explanation: string;
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
  modifiedText?: string;
  lineOrPosition?: string;
}

export interface ReviewResult {
  overallScore: number;
  toneScore: number;
  terminologyScore: number;
  claimsScore: number;
  visualScore: number;
  accessibilityScore: number;
  grammarScore?: number;
  copyrightScore?: number;
  imageAnalysis?: ImageAnalysisResult;
  aiDisclosure: string;
  summary: string;
  issues: ComplianceIssue[];
  suggestedFullText?: string;
  analyzedAt: string;
  modelUsed?: string;
}

export interface SubmissionComment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
  resolved?: boolean;
}

export interface ApprovalSignature {
  signedBy: string;
  signerEmail: string;
  role: UserRole;
  timestamp: string;
  hash: string;
  remarks?: string;
}

export type ContentFormat = 'text' | 'docx' | 'image' | 'social' | 'ad_copy' | 'email' | 'audio' | 'video';
export type SubmissionStatus = 'draft' | 'in_review' | 'changes_requested' | 'approved' | 'rejected';

export interface ContentSubmission {
  id: string;
  orgId: string;
  title: string;
  format: ContentFormat;
  rawText: string;
  currentText: string;
  mediaUrl?: string;
  targetAudience?: string;
  channel?: string;
  author: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  assignedReviewer?: string;
  status: SubmissionStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  reviewResult?: ReviewResult;
  comments: SubmissionComment[];
  approvalSignature?: ApprovalSignature;
  revisionHistory: {
    version: number;
    text: string;
    updatedAt: string;
    authorName: string;
    changeNote: string;
  }[];
}

export interface BrandGuidelineConfig {
  orgId: string;
  brandName: string;
  missionStatement: string;
  toneSliders: {
    formalVsCasual: number;
    seriousVsPlayful: number;
    reservedVsBold: number;
  };
  approvedGlossary: Array<{
    id: string;
    forbidden: string;
    preferred: string;
    reason: string;
    severity: IssueSeverity;
  }>;
  approvedClaims: Array<{
    id: string;
    claim: string;
    source: string;
    category: string;
    verifiedDate: string;
  }>;
  colorPalette: Array<{
    name: string;
    hex: string;
    role: 'primary' | 'secondary' | 'accent' | 'background' | 'text';
  }>;
  competitorLockout: string[];
  rules: Array<{
    id: string;
    ruleCode: string;
    title: string;
    description: string;
    category: IssueCategory;
    severity: IssueSeverity;
  }>;
  accessibilityRules: {
    minContrastRatio: number;
    requireAltText: boolean;
    maxReadingGradeLevel: number;
  };
}

export interface BrandAsset {
  id: string;
  orgId: string;
  title: string;
  type: 'logo' | 'color_swatch' | 'image' | 'guideline_doc';
  url: string;
  publicId?: string;
  format: string;
  sizeBytes: number;
  uploadedAt: string;
  uploadedBy: string;
  isConfidential: boolean;
}

export interface AuditLogEntry {
  id: string;
  orgId: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  category: 'review' | 'workflow' | 'guideline' | 'security' | 'asset' | 'collaboration' | 'media';
}

// ==========================================
// COLLABORATION HUB & PROJECT TIMELINE TYPES
// ==========================================

export type ProjectStatus =
  | 'just_started'
  | 'in_progress'
  | 'under_review'
  | 'revisions'
  | 'completed';

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  targetDate: string;
  completedAt?: string;
  completedBy?: string;
}

export interface TeamChangeRecord {
  id: string;
  projectId: string;
  submissionId?: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  timestamp: string;
  changeType: 'text_edit' | 'status_change' | 'comment' | 'approval' | 'guideline_override' | 'media_upload';
  description: string;
  contentSnippetBefore?: string;
  contentSnippetAfter?: string;
  charDelta?: number;
}

export interface Project {
  id: string;
  orgId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progressPercent: number;
  startDate: string;
  targetDeadline: string;
  assignedCreators: string[]; // UserAccount ids
  assignedReviewers: string[]; // UserAccount ids
  submissionIds: string[];
  milestones: ProjectMilestone[];
  channels: string[];
  tags: string[];
}

export interface LiveTeamPresence {
  userId: string;
  userName: string;
  userRole: UserRole;
  userAvatar?: string;
  currentActivity: 'editing' | 'reviewing' | 'idle' | 'in_call';
  currentSection?: string;
  lastActive: string;
}

export interface HuddleCallSession {
  id: string;
  projectId: string;
  projectTitle: string;
  isActive: boolean;
  isScreenSharing: boolean;
  screenSharerName?: string;
  participants: {
    userId: string;
    userName: string;
    userRole: UserRole;
    isMuted: boolean;
    isVideoOn: boolean;
    isSpeaking: boolean;
  }[];
  startedAt: string;
}

// ==========================================
// AUDIO & VIDEO MULTIMEDIA AUDIT TYPES
// ==========================================

export interface AudioAnalysisResult {
  mediaUrl: string;
  durationSeconds: number;
  transcription: string;
  brandVoicePitchScore: number; // 0-100
  speechCadenceWordsPerMin: number;
  fillerWordRatioPercent: number;
  loudnessLUFS: number; // e.g. -14 LUFS (EBU standard)
  isLoudnessCompliant: boolean;
  backgroundMusicDetected: boolean;
  musicCopyrightStatus: 'royalty_free' | 'unlicensed_risk' | 'licensed_library';
  musicCopyrightScore: number;
  musicTrackMatch?: string;
  profanityOrSafetyFlags: string[];
  recommendations: string[];
}

export interface VideoKeyframeAudit {
  timestampSeconds: number;
  frameImageUrl: string;
  detectedText: string;
  paletteAdherenceScore: number;
  dominantHexes: string[];
  watermarksOrStockMarkers: string[];
  logoDetected: boolean;
  contrastPassesAA: boolean;
}

export interface VideoAnalysisResult {
  mediaUrl: string;
  durationSeconds: number;
  aspectRatio: string;
  resolution: string;
  overallVideoScore: number;
  visualConsistencyScore: number;
  subtitlesPresent: boolean;
  subtitlesReadingSpeedWPM: number;
  subtitlesContrastRatio: number;
  stockWatermarkRiskLevel: 'low' | 'medium' | 'high';
  stockWatermarksDetected: string[];
  audioSyncAudit: AudioAnalysisResult;
  keyframes: VideoKeyframeAudit[];
  identifiedIssues: ComplianceIssue[];
  recommendations: string[];
}

// ==========================================
// WORKFLOW INTEGRATIONS (YouTube, Canva, Teams, GitHub, etc.)
// ==========================================

export type SupportedIntegrationPlatform =
  | 'youtube'
  | 'canva'
  | 'teams'
  | 'github'
  | 'slack'
  | 'figma'
  | 'hubspot';

export interface ConnectedPlatform {
  id: SupportedIntegrationPlatform;
  name: string;
  category: 'video' | 'design' | 'collaboration' | 'code' | 'marketing';
  description: string;
  isConnected: boolean;
  connectedAccount?: string;
  connectedAt?: string;
  lastSyncAt?: string;
  autoSyncApprovedContent: boolean;
  webhookUrl?: string;
  channelOrWorkspace?: string;
}
