# Authentication, Cryptographic Security & RBAC Runbook — VibeCheck AI

```
+========================================================================================+
|                        ENTERPRISE SECURITY & ACCESS CONTROL                            |
+========================================================================================+
| Identity Providers: Email/Password + Google OAuth 2.0 | Cryptographic Hash: SHA-256    |
| Tenancy Model: Isolated Admin Key Partitioning        | Subscription Seat: Rs 5,000/mo |
| Password Recovery: Self-Service Expiring Tokens       | Emojis: 0 (Strict ASCII/SVG)   |
+========================================================================================+
```

---

## 1. Authentication & Multi-Tenant RBAC Architecture

VibeCheck AI implements an enterprise Role-Based Access Control (RBAC) architecture separating duties between content creators, editorial reviewers, compliance managers, and organization administrators.

```mermaid
flowchart TD
    User([Incoming User Request]) --> AuthGate{"Authenticated Session?"}
    AuthGate -- "No" --> AuthModal["Auth Portal (Login / Google OAuth / Forgot Password)"]
    AuthGate -- "Yes" --> SubCheck{"Active Rs 5,000/mo Subscription?"}
    
    SubCheck -- "Lapsed & Non-Admin" --> Lockout["Service Suspension View (Contact Admin)"]
    SubCheck -- "Lapsed & Admin" --> RenewalBanner["Admin Renewal Gateway (Instant 1-Click Pay)"]
    SubCheck -- "Active" --> RoleRouter{"Tenant Role Matrix"}
    
    RoleRouter -- "Creator" --> CreatorView["Document Composer, DOCX Upload, AI Audit"]
    RoleRouter -- "Reviewer" --> ReviewerView["Queue Audit, Peer Comments, Revision Requests"]
    RoleRouter -- "Manager" --> ManagerView["Approval Queue, WebRTC Huddle, SHA-256 Seal"]
    RoleRouter -- "Admin" --> AdminView["Policy Engine, Accuracy Meter, Seat Management"]

    classDef gate fill:#1C1917,stroke:#C5A880,stroke-width:1.5px,color:#FBF8F3;
    classDef view fill:#141210,stroke:#78716C,stroke-width:1px,color:#E7E5E4;
    classDef alert fill:#2B1F08,stroke:#F59E0B,stroke-width:1.5px,color:#FBF8F3;
    class AuthGate,SubCheck,RoleRouter gate;
    class CreatorView,ReviewerView,ManagerView,AdminView view;
    class Lockout,RenewalBanner alert;
```

---

## 2. Google OAuth 2.0 & Identity Handshake Flow

```mermaid
sequenceDiagram
    autonumber
    participant User as Enterprise Member
    participant UI as VibeCheck Auth Dialog
    participant Google as Google Identity Provider (OAuth 2.0)
    participant Tenant as Local Tenancy Registry

    User->>UI: Clicks "Continue with Google"
    UI->>Google: Initialize OAuth 2.0 Authorization Flow (scope: email, profile)
    Google->>User: Displays Google Account Selector & Consent Screen
    User->>Google: Confirms Identity Verification
    Google-->>UI: Returns Verified ID Token & User Profile
    UI->>Tenant: Check if email exists in Organization Registry
    alt Existing Workspace Member
        Tenant-->>UI: Hydrate Session Token with Stored Role (Creator/Reviewer/Manager)
    else New Workspace Member
        UI->>User: Prompt for Organization Admin Key
        User->>UI: Submits 6-Character Admin Join Key
        Tenant-->>UI: Bind User to Organization with Creator Role
    end
    UI-->>User: Redirect to Active Editorial Dashboard
```

---

## 3. Self-Service Password Recovery Architecture

```mermaid
stateDiagram-v2
    [*] --> RequestModal: User Clicks "Forgot Password"
    RequestModal --> TokenGeneration: Enterprise Email Submitted
    TokenGeneration --> DispatchReset: Generate Cryptographic SHA-256 Token (60-Min Expiry)
    DispatchReset --> VerificationView: User Follows Reset Link
    VerificationView --> PasswordUpdate: Input New Password (Entropy >= 80 Bits)
    PasswordUpdate --> Finalize: Re-hash & Invalidate Prior Reset Tokens
    Finalize --> SuccessConfirmation: Update User Credentials
    SuccessConfirmation --> [*]: Log In with New Password
```

```
+---------------------------------------------------------------------------------------+
| PASSWORD SECURITY SPECIFICATION                                                       |
+---------------------------------------------------------------------------------------+
| Minimum Length: 8 Characters                 | Complexity: Mixed-case, numbers, symbol|
| Reset Token Lifetime: 60 Minutes (Expiring)   | Token Invalidation: Immediate on reset |
| Rate Limit: Max 3 reset requests per 15 mins  | Hashing Strategy: Salted PBKDF2/SHA-256|
+---------------------------------------------------------------------------------------+
```

---

## 4. Granular RBAC Permissions Matrix

```
+---------------------------------------------------------------------------------------+
| ACCESS CAPABILITY MATRIX                                                              |
+---------------------------------------------------------------------------------------+
| Capability / Feature Action           | Creator | Reviewer | Manager | Org Admin      |
+---------------------------------------+---------+----------+---------+----------------+
| Draft copy in Document Composer       | ALLOWED | ALLOWED  | ALLOWED | ALLOWED        |
| Upload DOCX and Media Creatives       | ALLOWED | ALLOWED  | ALLOWED | ALLOWED        |
| Execute AI Content & Media Audits     | ALLOWED | ALLOWED  | ALLOWED | ALLOWED        |
| Submit drafts to Editorial Queue      | ALLOWED | LOCKED   | LOCKED  | LOCKED         |
| Review queue submissions & comment    | LOCKED  | ALLOWED  | ALLOWED | ALLOWED        |
| Request revision & return to author   | LOCKED  | ALLOWED  | ALLOWED | ALLOWED        |
| Execute final approval & SHA-256 seal | LOCKED  | LOCKED   | ALLOWED | ALLOWED        |
| Launch WebRTC team review huddle      | LOCKED  | LOCKED   | ALLOWED | ALLOWED        |
| Calibrate tone sliders & claim bank   | LOCKED  | LOCKED   | LOCKED  | ALLOWED        |
| Inspect Organization Admin Key        | LOCKED  | LOCKED   | LOCKED  | ALLOWED        |
| Manage Rs 5,000/mo Subscription       | LOCKED  | LOCKED   | LOCKED  | ALLOWED        |
| View Member Mistake & Accuracy Meter  | LOCKED  | LOCKED   | LOCKED  | ALLOWED        |
+---------------------------------------------------------------------------------------+
```

---

## 5. Cryptographic Proof of Sign-Off (SHA-256)

When an executive Manager or Administrator approves a submission for public syndication, an immutable cryptographic digest is generated via the native Web Crypto API:

```mermaid
flowchart LR
    DocID["Submission ID"] --> Combiner["Canonical String Combiner"]
    DocText["Final Text Body"] --> Combiner
    AuthorEmail["Author Email"] --> Combiner
    SignerEmail["Approver Email"] --> Combiner
    Timestamp["ISO 8601 Timestamp"] --> Combiner

    Combiner --> DigestEngine["Web Crypto API (SHA-256)"]
    DigestEngine --> HashHex["Hexadecimal Hash Digest (64 Chars)"]
    HashHex --> CertSeal["Digital Publication Seal Stamp"]
```

#### Cryptographic Hash Implementation
```typescript
/**
 * Generates an immutable SHA-256 audit digest for approved publications.
 */
export async function generateDocumentSeal(
  submissionId: string,
  title: string,
  content: string,
  authorEmail: string,
  approverEmail: string
): Promise<string> {
  const timestamp = new Date().toISOString();
  const canonicalPayload = [
    submissionId,
    title.trim(),
    content.trim(),
    authorEmail.toLowerCase(),
    approverEmail.toLowerCase(),
    timestamp
  ].join('::');

  const msgBuffer = new TextEncoder().encode(canonicalPayload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
```

---

## 6. Commercial Subscription Paywall Architecture (₹5,000 / month)

```
+---------------------------------------------------------------------------------------+
| TENANT BILLING TOPOLOGY                                                               |
+---------------------------------------------------------------------------------------+
| Billing Model: Single-Tier Company License ($60 / Rs 5,000 per month)                 |
| Payer: Organization Administrator ONLY (Single checkout for unlimited team seats)     |
| Guest / Member Model: Team members join 100% free using the tenant's adminKey         |
+---------------------------------------------------------------------------------------+
```

### Lapsed Subscription State Enforcement

```mermaid
flowchart TD
    Req["Member Attempts Action"] --> StatusCheck{"Check org.subscriptionStatus"}
    StatusCheck -- "active" --> Execute["Allow Action Execution"]
    StatusCheck -- "past_due / unpaid" --> UserRole{"Member Role?"}
    UserRole -- "Creator / Reviewer / Manager" --> SuspensionModal["Show Service Suspension Dialog<br/>'Please contact Admin to renew Rs 5,000/mo plan'"]
    UserRole -- "Admin" --> AdminPaymentGateway["Display Instant Renewal Gateway<br/>'Renew Workspace Access for Rs 5,000'"]
```

---

## 7. Data Privacy, Cookie Governance & Git Shielding

- **Explicit Consent**: First-visit banner requires affirmative selection between *"Accept All"* and *"Essential Only"*, persisted in `vibecheck_cookie_consent`.
- **Zero AI Training Retention**: Upstream OpenRouter and Gemini API calls are transmitted with stateless privacy headers ensuring corporate drafts are never absorbed into training corpuses.
- **Git Shielding Policy**: All `.env`, `.env.local`, and API keys are barred from version control via automated `.gitignore` rules.
