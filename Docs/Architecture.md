# System Architecture & Technical Specifications — VibeCheck AI

## 1. High-Level Architecture Overview
VibeCheck AI is built on the **Next.js 14 App Router** combining React Server Components (RSC), Client Components (`'use client'`), Node.js Route Handlers, and WebRTC peer-to-peer real-time communication.

```mermaid
graph TD
    Client[Browser Client - React 18] -->|HTTPS Requests| NextServer[Next.js 14 App Router Engine]
    
    subgraph Client Application Layer
        Page[src/app/page.tsx Orchestrator] --> Nav[Navbar Component]
        Page --> Side[Sidebar Navigation]
        Page --> Views[Role Views & Feature Modules]
        Views --> Collab[Collaboration Hub & WebRTC Engine]
        Views --> ReviewEngine[Review Engine & DOCX Importer]
        Views --> MediaAudit[Media Governance & Audio/Video]
        Views --> Dash[Role Dashboard & Admin Mistake Tracker]
        Views --> Analytics[Governance Insights Analytics]
        Page --> Modals[Legal, Checkout & Settings Modals]
    end

    subgraph API Route Handlers
        NextServer --> RouteReview[/api/review]
        NextServer --> RouteTranscribe[/api/transcribe-audio]
        NextServer --> RouteVision[/api/review-image]
        NextServer --> RouteDocx[/api/extract-docx]
        NextServer --> RouteUpload[/api/upload]
        NextServer --> RouteNotify[/api/notify]
    end

    subgraph External Infrastructure
        RouteReview --> OpenRouter[OpenRouter AI Gateway]
        RouteTranscribe --> OpenRouter
        RouteUpload --> Cloudinary[Cloudinary Media CDN]
        RouteNotify --> Resend[Resend Transactional Mail]
        Collab <-->|WebRTC Streams| PeerClient[Peer Clients]
    end
```

---

## 2. Multi-Tenant Organization Data Isolation
A core architectural requirement of VibeCheck AI is strict multi-tenant boundary enforcement:

### 2.1 The Tenancy Model
Every persistent entity is bound to an `orgId`:
- `UserAccount.orgId`
- `Project.orgId`
- `ContentSubmission.orgId`
- `AuditLogEntry.orgId`
- `TeamChangeRecord.projectId` (linked via `Project.orgId`)
- `MemberMistakeRecord.orgId`

### 2.2 Client-Side Partitioning Pipeline
In `src/app/page.tsx`, the active organization is resolved from the logged-in session:
```ts
const currentOrg = currentUser
  ? organizations.find((o) => o.id === currentUser.orgId) || fallbackOrg
  : organizations[0];

// Memoized tenant partitions
const orgTeamMembers = useMemo(
  () => accounts.filter((a) => a.orgId === currentOrg.id),
  [accounts, currentOrg.id]
);

const orgProjects = useMemo(
  () => projects.filter((p) => p.orgId === currentOrg.id),
  [projects, currentOrg.id]
);

const orgSubmissions = useMemo(
  () => submissions.filter((s) => s.orgId === currentOrg.id),
  [submissions, currentOrg.id]
);

const orgChangeRecords = useMemo(() => {
  const orgProjIds = new Set(orgProjects.map((p) => p.id));
  return changeRecords.filter((c) => orgProjIds.has(c.projectId));
}, [changeRecords, orgProjects]);
```
This guarantees that when Organization B logs in, they see zero projects, zero submissions, and zero team members from Organization A.

---

## 3. WebRTC Collaboration & Live Screen Share Architecture

### 3.1 Signaling & Handshake
To eliminate external socket dependencies in standard deployments, VibeCheck AI uses a hybrid signaling bus:
- Multi-Tab & Multi-Client synchronization via `window.addEventListener('storage')` and broadcast custom events (`vibecheck_call_invite`, `vibecheck_screen_share_update`).
- Explicit invitation protocol: Host starts call $\to$ emits invite to target member $\to$ target member receives modal popup $\to$ accepts $\to$ peer connection activated.

### 3.2 Media Stream Pipeline
- Camera & Mic: Captured via `navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 1280, height: 720 } })`.
- Screen Share: Captured via `navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' }, audio: false })`.
- Stream Lifecycle Management:
  ```ts
  const stopAllTracks = (stream: MediaStream | null) => {
    if (!stream) return;
    stream.getTracks().forEach((track) => {
      track.stop();
      track.enabled = false;
    });
  };
  ```
- Screen video elements are bound via `srcObject` with fallback to native element renderers.

---

## 4. Cryptographic Non-Repudiation Architecture (SHA-256)
When an authorized Manager or Admin approves content:
1. Canonical serialization:
   $$\text{Payload} = \text{submissionId} \parallel \text{orgId} \parallel \text{title} \parallel \text{currentText} \parallel \text{author.email} \parallel \text{signerEmail} \parallel \text{timestamp}$$
2. Cryptographic digest:
   $$\text{Hash} = \text{SHA-256}(\text{Payload})$$
3. The resulting 64-character hexadecimal digest is attached to the record and permanently recorded in `auditLogs`. Any alteration to approved text invalidates the cryptographic hash.

---

## 5. Security & Secret Isolation
- Environment keys (`OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `CLOUDINARY_*`, `RESEND_*`) reside strictly in `.env.local` on the server runtime.
- The root `.gitignore` file enforces exclusion of all `.env*` files, preventing accidental exposure to GitHub.
- Client components access external AI services exclusively through intermediate Route Handlers (`/api/*`), never exposing raw API keys to browser devtools.
