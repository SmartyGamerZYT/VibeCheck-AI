# Full Implementation Blueprint & Component Architecture — VibeCheck AI

```
+========================================================================================+
|                        PROJECT IMPLEMENTATION ARCHITECTURE                             |
+========================================================================================+
| Framework: Next.js 14 App Router (React 18)     | State Engine: Unified Master State   |
| Component Architecture: Modular Atomic Hierarchy | Type System: TypeScript 5 Strict     |
| Real-Time Layer: WebRTC + BroadcastChannel      | Emojis: 0 (Strict ASCII/SVG)         |
+========================================================================================+
```

---

## 1. Component Hierarchy & Module Interaction Map

```mermaid
flowchart TD
    Root["src/app/layout.tsx (Global HTML shell & Typography tokens)"]
    Page["src/app/page.tsx (Master State Orchestrator & Multi-Tenant Partitioning)"]
    Root --> Page

    subgraph Navigation & Header Tier
        Page --> Nav["src/components/Navbar.tsx (Brand header, Profile & Quick Actions)"]
        Page --> Side["src/components/Sidebar.tsx (Role-adaptive view switcher)"]
        Page --> Cookie["src/components/CookieConsentBanner.tsx (Privacy consent)"]
    end

    subgraph Active Viewport Tier [Active Viewport Switching based on activeTab]
        Page --> Review["src/components/ReviewEngine.tsx (Content Auditor & Diff Inspector)"]
        Page --> Media["src/components/MediaAudit.tsx (Canvas CV, Audio Waveform & Speech)"]
        Page --> Collab["src/components/CollaborationHub.tsx (WebRTC Real Screen & Meet Tile)"]
        Page --> Queue["src/components/SubmissionQueue.tsx (Editorial Queue & SHA-256 Seal)"]
        Page --> Guidelines["src/components/BrandGuidelinesBuilder.tsx (Voice Sliders & Claims)"]
        Page --> Analytics["src/components/AnalyticsInsights.tsx (Mistake Meter & Accuracy)"]
        Page --> Workflows["src/components/WorkflowIntegrations.tsx (Cloudinary, Resend, Teams)"]
    end

    subgraph Enterprise Dialog Tier
        Page --> AuthModal["src/components/AuthScreen.tsx (Login, Google OAuth, Forgot Password)"]
        Page --> SubModal["src/components/SubscriptionCheckoutModal.tsx (Rs 5,000/mo Paywall)"]
        Page --> LegalModal["src/components/LegalSupportModal.tsx (5-Tab Compliance Terms)"]
        Page --> Settings["src/components/SettingsModal.tsx (Tenancy keys & API settings)"]
    end

    classDef core fill:#1C1917,stroke:#C5A880,stroke-width:2px,color:#FBF8F3;
    classDef comp fill:#141210,stroke:#78716C,stroke-width:1px,color:#E7E5E4;
    classDef dialog fill:#1A261D,stroke:#4ADE80,stroke-width:1.5px,color:#E6EDF3;
    class Root,Page core;
    class Nav,Side,Cookie,Review,Media,Collab,Queue,Guidelines,Analytics,Workflows comp;
    class AuthModal,SubModal,LegalModal,Settings dialog;
```

---

## 2. Component-to-Route Wiring Matrix

| UI Component | Serverless Route | Library Dependency | Purpose |
| :--- | :--- | :--- | :--- |
| `ReviewEngine.tsx` | `/api/review` | `src/lib/openrouter.ts` | Multi-agent text compliance & tone calibration |
| `ReviewEngine.tsx` | `/api/extract-docx` | `mammoth` (npm) | Binary `.docx` text and table extraction |
| `MediaAudit.tsx` | `/api/transcribe-audio`| Web Speech API / OpenRouter | Audio transcription & speech tone audit |
| `MediaAudit.tsx` | `/api/review-image` | `src/lib/accessibility-cv.ts`| Canvas 2D WCAG contrast & palette audit |
| `CollaborationHub.tsx` | Native WebRTC | `BroadcastChannel` | Real screen capture & Google Meet video grid |
| `SubmissionQueue.tsx` | Client Web Crypto | Native `crypto.subtle` | Immutable SHA-256 digital publication seal |
| `SubscriptionCheckoutModal.tsx` | Razorpay / Stripe Hook | `src/lib/types.ts` | Rs 5,000/mo single-seat company license gate |
| `WorkflowIntegrations.tsx` | `/api/upload` | `src/lib/cloudinary.ts` | Brand creative and banner cloud storage |
| `WorkflowIntegrations.tsx` | `/api/notify` | `src/lib/resend.ts` | Transactional email alerts for managers |

---

## 3. Master State Orchestration (`src/app/page.tsx`)

`src/app/page.tsx` acts as the single source of truth for all multi-tenant state. State reads and writes are reactive and isolated:

```mermaid
flowchart LR
    subgraph Master State
        User["currentUser (UserAccount)"]
        Org["currentOrg (Organization)"]
        Projects["projects[] (Project[])"]
        Submissions["submissions[] (ContentSubmission[])"]
        Mistakes["mistakes[] (MemberMistake[])"]
        Guidelines["guidelines (BrandGuidelineConfig)"]
    end

    subgraph Tenant Filtering Pipeline
        Org --> FilterP["Filter: p.orgId == currentOrg.id"]
        Org --> FilterS["Filter: s.orgId == currentOrg.id"]
        Org --> FilterM["Filter: m.orgId == currentOrg.id"]
    end

    subgraph Consumer Components
        FilterP --> CollabHub["CollaborationHub (orgProjects)"]
        FilterS --> QueueView["SubmissionQueue (orgSubmissions)"]
        FilterM --> AnalyticsView["AnalyticsInsights (orgMistakes)"]
    end
```

---

## 4. End-to-End Content Publication Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Creator as Content Author
    participant Composer as DocumentEditor.tsx
    participant Review as ReviewEngine.tsx
    participant Queue as SubmissionQueue.tsx
    actor Manager as Compliance Manager
    participant Seal as Web Crypto SHA-256

    Creator->>Composer: Drafts or uploads Word (.docx) document
    Composer->>Review: Triggers "Run AI Audit"
    Review->>Review: Evaluates claims, grammar, tone sliders, and competitor terms
    Review-->>Creator: Renders side-by-side Diff Inspector with 1-click fixes
    Creator->>Review: Accepts suggestions & submits to Editorial Queue
    Review->>Queue: Appends ContentSubmission (status: 'in_review')
    Manager->>Queue: Reviews flagged claims & conducts WebRTC screen review
    Manager->>Queue: Clicks "Approve & Seal with SHA-256"
    Queue->>Seal: Hashes (id + text + author + approver + timestamp)
    Seal-->>Queue: Generates 64-character hexadecimal digest
    Queue-->>Creator: Issues certified publication receipt
```

---

## 5. Production Readiness & Build Verification Matrix

```
+---------------------------------------------------------------------------------------+
| VERIFICATION MATRIX                                                                   |
+---------------------------------------------------------------------------------------+
| Verification Item      | Command / Standard             | Result                      |
+------------------------+--------------------------------+-----------------------------+
| TypeScript Strictness  | npx tsc --noEmit               | 0 errors, 0 implicit any    |
| Next.js Route Bundling | npm run build                  | 10/10 route bundles passed  |
| Iconography Purity     | Strict regex scan              | 0 unicode emojis            |
| Screen Share Integrity | Native getDisplayMedia         | Verified (True screen feed) |
| Meet Cam Integrity     | Native getUserMedia            | Verified (True webcam feed) |
| Account Recovery       | Self-service expiring tokens   | Verified (Forgot password)  |
+---------------------------------------------------------------------------------------+
```
