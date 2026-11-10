# VibeCheck AI — Intelligent Brand Governance & Multi-Modal Compliance Platform

> **"Your brand voice, protected at every step."**  
> An enterprise-grade, multi-factor brand governance engine that ensures content compliance across text, images, audio, and video before public distribution.

---

## 🌟 Overview

**VibeCheck AI** is a real-time brand governance, editorial compliance, and multi-team collaboration platform. It guarantees that every asset published by marketing teams, content creators, clinicians, and partners adheres strictly to organizational brand guidelines, approved scientific claims, tone sliders, regulatory guidelines, and accessibility standards.

---

## 🚀 Key Features

### 1. Multi-Factor AI Content Audit Engine
- **OpenRouter Gemini & Llama 3.3 Integration**: Routes drafts through Google Gemini (`gemini-2.5-flash`, `gemini-2.5-pro`) and Meta Llama 3.3 (70B) for zero-latency, context-aware analysis.
- **Dynamic Spelling & Grammar Inspection**: Flags typos, incorrect tense usage (*"decides to went"* → *"decided to go"*, *"buyed"* → *"bought"*), irregular verb forms, and subject-verb agreements without awkward hardcoded boilerplate.
- **Intent-Preserving Tone Rewriting**: Preserves the author's original storyline and character context while polishing prose to meet brand formality, seriousness, and boldness parameters.
- **Admin Claim Points Enforcement**: Verifies all asserted facts, statistical percentages, and performance benchmarks against the organization's certified `approvedClaims` repository. Unsupported or exaggerated claims (*e.g., "miracle cure", "100% guaranteed"*) trigger `RULE-CLAIM-EXCESS` critical violations and block publication.
- **Brand Safety & Adult Filter**: Identifies sexual framing, explicit slang, and violent threats with immediate removal recommendations.
- **Glossary & Competitor Lockout**: Enforces preferred brand terminology and prevents accidental citation of rival entities.

---

### 2. Computer Vision (CV) Image Analysis
- **Dynamic Canvas Pixel Sampling**: Extracts real dominant color palettes from uploaded images and calculates percentage alignment with brand hex tokens.
- **WCAG 2.1 AAA Contrast Ratio**: Calculates luminance contrast across foreground and background elements.
- **Figure & Content Safety Filter**: Detects high-ratio skin exposure or suggestive poses requiring editorial safety oversight.
- **Stock Watermark & Copyright Scanner**: Detects stock agency signatures (Getty Images, Shutterstock, iStock, Alamy, Adobe Stock) to prevent unlicensed IP liabilities.
- **Optical Character Recognition (OCR)**: Extracts visible text within images and runs automated brand compliance checks on graphic typography.

---

### 3. Audio & Video Governance Audit
- **Audio Cadence & Voice Analysis**:
  - Speech-to-Text (STT) transcription with automatic claims and terminology verification.
  - Speech cadence monitoring (target: 140–160 WPM).
  - Filler word ratio calculation (*"um"*, *"uh"*, *"like"*).
  - Loudness normalization (-14 LUFS according to EBU R128 and YouTube broadcast specs).
  - Background music copyright scan distinguishing royalty-free attribution from unlicensed risks.
- **Video Timeline & Keyframe Inspection**:
  - Keyframe scene extraction across the video timeline.
  - On-screen lower-thirds OCR check.
  - Scene color grading adherence against brand color tokens.
  - Closed-caption subtitle presence and contrast ratio (WCAG 7:1 AAA standard).
  - Stock watermark detector across individual video frames.

---

### 4. Collaboration Hub
- **Concurrent Multi-Project Management**:
  - Run multiple marketing, whitepaper, and social campaigns simultaneously.
  - Create new projects with deadlines, target channels, and role allocation.
- **Visual Project Lifecycle Timeline**:
  - Track stages: `Just Started` → `In Progress` → `Under Review` → `Revisions Requested` → `Completed & Certified`.
  - Interactive milestones checklist with automated completion percentage calculations.
- **Author Change Tracking & Diff History**:
  - Granular changelog tracking *who changed what, when, and why*.
  - Side-by-side Before & After text diff previews with character delta counters (`+48`, `-12`).
  - Tracks content edits, guideline overrides, and status promotions.
- **Live Team Huddle & Screen Sharing**:
  - Built-in collaborative meeting room with participant video tiles.
  - Microphone mute/unmute and camera toggle controls.
  - Screen share broadcast via WebRTC `getDisplayMedia` to present documents, designs, or video timelines.
  - In-call collaborative chat and timestamped reviewer notes.

---

### 5. Workflow & Direct Platform Integrations
Directly connects to leading enterprise tools:
- **YouTube**: Direct video publishing with automated title, description, and thumbnail OCR verification.
- **Canva**: Bi-directional brand kit synchronization (palettes, typography, and certified social graphics).
- **Microsoft Teams**: Real-time webhook notifications, approval cards, and review alerts dispatched directly to Teams channels (*e.g., `#editorial-governance`*).
- **GitHub**: CI/CD Brand Guard linting for markdown documentation, whitepapers, and public site copy in Pull Requests.
- **Slack, Figma, & HubSpot**: One-click connector toggles for automated marketing distribution.

---

### 6. Role-Based Governance & Cryptographic Sign-Off
- **Four Dedicated Roles**:
  - **Creator**: Drafts copy in rich markdown/WYSIWYG editor, uploads DOCX files or creative media, reviews AI suggestions, and submits to the queue.
  - **Reviewer**: Evaluates flagged issues, resolves inline comments, and requests revisions or endorses drafts.
  - **Manager**: Oversees approval queues, assigns reviewers, and executes final approval.
  - **Admin**: Configures tone sliders, certified claim points, approved glossary terms, and pins color palette tokens.
- **Cryptographic Audit Signature**:
  - Every approved document receives a SHA-256 digital signature hash sealing the final approved text, author, signer email, and timestamp.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & API Routes)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing across models, audits, and components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Sandstone aesthetic `#FAF8F5`, `#3C311F`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Engine**: [OpenRouter API](https://openrouter.ai/) (Google Gemini 2.5 Flash, Gemini 2.5 Pro, Meta Llama 3.3 70B)
- **Document Processing**: [Mammoth.js](https://github.com/mwilliamson/mammoth.js) (DOCX client extraction)
- **Computer Vision**: HTML5 Canvas Pixel Extraction & Dynamic Delta-E Color Distance
- **Media Delivery**: Cloudinary & Local Data URLs
- **Email Notifications**: Resend API

---

## 📁 Project Structure

```bash
VibeCheck AI/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── extract-docx/       # Mammoth.js DOCX text extractor
│   │   │   ├── notify/             # Resend email notification service
│   │   │   ├── review/             # OpenRouter Gemini/Llama text & claims audit
│   │   │   ├── review-image/       # Vision AI image analysis
│   │   │   └── upload/             # Cloudinary asset upload handler
│   │   ├── globals.css             # Tailwind base & custom animations
│   │   ├── layout.tsx              # Root HTML & fonts
│   │   └── page.tsx                # Master workspace orchestrator
│   ├── components/
│   │   ├── AnalyticsInsights.tsx   # Visual charts for compliance KPIs
│   │   ├── AssetLibrary.tsx        # Brand asset manager (logos, guidelines, media)
│   │   ├── AuditLogs.tsx           # Security log viewer
│   │   ├── AuthScreen.tsx          # Org registration & role sign-in
│   │   ├── BrandGuidelinesBuilder.tsx # Tone sliders, claims ledger, color pinning
│   │   ├── CollaborationHub.tsx    # Multi-project timelines, author diffs, video huddle
│   │   ├── DiffViewer.tsx          # Side-by-side draft vs rewrite comparison
│   │   ├── DocumentEditor.tsx      # Rich formatted document composer
│   │   ├── LandingPage.tsx         # Modern hero & workflow overview
│   │   ├── MediaAudit.tsx          # Audio & video governance inspector
│   │   ├── Navbar.tsx              # Workspace header & user profile
│   │   ├── ReviewEngine.tsx        # Interactive content auditor & scorecard
│   │   ├── RoleDashboard.tsx       # Tailored portal per user role
│   │   ├── SettingsModal.tsx       # Organization keys & OpenRouter API config
│   │   ├── Sidebar.tsx             # Role-adaptive navigation menu
│   │   ├── SubmissionQueue.tsx     # Editorial approval pipeline & SHA-256 signing
│   │   └── WorkflowIntegrations.tsx# YouTube, Canva, Teams, GitHub connectors
│   └── lib/
│       ├── accessibility-cv.ts     # WCAG contrast & canvas CV algorithms
│       ├── cloudinary.ts           # Cloudinary SDK client
│       ├── default-data.ts         # Initial orgs, guidelines, projects & sample media
│       ├── image-analysis.ts       # Vision AI & stock watermark detection
│       ├── openrouter.ts           # OpenRouter LLM interface (Gemini & Llama)
│       ├── resend.ts               # Resend notification client
│       └── types.ts                # TypeScript domain models
├── public/                         # Static assets & icons
├── .env.local                      # Private environment variables (gitignored)
├── package.json                    # Dependencies & scripts
├── tailwind.config.ts              # Custom sand & bronze palette configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## ⚡ Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/vibecheck-ai.git
cd "VibeCheck AI"
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# OpenRouter API Key (Required for AI Review Engine)
OPENROUTER_API_KEY="sk-or-v1-..."

# Cloudinary (Optional - For cloud asset hosting)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Resend (Optional - For email approval alerts)
RESEND_API_KEY="re_..."

# Application Display Name
NEXT_PUBLIC_APP_NAME="VibeCheck AI"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 👥 Default Demo Credentials

You can sign in with any of the preconfigured organization roles:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@luminahealth.org` | `password123` | Full access, Guideline policy, Color pinning, Invite keys |
| **Manager** | `elena@luminahealth.org` | `password123` | Final sign-off, SHA-256 signatures, Project timelines |
| **Reviewer** | `julian@luminahealth.org` | `password123` | Queue audits, Inline comments, Revision requests |
| **Creator** | `maya@luminahealth.org` | `password123` | Draft composer, DOCX upload, AI review execution |

---

## 🛡️ License

This project is licensed under the MIT License.

