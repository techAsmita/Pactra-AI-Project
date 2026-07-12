# 04 — Component Library
**Pactra: Founder Decision Intelligence Platform**
*Version 1.0 — Pending Architect Review*

---

## Purpose

This document defines every reusable UI component in Pactra.

Each component has:
- Purpose
- Visual specification
- States
- Props
- Behavior
- Accessibility
- Responsive behavior

Components should be generic enough to reuse throughout the application.

If multiple pages require similar UI, create a reusable component rather than duplicating implementation.

If a new component is required during implementation, it must be added to this document before it is built.

---

## Component Philosophy

Every component must satisfy:
- One responsibility
- Predictable behavior
- Accessible by default
- Responsive by default
- Animation built-in (respecting reduced motion)
- Theme aware

No page-specific components belong here.

---

## Elevation Tokens (Canonical)

These are the only permitted shadow values across the entire application.
Values use the near-black from the background palette rather than pure black.

| Level | Value | Usage |
|---|---|---|
| 0 | none | Flat surfaces |
| 1 | 0 2px 8px rgba(15,23,42,0.08) | Default cards |
| 2 | 0 6px 16px rgba(15,23,42,0.10) | Raised cards |
| 3 | 0 12px 24px rgba(15,23,42,0.14) | Hover states |
| 4 | 0 20px 40px rgba(15,23,42,0.18) | Modals, drawers |

**Note:** These values supersede the elevation section in `03_DESIGN_SYSTEM.md`. This document is the canonical source for shadow values.

---

## Design Tokens Reference

This library follows:
- `01_PRODUCT_VISION.md`
- `02_INFORMATION_ARCHITECTURE.md`
- `03_DESIGN_SYSTEM.md`
- `06_DECISION_FLOWS.md`

---

## Reduced Motion Rule

If the user's OS requests `prefers-reduced-motion: reduce`:
- Remove all translate animations.
- Replace with opacity fades only.
- Disable pulse effects on AgentCard.
- Disable ConfidenceRing sweep animation — render final value immediately.
- Preserve hierarchy using timing only.

Every component animation must check this preference before running.

---

## Motion Timing

No component invents its own timing. All animations use these tokens:

| Token | Duration | Usage |
|---|---|---|
| fast | 150ms | Hover states, focus rings |
| normal | 250ms | Tab switches, button feedback |
| slow | 400ms | Card reveals, page transitions |
| long | 600ms | Charts, Decision Card reveal, count animations |

Default easing: ease-out for entrances, ease-in for exits.

---

## Illustration Rules

**Allowed:**
- Documents, contracts, dashboards
- Abstract business graphics
- Flat geometric shapes

**Not allowed:**
- Stock photos of people shaking hands
- Futuristic holograms or sci-fi imagery
- Cartoon or anime styles
- Cyberpunk aesthetics
- Staged business photography

---

## Component Naming Convention

PascalCase throughout.

```
Button
MetricCard
DecisionCard
ConfidenceRing
RiskBreakdownCard
AgentCard
ClauseDrawer
AgreementWorkspaceHeader
DecisionStream
EmptyWorkspace
```

---

---

# Foundation Components

---

## Button

**Purpose:** Primary interaction trigger across all pages.

**Variants:**

| Variant | Usage |
|---|---|
| Primary | Main CTA per screen. Maximum one per view. |
| Secondary | Supporting actions. |
| Ghost | Low-emphasis actions, navigation. |
| Danger | Destructive actions only (delete, revoke). |

**Sizes:**

| Size | Height |
|---|---|
| Small | 36px |
| Medium | 44px |
| Large | 52px |

**States:**

| State | Treatment |
|---|---|
| Default | As defined per variant. |
| Hover | Primary: lift 2px + indigo-hover. Others: bg-surface fade. |
| Active | Scale 0.98 + pressed color. |
| Focus | 2px Indigo focus ring, 2px offset. |
| Disabled | 40% opacity. cursor: not-allowed. pointer-events: none. |
| Loading | Spinner replaces label text. Width locked to prevent layout shift. |

**Rules:**
- Maximum one icon per button.
- Loading state locks button width to prevent layout shift.
- Danger variant requires confirmation modal before executing action.

**Accessibility:** `role="button"`, `aria-disabled` when disabled, `aria-busy` when loading.

---

## Input

**Purpose:** Single-line text entry.

**Types:** Text, Email, Password, Search, Number

**Specification:**
- Height: 48px
- Padding: 16px horizontal
- Label: Always visible above field. Never replaced by placeholder.
- Placeholder: Supplementary hint only.
- Focus: Indigo border + `box-shadow: 0 0 0 3px rgba(99,102,241,0.2)`

**Validation states:**

| State | Treatment |
|---|---|
| Default | border-default (#243047) |
| Focus | Indigo border + soft glow |
| Success | Green border (#22C55E) |
| Error | Crimson border (#EF4444) + helper text below |
| Warning | Amber border (#F59E0B) + helper text below |

**Accessibility:** `aria-label` or visible `<label>`. `aria-describedby` for helper text. `aria-invalid` on error state.

---

## Textarea

**Purpose:** Multi-line text entry (negotiation email editor, notes).

- Auto-growing up to 240px, then scrollable.
- Character counter optional (shown when limit is set).
- Same validation states as Input.

---

## Select

**Purpose:** Controlled single-value selection.

- Single select only in V1.
- Searchable only when options > 10.
- Dropdown uses bg-surface background.
- Option hover: bg-card-hover.

---

## Checkbox

**Purpose:** Binary opt-in selection.

- Keyboard operable (Space to toggle).
- Supports helper text below.
- Indigo fill when checked.
- `aria-checked` state.

---

## RadioGroup

**Purpose:** Mutually exclusive selection from a small set.

**Used for:** Funding Stage, Risk Appetite, Decision confirmation options.

- Keyboard: Arrow keys navigate between options.
- `role="radiogroup"` with `aria-labelledby`.

---

## Toggle

**Purpose:** Binary on/off setting.

- Used only in Settings (V1).
- Animated slide (150ms ease-out).
- Indigo when active, border-default when inactive.
- `role="switch"` with `aria-checked`.

---

---

# Layout Components

---

## AppShell

**Purpose:** Root layout wrapper for all authenticated pages.

**Contains:**
- Sidebar (left)
- TopBar (top)
- Content area (main)
- Notification layer (overlay)

**Behavior:** Sidebar and TopBar are fixed. Content area scrolls independently.

---

## Sidebar

**Purpose:** Primary navigation for Application Layer.

**Dimensions:**

| Breakpoint | Width | Behavior |
|---|---|---|
| Desktop | 280px | Always visible, expanded |
| Tablet | 80px | Collapsed (icon-only) by default, expandable |
| Mobile | 0px | Hidden. FAB at bottom-right opens overlay nav. |

**Sections (top to bottom):**
1. Logo (fixed top)
2. Navigation items: Workspace, Contracts, Negotiations, Analytics, Settings
3. Profile + Settings (pinned bottom)

**Navigation item states:**

| State | Treatment |
|---|---|
| Active | Indigo background pill, white icon, white text |
| Inactive | text-muted, no background |
| Hover | bg-surface fade, 150ms |

**Accessibility:** `role="navigation"`, `aria-label="Main navigation"`. Active item has `aria-current="page"`.

---

## TopBar

**Purpose:** Persistent top navigation bar within authenticated views.

**Contains:** Breadcrumb (left), Global Search trigger (center), Notifications icon, Profile avatar (right).

**Height:** 72px. Sticky (position: fixed, top: 0).

---

## PageContainer

**Purpose:** Consistent content wrapper for all pages.

- Max width: 1280px
- Center aligned
- Horizontal padding: 80px (desktop), 40px (tablet), 16px (mobile)

---

---

# Display Components

---

## Card

**Purpose:** Primary surface for grouping related content.

**Variants:**

| Variant | Usage |
|---|---|
| Default | Standard content grouping |
| Elevated | Highlighted or featured content |
| Interactive | Clickable cards (Agreement list items) |
| Status | Cards with left-border color accent |

**Specification:**
- Padding: 24px
- Border radius: 20px
- Default shadow: Level 1
- Hover (Interactive only): lift 2px + Level 3 shadow, 200ms ease-out
- Rule: Cards never animate continuously. Hover is the only persistent state change.

---

## MetricCard

**Purpose:** Display a single KPI with label, value, and optional trend.

**Contains:**
- Icon (optional)
- Numeric value (animated count on mount, 600ms ease-out)
- Label
- Trend indicator (up/down arrow + delta value, colored by direction)

**Responsive:** Stacks 2-up on tablet, 1-up on mobile.

---

## Badge

**Purpose:** Compact status, risk, or decision label.

**Types:**

| Type | Variants |
|---|---|
| Status | Uploaded, Analyzing, Decision Ready, Negotiating, Completed, Archived |
| Risk | Low (green), Medium (amber), High (crimson), Critical (deep crimson) |
| Decision | SIGN (green), NEGOTIATE (amber), WAIT (indigo), ESCALATE (crimson) |

**Sizes:** Small (12px text), Medium (14px text).
**Style:** Pill shape (border-radius: 999px). Filled background at 15% opacity + matching text color.

---

## Divider

- Horizontal and vertical variants.
- Color: border-default (#243047).
- No decorative dividers. Used only for structural separation.

---

---

# Decision Components

---

## DecisionSnapshot

**Purpose:** Persistent Agreement Workspace header. Always visible. Never collapsed.

**Layout (desktop, horizontal):**
```
[Agreement Name]   [NEGOTIATE]   Confidence: 92%   Risk: High   Updated: 2 min ago
```

**Layout (mobile, vertical stack):**
```
Vendor Agreement
NEGOTIATE
Confidence: 92% · Risk: High · 2 min ago
```

**States:**
- During analysis: Decision label shows "ANALYZING…", Confidence shows live percentage
- Post-analysis: Decision label shows final outcome with color treatment

**Sticky:** Yes. Fixed to top of Agreement Workspace below TopBar.

**Contains:** ConfidenceRing (right side, desktop only).

---

## ConfidenceRing

**Purpose:** Circular visual indicator of decision confidence score.

**Placement:** Top-right of DecisionSnapshot.

**Sizes:**

| Breakpoint | Size |
|---|---|
| Desktop | 96px |
| Tablet | 80px |
| Mobile | 64px (hidden in DecisionSnapshot, shown in DecisionCard) |

**Specification:**
- Stroke width: 8px
- Track color: border-default
- Fill color: follows decision status (SIGN → green, NEGOTIATE → amber, WAIT → indigo, ESCALATE → crimson)
- **During analysis (no decision yet):** Indigo fill (brand default) until Decision Engine completes
- Animation: Progressive sweep (0 → final angle), 600ms ease-out
- Center: Animated count from 0 → final percentage, 600ms ease-out
- Reduced motion: Show final value and completed ring immediately. No sweep, no count animation.

---

## DecisionCard

**Purpose:** Primary output surface of the Decision Engine. The moment of truth.

**Contains (in reveal order):**
1. Decision label (SIGN / NEGOTIATE / WAIT / ESCALATE)
2. Risk level badge
3. ConfidenceRing
4. Business Impact (2–3 sentences, plain English)
5. Financial Exposure (estimated range, shown when available)
6. Top 3 Actions (numbered, specific, actionable)
7. Primary CTA
8. Secondary CTA (text link weight, not button)

**Reveal sequence (see `06_DECISION_FLOWS.md` for full timing):**
- Background fade → Card scale → Decision label types in → Metrics stagger → Actions slide up → CTAs fade

**Rule:** Only one primary CTA. Secondary action is always lower visual weight.

---

## RiskBreakdownCard

**Purpose:** Explain the composition of risk transparently. Makes the decision feel earned rather than opaque.

**Placement:** Directly beneath DecisionSnapshot in the Decision Center. Also usable as a standalone card in AI Workspace.

**Contains:**
- Card header: "Risk Breakdown"
- Four risk dimensions, each with:
  - Label
  - Horizontal progress bar (filled portion colored by severity)
  - Percentage value

**Default risk dimensions:**

| Dimension | Description |
|---|---|
| Financial Exposure | Monetary risk relative to startup stage |
| Legal Complexity | Volume and severity of non-standard clauses |
| Operational Risk | Obligations that affect day-to-day business |
| Compliance Risk | Regulatory or policy exposure |

**Visual specification:**
```
Risk Breakdown
──────────────────────────────────
Financial Exposure
███████░░░  72%

Legal Complexity
████░░░░░░  41%

Operational Risk
████████░░  81%

Compliance Risk
███░░░░░░░  33%
──────────────────────────────────
```

**Bar colors:**
- 0–40%: Green (#22C55E)
- 41–70%: Amber (#F59E0B)
- 71–100%: Crimson (#EF4444)

**Animation:** Bars fill left-to-right on mount, staggered 100ms between rows, 400ms ease-out each.
**Reduced motion:** Bars render at final width immediately. No fill animation.

**Aligns with Principle 2:** Explain before recommending. The founder sees why the risk exists before reading the recommendation.

---

## DecisionStream

**Purpose:** Live scrollable activity log of agent findings during analysis.

**Layout:** Vertical feed. Newest entries at bottom. Auto-scrolls to latest entry.

**Entry anatomy:**
```
🧠 Legal Advisor  ·  0:12
   Found unlimited liability clause in §4.2
```

- Agent icon + name: body text weight
- Timestamp: JetBrains Mono, 12px, text-muted
- Finding: body text, text-secondary
- Severity indicator: colored left border (green / amber / crimson)
- Entries separated by border-default divider

**Entry animation:** Fade + translateX(-8px → 0), 200ms ease-out. Stagger: 100ms between entries.
**Reduced motion:** Fade only. No translate.

**Rule:** Not a chat interface. No speech bubbles. No avatars per entry. Looks like a professional activity log.

**Scroll behavior:** Container has fixed height. Content scrolls. Auto-scrolls to bottom on new entry unless user has manually scrolled up.

---

## DecisionTimeline

**Purpose:** Persistent vertical audit trail of every action taken on an agreement.

**Placement:** Left panel or right panel of Agreement Workspace (implementation decision).

**Node anatomy:**
```
● Uploaded                    Jan 15, 09:41
  Agreement received

● AI Analysis                 Jan 15, 09:42
  5 agents completed

○ Decision Generated          Pending
○ Negotiation Draft           Pending
○ Archived                    Pending
```

- Filled circle: completed state
- Outlined circle: pending state
- Connecting line: 1px border-default
- Timestamps: JetBrains Mono, 12px, text-muted
- Labels: 14px, text-secondary
- Notes: 12px, text-muted, italic

**Animation:** New nodes fade in when state transitions occur.

---

---

# AI Components

---

## AgentCard

**Purpose:** Display the status, progress, and latest output of a single AI agent.

**Contains:**
- Avatar (emoji or icon, 40px)
- Agent name
- Personality label (Precise / Analytical / Forward-looking / Practical / Neutral)
- Status label (Waiting / Initializing / Running / Completed / Failed)
- Progress bar (visible only in Running and Completed states)
- Latest activity line (most recent finding, updates in real time)
- Completion timestamp (Completed state only)

**States:**

| State | Visual Treatment |
|---|---|
| Waiting | Dimmed card (40% opacity). Avatar greyed. No progress bar. |
| Initializing | Full opacity. Avatar brightens. Pulse ring expands. Label: "Initializing…" |
| Running | Progress bar fills (reflects actual elapsed time, not fixed duration). Agent-specific status message. |
| Completed | Progress bar full. Green checkmark replaces pulse. Timestamp appears. |
| Failed | Crimson border. Error message. Retry option. |

**Natural Timing Rule:** Progress bar fill speed reflects actual API response time. No agent is held to a fixed duration to match other agents. See `06_DECISION_FLOWS.md`.

**Pulse animation:** Subtle ring expands from avatar and fades. Duration: 800ms, loops while in Initializing or Running state.
**Reduced motion:** Pulse disabled. State changes via opacity only.

---

## AgentProgressGroup

**Purpose:** Container for all five AgentCards during analysis.

- Supports dynamic ordering (agents reorder as they complete, optional).
- Grid layout: 1 column on mobile, 2 columns on tablet, 1 column on desktop (sidebar panel).
- Passes state updates to each AgentCard independently.

---

---

# Workspace Components

---

## AgreementCard

**Purpose:** List item representing a single agreement in the Contracts index.

**Contains:**
- Agreement name
- Agreement type badge (Vendor / Employment / SAFE / NDA / Partnership)
- Status badge
- Decision badge (if available)
- Last updated timestamp
- Resume button (Interactive state only)

**Responsive:** Full width on all breakpoints.

---

## AgreementWorkspaceHeader

**Purpose:** Top section of every Agreement Workspace. Persistent on scroll.

**Contains:**
- DecisionSnapshot (full width)
- Tab navigation: Analysis · Decision · Clauses · Negotiation · Timeline
- Quick actions (Export, Share, Archive)

**Sticky:** Yes. Scrolls with page until it hits TopBar, then locks.

---

## ClauseRow

**Purpose:** Single flagged clause displayed in the Decision Center clause list.

**Contains:**
- Clause reference (§4.2, monospace)
- Clause name
- Severity badge
- One-line summary
- "View →" trigger button

**Click behavior:** Opens ClauseDrawer. Does not navigate away from Decision Center.

---

## ClauseDrawer

**Purpose:** Right-side drawer for detailed clause investigation without leaving Decision Center.

**Dimensions:**

| Breakpoint | Treatment |
|---|---|
| Desktop | Right panel, 40% screen width |
| Tablet | Right panel, 50% screen width |
| Mobile | Bottom sheet, 85% screen height |

**Contains:**
- Clause reference + name (header)
- Plain-English explanation
- Business Impact section
- Suggested Rewrite (original → replacement)
- "Add to Negotiation" CTA
- Close button (top-right)

**Animation:** Slide in from right (desktop/tablet), slide up from bottom (mobile). 300ms ease-out.

**Keyboard:**
- `Esc`: Close drawer, return focus to triggering ClauseRow.
- `Arrow Down / Up`: Navigate to next/previous clause without closing drawer. Content transitions (fade out → fade in, 150ms).

**Focus trap:** Focus locked inside drawer while open. `role="dialog"`, `aria-labelledby` pointing to clause name.

**Tab order within drawer:**
1. Close button
2. Clause heading
3. Explanation text
4. Business Impact
5. Suggested Rewrite
6. "Add to Negotiation" CTA

---

## EmptyWorkspace

**Purpose:** First-use state for new founders with no agreements uploaded.

**Replaces:** Generic "No agreements yet" empty state.

**Layout:**
```
[Simple document illustration]

Ready for your first decision?

Upload your first agreement to receive
AI-powered decision intelligence.

[ Upload Agreement ]
```

**Specification:**
- Illustration: Simple flat document/contract graphic (consistent with illustration rules)
- Headline: H3, text-primary
- Description: body, text-secondary, max-width 360px, centered
- CTA: Primary Button, large size
- Background: bg-primary, centered vertically in content area

**Animation:** Illustration and text fade in with stagger (100ms between elements) on mount.
**Reduced motion:** All elements appear immediately at full opacity.

**Rule:** This component appears only on first login or when all agreements are archived. It is never shown alongside other content.

---

---

# Negotiation Components

---

## NegotiationPriorityCard

**Purpose:** Single negotiation priority item with rationale.

**Contains:**
- Priority number (large, text-muted)
- Clause reference
- Reason to negotiate
- Leverage point (why the founder has negotiating power here)

---

## ClauseRewriteCard

**Purpose:** Side-by-side original clause vs. AI-suggested replacement.

**Layout:**
```
Original                    Suggested Rewrite
──────────────              ──────────────────
[Original clause text]  →   [Replacement text]
```

**Actions:** Accept (applies to Negotiation Email), Copy (copies suggested text), Edit (inline).

---

## NegotiationEmailEditor

**Purpose:** Inline-editable AI-generated negotiation email.

**Behavior:**
- All text sections editable on click (no separate edit mode).
- Click away to save (on blur).
- Auto-save every 30 seconds.
- Export captures current edited state, not original AI output.

**Actions:** Copy to Clipboard, Export PDF, Save Draft.

**Accessibility:** `contenteditable` with `role="textbox"` and `aria-multiline="true"`. Or standard `<textarea>` with auto-grow.

---

---

# Analytics Components

---

## ChartCard

**Purpose:** Recharts wrapper with consistent Pactra styling.

**Variants:** Line, Bar, Donut, Area.

**Contains:**
- Card header with title
- Optional subtitle
- Chart body
- Loading: Skeleton

**Chart styling:**
- Rounded bar corners (radius: 4px)
- Soft grid lines (border-default color)
- No legends unless essential
- Animation: 600ms ease-out on mount
- Colors: Indigo, Emerald, Amber, Crimson (semantic palette only)

---

## InsightCard

**Purpose:** Single AI-generated observation with recommendation.

**Contains:**
- Observation text
- Recommendation
- Confidence badge

---

---

# Feedback Components

---

## Toast

**Position:** Bottom right, 16px from edge.
**Auto-dismiss:** 3 seconds. Manual dismiss on click.
**Stack behavior:** Multiple toasts stack vertically (newest on top).

| Type | Left Border | Icon |
|---|---|---|
| Success | Green | CheckCircle |
| Warning | Amber | AlertTriangle |
| Error | Crimson | XCircle |
| Info | Indigo | Info |

---

## Modal

- Backdrop: `blur(8px)` + `rgba(0,0,0,0.6)`
- Entry: Scale 0.95 → 1.0 + fade in, 250ms ease-out
- Exit: Scale 1.0 → 0.95 + fade out, 150ms ease-in
- `Esc` closes. Backdrop click closes.
- Focus trap: focus locked inside while open.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal title.

---

## EmptyState

**Purpose:** Generic empty state for lists, search results, and filtered views.

**Contains:**
- Illustration (simple, flat)
- Headline (one sentence)
- Description (optional, one sentence)
- Primary CTA (one action)

**Rule:** Never leave a blank screen. Every zero-data state has an EmptyState.

**Note:** EmptyWorkspace is a specialized variant of EmptyState for the first-login experience.

---

## Skeleton

**Variants:** Card, Table row, Text block, Chart.

**Animation:** Shimmer left-to-right, 1.5s loop.
**Reduced motion:** Static grey block. No shimmer.

**Rule:** Skeletons must match the layout dimensions of the content they replace. Never show a full-page skeleton — skeleton individual sections progressively.

---

## LoadingOverlay

**Purpose:** Blocking state indicator for actions that prevent interaction.

**Used for:** File upload processing, session initialization.
**Not used for:** AI analysis (DecisionStream handles this), page loads (Skeleton handles this).
**Never:** Full-page except during initial authentication.

---

---

# Search Components

---

## CommandPalette

**Purpose:** Global keyboard-first search and navigation.

**Activation:** `⌘K` (or `Ctrl+K` on Windows). Also via TopBar search icon.

**Dimensions:**

| Breakpoint | Treatment |
|---|---|
| Desktop | Center modal, 600px wide |
| Tablet | Center modal, 90% width |
| Mobile | Full screen |

**Contains:**
- Search input (auto-focused on open)
- Results list (keyboard navigable)
- Recent searches (shown when input is empty)
- Result types: Agreements, Clauses, Decisions, Pages

**Keyboard:**
- `Arrow Up / Down`: Navigate results
- `Enter`: Select highlighted result
- `Esc`: Close palette

**Animation:** Fade in + scale from 0.97, 150ms ease-out.

**Accessibility:** `role="combobox"`, `aria-expanded`, `aria-controls` pointing to results list. Results have `role="option"`.

---

---

## Responsive Rules

Every component defines behavior at all three breakpoints. No component may be desktop-only.

| Component | Mobile adaptation |
|---|---|
| Sidebar | Hidden, replaced by FAB overlay |
| ClauseDrawer | Bottom sheet (85% height) |
| DecisionSnapshot | Vertical stack |
| AgentProgressGroup | Single column |
| ChartCard | Horizontal scroll if needed |
| CommandPalette | Full screen |
| ConfidenceRing | Hidden in DecisionSnapshot, shown in DecisionCard |

---

## Accessibility Checklist (Per Component)

Every component must satisfy:
- [ ] Keyboard operable
- [ ] Screen reader compatible (appropriate ARIA roles and labels)
- [ ] Visible focus state (2px Indigo ring, 2px offset)
- [ ] Color not sole indicator of state (always paired with label or icon)
- [ ] Reduced motion respected
- [ ] Minimum WCAG AA contrast (4.5:1 body, 3:1 large text)

---

## Product Constitution Reference

This library is the implementation vocabulary of Pactra.

Every page must be built exclusively from these components.

If implementation requires a component not listed here, add it to this document first — then implement it.

This document is subordinate to `01_PRODUCT_VISION.md`, `02_INFORMATION_ARCHITECTURE.md`, `03_DESIGN_SYSTEM.md`, and `06_DECISION_FLOWS.md`.

---

*Document Status: Draft v1.0 — Pending Architect Review*
*All decisions owned by: Product Architect*
*Last reviewed: Sprint 0*
