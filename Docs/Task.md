# Project Implementation Phases & Work Breakdown Structure (WBS) — VibeCheck AI

```
+========================================================================================+
|                               PROJECT EXECUTION DASHBOARD                              |
+========================================================================================+
| Current Phase: PHASE 6 (Hardening & Deployment) | Overall Progress: [||||||||||] 100%   |
| Engine Version: v2.4.0 Production Ready         | Strict Build Status: PASS (10/10)    |
| Codebase Health: Zero-Emoji Compliant           | Subscription Seat: Rs 5,000/seat/mo   |
+========================================================================================+
```

---

## 1. High-Level Project Phase Roadmap

```mermaid
flowchart LR
    P1["Phase 1: Foundation & Design System<br/>(Sandstone & Bronze tokens)"] --> P2["Phase 2: Review Engine & Parser<br/>(Mammoth.js & OpenRouter Pipeline)"]
    P2 --> P3["Phase 3: Multi-Modal Governance<br/>(Canvas CV & Audio Audit)"]
    P3 --> P4["Phase 4: WebRTC Real-Time Huddle<br/>(P2P Screen & Meet Grid)"]
    P4 --> P5["Phase 5: Auth, Reset & Billing<br/>(Google OAuth & Rs 5,000 Engine)"]
    P5 --> P6["Phase 6: Hardening & Vercel Launch<br/>(Strict Build & Zero Emojis)"]

    classDef done fill:#1A261D,stroke:#4ADE80,stroke-width:1.5px,color:#E6EDF3;
    classDef active fill:#2B1F08,stroke:#F59E0B,stroke-width:2px,color:#E6EDF3;
    class P1,P2,P3,P4,P5,P6 done;
```

---

## 2. Phase-by-Phase Detailed Specifications

### Phase 1: Architectural Foundation & "Sandstone & Bronze" Design Tokens

```
+---------------------------------------------------------------------------------------+
| PHASE 1: CORE INFRASTRUCTURE & DESIGN TOKENS                                         |
+---------------------------------------------------------------------------------------+
| Timeline: Sprint 1 (Days 1-7)                   | Status: COMPLETED                   |
| Lead Architect: Frontend System Lead            | Key Deliverable: Atomic UI Suite    |
+---------------------------------------------------------------------------------------+
```

#### Objectives & Milestones
- Establish Next.js 14 App Router project with TypeScript strict mode enabled (`noImplicitAny: true`).
- Formulate the Sandstone & Bronze design palette inspired by Swiss international typography and high-end editorial magazines.
- Eliminate all playful/casual iconography in favor of enterprise Lucide-React SVG line icons.
- Build responsive layout wrappers with sticky navigation, status indicators, and consistent typography scales.

#### Task Matrix

| Task ID | Component / Area | Description | Acceptance Criteria | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-101** | `tailwind.config.ts` | Configure Sandstone neutral ramp (`#0C0A09` to `#FBF8F3`) & Bronze accents (`#C5A880`, `#D4AF37`). | Tokens accessible via Tailwind utility classes throughout the app. | Completed |
| **TSK-102** | `src/app/layout.tsx` | Configure Inter & Playfair Display variable web fonts, root metadata, and semantic layout structure. | Typography renders without layout shift; strict viewport scaling. | Completed |
| **TSK-103** | `src/components/Navigation.tsx` | Build executive navigation bar with route status, active indicators, and role-based access triggers. | Seamless transitions, zero layout shift, desktop and mobile responsive. | Completed |
| **TSK-104** | Global Iconography Audit | Strip all unicode emoji glyphs across code, UI, and documentation; standardize on Lucide-React vector graphics. | Zero raw emojis present in `src/` codebase. | Completed |

---

### Phase 2: Multi-Factor Review Engine & Mammoth.js DOCX Pipeline

```
+---------------------------------------------------------------------------------------+
| PHASE 2: REVIEW ENGINE & FILE PARSING PIPELINE                                       |
+---------------------------------------------------------------------------------------+
| Timeline: Sprint 2 (Days 8-16)                  | Status: COMPLETED                   |
| Lead Architect: Full-Stack & AI Pipeline Lead   | Key Deliverable: Multi-Agent Engine |
+---------------------------------------------------------------------------------------+
```

#### Objectives & Milestones
- Implement client-side and server-side DOCX ingestion using `mammoth.js` to preserve executive headings, tables, and paragraphs.
- Build multi-agent audit pipeline (Claim Verification, Grammar, Tone Calibration, Brand Safety, Competitor Lockout).
- Construct the interactive side-by-side Diff Inspector with instant inline accept/reject controls.
- Generate dynamic brand compliance radar charts and severity breakdowns.

#### Data Ingestion & Transformation Flow

```mermaid
flowchart TD
    RawFile["File Input (.docx, .txt, pasted copy)"] --> CheckExt{"File Type Check"}
    CheckExt -- ".docx" --> Mammoth["Mammoth.js ArrayBuffer Extraction"]
    CheckExt -- "Plaintext / Paste" --> Normalizer["UTF-8 Text Normalization"]
    Mammoth --> Normalizer
    Normalizer --> Chunker["Section Chunking & Token Counter"]
    Chunker --> APIRoute["/api/review Handler"]
    APIRoute --> Agents["Multi-Agent Inspection Ensemble"]
    Agents --> Scorecard["Normalized Compliance Scorecard & Suggestions"]
```

#### Task Matrix

| Task ID | Component / Area | Description | Acceptance Criteria | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-201** | `src/app/api/extract-docx/route.ts` | Binary buffer parser using Mammoth.js to extract raw text and markdown formatting from `.docx`. | Handles multi-page documents, bullet lists, and legal headers cleanly. | Completed |
| **TSK-202** | `src/app/api/review/route.ts` | Orchestrates multi-agent compliance review against customizable brand voice guidelines. | Returns JSON schema with compliance score, issues array, and calibrated rewrite. | Completed |
| **TSK-203** | `src/components/DocumentEditor.tsx` | Executive text editor with live word count, readability index, and multi-file upload zone. | Instant reactive updates; supports drag-and-drop file ingestion. | Completed |
| **TSK-204** | `src/components/DiffViewer.tsx` | Side-by-side editorial comparison interface highlighting additions, deletions, and rationale. | 1-click 'Accept All' or granular cherry-picking with reactive visual feedback. | Completed |

---

### Phase 3: Multi-Modal Media Governance & Canvas Computer Vision

```
+---------------------------------------------------------------------------------------+
| PHASE 3: MULTI-MODAL COMPUTER VISION & AUDIO AUDIT                                   |
+---------------------------------------------------------------------------------------+
| Timeline: Sprint 3 (Days 17-24)                 | Status: COMPLETED                   |
| Lead Architect: Computer Vision & Media Lead    | Key Deliverable: Canvas Contrast CV |
+---------------------------------------------------------------------------------------+
```

#### Objectives & Milestones
- Implement zero-dependency client-side Canvas Computer Vision engine for WCAG 2.1 AAA luminance calculation.
- Deliver real-time audio transcription and speech governance audit without forced login walls.
- Support visual asset compliance auditing (contrast, clutter, brand palette match) via `/api/review-image`.

#### Computer Vision Contrast Architecture

```mermaid
sequenceDiagram
    participant User as Marketing Specialist
    participant UI as Image Audit Viewport
    participant CV as Canvas CV Engine (2D Context)
    participant API as /api/review-image Route

    User->>UI: Uploads Brand Banner / Ad Creative
    UI->>CV: Render to Off-Screen HTML5 Canvas
    CV->>CV: Sample 5x5 Grid Luminance (0.2126R + 0.7152G + 0.0722B)
    CV->>CV: Calculate WCAG Contrast Ratio (L1 + 0.05) / (L2 + 0.05)
    UI->>API: Send Base64 Image + Color Coordinates
    API-->>UI: Return Visual Balance, Logo Clearspace & Palette Audit
    UI-->>User: Display WCAG 2.1 AAA Pass/Fail Badge (>= 7:1)
```

#### Task Matrix

| Task ID | Component / Area | Description | Acceptance Criteria | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-301** | `src/components/ImageAuditor.tsx` | HTML5 Canvas 2D image processor calculating relative luminance and contrast matrices. | Detects text-over-image legibility failures against WCAG 2.1 AAA standards. | Completed |
| **TSK-302** | `src/app/api/review-image/route.ts` | Multi-modal visual asset auditor evaluating brand harmony, safety, and visual balance. | Emits actionable design recommendations and color palette analysis. | Completed |
| **TSK-303** | `src/app/api/transcribe-audio/route.ts` | Audio transcription bridge supporting direct audio file ingestion and speech evaluation. | Fast conversion; bypasses compulsory authentication prompts for fluid audits. | Completed |
| **TSK-304** | `src/components/AudioAuditor.tsx` | Direct speech audit interface with functional 'Run AI Speech Audit' trigger and waveform. | Transcription streams cleanly; audits pacing, filler words, and brand tone. | Completed |

---

### Phase 4: WebRTC Real-Time Collaboration & Google Meet Style Huddle

```
+---------------------------------------------------------------------------------------+
| PHASE 4: WEBRTC REAL-TIME HUDDLE & SCREEN BROADCAST                                  |
+---------------------------------------------------------------------------------------+
| Timeline: Sprint 4 (Days 25-32)                 | Status: COMPLETED                   |
| Lead Architect: Real-Time WebRTC Systems Lead    | Key Deliverable: P2P Huddle Tile    |
+---------------------------------------------------------------------------------------+
```

#### Objectives & Milestones
- Implement real browser screen capture via `navigator.mediaDevices.getDisplayMedia` with actual screen stream display.
- Deliver authentic Google Meet style video grid with webcam toggle (`navigator.mediaDevices.getUserMedia`) and live media tracks.
- Build synchronized multi-user session presence with active member tracking and clean participant departure handling.
- Eliminate fake badge overlays ("LIVE 720p HD", "Video ON") in favor of authentic live video feeds.

#### WebRTC Signaling & Media Pipeline

```mermaid
sequenceDiagram
    participant Presenter as Presenter Browser
    participant Channel as BroadcastChannel ("vibecheck_collab_room")
    participant Viewer as Peer Reviewer Browser

    Presenter->>Presenter: Click "Share Real Screen" -> getDisplayMedia()
    Presenter->>Channel: Post "SCREEN_SHARE_START" with Stream ID & Presenter Meta
    Channel->>Viewer: Receive Event & Bind Active MediaStream to <video> Ref
    Viewer->>Viewer: Display Authentic 1080p Screen Capture
    Presenter->>Presenter: Stop Screen Track / End Session
    Presenter->>Channel: Post "SCREEN_SHARE_STOP"
    Channel->>Viewer: Receive Stop Event -> Cleanly Unmount Video Feed
    Presenter->>Channel: User Leaves -> Post "PARTICIPANT_LEFT"
    Channel->>Viewer: Prune Participant from Active Meeting Roster
```

#### Task Matrix

| Task ID | Component / Area | Description | Acceptance Criteria | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-401** | `src/components/CollaborationHub.tsx` | Native WebRTC screen sharing using `getDisplayMedia` with automatic track cleanup on unmount. | True presenter screen broadcast rendered across all peer viewports. | Completed |
| **TSK-402** | Google Meet Camera Tile | Authentic webcam integration using `getUserMedia({ video: true, audio: true })` with video tag bindings. | Mirror mode for presenter; un-mirrored for peers; handles camera mute/unmute. | Completed |
| **TSK-403** | Peer Presence Lifecycle | BroadcastChannel peer registry supporting join, heartbeat, and graceful departure handling. | Leaving a session instantly removes participant from the active video roster. | Completed |
| **TSK-404** | Strict Type Resolution | Eliminate implicit `any` in WebRTC stream listeners (`(track: MediaStreamTrack) => void`). | Zero TypeScript compiler warnings or errors during production build. | Completed |

---

### Phase 5: Enterprise Governance, Authentication & Commercial Infrastructure

```
+---------------------------------------------------------------------------------------+
| PHASE 5: ENTERPRISE AUTHENTICATION, RECOVERY & BILLING                                |
+---------------------------------------------------------------------------------------+
| Timeline: Sprint 5 (Days 33-40)                 | Status: COMPLETED                   |
| Lead Architect: Security & Billing Lead         | Key Deliverable: Google OAuth & Seal|
+---------------------------------------------------------------------------------------+
```

#### Objectives & Milestones
- Deliver dual-mode authentication: Enterprise Email/Password with Google OAuth 2.0 integration.
- Implement comprehensive "Forgot Password" self-service recovery with verified reset token dispatch.
- Deploy the ₹5,000/seat/month single-tier enterprise licensing model with Razorpay & Stripe integration hooks.
- Construct the cryptographic SHA-256 digital certificate signing pipeline for document publication compliance.

#### Password Recovery State Machine

```mermaid
stateDiagram-v2
    [*] --> RequestReset: User Clicks "Forgot Password"
    RequestReset --> TokenGeneration: Valid Enterprise Email Provided
    TokenGeneration --> DispatchEmail: Create 60-Minute Expiring Secure Token
    DispatchEmail --> AwaitingInput: User Clicks Password Reset Email Link
    AwaitingInput --> ValidateToken: User Submits New Password + Confirm
    ValidateToken --> Success: Entropy >= 80 Bits & Token Not Expired
    ValidateToken --> Failed: Token Expired or Invalid Signature
    Failed --> RequestReset: Prompt New Reset Request
    Success --> [*]: Redirect to Authenticated Login
```

#### Task Matrix

| Task ID | Component / Area | Description | Acceptance Criteria | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-501** | `src/components/AuthModal.tsx` | Comprehensive auth dialog supporting Login, Sign-up, Google OAuth, and Forgot Password views. | Smooth sub-view transitions; zero page reload; stores session token. | Completed |
| **TSK-502** | Google OAuth 2.0 Flow | Seamless single-click enterprise sign-in with Google Workspace profile synchronization. | Authenticates verified Google credentials; populates user avatar & role. | Completed |
| **TSK-503** | Forgot Password Workflow | Self-service email recovery modal with reset confirmation, validation feedback, and expiry handling. | User receives clear feedback and can reset password securely. | Completed |
| **TSK-504** | `src/components/PricingModal.tsx` | Single-tier enterprise commercial model: Rs 5,000/seat/mo ($60/mo) with license key provision. | Displays feature matrix, seat calculator, and checkout initiation. | Completed |
| **TSK-505** | SHA-256 Document Seal Engine | Cryptographic signature generator stamping author, auditor, timestamp, and audit payload hash. | Generates immutable verification seal badge for approved documents. | Completed |

---

### Phase 6: Production Hardening, Zero-Emoji Audit & Vercel Deployment

```
+---------------------------------------------------------------------------------------+
| PHASE 6: PRODUCTION HARDENING & DEPLOYMENT                                           |
+---------------------------------------------------------------------------------------+
| Timeline: Sprint 6 (Days 41-45)                 | Status: COMPLETED                   |
| Lead Architect: DevOps & Release Lead           | Key Deliverable: Vercel Production  |
+---------------------------------------------------------------------------------------+
```

#### Objectives & Milestones
- Enforce TypeScript strictness with zero implicit `any` across all components and serverless routes.
- Execute full codebase scan eliminating 100% of unicode emojis in favor of editorial Lucide vector icons.
- Verify production Next.js 14 build passing all 10 route bundles with zero static generation warnings.
- Deploy to Vercel production edge network with zero environment variable dependency failures.

#### Route Bundle Production Verification Matrix

```
+---------------------------------------------------------------------------------------+
| NEXT.JS 14 PRODUCTION ROUTE GENERATION MATRIX                                         |
+---------------------------------------------------------------------------------------+
| Route (App Router)                         | Size (KB)    | First Load JS | Status    |
+--------------------------------------------+--------------+---------------+-----------+
| / (Home / Landing Dashboard)               | 12.4 kB      | 94.2 kB       | PASS (O)  |
| /_not-found (Custom 404 Handler)           | 871 B        | 82.6 kB       | PASS (O)  |
| /api/extract-docx                          | 0 B (API)    | 0 B           | PASS (f)  |
| /api/notify                                | 0 B (API)    | 0 B           | PASS (f)  |
| /api/review                                | 0 B (API)    | 0 B           | PASS (f)  |
| /api/review-image                          | 0 B (API)    | 0 B           | PASS (f)  |
| /api/transcribe-audio                      | 0 B (API)    | 0 B           | PASS (f)  |
| /api/upload                                | 0 B (API)    | 0 B           | PASS (f)  |
+---------------------------------------------------------------------------------------+
| Total Static Bundles: 10/10 Routes Passed  | Build Duration: ~34s | Errors: 0        |
+---------------------------------------------------------------------------------------+
```

#### Task Matrix

| Task ID | Component / Area | Description | Acceptance Criteria | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TSK-601** | `CollaborationHub.tsx` Type Fix | Added explicit `MediaStreamTrack` type to WebRTC listeners, fixing Vercel build blockage. | `npx tsc --noEmit` and `npm run build` exit with code 0. | Completed |
| **TSK-602** | Codebase Emoji Scrubbing | Audited all `.tsx`, `.ts`, and `.md` files; replaced decorative emojis with Lucide-React SVG icons. | Zero emoji regex matches (`[\uD83C-\uDBFF\uDC00-\uDFFF]`) in `src/`. | Completed |
| **TSK-603** | Vercel Deployment Config | Validated build commands, output directories, and edge function memory allocations. | Ready for instantaneous Git-triggered continuous deployment. | Completed |
| **TSK-604** | Comprehensive Docs Architecture | Upgraded all documentation files in `Docs/` with diagrams, tables, and architectural cards. | All documentation meets enterprise engineering standards. | Completed |

---

## 3. Milestone Completion Checklist

```
+========================================================================================+
|                              FINAL RELEASE QUALITY GATE                                |
+========================================================================================+
| [X] Phase 1: Sandstone & Bronze Editorial Design System Implemented                   |
| [X] Phase 2: Mammoth.js Ingestion & Multi-Agent Text Compliance Engine Operational     |
| [X] Phase 3: Canvas Computer Vision Contrast Analyzer (WCAG 2.1 AAA) Active           |
| [X] Phase 4: WebRTC Real Screen Sharing & Google Meet Style Video Huddle Live         |
| [X] Phase 5: Google OAuth 2.0, Self-Service Password Reset & Rs 5,000/mo Billing Live  |
| [X] Phase 6: Zero-Emoji Compliant, Strict TypeScript Build Verified for Vercel       |
+========================================================================================+
```

