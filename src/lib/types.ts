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
  createdAt: string;
}

export type IssueSeverity = 'critical' | 'warning' | 'suggestion';
export type IssueCategory = 'tone' | 'terminology' | 'claims' | 'visual' | 'accessibility' | 'competitor';

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

export type ContentFormat = 'text' | 'docx' | 'image' | 'social' | 'ad_copy' | 'email';
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
  category: 'review' | 'workflow' | 'guideline' | 'security' | 'asset';
}
