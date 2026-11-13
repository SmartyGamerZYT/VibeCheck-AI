# Multi-Agent Intelligence Architecture & Prompt Engineering — VibeCheck AI

```
+========================================================================================+
|                       MULTI-AGENT INTELLIGENCE GOVERNANCE SUITE                        |
+========================================================================================+
| Architecture: Heterogeneous Agent Ensemble      | Aggregation: Weighted Consensus      |
| Parallel Tier: 6 Inspection Sub-Agents          | Fallback: Deterministic Regex Rules  |
| Max Latency Budget: < 2,400ms                   | Output Schema: Strict JSON / RFC-8259|
+========================================================================================+
```

---

## 1. Multi-Agent Philosophy & Orchestration Flow

Rather than relying on a fragile, monolithic prompt that hallucinates or dilutes domain nuance, VibeCheck AI routes incoming drafts through an ensemble of six specialized, sandboxed sub-agents. Each agent inspects a single governance dimension, producing structured findings that are consolidated by a mathematical consensus engine.

```mermaid
flowchart TD
    DraftInput["Raw Content Input (.docx / plain text / audio transcript)"] --> Orchestrator["Master Orchestrator Agent (Tokenization & Routing)"]
    
    subgraph Parallel Inspection Tier [Parallel Inspection Tier - Isolated Workers]
        Orchestrator --> AgentClaims["Claim Verification Agent<br/>(approvedClaims Database)"]
        Orchestrator --> AgentGrammar["Grammar & Linguistic Agent<br/>(Syntax & Style Polisher)"]
        Orchestrator --> AgentTone["Tone Calibration Agent<br/>(Tri-Axis Voice Registry)"]
        Orchestrator --> AgentSafety["Brand Safety & Filter Agent<br/>(Toxicity & Risk Blocker)"]
        Orchestrator --> AgentLockout["Competitor & Glossary Agent<br/>(Forbidden Names / Terminology)"]
        Orchestrator --> AgentCV["Computer Vision & Contrast Agent<br/>(Canvas WCAG 2.1 AAA)"]
    end

    AgentClaims --> Aggregator["Consensus & Scoring Aggregation Engine"]
    AgentGrammar --> Aggregator
    AgentTone --> Aggregator
    AgentSafety --> Aggregator
    AgentLockout --> Aggregator
    AgentCV --> Aggregator

    Aggregator --> OutputCard["Normalized Compliance Scorecard (0-100)"]
    Aggregator --> DiffStream["Structured Token Diff Stream (Accepted/Rejected)"]

    classDef orch fill:#1C1917,stroke:#C5A880,stroke-width:2px,color:#FBF8F3;
    classDef worker fill:#141210,stroke:#78716C,stroke-width:1px,color:#E7E5E4;
    classDef output fill:#1A261D,stroke:#4ADE80,stroke-width:1.5px,color:#E6EDF3;
    class Orchestrator orch;
    class AgentClaims,AgentGrammar,AgentTone,AgentSafety,AgentLockout,AgentCV worker;
    class Aggregator,OutputCard,DiffStream output;
```

---

## 2. Multi-Agent Orchestration Sequence

```mermaid
sequenceDiagram
    autonumber
    participant Client as Editorial Client
    participant Orch as Master Orchestrator
    participant Worker as Parallel Agent Tier (6 Nodes)
    participant Engine as Consensus Aggregator
    participant Seal as Digital Seal Engine

    Client->>Orch: POST /api/review { content, brandGuidelines, mode }
    Orch->>Orch: Normalize Text & Extract Semantic Chunks
    par Parallel Agent Dispatch
        Orch->>Worker: Dispatch to Claim Verification Agent
        Orch->>Worker: Dispatch to Grammar & Syntax Agent
        Orch->>Worker: Dispatch to Tone Calibration Agent
        Orch->>Worker: Dispatch to Brand Safety Agent
        Orch->>Worker: Dispatch to Competitor Lockout Agent
        Orch->>Worker: Dispatch to Computer Vision Agent
    end
    Worker-->>Engine: Stream Structured Issue Payloads
    Engine->>Engine: Resolve Conflicting Suggestions & De-duplicate
    Engine->>Engine: Calculate Weighted Penalty Score (100 - Sum of Deductions)
    alt Zero Critical Issues
        Engine->>Seal: Authorize Publication & Stamp Candidate Hash
    else Unresolved Critical Violations
        Engine->>Engine: Set status = 'blocked' (Lock Manager Approval)
    end
    Engine-->>Client: Return RFC-8259 Compliant JSON Response
```

---

## 3. Specialized Agent Specifications Card Deck

### Agent 1: Claim Verification Auditor (`RULE-CLAIM-EXCESS`)

```
+---------------------------------------------------------------------------------------+
| AGENT PROFILE: CLAIM VERIFICATION AUDITOR                                             |
+---------------------------------------------------------------------------------------+
| Target Domain: Quantitative, Scientific, Medical, & Financial Assertions              |
| Execution Priority: P0 (Critical Publication Blocker)                                 |
| Penalty Impact: -15% per unverified assertion                                         |
+---------------------------------------------------------------------------------------+
```

```json
{
  "agent_id": "auditor_claims",
  "system_mandate": "Cross-reference every quantitative assertion, performance promise, and scientific statistic against the tenant's approvedClaims whitelist. Any metric without exact citation must be flagged with severity: critical.",
  "parameters": {
    "temperature": 0.1,
    "max_tokens": 1024,
    "strict_mode": true
  },
  "input_schema": {
    "claims_database": ["string"],
    "content_chunk": "string"
  },
  "output_schema": {
    "flagged_claims": [
      {
        "claimed_metric": "string",
        "citation_status": "verified | unverified | exaggerated",
        "suggested_citation": "string",
        "severity": "critical"
      }
    ]
  }
}
```

---

### Agent 2: Grammar & Linguistic Polishing Agent (`RULE-SYNTAX-POLISH`)

```
+---------------------------------------------------------------------------------------+
| AGENT PROFILE: GRAMMAR & LINGUISTIC POLISHING AGENT                                   |
+---------------------------------------------------------------------------------------+
| Target Domain: International Business English, Syntax, Tense, & Idiomatic Precision   |
| Execution Priority: P2 (Editorial Excellence)                                         |
| Penalty Impact: -3% per syntax or typographical defect                                |
+---------------------------------------------------------------------------------------+
```

```json
{
  "agent_id": "auditor_linguistics",
  "system_mandate": "Act as an executive copy editor. Detect irregular verb inflections (e.g., 'decides to went' -> 'decided to go'), subject-verb number mismatches, dangling participles, and ambiguous pronoun references without flattening the author's personal voice.",
  "parameters": {
    "temperature": 0.2,
    "max_tokens": 1500
  },
  "rules_evaluated": [
    "Subject-Verb Agreement",
    "Irregular Past Tense Consistency",
    "Oxford Comma Enforcement",
    "Hyphenation of Compound Modifiers"
  ]
}
```

---

### Agent 3: Tone Calibration Agent (`RULE-TONE-DRIFT`)

```
+---------------------------------------------------------------------------------------+
| AGENT PROFILE: TONE CALIBRATION AGENT                                                 |
+---------------------------------------------------------------------------------------+
| Target Domain: Multidimensional Voice Governance (Formality, Seriousness, Boldness)   |
| Execution Priority: P1 (Brand Identity Alignment)                                     |
| Penalty Impact: -8% per out-of-bounds register violation                              |
+---------------------------------------------------------------------------------------+
```

```mermaid
graph LR
    subgraph Axis 1: Formality
        F0["0: Conversational / Casual"] <--> F100["100: Academic / Institutional"]
    end
    subgraph Axis 2: Seriousness
        S0["0: Playful / Witty"] <--> S100["100: Regulated / Solemn"]
    end
    subgraph Axis 3: Boldness
        B0["0: Understated / Neutral"] <--> B100["100: Disruptive / Authoritative"]
    end
```

---

### Agent 4: Brand Safety & Toxicity Filter (`RULE-BRAND-SAFETY`)

```
+---------------------------------------------------------------------------------------+
| AGENT PROFILE: BRAND SAFETY & TOXICITY FILTER                                         |
+---------------------------------------------------------------------------------------+
| Target Domain: Profanity, Hate Speech, Sexually Suggestive Copy, Aggressive Metaphors |
| Execution Priority: P0 (Enterprise Risk Blocker)                                      |
| Penalty Impact: -15% per violation                                                    |
+---------------------------------------------------------------------------------------+
```

- **Interceptor Matrix**:
  - Flags violent corporate rhetoric (*e.g., "killing our competitors", "take no prisoners"*).
  - Intercepts exclusionary language, demographic biases, and insensitive slang.
  - Generates safe executive alternatives preserving original persuasive intent.

---

### Agent 5: Competitor & Glossary Lockout Agent (`RULE-COMPETITOR-LOCKOUT`)

```
+---------------------------------------------------------------------------------------+
| AGENT PROFILE: COMPETITOR & GLOSSARY LOCKOUT AGENT                                    |
+---------------------------------------------------------------------------------------+
| Target Domain: Trademark Mentions, Forbidden Nomenclature, Brand Glossary Standards    |
| Execution Priority: P1 (Major Infraction)                                             |
| Penalty Impact: -8% per unauthorized mention                                          |
+---------------------------------------------------------------------------------------+
```

| Source Mention (Forbidden) | Replacement (Approved Brand Voice) | Rule Trigger |
| :--- | :--- | :--- |
| `Salesforce` / `HubSpot` | *Leading enterprise CRM solutions* | `RULE-COMPETITOR-LOCKOUT` |
| `customer` / `client` | *Member* or *Partner* | `RULE-GLOSSARY-MANDATE` |
| `drug` / `medication` | *Therapeutic candidate* | `RULE-GLOSSARY-MANDATE` |
| `cheap` / `low-cost` | *Capital-efficient* or *Value-optimized* | `RULE-TONE-ELEVATION` |

---

### Agent 6: Computer Vision & Visual Contrast Agent (`RULE-CV-CONTRAST`)

```
+---------------------------------------------------------------------------------------+
| AGENT PROFILE: COMPUTER VISION & CONTRAST AGENT                                       |
+---------------------------------------------------------------------------------------+
| Target Domain: Text-on-Image Legibility, Visual Hierarchy, WCAG 2.1 AAA Compliance    |
| Execution Priority: P1 (Accessibility & Asset Compliance)                             |
| Mathematical Model: Canvas Pixel Relative Luminance Sampling                          |
+---------------------------------------------------------------------------------------+
```

- **Formula Implementation**:
  $$\text{Relative Luminance } L = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B$$
  $$\text{Contrast Ratio} = \frac{L_{\text{lighter}} + 0.05}{L_{\text{darker}} + 0.05}$$
- **Threshold**: Requires $\ge 7:1$ for WCAG 2.1 AAA level compliance. Any text overlay falling under $4.5:1$ is automatically flagged with background scrim recommendations.

---

## 4. Consensus & Mathematical Scoring Aggregation

The composite Brand Compliance Score ($S$) is derived using a bounded penalty deduction model:

$$S = \max\left(0, 100 - \sum_{i=1}^{m} w(\text{severity}_i) \cdot c_i\right)$$

Where $c_i \in [0.5, 1.0]$ represents the agent's confidence factor, and weights are partitioned as follows:

| Severity Level | Base Penalty Weight ($w$) | Blocking Behavior | Remediation SLA |
| :--- | :--- | :--- | :--- |
| **Critical** | **-15%** | Hard-blocks publication seal generation | Immediate fix required |
| **Major** | **-8%** | Requires Manager manual override to publish | Review before staging |
| **Minor** | **-3%** | Advisory warning; does not block signing | Optional polish |

```
+---------------------------------------------------------------------------------------+
| SAMPLE SCORING EVALUATION RUN                                                         |
+---------------------------------------------------------------------------------------+
| Base Score: 100.0%                                                                    |
| - 1 Critical Violation (Unverified 40% ROI Claim): -15.0%                             |
| - 1 Major Violation (Competitor Name Mentioned):   -8.0%                              |
| - 2 Minor Violations (Irregular Past Tense):       -6.0%                              |
| ------------------------------------------------------------------------------------- |
| Net Compliance Score: 71.0% [NEEDS REVISION]                                          |
+---------------------------------------------------------------------------------------+
```

---

## 5. Agent State Transition Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Worker Spawned
    Idle --> Ingestion: Task Dispatched from Orchestrator
    Ingestion --> Tokenizing: Parse Text Chunks & Guidelines
    Tokenizing --> Evaluating: Execute System Prompt Guardrails
    Evaluating --> ConflictResolution: Intercept Overlapping Spans
    ConflictResolution --> PayloadEmit: Format JSON RFC-8259
    PayloadEmit --> [*]: Return to Aggregator
```

---

## 6. Performance & SLA Benchmarks

| Metric | Target SLA | Measured P95 | Fallback Mechanism |
| :--- | :--- | :--- | :--- |
| **Chunk Analysis Latency** | $< 1,200\text{ms}$ | $840\text{ms}$ | Parallel chunk sharding |
| **Complete Document Audit** | $< 2,500\text{ms}$ | $1,890\text{ms}$ | Early exit on critical safety breach |
| **JSON Schema Conformance** | $100\%$ | $100\%$ | Zod validation with retry loop |
| **Memory Footprint** | $< 128\text{MB}$ | $42\text{MB}$ | Stateless serverless execution |
