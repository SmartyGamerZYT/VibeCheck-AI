# UI/UX Design System & Style Guide — VibeCheck AI

## 1. Aesthetic Identity: "Sandstone & Bronze"
VibeCheck AI rejects cold, sterile corporate aesthetics in favor of a warm, humanistic editorial identity known as **Sandstone & Bronze**. This aesthetic reflects durability, wisdom, and timeless publishing authority while retaining cutting-edge technical precision.

---

## 2. Color Palette & Design Tokens

### 2.1 Sandstone Neutral Scale
Used for structural surfaces, cards, borders, and body text:

```css
:root {
  --sand-50:  #FAF8F5; /* Main application background */
  --sand-100: #F5F1EB; /* Inset panels, table alternate rows */
  --sand-200: #E8DFD3; /* Card borders, dividers, subtle outlines */
  --sand-300: #D9CCA7; /* Active card borders, input borders */
  --sand-400: #BFA97D; /* Subdued icons, disabled state */
  --sand-500: #9C8561; /* Bronze secondary accents, badge labels */
  --sand-600: #7D6846; /* Metadata, supporting descriptions */
  --sand-700: #5F4E34; /* Secondary body, table headers */
  --sand-800: #4B3D27; /* Emphasized section headers */
  --sand-900: #3C311F; /* Primary buttons, active tabs */
  --sand-950: #1A160E; /* Main high-contrast text */
}
```

### 2.2 Semantic Status System
Color tokens mapped strictly to governance states:
- **Compliance Optimal (Emerald)**:
  - Text: `text-emerald-800` (`#065F46`)
  - Background: `bg-emerald-50` (`#ECFDF5`)
  - Border: `border-emerald-200` (`#A7F3D0`)
  - Meaning: Score $\ge 85\%$, certified claim, zero violations.
- **Review Attention (Amber)**:
  - Text: `text-amber-800` (`#92400E`)
  - Background: `bg-amber-50` (`#FFFBEB`)
  - Border: `border-amber-200` (`#FDE68A`)
  - Meaning: Score $70-84\%$, minor tone drift, unverified claim requiring review.
- **Critical Violation (Rose)**:
  - Text: `text-rose-800` (`#9F1239`)
  - Background: `bg-rose-50` (`#FFF1F2`)
  - Border: `border-rose-200` (`#FECDD3`)
  - Meaning: Score $< 70\%$, competitor mention lockout, exaggerated claim (`RULE-CLAIM-EXCESS`).
- **Cryptographic & Tech (Indigo/Purple)**:
  - Text: `text-indigo-800` (`#3730A3`)
  - Background: `bg-indigo-50` (`#EEF2FF`)
  - Border: `border-indigo-200` (`#C7D2FE`)
  - Meaning: SHA-256 signatures, WebRTC call status, API key tokens.

---

## 3. Typography Architecture

### 3.1 Font Stacks
1. **Editorial Serif (`font-serif`)**:
   - `Playfair Display`, `Georgia`, `serif`
   - Role: Main application headings, modal hero titles, brand score percentages, cryptographic headers.
2. **UI Sans-Serif (`font-sans`)**:
   - `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`
   - Role: Body prose, button labels, form inputs, tooltips, navigation menus.
3. **Technical Monospace (`font-mono`)**:
   - `JetBrains Mono`, `ui-monospace`, `SFMono-Regular`, `Consolas`, `monospace`
   - Role: WPM indicators, LUFS decibels, SHA-256 hashes, timestamps, word counters.

### 3.2 Responsive Type Scale
| Tailwind Class | Font Size | Line Height | Typical Usage |
| :--- | :--- | :--- | :--- |
| `text-2xl` | `1.5rem` (24px) | `2rem` (32px) | Dashboard greeting, primary modal headers |
| `text-xl` | `1.25rem` (20px) | `1.75rem` (28px) | Section headers, card group titles |
| `text-lg` | `1.125rem` (18px) | `1.75rem` (28px) | Project title banner, submission headline |
| `text-base` | `1rem` (16px) | `1.5rem` (24px) | Document body preview, primary dialog copy |
| `text-xs` | `0.75rem` (12px) | `1rem` (16px) | Table cells, form labels, input values |
| `text-[11px]` | `0.6875rem` (11px) | `0.875rem` (14px)| Metadata badges, timestamp chips |
| `text-[10px]` | `0.625rem` (10px) | `0.75rem` (12px) | Uppercase category pills, delta counters |

---

## 4. Component Design Patterns & Behaviors

### 4.1 Card Elevation & Surfaces
- Master cards use `rounded-2xl` (16px radius) with `border border-sand-300` and `bg-white` or `bg-sand-50/70`.
- Sub-cards (e.g. milestone items, issue items) use `rounded-xl` (12px radius) with `border border-sand-200`.
- Shadows are restrained (`shadow-xs` or `shadow-sm`) to maintain an editorial print feel rather than heavy 3D skeuomorphism.

### 4.2 Inputs, Textareas & Empty State Principles
- **No Pre-Filled Mock Text**: All editor fields, title inputs, and channel inputs start strictly empty.
- **Descriptive Placeholders**: High-contrast placeholders (`placeholder="Enter document title (e.g. Q4 Launch Announcement)..."`) provide clear instructional scaffolding.
- **Focus Rings**: Smooth `transition-all` with `focus:ring-2 focus:ring-[#3C311F] focus:outline-none`.

### 4.3 Persistent Footer Pattern
- The footer stays anchored at the bottom of the viewport/container (`mt-auto`).
- Features centered or distributed flex layout with copyright on the left and clickable legal links on the right.
- Text uses `text-xs text-sand-600` with subtle hover transitions (`hover:text-sand-950`).

### 4.4 Accessibility (WCAG 2.1 AAA) Standards
- Minimum body text contrast ratio: **$7:1$** against background.
- Focus rings are mandatory on all interactive elements for keyboard navigation (`Tab` / `Shift+Tab`).
- Screen reader accessibility labels (`aria-label`) are assigned to all icon-only buttons.
