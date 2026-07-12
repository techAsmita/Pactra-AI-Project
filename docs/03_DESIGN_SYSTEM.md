# 03 — Design System
**Pactra: Founder Decision Intelligence Platform**
*Version 1.0 — Pending Architect Review*

---

## Purpose

This document defines Pactra's complete visual language.

It is not a style guide.

It is the source of truth for every visual decision across the application.

Every page, component, animation, and interaction must follow these rules.

Consistency takes priority over creativity.

If a visual decision conflicts with this document, this document wins.

---

## Design Philosophy

Pactra is not a flashy AI demo.

It is a premium SaaS product built for startup founders making high-impact business decisions.

The interface should feel:

- Calm
- Premium
- Intentional
- Intelligent
- Trustworthy

The design should inspire confidence rather than excitement.

**Reference products:**
- Linear
- Stripe Dashboard
- Notion
- Vercel Dashboard
- Raycast
- Cursor IDE

**Avoid visual inspiration from:**
- Cyberpunk dashboards
- Neon hacker interfaces
- Crypto trading terminals
- Overly gamified UIs
- Glassmorphism-heavy designs

---

## Visual Identity

Primary feeling:

> "I trust this product with an important business decision."

Every screen should reinforce professionalism.

White space is preferred over visual density.

Animation is preferred over decoration.

Information hierarchy is preferred over visual complexity.

---

## Layout System

**Desktop Container**
- Max Width: 1440px
- Content Width: 1280px
- Center aligned

**Grid**
- 12-column grid
- 24px gutters
- 80px outer margins

**Spacing Scale**

| Token | Value |
|---|---|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 20px |
| space-6 | 24px |
| space-8 | 32px |
| space-10 | 40px |
| space-12 | 48px |
| space-16 | 64px |
| space-20 | 80px |
| space-24 | 96px |

Only use values from this scale. Never invent spacing.

---

## Border Radius

| Element | Value |
|---|---|
| Buttons | 12px |
| Cards | 20px |
| Input Fields | 14px |
| Modal | 24px |
| Drawer | 24px |
| Badges | 999px (pill) |

Never mix random radius values.

---

## Color Palette

### Background

| Token | Value |
|---|---|
| bg-primary | #0B1020 |
| bg-secondary | #121A2B |
| bg-surface | #182235 |
| bg-card-hover | #1F2B42 |

### Primary Brand

| Token | Value |
|---|---|
| indigo-default | #6366F1 |
| indigo-hover | #7C83FF |
| indigo-pressed | #5558E8 |

### Semantic Colors

| Token | Value | Usage |
|---|---|---|
| emerald | #10B981 | Accent, success actions |
| amber | #F59E0B | Warning, NEGOTIATE, WAIT |
| crimson | #EF4444 | Error, danger, ESCALATE |
| green | #22C55E | Success, SIGN |

### Text

| Token | Value |
|---|---|
| text-primary | #F8FAFC |
| text-secondary | #CBD5E1 |
| text-muted | #94A3B8 |
| text-disabled | #64748B |

### Border

| Token | Value |
|---|---|
| border-default | #243047 |
| border-hover | #334155 |
| border-focus | #6366F1 (Indigo) |

---

## Decision & Risk Tags

### Decision Outcomes

| Label | Color | Rationale |
|---|---|---|
| SIGN | Green (#22C55E) | Positive. Clear to proceed. |
| NEGOTIATE | Amber (#F59E0B) | Caution. Action required before signing. |
| WAIT | Indigo (#6366F1) | Neutral pause. Gather more information. |
| ESCALATE | Crimson (#EF4444) | High risk. Seek legal counsel. |

**Note:** WAIT uses Indigo (primary brand color) rather than a separate blue. This keeps the palette within defined tokens and reserves blue-family hues for brand identity only.

### Risk Levels

| Label | Color |
|---|---|
| Low | Green (#22C55E) |
| Medium | Amber (#F59E0B) |
| High | Crimson (#EF4444) |
| Critical | Deep Crimson (#DC2626) |

---

## Typography

### Typefaces

| Role | Font | Weights |
|---|---|---|
| Headings | Space Grotesk | 600, 700 |
| Body | Inter | 400, 500, 600 |
| Monospace | JetBrains Mono | 400, 500 |

**Monospace used only for:**
- Timestamps
- Agent log entries (Decision Stream)
- Technical identifiers
- Clause references (§4.2)

### Type Scale

| Token | Size | Usage |
|---|---|---|
| display | 56px | Hero headlines only |
| h1 | 40px | Page titles |
| h2 | 32px | Section headers |
| h3 | 24px | Card headers |
| h4 | 20px | Sub-sections |
| body-lg | 18px | Lead paragraphs |
| body | 16px | Default body text |
| small | 14px | Labels, captions, metadata |
| caption | 12px | Helper text, timestamps |

**Line Height:** 140% across all sizes.
**Letter Spacing:** Default. No excessive tracking.

---

## Elevation

Shadow values increase with elevation level. No glowing borders. No harsh drop shadows.

| Level | Usage | Value |
|---|---|---|
| 0 | Flat surfaces | none |
| 1 | Default cards | 0 1px 3px rgba(0,0,0,0.3) |
| 2 | Raised cards | 0 4px 12px rgba(0,0,0,0.4) |
| 3 | Hover state | 0 8px 24px rgba(0,0,0,0.5) |
| 4 | Modals, drawers | 0 20px 60px rgba(0,0,0,0.6) |

---

## Icons

- **Library:** Lucide React
- **Sizes:** 16px, 20px, 24px
- **Stroke:** 2px
- **Style:** Rounded. No filled icons.

---

## Buttons

### Primary
- Background: Indigo (#6366F1)
- Text: White
- Hover: Lift 2px + indigo-hover (#7C83FF)
- Pressed: Scale 0.98 + indigo-pressed (#5558E8)
- Loading: Spinner replaces label text
- Disabled: 40% opacity, cursor not-allowed

### Secondary
- Style: Outline only (border-default)
- Hover: Background fade to bg-surface

### Ghost
- No border
- Hover: Background fade to bg-surface

### Danger
- Background: Crimson (#EF4444)
- Reserved for destructive actions only

---

## Inputs

- **Height:** 48px
- **Padding:** 16px horizontal
- **Label:** Always visible above field. Never replaced by placeholder.
- **Placeholder:** Supplementary hint text only.
- **Focus:** Indigo border + soft glow (box-shadow: 0 0 0 3px rgba(99,102,241,0.2))
- **Validation success:** Green border (#22C55E)
- **Validation error:** Red border (#EF4444) + helper text below

---

## Cards

- **Padding:** 24px
- **Radius:** 20px
- **Default shadow:** Level 1
- **Hover:** Lift 2px + Level 3 shadow
- **Transition:** 200ms ease-out
- **Rule:** Cards never animate continuously. Hover is the only persistent state change.

---

## Sidebar

- **Width (expanded):** 280px
- **Width (collapsed):** 80px (icon-only)
- **Background:** bg-secondary (#121A2B)
- **Logo:** Fixed at top
- **Navigation:** Vertically centered
- **Settings:** Pinned to bottom

### Navigation States

| State | Treatment |
|---|---|
| Active | Indigo background, white icon, white text |
| Inactive | text-muted, no background |
| Hover | bg-surface background fade, 150ms |

---

## Tables

- Minimal borders (border-default only between rows)
- Large row spacing (48px row height minimum)
- Hover: bg-card-hover highlight
- No zebra stripes

---

## Charts

- **Library:** Recharts
- **Bar style:** Rounded corners (radius: 4px)
- **Grid:** Soft, muted lines (border-default color)
- **Legends:** Only when essential. Never decorative.
- **Animation:** 600ms ease-out on mount
- **Colors:** Use semantic palette only (Indigo, Emerald, Amber, Crimson)

---

## Empty States

Every empty state includes:
1. A simple product illustration (see Image Style)
2. One sentence explaining the state
3. One CTA

Never leave a blank screen. Never show only a loading spinner with no context.

---

## Loading States

- **Skeleton loaders** for all content areas
- Never spinning cards
- Never blank pages
- Progressive reveal: skeleton → content (fade in, 200ms)

---

## Toast Notifications

- **Position:** Bottom right
- **Auto-dismiss:** 3 seconds
- **Manual dismiss:** Click anywhere on toast
- **Success:** Green left border accent
- **Error:** Red left border accent
- **Warning:** Amber left border accent

---

## Modals

- Background: blur(8px) + rgba(0,0,0,0.6) overlay
- Entry: Scale from 0.95 → 1.0 + fade in (250ms ease-out)
- Exit: Scale to 0.95 + fade out (150ms ease-in)
- ESC closes
- Backdrop click closes

---

## Drawers

- Entry: Slide from right (translateX 100% → 0), 300ms ease-out
- Exit: Slide to right, 200ms ease-in
- Desktop: 40% screen width
- Tablet: 50% screen width
- Mobile: Bottom sheet, 85% screen height

---

## Motion Principles

Motion exists to explain change. Never animate purely for decoration.

Every animation must communicate one of:
- Progress
- Focus
- Hierarchy
- Feedback

### Motion Timing

| Token | Duration | Usage |
|---|---|---|
| fast | 150ms | Hover states, focus rings |
| normal | 250ms | Tab switches, button feedback |
| slow | 400ms | Card reveals, page transitions |
| long | 600ms | Charts, Decision Card reveal, count animations |

**Default easing:** ease-out for all entrances. ease-in for exits.

---

## Reduced Motion

When the user's operating system requests reduced motion (`prefers-reduced-motion: reduce`):

- Disable all stagger animations.
- Replace movement (translate, scale) with opacity fades only.
- Disable pulsing and looping effects (agent pulse, skeleton shimmer).
- Disable Confidence Evolution count animation — show final value immediately.
- Preserve timing hierarchy — elements still appear in sequence, but without translation.
- Decision Stream entries appear instantly rather than sliding in from the left.

**Implementation rule:** Every animation in the codebase must be wrapped in a `prefers-reduced-motion` check. No exceptions.

---

## Image Style

**Allowed:**
- Simple product illustrations (documents, contracts, abstract business graphics)
- Flat, modern illustration style
- Abstract geometric compositions

**Not allowed:**
- Stock photos of people shaking hands
- Futuristic holograms or sci-fi imagery
- Cartoon or anime illustration styles
- Photography with people in staged business settings
- Glassmorphism renders or 3D abstract renders

**Rule:** Every image on the landing page and empty states must feel like it belongs to the same illustration system. Inconsistent image styles break the premium feel immediately.

---

## AI Visual Language

### Agent Cards
- Professional profile-style layout
- Minimal pulse animation when active (disabled under reduced motion)
- Avatar + name + personality label + progress bar + status message

### Decision Stream
- Visual treatment: professional activity log
- Monospace timestamps (JetBrains Mono, 12px, text-muted)
- Entries separated by subtle dividers (border-default)
- Not a chat interface. No speech bubbles. No avatars per entry.

### Confidence Meter
- Circular progress indicator
- Animated count (0 → final value, 600ms, ease-out)
- Placement: above or adjacent to Decision Stream
- Reduced motion: show final value immediately, no count animation

### Decision Timeline
- Vertical layout
- Minimal connecting line (border-default, 1px)
- State nodes: filled circle (complete) / outlined circle (pending)
- Timestamps in monospace, text-muted

---

## Accessibility

- Minimum contrast ratio: WCAG AA (4.5:1 for body text, 3:1 for large text)
- Visible focus states on all interactive elements (2px Indigo ring, 2px offset)
- Full keyboard navigation support
- Reduced motion support (see above)
- Never rely on color alone to communicate state — always pair with label or icon
- All form inputs have visible labels (never placeholder-only)

---

## Responsive Breakpoints

| Token | Range |
|---|---|
| mobile | < 768px |
| tablet | 768px – 1023px |
| desktop | 1024px – 1439px |
| large | 1440px+ |

---

## Design Principles

1. White space is a feature.
2. Motion explains state changes.
3. One primary action per screen.
4. Information before decoration.
5. Consistency over novelty.
6. Calm interfaces build trust.
7. Every component belongs to a system.
8. The interface should disappear behind the decision.

---

## Product Constitution Reference

This document implements the visual language defined by:

- `01_PRODUCT_VISION.md`
- `02_INFORMATION_ARCHITECTURE.md`
- `06_DECISION_FLOWS.md`

Future documents (Component Library, Animation System, Frontend Implementation) must strictly follow this design system.

If implementation conflicts with this document, the implementation changes — not the design system.

---

*Document Status: Draft v1.0 — Pending Architect Review*
*All decisions owned by: Product Architect*
*Last reviewed: Sprint 0*
