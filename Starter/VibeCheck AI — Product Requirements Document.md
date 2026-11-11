VibeCheck AI

- [Overview](#overview)
- [Problem](#problem)
- [Features](#features)
- [Tech Stack](#tech)
- [Workflow](#workflow)
- [Roadmap](#roadmap)

PRD v1.0

Product Requirements Document

# Brand governance, *made intelligent.*

VibeCheck AI is an intelligent brand-governance platform that reviews content before publication, checks it against approved guidelines, and helps teams stay consistently on-brand — without slowing down creativity.

**Product** VibeCheck AI

**Version** 1.0

**Status** Planning

**Prepared by** Inkloom AI

**Date** November 2026

01 — Overview

## What is VibeCheck AI?

Growing organisations publish content through multiple employees, agencies and AI tools, making it difficult to maintain a consistent and trustworthy brand identity. Incorrect claims, outdated information, inconsistent language and off-brand visuals can damage credibility before anyone notices the problem.

VibeCheck AI is a full-stack brand compliance platform combining AI-powered content review, explainable flagging, smart correction suggestions, and a human-led approval workflow — all in one coherent product. It is built for brand managers, content creators, marketing leads, and legal reviewers who need to move fast without losing control.

02 — Problem Statement

## The challenge we're solving

Multi-team publishing pipelines create compounding risks: tone inconsistency, unverified claims, visual brand drift, and inaccessible content — often discovered only after publication.

When teams scale, brand governance doesn't scale with them. A new copywriter doesn't know the glossary. An agency misuses the logo. An AI writing tool invents a claim. A social post skips alt-text. None of these get caught until it's too late.

Existing tools either require a full manual review cycle (slow, expensive) or offer a black-box auto-reject with no explanation (frustrating and unusable). VibeCheck AI bridges that gap: automated detection paired with human-readable explanations, collaborative review, and always-human final decisions.

03 — Goals & Success Metrics

## What success looks like

\< 5 min

Average AI review turnaround per content submission

95%

Flagging accuracy vs manually identified brand violations

0

Auto-applied corrections — humans always make the final call

4 roles

Creator → Reviewer → Manager → Admin with scoped permissions

04 — Feature Requirements

## Core product capabilities

1 Brand Guidelines Management

- Upload and define brand guidelines in PDF, DOCX, or plain text format
- Approved terminology and glossary dictionary with violation detection
- Reusable asset library for logos, colors, fonts, and imagery
- Approved facts and claims repository to verify content against
- Version-controlled guidelines with audit trail of when rules change

2 Content Review Engine (AI-Powered)

- Multi-format review: text, images, PDFs, social posts, ad copy, emails
- Tone and voice consistency checker against defined brand persona
- Terminology and language compliance scanner using approved glossary
- Fact and claim verification against approved source documents
- Visual consistency checks: logo usage, color palette, typography in images
- Accessibility audit: alt text presence, contrast ratios, readability scores
- Off-brand promotional claim and competitor mention detection

3 Explainable Flagging System

- Each flag links back to the specific guideline violated
- Severity classification: Critical / Warning / Suggestion
- Side-by-side view of original content versus flagged section
- Plain-language explanation of why something was flagged

4 Smart Correction Suggestions

- AI-suggested rewrites that preserve the creator's original intent
- Accept, reject, or modify each suggestion individually
- No auto-apply — every change is a deliberate human decision
- Side-by-side diff view: original vs. suggested text

5 Review and Approval Workflow

- Role-based access: Creator → Reviewer → Manager → Admin
- Submission queue with status tracking: Draft / In Review / Approved / Rejected
- Inline comments and threaded discussions per content piece
- Approval signatures with timestamps and full audit trail
- Revision history with tracked changes across all versions
- Email and in-app notifications for all workflow events

6 Governance Insights and Analytics

- Dashboard of most common violations by type and category
- Heatmaps of which guidelines are most frequently broken
- Per-team and per-creator compliance scores over time
- Weekly and monthly brand health trend reports
- Flagged content history with resolution outcomes

7 Security and Confidentiality

- Role-based permissions for sensitive brand assets
- Watermarked previews for non-authorised roles
- AI usage disclosure on every review result
- Full audit log of all actions and accesses

★ Extended Features

- Brand Guidelines Builder: in-platform wizard with tone sliders, color pickers, and terminology rules — no upload needed
- Chrome Extension and CMS plugins for Google Docs, Notion, WordPress, Webflow — real-time underlining of violations as you type
- Integrations: Slack, MS Teams, Figma, HubSpot, Mailchimp with API access for custom workflows
- AI Brand Voice Training: train the reviewer on past approved content, generate brand voice scores (0–100)
- Content Templates with locked sections, constrained vocabulary zones, and template compliance scoring
- Localization and Regional Compliance: multi-language guideline support, UK vs US English rules, local ad standards
- Onboarding Module: auto-generated brand quizzes from guidelines, training completion tracking

05 — User Roles and Permissions

## Who uses VibeCheck AI

Creator

- Submit content for review
- View own submissions
- Respond to comments
- Apply or reject suggestions

Reviewer

- Review assigned submissions
- Add inline comments
- Request revisions
- View AI review results

Manager

- Final approve / reject
- Access team analytics
- Manage brand guidelines
- Configure workflow stages

Admin

- All Manager permissions
- Manage users and roles
- API key management
- Full audit log access

06 — Technical Architecture

## APIs and integrations

VibeCheck AI is built on a carefully selected set of best-in-class third-party services, each serving a distinct and non-overlapping function in the product.

| Service | Role in VibeCheck AI | Auth |
| --- | --- | --- |
| OpenRouter | AI content review engine — tone analysis, compliance flagging, correction suggestion generation | API Key |
| OpenCV (Custom CV) | Image brand compliance checks — logo detection, color palette validation, visual consistency | API Key |
| Supabase | Primary database, user authentication, file storage, real-time workflow updates | API Key |
| Cloudinary | Upload, store, transform and serve brand assets — logos, images, documents with watermarking | API Key |
| Resend | Transactional email notifications for approvals, rejections, comments and workflow events | API Key |
| axe-core | Automated accessibility auditing — WCAG contrast, alt-text, readability checks | No key needed |
| Mammoth.js | Extract clean text from DOCX uploads for AI analysis without server-side conversion | No key needed |

⚡

Frontend React / Next.js, Tailwind CSS, real-time Supabase subscriptions

🗄️

Backend Supabase Edge Functions, Node.js API routes, PostgreSQL

🤖

AI Layer OpenRouter (LLM routing), structured JSON prompts, explainable output

🗂️

Storage Cloudinary for media, Supabase Storage for documents

📧

Notifications Resend for email, Supabase Realtime for in-app alerts

🔒

Auth and Security Supabase Auth (JWT, RLS), role-based access control, audit logging

07 — Supported Content Formats

## What VibeCheck AI can review

- Plain text: blog posts, copy blocks, headlines, taglines, descriptions
- DOCX documents: extracted via Mammoth.js for full-text AI analysis
- PDF documents: brand documents, campaign briefs, print-ready files
- Images (JPG, PNG, WebP): logo usage, color palette, font and visual consistency via OpenCV
- Social media posts: short-form copy, caption text, hashtags, ad copy
- Email campaigns: subject lines, preview text, body content, disclaimers

08 — Product Roadmap

## Build phases

1

Foundation — Auth, DB, Asset Upload

Weeks 1–2

Supabase setup (auth, DB schema, RLS policies). Cloudinary integration for asset uploads. User roles and permission model. Brand guidelines upload and storage. Basic dashboard shell.

2

AI Review Engine — Text and Documents

Weeks 3–4

OpenRouter integration with structured prompts for tone, terminology, and claim checking. Mammoth.js DOCX extraction pipeline. Explainable flagging output with severity levels. Side-by-side review UI with diff view.

3

Approval Workflow and Collaboration

Weeks 5–6

Submission queue with status tracking. Inline comments and threaded discussions. Approval signatures with timestamps. Resend email notifications for all workflow events. Revision history.

4

Visual Review and Accessibility

Weeks 7–8

OpenCV image brand-compliance checks. axe-core accessibility audit integration. Alt-text detection, contrast ratio scoring, readability analysis. Watermarked previews for non-authorised roles.

5

Analytics, Insights and Extended Features

Weeks 9–10

Governance dashboard with violation heatmaps, compliance scores, trend reports. Brand Guidelines Builder wizard. Chrome Extension MVP. Slack and Figma integrations. AI brand voice training module.

09 — Non-Functional Requirements

## Quality, security and compliance

- All AI review results must include a disclosure that AI was used in the analysis
- No content is auto-modified — every suggestion requires explicit human acceptance
- Row-level security (RLS) in Supabase ensures users only access content within their organisation
- All API keys stored server-side only; never exposed to the client
- Audit log captures every access, submission, approval, rejection and change — immutable
- WCAG 2.1 AA compliance for the platform UI itself, not just the content it reviews
- AI outputs treated as suggestions, not decisions — human review is non-negotiable in every workflow path
- Sensitive brand assets (unreleased campaigns, proprietary style guides) protected by role-gated access and watermarked previews

10 — Out of Scope (v1.0)

## What we're deferring

To keep the v1.0 delivery focused and shippable, the following are explicitly deferred to future versions:

- Native mobile apps (iOS and Android) — web-responsive is sufficient for v1.0
- Video content review — text, image, and document formats are prioritised first
- Multi-language guideline support and regional compliance flags
- Custom LLM fine-tuning on client brand voice — planned for v2.0
- HubSpot and Mailchimp native integrations — API-first approach enables these post-launch

VibeCheck AI

PRD v1.0 — Prepared by Inkloom AI — November 2026

Confidential — Internal Use Only