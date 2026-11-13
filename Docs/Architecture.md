# System Architecture & Technical Specifications — VibeCheck AI

```
========================================================================================
  VIBECHECK AI — FULL SYSTEM ARCHITECTURE & COMPONENT INTEGRATION BLUEPRINT
  Document Version: 3.0.0 | Architecture: Next.js 14 App Router | Pattern: Multi-Tenant
========================================================================================
```

---

## 1. End-to-End Website Flow Architecture

The diagram below illustrates the comprehensive user journey, routing topology, and state transitions from public landing to certified omnichannel release:

```mermaid
flowchart TD
    Start([Visitor Enters Application]) --> Landing[LandingPage Component]
    
    Landing -->|Click 'Sign In' / 'Get Started'| Auth[AuthScreen Component]
    Landing -->|Click Legal Links in Footer| LegalModal[LegalSupportModal Component]
    
    subgraph Authentication & Identity Pipeline
        Auth --> GoogleAuth[Google OAuth 2.0 Client\ngsi/client]
        Auth --> CredAuth[Email & Password Credentials]
        Auth --> ForgotPass[Self-Service Password Reset]
        ForgotPass --> CredAuth
        GoogleAuth --> SessionGen[Session Generator & Org Resolver]
        CredAuth --> SessionGen
    end

    SessionGen --> TenantRouter{Multi-Tenant Role Router}
    
    TenantRouter -->|Role: Creator| CreatorView[Document Editor & Draft Composer]
    TenantRouter -->|Role: Reviewer| ReviewerView[Approval Queue & Inline Annotator]
    TenantRouter -->|Role: Manager| ManagerView[Timeline, Live Huddle & SHA-256 Sign-Off]
    TenantRouter -->|Role: Admin| AdminView[Tone Calibrator, Claims DB & Accuracy Meter]

    subgraph Feature Engine Subsystems
        CreatorView --> DocxParser[Client Mammoth.js DOCX Parser]
        CreatorView --> MultiFactorReview[Multi-Factor AI Review Engine]
        
        ReviewerView --> QueueEngine[Submission Queue & Review Status Engine]
        QueueEngine --> Revisions[Request Revision Loop]
        Revisions --> CreatorView
        
        ManagerView --> CollabHub[Collaboration Hub & Milestone Tracker]
        CollabHub --> WebRTCHuddle[WebRTC Video & Real Screen Share]
        CollabHub --> DiffViewer[Side-by-Side Character Diff Engine]
        CollabHub --> ShaSeal[SHA-256 Cryptographic Seal Generator]
        
        AdminView --> ToneSliders[Tone Calibration Vector Sliders]
        AdminView --> ClaimDB[Certified Claim & Nomenclature Database]
        AdminView --> Billing[Subscription Checkout ₹5,000/mo]
        AdminView --> MistakeTracker[Member Mistakes & Accuracy Meter]
    end

    subgraph Media Governance Layer
        MultiFactorReview --> MediaAudit[Media Governance Engine]
        MediaAudit --> CanvasCV[HTML5 Canvas Pixel Computer Vision]
        MediaAudit --> CadenceAnalyzer[Audio Cadence & LUFS Analyzer]
        MediaAudit --> WatermarkDetector[Stock Watermark Classifier]
    end

    ShaSeal ==> FinalPublish([Certified Omnichannel Publication])
```

---

## 2. Technology Stack Architecture

```
+--------------------------------------------------------------------------------------------------+
|                                  COMPLETE TECHNOLOGY STACK MATRIX                                |
+------------------+------------------------------+------------------------------------------------+
| Layer            | Primary Technology           | Architectural Role & Capabilities              |
+------------------+------------------------------+------------------------------------------------+
| Framework        | Next.js 14.2 (App Router)    | Hybrid RSC & Client Components, Route Handlers |
| UI Runtime       | React 18.3                   | State synchronization, Callback Refs, Contexts |
| Styling & Theme  | Tailwind CSS 3.4             | "Sandstone & Bronze" custom tokens, Responsive |
| Type Safety      | TypeScript 5.0 (Strict)      | Strict interfaces, type assertions, noImplicit |
| Icons & Visuals  | Lucide React                 | Clean vector typography without unicode emojis |
| Document Parsing | Mammoth.js (Client-Side)     | Native binary .docx to markdown conversion     |
| Real-Time Media  | Native Browser WebRTC        | RTCPeerConnection, STUN (Google), Local Streams|
| Screen Capture   | Screen Capture API           | navigator.mediaDevices.getDisplayMedia         |
| WebRTC Signaling | BroadcastChannel API         | Zero-dependency inter-tab WebRTC signaling     |
| Computer Vision  | HTML5 Canvas 2D Context      | Pixel luminance, Euclidean color distance, CV  |
| Cryptography     | Web Crypto API (SHA-256)     | Immutable managerial approval certificate seals|
| Identity Auth    | Google Identity Services     | OAuth 2.0 credential decoding & sign-in        |
| AI Gateway       | OpenRouter REST API          | Multi-LLM linguistic & compliance auditing     |
| Transaction Mail | Resend API                   | Automated transactional notifications          |
| Asset Storage    | Cloudinary Media CDN         | Scalable enterprise brand asset hosting        |
+------------------+------------------------------+------------------------------------------------+
```

```mermaid
graph LR
    subgraph Client-Side Presentation
        Next[Next.js 14 App Router]
        React[React 18 Engine]
        Tailwind[Tailwind CSS: Sandstone & Bronze]
        Lucide[Lucide React Vector Library]
    end

    subgraph Browser Hardware & Native APIs
        Canvas[HTML5 Canvas CV Engine]
        WebRTC[WebRTC RTCPeerConnection]
        Display[Screen Capture DisplayMedia API]
        Crypto[Web Crypto API SHA-256]
        BC[BroadcastChannel Signaling]
    end

    subgraph Serverless Backend & External APIs
        Routes[Next.js Node.js Route Handlers]
        OpenRouter[OpenRouter AI Multi-LLM Gateway]
        Google[Google OAuth 2.0 Identity Services]
        Cloudinary[Cloudinary Cloud Media CDN]
        Resend[Resend Transactional Email API]
    end

    Client-Side Presentation --> Browser Hardware & Native APIs
    Client-Side Presentation --> Serverless Backend & External APIs
```

---

## 3. Directory & Folder Structure Architecture

```mermaid
graph TD
    Root["/ (Project Root)"]
    Root --> Docs["Docs/ (Engineering & Product Documentation)"]
    Root --> Public["public/ (Static Assets & Favicons)"]
    Root --> Src["src/ (Application Source Code)"]

    Src --> App["app/ (Next.js App Router Core)"]
    Src --> Components["components/ (Modular UI Systems)"]
    Src --> Lib["lib/ (Engines, Types & Default Data)"]

    App --> AppApi["api/ (Serverless Route Handlers)"]
    App --> AppLayout["layout.tsx & globals.css"]
    App --> AppPage["page.tsx (Master State Orchestrator)"]

    AppApi --> ApiDocx["extract-docx/route.ts"]
    AppApi --> ApiReview["review/route.ts"]
    AppApi --> ApiImage["review-image/route.ts"]
    AppApi --> ApiAudio["transcribe-audio/route.ts"]
    AppApi --> ApiNotify["notify/route.ts"]
    AppApi --> ApiUpload["upload/route.ts"]

    Components --> CompAuth["AuthScreen.tsx"]
    Components --> CompEditor["DocumentEditor.tsx"]
    Components --> CompReview["ReviewEngine.tsx"]
    Components --> CompMedia["MediaAudit.tsx"]
    Components --> CompCollab["CollaborationHub.tsx"]
    Components --> CompQueue["SubmissionQueue.tsx"]
    Components --> CompDash["RoleDashboard.tsx"]
    Components --> CompBrand["BrandGuidelinesBuilder.tsx"]
    Components --> CompModals["Settings, Checkout & Legal Modals"]

    Lib --> LibCV["accessibility-cv.ts (Canvas CV Engine)"]
    Lib --> LibTypes["types.ts (Strict TypeScript Schemas)"]
    Lib --> LibData["default-data.ts (Initial Seeds)"]
    Lib --> LibClients["openrouter.ts, cloudinary.ts, resend.ts"]
```

```
c:\Users\kshit\Desktop\VibeCheck AI\
├── Docs/                                    # Architectural & Product Specifications
│   ├── PRD.md                               # Product Requirements Document
│   ├── Architecture.md                      # System Architecture & Topology
│   ├── Design.md                            # UI/UX Style Guide & Design System
│   ├── Task.md                              # Project Roadmap & Implementation Phases
│   ├── Database.md                          # Data Models, ERD & Persistence
│   ├── API.md                               # Serverless API Specifications
│   ├── Agents.md                            # Multi-Agent Compliance Pipeline
│   ├── Authentication &security.md          # Identity, RBAC & SHA-256 Signatures
│   ├── Integrations.md                      # External Integrations (Cloudinary, Resend)
│   ├── MCP connection.md                    # Model Context Protocol Specification
│   ├── Project Implementation.md            # Component Hierarchy & Implementation Map
│   ├── setup&initilisation.md               # Quickstart & Environment Setup
│   ├── Testing &QA.md                       # Quality Assurance & Test Strategy
│   └── Debugging.md                         # Troubleshooting & Diagnostic Runbook
├── public/                                  # Static Assets & Metadata
├── src/
│   ├── app/                                 # Next.js 14 App Router Directory
│   │   ├── api/                             # Serverless Node.js Route Handlers
│   │   │   ├── extract-docx/route.ts        # Mammoth.js DOCX Parsing Endpoint
│   │   │   ├── notify/route.ts              # Resend Transactional Email Endpoint
│   │   │   ├── review/route.ts              # Multi-Agent Text Compliance Endpoint
│   │   │   ├── review-image/route.ts        # Computer Vision Image Analysis Endpoint
│   │   │   ├── transcribe-audio/route.ts    # Speech-to-Text Transcription Endpoint
│   │   │   └── upload/route.ts              # Cloudinary Asset Upload Endpoint
│   │   ├── globals.css                      # Tailwind Directives & CSS Variable Scales
│   │   ├── layout.tsx                       # Root Layout with Google & Puter SDKs
│   │   └── page.tsx                         # Master State Orchestrator Component
│   ├── components/                          # Core Interactive React Components
│   │   ├── AnalyticsInsights.tsx            # Compliance Analytics & Trend Charts
│   │   ├── AssetLibrary.tsx                 # Brand Asset Storage & Tagging
│   │   ├── AuditLogs.tsx                    # Tamper-Proof Audit Trail Explorer
│   │   ├── AuthScreen.tsx                   # Google OAuth & Credential Sign-In / Reset
│   │   ├── BrandGuidelinesBuilder.tsx       # Tone Sliders & Certified Claim Editor
│   │   ├── CollaborationHub.tsx             # Milestone Tracker & WebRTC Huddle Room
│   │   ├── CookieConsentBanner.tsx          # GDPR/ePrivacy Compliance Banner
│   │   ├── DiffViewer.tsx                   # Side-by-Side Red/Green Diff Inspector
│   │   ├── DocumentEditor.tsx               # Rich Document Composer & DOCX Importer
│   │   ├── LandingPage.tsx                  # Public Marketing Showcase
│   │   ├── LegalSupportModal.tsx            # Interactive 5-Tab Legal Dialog
│   │   ├── MediaAudit.tsx                   # Audio Cadence, Video & Stock Watermark Scan
│   │   ├── Navbar.tsx                       # Workspace Navigation & Profile Bar
│   │   ├── ReviewEngine.tsx                 # Interactive Multi-Factor Content Review
│   │   ├── RoleDashboard.tsx                # Role-Specific Portals & Accuracy Meter
│   │   ├── SettingsModal.tsx                # Organization Key & User Preference Modal
│   │   ├── Sidebar.tsx                      # Primary Navigation Sidebar
│   │   ├── SubmissionQueue.tsx              # Editorial Queue with SHA-256 Sign-Off
│   │   └── SubscriptionCheckoutModal.tsx    # ₹5,000/mo Organization Billing Modal
│   └── lib/                                 # Core Engines, Types & Shared Utilities
│       ├── accessibility-cv.ts              # HTML5 Canvas Computer Vision Engine
│       ├── cloudinary.ts                    # Cloudinary SDK Configuration
│       ├── default-data.ts                  # Demo Organizations, Claims & Guidelines
│       ├── image-analysis.ts                # Client-Side Image Analysis Helpers
│       ├── openrouter.ts                    # OpenRouter LLM Gateway Client
│       ├── resend.ts                        # Resend Transactional Email Client
│       └── types.ts                         # Strict TypeScript Domain Schemas
├── .env.local                               # Private Local Environment Variables
├── package.json                             # Dependencies & Script Definitions
├── tailwind.config.ts                       # Tailwind Configuration & Sandstone Tokens
└── tsconfig.json                            # Strict TypeScript Compiler Options
```

---

## 4. Component Interconnectivity & Data Flow

### 4.1 Master State Orchestrator (`src/app/page.tsx`)
The master state orchestrator manages global data collections and isolates them per organization:

```mermaid
graph TD
    State[Master State in page.tsx]
    
    subgraph Persistent Collections
        State -->|Organizations| Orgs[organizations State]
        State -->|Accounts| Accs[accounts State]
        State -->|Projects| Projs[projects State]
        State -->|Submissions| Subs[submissions State]
        State -->|Guidelines| Guides[guidelines State]
        State -->|Audit Logs| Audits[auditLogs State]
        State -->|Mistakes| Mistakes[memberMistakes State]
    end

    subgraph Component Consumers
        Orgs --> AuthScreen
        Accs --> AuthScreen
        Projs --> CollabHub
        Subs --> SubmissionQueue
        Guides --> BrandGuidelines
        Guides --> ReviewEngine
        Audits --> AuditLogs
        Mistakes --> RoleDashboard
    end

    subgraph LocalStorage Mirroring
        Orgs -.->|Mirror| LS1[vibecheck_orgs]
        Accs -.->|Mirror| LS2[vibecheck_accounts]
        Projs -.->|Mirror| LS3[vibecheck_projects]
        Subs -.->|Mirror| LS4[vibecheck_submissions]
    end
```

### 4.2 WebRTC Peer-to-Peer Stream & Signaling Architecture
The diagram below demonstrates how Tab A and Tab B exchange real screen streams and webcam video without external socket servers:

```mermaid
sequenceDiagram
    autonumber
    participant TabA as Tab A (Host: Elena)
    participant BC as BroadcastChannel ('vibecheck_webrtc_meet')
    participant RoomLS as LocalStorage ('vibecheck_room_presence')
    participant TabB as Tab B (Viewer: Julian)

    TabA->>RoomLS: Writes presence ping (timestamp, inCall: true)
    TabA->>BC: Broadcasts 'peer-joined' {userId: 'elena'}
    BC->>TabB: Delivers 'peer-joined'
    
    TabB->>TabB: getOrCreatePC() instantiates RTCPeerConnection
    TabA->>TabA: getOrCreatePC() instantiates RTCPeerConnection
    
    TabA->>BC: Sends 'sdp-offer' + ICE Candidates
    BC->>TabB: Delivers 'sdp-offer'
    TabB->>TabB: setRemoteDescription() & createAnswer()
    TabB->>BC: Sends 'sdp-answer' + ICE Candidates
    BC->>TabA: Delivers 'sdp-answer'
    TabA->>TabA: setRemoteDescription()
    
    Note over TabA,TabB: Direct P2P WebRTC Connection Established (< 50ms)

    TabA->>TabA: Clicks "Start Screen Sharing" (getDisplayMedia)
    TabA->>TabA: Adds Screen Track to PeerConnection
    TabA->>BC: Sends renegotiation 'sdp-offer' {isScreen: true}
    BC->>TabB: Delivers renegotiation offer
    TabB->>TabB: pc.ontrack fires with screen MediaStream!
    TabB->>TabB: Callback ref assigns stream to video.srcObject
    Note over TabB: Julian views Elena's genuine screen in 1080p

    TabA->>TabA: Clicks "End Call"
    TabA->>RoomLS: Prunes Elena from room presence
    TabA->>BC: Broadcasts 'peer-left' {userId: 'elena'}
    BC->>TabB: Delivers 'peer-left'
    TabB->>TabB: Immediately removes Elena from call grid (Google Meet Style)
```

### 4.3 HTML5 Canvas Computer Vision Engine (`src/lib/accessibility-cv.ts`)
The client-side Computer Vision pipeline inspects graphic assets entirely in browser memory:

```mermaid
flowchart TD
    Img[Uploaded Image / Video Keyframe] --> Canvas[Off-Screen HTML5 Canvas 2D]
    Canvas --> PixelData[Extract ImageData Context: 32-bit RGBA Pixels]
    
    PixelData --> Subsample[Grid Subsampling: 100x100 Pixel Grid]
    
    subgraph CV Analyses
        Subsample --> Palette[K-Means Hue Clustering: Extract Dominant Hex Swatches]
        Subsample --> Luminance[Relative Luminance Calculation: L = 0.2126R + 0.7152G + 0.0722B]
        Subsample --> Watermark[High-Frequency Edge Filter: Commercial Stock Logo Detection]
        Subsample --> SkinTone[YCbCr Color Space Mapping: Skin-Tone Coverage Detection]
    end

    Palette --> DeltaE[Compare Euclidean Distance vs Brand Hex Tokens]
    Luminance --> ContrastRatio[Compute Contrast Ratio: CR = L1 + 0.05 / L2 + 0.05]
    
    DeltaE --> ResultReport[CanvasComputerVisionAudit Object]
    ContrastRatio --> ResultReport
    Watermark --> ResultReport
    SkinTone --> ResultReport
    
    ResultReport ==> UI[Render Badges & Score in MediaAudit.tsx]
```

---

## 5. Security & Boundary Enforcement Architecture

```
+--------------------------------------------------------------------------------------------------+
|                                    SECURITY ARCHITECTURE OVERVIEW                                |
+------------------------+-------------------------------------+-----------------------------------+
| Security Layer         | Threat Mitigated                    | Defensive Implementation          |
+------------------------+-------------------------------------+-----------------------------------+
| Multi-Tenant Boundary  | Cross-organization data leakage     | Strict orgId scoping on all query |
|                        |                                     | selectors, mutations, and views   |
+------------------------+-------------------------------------+-----------------------------------+
| Non-Repudiation Proof  | Disputed approvals & alterations    | SHA-256 cryptographic digest of   |
|                        |                                     | content + timestamp + manager ID  |
+------------------------+-------------------------------------+-----------------------------------+
| Regulatory Defense     | FDA / FTC regulatory claim fines    | Hard-blocking claim validation    |
|                        |                                     | rule `RULE-CLAIM-EXCESS`          |
+------------------------+-------------------------------------+-----------------------------------+
| API Token Isolation    | Leakage of private provider keys    | Serverless route handlers isolate |
|                        |                                     | OpenRouter, Resend & Cloudinary   |
+------------------------+-------------------------------------+-----------------------------------+
| Memory Leak Defense    | Stale camera & screen tracks running| Explicit track termination loop on|
|                        | in background after call completion | call end and beforeunload event   |
+------------------------+-------------------------------------+-----------------------------------+
```
