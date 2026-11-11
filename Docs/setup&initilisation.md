# Setup, Initialization & Deployment Runbook — VibeCheck AI

## 1. Environment Prerequisites
Before installing VibeCheck AI, ensure your host environment meets the following specifications:
- **Node.js**: `v18.17.0` or higher (Node 20+ LTS strongly recommended).
- **Package Manager**: `npm` (v9+), `yarn` (v1.22+), or `pnpm` (v8+).
- **Operating System**: macOS, Linux (Ubuntu/Debian/Alpine), or Windows 10/11 (PowerShell/WSL2).
- **Hardware**: Minimum 4GB RAM (8GB+ recommended for local builds).

---

## 2. Step-by-Step Installation Guide

### Step 2.1: Clone the Repository
```bash
git clone https://github.com/your-org/vibecheck-ai.git
cd "VibeCheck AI"
```

### Step 2.2: Install NPM Dependencies
```bash
npm install
```
This installs core packages including Next.js 14, React 18, Tailwind CSS, Lucide React, and Mammoth.js.

### Step 2.3: Configure Environment Secrets
Create a `.env.local` file in the root workspace directory. This file is git-ignored and holds private credentials:

```env
# ==============================================================================
# VIBECHECK AI CORE CONFIGURATION
# ==============================================================================

# Application Display Name
NEXT_PUBLIC_APP_NAME="VibeCheck AI"

# OpenRouter API Key (Required for AI Review Engine & Audio Transcription)
# Obtain from https://openrouter.ai/keys
OPENROUTER_API_KEY="sk-or-v1-**********"

# Google Gemini API Key (Direct API integration)
# Obtain from https://aistudio.google.com/
GEMINI_API_KEY="****"

# Supabase Publishable Key (Authentication & Client RLS)
# Obtain from https://supabase.com/dashboard
SUPABASE_PUBLISHABLE_KEY="******"

# ==============================================================================
# OPTIONAL INTEGRATION KEYS
# ==============================================================================

# Cloudinary (Optional - Cloud asset hosting & optimization)
CLOUDINARY_CLOUD_NAME="******"
CLOUDINARY_API_KEY="******"
CLOUDINARY_API_SECRET="******"
CLOUDINARY_URL="********"

# Resend (Optional - Transactional email notifications)
# Obtain from https://resend.com/api-keys
RESEND_API_KEY="****"
```

---

## 3. Local Development Server
Execute the Next.js development server:
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) in your browser. The app will launch with Hot Module Replacement (HMR) enabled.

---

## 4. Production Build & Deployment

### Step 4.1: Production Build
```bash
npm run build
```
This triggers the Next.js production build pipeline:
1. Validates strict TypeScript types across all components and libraries.
2. Statically generates prerendered pages (`/`, `/_not-found`).
3. Compiles serverless API route handlers (`/api/*`).
4. Generates optimized bundle chunks with code splitting.

### Step 4.2: Start Production Server
```bash
npm run start
```
Starts the production server on port 3000 (or the port specified by `$PORT`).

### Step 4.3: Deploying to Vercel / Railway / AWS
- **Vercel**: Import the GitHub repository, set Framework Preset to **Next.js**, and add the environment variables from `.env.local`.
- **Docker**:
  ```dockerfile
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM node:20-alpine AS runner
  WORKDIR /app
  ENV NODE_ENV=production
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/.next/standalone ./
  COPY --from=builder /app/.next/static ./.next/static
  EXPOSE 3000
  CMD ["node", "server.js"]
  ```

---

## 5. Seed Accounts & Preconfigured Credentials

To test role interactions immediately, use these preconfigured demo profiles:

| Role | Email | Password | Organization | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@luminahealth.org` | `password123` | Lumina Health | Full governance, color tokens, ₹5k subscription, mistake meter |
| **Manager** | `elena@luminahealth.org` | `password123` | Lumina Health | Project timelines, final approval sign-off, SHA-256 seal |
| **Reviewer** | `julian@luminahealth.org` | `password123` | Lumina Health | Queue audit, inline comments, revision requests |
| **Creator** | `maya@luminahealth.org` | `password123` | Lumina Health | Document composer, DOCX import, AI review execution |
| **Admin (Acme)** | `admin@acme.com` | `password123` | Acme Corp | Demonstrates complete multi-tenant tenant isolation |
