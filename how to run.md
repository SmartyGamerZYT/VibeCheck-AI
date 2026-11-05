# How to Run VibeCheck AI

This document provides step-by-step instructions for running and testing the **VibeCheck AI** brand governance platform locally.

---

## 1. Quick Start

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```

3. **Open in your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 2. Authentication & Multi-Company System

The platform features a multi-tenant authentication system where independent companies/admins can manage their own teams and brand guidelines:

### A. Register as an Admin (Create a Company)
1. On the sign-in screen, click **Create Account**.
2. Select the **ADMIN** role button.
3. Fill in your name, email, password, and **Company / Organization Name** (e.g. *Acme Innovations*).
4. Click **Create Account**.
5. Once registered, your unique **Admin Organization Key** (e.g. `ACME-4019`) will be generated.
6. You can view, copy, and manage this key anytime by clicking the **Settings** icon in the top right navbar or visiting the **Team & Org Key** tab in the sidebar.

### B. Register as Manager, Reviewer, or Creator (Join an Organization)
1. On the sign-in screen, click **Create Account**.
2. Select **CREATOR**, **REVIEWER**, or **MANAGER**.
3. Fill in your name, email, and password.
4. In the **Admin Organization Key** field, enter your Admin's key (e.g. demo key `LUMINA-8842` or the key generated when creating a new company).
5. The form will validate the key and show which company you are connecting to.
6. Once registered, you will be directly connected under that company's workspace!

### C. One-Click Demo Sign-In
On the login tab, quick 1-click demo accounts are available to test each role instantly:
- **Admin**: `admin@luminahealth.org`
- **Manager**: `elena@luminahealth.org`
- **Reviewer**: `julian@luminahealth.org`
- **Creator**: `maya@luminahealth.org`

---

## 3. Role-Specific Dashboards & Permissions

- **Admin Dashboard**:
  - Displays company overview and the **Organization Key**.
  - Roster of all connected team members (managers, reviewers, creators).
  - Configure company-wide brand guidelines, glossary, and verified claims.
  - View full audit logs and governance insights.

- **Manager Dashboard**:
  - Focuses on the **Sign-Off Queue**.
  - Review drafts submitted by creators.
  - Issue **Cryptographic Approval Sign-Offs** (with SHA-256 digital signature hashes) or request revisions.

- **Reviewer Dashboard**:
  - Review queue for inspecting assigned submissions.
  - Verify factual claims, check tone, and leave threaded comments.

- **Creator Dashboard**:
  - Clean Content Composer & DOCX document upload.
  - Run multi-factor AI scans via OpenRouter.
  - Inspect side-by-side diffs and accept/reject/modify smart suggestions.
  - Submit content to the approval queue.

---

## 4. Environment Keys

All API keys are configured in `.env.local` on the server:
- `OPENROUTER_API_KEY`: OpenRouter LLM content review & tone analysis
- `CLOUDINARY_URL`: Cloudinary media asset library with watermarking
- `RESEND_API_KEY`: Resend transactional email notifications for workflow events
- `SUPABASE_PUBLISHABLE_KEY`: Supabase integration
