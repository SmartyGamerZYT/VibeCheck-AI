# VibeCheck AI — Multi-Modal Brand Governance & Enterprise Content Compliance Platform

> **"Your brand voice, protected at every step."**  
> An enterprise-grade, multi-factor brand governance engine that ensures content compliance across text, images, audio, and video before public distribution.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![OpenRouter](https://img.shields.io/badge/AI_Engine-OpenRouter_Gemini_&_Llama-orange)](https://openrouter.ai/)
[![WebRTC](https://img.shields.io/badge/Collaboration-WebRTC_Huddle-green?logo=webrtc)](https://webrtc.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Executive Overview

**VibeCheck AI** is a real-time brand governance, editorial compliance, and multi-team collaboration platform designed for high-velocity marketing, healthcare, fintech, and enterprise publishing teams. It guarantees that every asset published adheres strictly to organizational brand guidelines, certified scientific claim points, tone sliders, regulatory standards, and accessibility requirements.

Equipped with an ensemble of multi-agent review engines (Google Gemini 2.5 Flash, Gemini 2.0, Meta Llama 3.3 70B), Computer Vision (CV) pixel extraction, OpenRouter audio transcription, WebRTC peer collaboration rooms, and SHA-256 cryptographic sign-offs, VibeCheck AI transforms compliance from a bureaucratic bottleneck into an automated, real-time creative accelerator.

---

## 📚 Complete Engineering Documentation (`Docs/`)

Explore our deep-dive architecture, design, and operational manuals in the [`Docs/`](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs) directory:

| Document | Description | Direct Link |
| :--- | :--- | :--- |
| **Product Requirements (PRD)** | Problem statement, user personas, success metrics & feature backlog | [PRD.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/PRD.md) |
| **UI/UX Design System** | Sandstone & Bronze aesthetic tokens, typography scale & component specs | [Design.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/Design.md) |
| **System Architecture** | Next.js 14 App Router, multi-tenant data isolation & WebRTC signaling | [Architecture.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/Architecture.md) |
| **Database Schema** | Domain models, RLS tenancy, indexing & entity-relationship diagrams | [Database.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/Database.md) |
| **REST API Reference** | Complete endpoint specs (`/api/review`, `/api/transcribe-audio`, etc.) | [API.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/API.md) |
| **Multi-Agent Intelligence** | Multi-agent consensus, claim verification, tone & vision agents | [Agents.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/Agents.md) |
| **Project Implementation** | Full codebase directory layout, module mappings & component hierarchy | [Project Implementation.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/Project%20Implementation.md) |
| **Setup & Initialization** | Prerequisites, environment secrets, seed credentials & dev execution | [setup&initilisation.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/setup&initilisation.md) |
| **Feature Development** | Life of a feature, adding custom compliance rules & media extensions | [feature Development.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/feature%20Development.md) |
| **Authentication & Security** | RBAC, ₹5,000/mo paywall, SHA-256 sign-offs & cookie consent | [Authentication &security.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/Authentication%20&security.md) |
| **MCP Integration** | Model Context Protocol server tools, resources & agent connections | [MCP connection.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/MCP%20connection.md) |
| **Workflow Integrations** | YouTube, Canva, Microsoft Teams, GitHub, Slack, Figma connectors | [Integrations.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/Integrations.md) |
| **Testing & Quality Assurance** | Unit testing, multi-modal test fixtures, CI/CD verification & QA matrix | [Testing &QA.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/Testing%20&QA.md) |
| **Troubleshooting Runbook** | Debugging audio transcription, WebRTC screen share & storage recovery | [Debugging.md](file:///c:/Users/kshit/Desktop/VibeCheck AI/Docs/Debugging.md) |

---

## 🚀 Key Platform Capabilities

### 1. Multi-Factor AI Content Audit Engine
- **Multi-Agent Evaluation**: Audits drafts through Google Gemini (`gemini-2.5-flash`, `gemini-2.0-flash-001`) and Meta Llama 3.3 (70B) for zero-latency, context-aware analysis.
- **Dynamic Spelling & Grammar Inspection**: Flags typos, irregular verb tenses (*"decides to went"* → *"decided to go"*, *"buyed"* → *"bought"*), and subject-verb disagreements without robotic phrasing.
- **Intent-Preserving Tone Rewriting**: Polishes copy to match organizational Formality, Seriousness, and Boldness sliders while preserving author storyline and character context.
- **Admin Claim Points Enforcement**: Verifies all asserted facts, statistical percentages, and performance benchmarks against the organization's certified `approvedClaims` repository. Unsupported or exaggerated claims (*e.g., "miracle cure", "100% guaranteed"*) trigger `RULE-CLAIM-EXCESS` critical violations and hard-block publication.
- **Brand Safety & Adult Filter**: Identifies sexual framing, explicit slang, and violent threats with immediate removal recommendations.
- **Glossary & Competitor Lockout**: Enforces preferred brand terminology (*e.g., "Member" instead of "Customer"*) and locks out rival entity citations.

### 2. Computer Vision (CV) Image Analysis
- **Dynamic Canvas Pixel Sampling**: Extracts real dominant color palettes from uploaded images and calculates Delta-E mathematical distance against brand hex tokens.
- **WCAG 2.1 AAA Contrast Ratio**: Calculates luminance contrast across foreground and background elements.
- **Stock Watermark & Copyright Scanner**: Detects signatures of commercial stock agencies (Getty Images, Shutterstock, iStock, Alamy, Adobe Stock) to prevent unlicensed IP liabilities.
- **Optical Character Recognition (OCR)**: Extracts visible text within graphic creatives and runs automated brand compliance checks on typography.

### 3. Audio & Video Governance Audit
- **OpenRouter Speech Transcription**: Fast verbatim speech-to-text transcription powered directly by OpenRouter AI speech models.
- **Live Voice Microphone Recording**: Free in-browser speech recognition via Web Speech API with 0 API keys required.
- **Audio Cadence & Voice Analysis**:
  - Speech cadence monitoring (target: 140–160 WPM).
  - Filler word ratio calculation (*"um"*, *"uh"*, *"like"*).
  - Loudness normalization (-14 LUFS according to EBU R128 and YouTube broadcast specs).
- **Video Timeline & Keyframe Inspection**:
  - Keyframe scene extraction across the video timeline.
  - On-screen lower-thirds OCR check.
  - Scene color grading adherence against brand color tokens.
  - Closed-caption subtitle presence and contrast ratio (WCAG 7:1 AAA standard).

### 4. Collaboration Hub & Live Team Huddle
- **Concurrent Multi-Project Management**: Isolated project workspaces per organization with milestones and deliverables.
- **Visual Project Lifecycle Timeline**: `just_started` → `in_progress` → `under_review` → `revisions` → `completed`.
- **Author Change Tracking & Diff History**: Granular changelog tracking *who changed what, when, and why* with character delta counters (`+48`, `-12`).
- **Live Team Huddle & Synchronized Screen Share**: Built-in collaborative meeting room with participant video tiles, camera toggle, microphone mute/unmute, call invite handshake, and WebRTC `getDisplayMedia` screen broadcast.

### 5. Enterprise Workflow Integrations
- **YouTube**: Direct video publishing with automated title, description, and thumbnail OCR verification.
- **Canva**: Bi-directional brand kit synchronization (palettes, typography, and certified social graphics).
- **Microsoft Teams & Slack**: Real-time webhook notifications, approval cards, and review alerts dispatched directly to communication channels.
- **GitHub**: CI/CD Brand Guard linting for markdown documentation, whitepapers, and public site copy in Pull Requests.

### 6. Role-Based Governance & Cryptographic Sign-Off
- **Four Dedicated Roles**: **Creator**, **Reviewer**, **Manager**, and **Admin**.
- **Cryptographic Audit Signature**: Every approved document receives a SHA-256 digital signature hash sealing the final approved text, author, signer email, and timestamp.
- **Member Mistakes Tracking**: Real-time accuracy meter in the Admin Dashboard tracking violation frequency and attributing mistakes to authors for constructive coaching.

---

## 💳 Enterprise Pricing & Subscription Model

VibeCheck AI is built on a streamlined **Single-Seat Company License** model:

- **Subscription Rate**: **₹5,000 / month** per organization.
- **Admin Paid Tier**: Only the **Company Admin** pays the ₹5,000/mo subscription fee during registration or via the billing settings modal.
- **100% Free for Team Members**: Creators, Reviewers, and Managers join at zero cost simply by entering the organization's unique invite key (`adminKey`).
- **Organization-Wide Service Suspension**: If the organization's monthly subscription lapses or becomes unpaid, platform service locks gracefully for all members under that organization with a polite lock screen directing them to contact their Admin (`adminEmail`). The Admin retains immediate one-click renewal capability (`Renew ₹5,000 Plan`) to instantly restore access.
- **Supported Payment Methods**: UPI (Google Pay, PhonePe, Paytm, BHIM QR), Credit/Debit Cards (Visa, MasterCard, RuPay), and NetBanking.

---

## ⚖️ Legal, Privacy & Compliance Infrastructure

- **Persistent Downside Footer**: Every page and dashboard view includes immediate access to:
  - **About Us**: Company history, founding principles, engineering ethos, and leadership.
  - **Contact Us**: Interactive contact ticket form and enterprise support routing (`support@vibecheck.ai`, `compliance@vibecheck.ai`).
  - **Privacy Policy**: GDPR, CCPA, and zero-retention data sovereignty commitments.
  - **Terms of Service**: Enterprise SaaS licensing agreement, liability caps, and uptime SLA.
  - **Copyright Notice**: Official legal intellectual property notice (© 2026 VibeCheck AI Inc.).
- **Registration Consent**: Enforces a mandatory *"I accept terms & conditions and privacy policy"* validation check before account creation.
- **Cookie Consent**: Interactive banner displayed on first website visit (`Accept All` vs. `Reject Non-Essential`), persisting user consent in `localStorage`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing across models, audits, and components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Sandstone aesthetic `#FAF8F5`, `#3C311F`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Engine**: [OpenRouter API](https://openrouter.ai/) (Google Gemini 2.5 Flash, Gemini 2.0 Flash, Meta Llama 3.3 70B)
- **Real-Time Collaboration**: WebRTC (`getUserMedia`, `getDisplayMedia`)
- **Document Processing**: [Mammoth.js](https://github.com/mwilliamson/mammoth.js) (DOCX client extraction)
- **Computer Vision**: HTML5 Canvas Pixel Extraction & Dynamic Delta-E Color Distance
- **Media Delivery**: Cloudinary & Local Data URLs
- **Email Notifications**: Resend API

---

## ⚡ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-org/vibecheck-ai.git
cd "VibeCheck AI"
npm install
```

### 2. Environment Setup
Configure `.env.local` in the project root:
```env
# OpenRouter API Key (Required for AI Review Engine & Audio Transcription)
OPENROUTER_API_KEY="sk-or-v1-..."

# Google Gemini API Key (Direct API integration)
GEMINI_API_KEY="AQ...."

# Supabase Publishable Key
SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Resend (Optional)
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

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@luminahealth.org` | `password123` | Full access, Guideline policy, Color pinning, Invite keys, Billing |
| **Manager** | `elena@luminahealth.org` | `password123` | Final sign-off, SHA-256 signatures, Project timelines |
| **Reviewer** | `julian@luminahealth.org` | `password123` | Queue audits, Inline comments, Revision requests |
| **Creator** | `maya@luminahealth.org` | `password123` | Draft composer, DOCX upload, AI review execution |

---

## 🛡️ License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
