# REST API Reference & Route Handlers Specification — VibeCheck AI

## 1. Overview & Architecture
All VibeCheck AI backend services are exposed via Next.js 14 App Router Route Handlers (`src/app/api/*/route.ts`). Responses adhere strictly to the JSON API specification with standard HTTP status codes.

---

## 2. API Endpoints

### 2.1 Content Audit Review
- **Route**: `POST /api/review`
- **Description**: Evaluates text drafts against organizational tone parameters, approved claims, and prohibited competitor terms using multi-agent LLMs.
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "content": "Our metabolic program is 100% risk-free and offers a miracle cure within 48 hours. Unlike OmniCare Health, we are cheap.",
    "guidelines": {
      "brandName": "Lumina Health",
      "toneParameters": {
        "formality": 75,
        "seriousness": 80,
        "boldness": 60
      },
      "approvedClaims": [
        {
          "id": "cl_1",
          "claim": "34% reduction in acute symptom flares within 90 days.",
          "citation": "New England Journal of Medicine, Nov 2024"
        }
      ],
      "prohibitedTerms": ["miracle cure", "cheap", "100% guaranteed"],
      "competitorMentions": ["OmniCare Health"]
    },
    "format": "ad_copy",
    "channel": "LinkedIn & Social",
    "apiKey": "sk-or-v1-optional-user-key"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "result": {
      "overallScore": 58,
      "summary": "Content contains critical medical claim exaggerations and prohibited competitor citations.",
      "issues": [
        {
          "id": "iss_1",
          "category": "claims",
          "severity": "critical",
          "guidelineRef": "RULE-CLAIM-EXCESS",
          "message": "Claim 'miracle cure within 48 hours' exceeds certified clinical claim repository.",
          "flaggedText": "miracle cure within 48 hours",
          "suggestion": "clinically validated metabolic management",
          "status": "pending"
        },
        {
          "id": "iss_2",
          "category": "competitor",
          "severity": "major",
          "guidelineRef": "RULE-COMPETITOR-LOCKOUT",
          "message": "Direct citation of rival entity 'OmniCare Health' is prohibited by competitor lockout policy.",
          "flaggedText": "Unlike OmniCare Health",
          "suggestion": "Compared to legacy clinical programs",
          "status": "pending"
        }
      ],
      "rewrittenText": "Our metabolic health program offers clinically validated management backed by peer-reviewed clinical research. Compared to legacy clinical programs, our care is accessible and affordable for all patients."
    }
  }
  ```

---

### 2.2 Audio Speech Transcription
- **Route**: `POST /api/transcribe-audio`
- **Description**: Verbatim speech-to-text transcription powered directly by OpenRouter AI speech models (`google/gemini-2.5-flash`, `google/gemini-2.0-flash-001`).
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "audioBase64": "UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA...",
    "mimeType": "audio/mp3",
    "apiKey": "sk-or-v1-optional-override-key"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "transcript": "Thank you for joining today. Our preliminary clinical trials demonstrated a significant improvement across member metabolic metrics, with high patient satisfaction and zero adverse reactions reported."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{ "error": "Missing audio data" }`
  - `401 Unauthorized`: `{ "error": "OpenRouter API key is missing. Please configure OPENROUTER_API_KEY in .env.local or Settings." }`

---

### 2.3 Computer Vision Image Analysis
- **Route**: `POST /api/review-image`
- **Description**: Analyzes visual assets for palette alignment, stock watermark presence, and WCAG contrast.
- **Request Body**:
  ```json
  {
    "imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "guidelines": {
      "colorPalette": {
        "primary": "#3C311F",
        "secondary": "#9C8561",
        "accent": "#065F46"
      }
    }
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "result": {
      "paletteScore": 92,
      "contrastRatio": 8.6,
      "contrastAAA": true,
      "stockWatermarkDetected": false,
      "dominantColors": ["#3C311F", "#FAF8F5", "#9C8561"],
      "flags": []
    }
  }
  ```

---

### 2.4 Document Extraction
- **Route**: `POST /api/extract-docx`
- **Description**: Extracts plain text from Microsoft Word (`.docx`) binary files via Mammoth.js.
- **Request Body**: `multipart/form-data` containing `file` parameter.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "text": "Lumina Health Q4 Clinical Strategy Summary...\n\n1. Executive Summary\nOur ongoing randomized controlled trials...",
    "fileName": "Q4_Clinical_Summary.docx"
  }
  ```

---

### 2.5 Email Alerts Notification
- **Route**: `POST /api/notify`
- **Description**: Dispatches transactional editorial notifications via Resend API.
- **Request Body**:
  ```json
  {
    "to": "elena@luminahealth.org",
    "subject": "VibeCheck AI: Revision Requested on 'Q4 Clinical Brief'",
    "html": "<p>Reviewer Julian Vance has requested revisions on your draft.</p>"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "id": "email_msg_98127391823"
  }
  ```
