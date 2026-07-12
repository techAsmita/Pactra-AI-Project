# 06 — Decision Flows
**Pactra: Founder Decision Intelligence Platform**
*Version 1.0 — Pending Architect Review*

---

## Overview

This document is an interaction blueprint.

It defines exactly what the founder experiences from the first click to the final decision — including what the system does, what can go wrong, and how the product recovers. A frontend engineer should be able to implement the complete interaction model from this document without making independent UX decisions.

Every flow answers four questions:

1. **User Goal** — What is the founder trying to accomplish?
2. **System Response** — What does Pactra do at each step?
3. **Possible Failure** — What can go wrong?
4. **Recovery Path** — How does the product recover gracefully?

These are not page flows. They are **Decision Flows** — because every interaction in Pactra exists to move a founder closer to a confident business decision.

---

## Agreement State Machine

Every agreement in Pactra follows this lifecycle. All Decision Flows operate within this state machine.

```
New
 ↓
Uploaded
 ↓
Parsing
 ↓
Context Confirmed
 ↓
Analyzing
 ↓
Decision Ready
 ↓
Negotiating
 ↓
Completed
 ↓
Archived
```

**Rules:**
- States are linear. An agreement cannot skip states.
- Archived agreements can be reopened (state returns to Decision Ready).
- If analysis fails, state returns to Uploaded with a retry prompt.
- The Decision Timeline records every state transition with a timestamp.

---

## Decision Flow 01 — First Agreement

**User Goal:** Complete a first analysis from landing page to decision.

This is the golden path and the demo script.

---

### Step 1 — Landing Page

| | |
|---|---|
| **User Action** | Arrives at `/`. Reads hero. Clicks "Start Free Analysis". |
| **System Response** | Navigates to `/login` with `?intent=signup` param. Pre-selects Sign Up tab. |
| **Success State** | Sign Up form visible and focused. |
| **Failure State** | Page load failure. |
| **Recovery** | Retry with cached static landing. Error banner: "Having trouble loading? Try refreshing." |
| **UI Feedback** | CTA button shows press state on click. Navigation is instant. |

---

### Step 2 — Authentication

| | |
|---|---|
| **User Action** | Enters email and password. Clicks "Create Account". |
| **System Response** | Validates input. Creates account. Sets session. Redirects to `/onboarding`. |
| **Success State** | Redirect to Founder Onboarding with welcome animation. |
| **Failure State** | Email already registered / weak password / network error. |
| **Recovery** | Inline field-level error. No form reset. Password strength indicator updates live. "Already have an account? Sign in" surfaced. |
| **UI Feedback** | Button enters loading state on click. Spinner replaces label. On success: checkmark flash before redirect. |
| **Transition** | → Step 3 |

---

### Step 3 — Founder Onboarding

| | |
|---|---|
| **User Goal** | Initialize Decision Profile. |
| **User Action** | Fills in: Company name, Industry, Funding Stage, Employees, Revenue Range, Risk Appetite, Current Goal. Clicks "Build My Decision Profile". |
| **System Response** | Validates all fields. Saves Founder Profile to database. Redirects to `/workspace`. |
| **Success State** | Profile saved. Workspace loads with personalized greeting. |
| **Failure State** | Incomplete fields / save failure. |
| **Recovery** | Highlight incomplete fields. Preserve all entered data. Retry save silently. Show error only if retry fails. |
| **UI Feedback** | Progress indicator across onboarding steps. Each completed field shows a subtle check. Final button animates to "Profile Built ✓" before redirect. |
| **Note** | Onboarding only appears on first login. Subsequent logins skip directly to Workspace. |
| **Transition** | → Step 4 |

---

### Step 4 — Workspace

| | |
|---|---|
| **User Action** | Sees Workspace for the first time. No agreements yet. Clicks "Analyze New Agreement". |
| **System Response** | Empty state rendered. "Continue Working" hero shows onboarding nudge: "Upload your first agreement to get started." CTA navigates to `/contracts/new`. |
| **Success State** | Upload page loads. |
| **Failure State** | Workspace data fails to load. |
| **Recovery** | Skeleton loaders during fetch. If fetch fails after 5s: "Something went wrong. Refresh to try again." |
| **UI Feedback** | Sidebar highlights "Contracts". Workspace cards animate in with stagger fade. |
| **Transition** | → Step 5 |

---

### Step 5 — Upload Agreement

| | |
|---|---|
| **User Action** | Drags PDF onto upload zone or clicks "Choose File". |
| **System Response** | Validates file type (PDF, DOCX, TXT) and size (max 10MB). Shows upload progress bar. Creates Agreement Workspace on completion. |
| **Success State** | File uploaded. Agreement created in state: Uploaded. Redirect to `/contracts/new/context`. |
| **Failure State** | Wrong format / file too large / upload interrupted / server error. |
| **Recovery — Wrong format** | Inline error: "Only PDF, DOCX, and TXT files are supported." File input resets. Zone remains active. |
| **Recovery — File too large** | Inline error: "File exceeds 10MB limit. Try compressing your PDF." |
| **Recovery — Upload interrupted** | Progress bar pauses. Banner: "Upload paused. Check your connection." Retry button resumes from last checkpoint if possible, else restarts. |
| **Recovery — Server error** | Error card replaces progress bar. "Upload failed. Try again." Retry re-initiates full upload. |
| **UI Feedback** | Drop zone highlights on drag-over. Progress bar animates smoothly. On success: zone transitions to file preview card with filename, type badge, and size. |
| **Transition** | → Step 6 |

---

### Step 6 — Founder Context Review

| | |
|---|---|
| **User Goal** | Confirm that current startup context is accurate before analysis begins. |
| **User Action** | Reviews pre-filled context from Founder Profile. Updates any changed fields. Clicks "Looks Good — Continue" or "Update Profile". |
| **System Response** | If no changes: proceeds to analysis with existing context. If updated: saves new profile values, then proceeds. |
| **Success State** | Context confirmed. Agreement state → Context Confirmed. Redirect to AI Workspace. |
| **Failure State** | Save failure on profile update. |
| **Recovery** | Preserve edited values. Retry save. If retry fails: allow user to continue with existing context and surface a warning: "Profile update failed. Analysis will use your previous context." |
| **UI Feedback** | Fields are pre-filled and visually calm (not empty form). Changed fields highlight briefly. "Looks Good" button is the visual primary. "Update" is secondary. |
| **Note** | This step reinforces Pactra's core USP — context personalization. It must feel significant, not like a confirmation dialog. |
| **Transition** | → Step 7 |

---

### Step 7 — AI Analysis (Decision Stream)

| | |
|---|---|
| **User Goal** | Watch analysis unfold. Understand what the AI is finding. |
| **System Response** | Document parser runs. Five agents initialize sequentially then run in parallel. Decision Stream updates as each agent produces output. Decision Engine activates after all agents complete. |
| **Agent Sequence** | Legal Advisor → Financial Strategist → Growth Advisor → Negotiation Coach → Decision Engine |

**AI Agent Personalities:**

Each agent has a defined personality that governs the tone of every piece of text it produces — in the Decision Stream, Decision Center, clause explanations, and negotiation output. Engineers and AI prompt authors must respect these personalities.

| Agent | Personality | Tone in Output |
|---|---|---|
| 🧠 Legal Advisor | Precise | Specific. Clause references. No ambiguity. No hedging. States facts. |
| 💰 Financial Strategist | Analytical | Numbers-first. Quantifies exposure. Compares scenarios. |
| 📈 Growth Advisor | Forward-looking | Focuses on future impact. Strategic implications. Opportunity cost framing. |
| 🤝 Negotiation Coach | Practical | Actionable. Concrete asks. Real language a founder can use. |
| ⚡ Decision Engine | Neutral synthesizer | No personality. Balances all inputs. States recommendation without editorializing. Never uses "I". |

**Rule:** Agent personality must remain consistent across every surface. The Legal Advisor never uses growth language. The Growth Advisor never cites clause numbers without business context.

**Agent State Model (per agent):**
```
Waiting → Activating → Running → Complete
```

**Left Panel — Agent Progress:**

| Agent | State Display |
|---|---|
| Waiting | Dimmed card. Avatar greyed. No progress bar. |
| Activating | Avatar brightens. Label: "Initializing…" Subtle pulse animation. |
| Running | Progress bar fills. Label: agent-specific status message. |
| Complete | Progress bar full. Green checkmark. Completion timestamp. |

**Natural Timing Rule:** Agent animations must reflect actual processing time — not a fixed choreography. If the Legal Advisor completes in 2 seconds, show it completing in 2 seconds. If the Financial Strategist takes 7 seconds, let it take 7 seconds. Progress bars fill proportionally to real elapsed time. No agent should be held artificially to match another's duration. Authentic timing signals genuine intelligence. Synchronized animations signal fake loading.

**Right Panel — Decision Stream:**

Each agent appends findings as they are generated. Stream does not wait for agent completion — output appears as produced.

```
Decision Stream
──────────────────────────────────
🧠 Legal Advisor  · 0:12
   Found unlimited liability clause in §4.2
   Auto-renewal without notice period in §8.1
──────────────────────────────────
💰 Financial Strategist  · 0:28
   Estimated exposure: 3× contract value
   Payment terms create 45-day cash flow gap
──────────────────────────────────
📈 Growth Advisor  · 0:41
   §7 restricts expansion to new verticals
   Exclusivity clause limits partnership options
──────────────────────────────────
⚡ Decision Engine  · 1:02
   Synthesizing all inputs…
──────────────────────────────────
```

**Confidence Evolution:**

A live confidence meter runs alongside the Decision Stream. It is not decorative — it reflects the cumulative weight of agent findings as they arrive. Each agent contributes a calculated delta to the confidence score based on the severity and volume of its findings.

```
Decision Confidence
──────────────────────────────────
  12%  ← Legal Advisor initializing
  ↓
  31%  ← Legal Advisor complete
  ↓
  54%  ← Financial Strategist complete
  ↓
  78%  ← Growth Advisor complete
  ↓
  92%  ← All agents complete
──────────────────────────────────
```

**Implementation rule:** Confidence values must be calculated from actual agent output — not animated on a fixed timer. If an agent finds zero issues, confidence rises faster. If an agent flags critical clauses, confidence rises more slowly or dips before stabilizing. The number must feel earned.

The Confidence Evolution is the most memorable visual in the product. A founder watching 12% → 92% build in real time understands intuitively that something intelligent is happening — without reading a single line of explanation.

| | |
|---|---|
| **Success State** | All agents complete. Decision Engine synthesizes. CTA appears: "View Decision". Agreement state → Decision Ready. |

**Decision Snapshot — Persistent Header Rule:**

The Decision Snapshot is visible in the Agreement Workspace header at all times — on every tab, during analysis, and after completion. It updates live as agents complete.

```
Vendor Agreement
─────────────────────────────────────────────────
ANALYZING…    Confidence: 54%    Risk: High    Updated: just now
─────────────────────────────────────────────────
```

After analysis:
```
Vendor Agreement
─────────────────────────────────────────────────
NEGOTIATE    Confidence: 92%    Risk: High    Updated: 2 min ago
─────────────────────────────────────────────────
```

**Rule:** The Decision Snapshot is never hidden, never collapsed, and never requires a scroll to see. It is the persistent orientation layer for every Agreement Workspace.
| **Failure State** | Agent timeout / API failure / network loss mid-analysis. |
| **Recovery — Agent timeout** | Affected agent card shows: "Taking longer than expected… Retrying." Auto-retry once. If second attempt fails: "Analysis incomplete. Some recommendations may be limited." Allow user to proceed with partial results. |
| **Recovery — Full failure** | Error card in Decision Stream: "Analysis failed. Your agreement is saved." Primary CTA: "Retry Analysis". Agreement state remains Uploaded. |
| **Recovery — Network loss** | Persistent banner: "Connection lost. Reconnecting…" Analysis pauses. On reconnect: resumes from last completed agent. |
| **UI Feedback** | Stream entries animate in (fade + slide from left). Decision Engine entry uses a distinct visual treatment — larger, bordered, centered. CTA fades in after Decision Engine completes. No auto-redirect — founder clicks to proceed. |
| **Transition** | → Step 8 |

---

### Step 8 — Decision Center

| | |
|---|---|
| **User Goal** | Receive and understand the final recommendation. |
| **System Response** | Renders Decision Card, Business Impact summary, Risk Assessment, Top 3 Actions. |

**Decision Card reveal sequence:**
```
1. Background fades in (300ms)
2. Card scales up from 0.95 (200ms)
3. Decision label types in character by character (400ms)
4. Supporting metrics fade in with stagger (200ms each)
5. Top 3 Actions slide up (300ms)
6. Secondary CTAs fade in last (200ms)
```

**Decision outputs:**

| Output | Description |
|---|---|
| Decision Label | SIGN / NEGOTIATE / WAIT / ESCALATE |
| Risk Level | Low / Medium / High / Critical |
| Confidence Score | Percentage. Tied to explainability of recommendation. |
| Business Impact | 2–3 sentence plain-English summary. |
| Financial Exposure | Estimated range where applicable. |
| Top 3 Actions | Numbered. Specific. Actionable. Never generic. |
| Primary CTA | "Generate Negotiation Strategy" (if NEGOTIATE/WAIT/ESCALATE) or "Archive Agreement" (if SIGN) |
| Secondary CTA | "Export Report" |

| | |
|---|---|
| **Success State** | Founder reads decision. Understands recommendation. Clicks primary CTA. |
| **Failure State** | Decision Engine returns no recommendation / confidence too low. |
| **Recovery** | Surface partial decision with caveat: "Our analysis identified key risks but could not produce a confident recommendation. Review flagged clauses below." Clause list still renders. |
| **UI Feedback** | Decision label color matches severity: Emerald (SIGN), Amber (WAIT/NEGOTIATE), Crimson (ESCALATE). Decision Snapshot in header updates simultaneously. |
| **Transition** | → Step 9 (Clause Investigation) or Step 10 (Negotiation) |

---

### Step 9 — Archive / Complete

| | |
|---|---|
| **User Action** | Clicks "Archive Agreement" after decision review. |
| **System Response** | Agreement state → Completed → Archived. Decision Timeline records final entry. Agreement appears in Contracts → Archived tab. |
| **Success State** | Workspace preserved. Founder redirected to Workspace with success toast: "Agreement archived." |
| **UI Feedback** | Toast notification (bottom right, 3s). Workspace "Continue Working" hero updates to next active agreement or empty state. |

---

## Decision Flow 02 — Resume Existing Analysis

**User Goal:** Return to an agreement already in progress without losing context.

| Step | User Action | System Response | Success State |
|---|---|---|---|
| Login | Enter credentials. | Session restored. | Redirect to Workspace. |
| Workspace | See "Continue Working" hero with most recent active agreement. | System surfaces last active Agreement Workspace. | Agreement name, status badge, and Resume CTA visible. |
| Resume | Click "Resume →" | Navigate to the exact page within the Agreement Workspace where the founder left off. | Correct page loads. Decision Timeline intact. All previous agent outputs preserved. |

**Critical rule:** Resume never restarts analysis. Resume never shows upload screen. Resume opens the Agreement Workspace at the last visited tab.

**Failure state:** Session expired.
**Recovery:** Redirect to `/login` with `?redirect=/contracts/:id`. After login, navigate directly to the agreement.

---

## Decision Flow 03 — Upload New Agreement (Returning Founder)

**User Goal:** Start analysis on a new agreement without re-doing onboarding.

```
Workspace
  ↓
Click "Analyze New Agreement" (or press N)
  ↓
/contracts/new
  ↓
Upload (drag or choose)
  ↓
Validation
  ↓
Founder Context Review
  ↓
/contracts/:id/analysis
```

**Difference from Flow 01:** No onboarding. Context Review is pre-filled. Upload is the first interaction.

**All upload failures from Flow 01 Step 5 apply here identically.**

---

## Decision Flow 04 — Clause Investigation

**User Goal:** Understand a specific flagged clause without leaving the Decision Center.

```
Decision Center
  ↓
Click "View →" on flagged clause
  ↓
Right drawer opens (slide from right, 300ms)
  ↓
Read plain-English explanation
  ↓
Review business impact
  ↓
Read suggested rewrite
  ↓
Click "Add to Negotiation" (optional)
  ↓
Drawer closes or stays open for next clause
```

**Drawer behavior:**
- Opens: slides in from right (300ms ease-out).
- Closes: slides out on Esc, backdrop click, or explicit close button.
- Multiple clauses: drawer content transitions (fade out → fade in) without closing.
- Desktop: right panel occupying 40% of screen width.
- Mobile: bottom sheet occupying 85% of screen height.

**Tab order within drawer:**
1. Close button
2. Clause heading
3. Explanation text
4. Business Impact section
5. Suggested Rewrite
6. "Add to Negotiation" CTA

**Keyboard:**
- `Esc` — closes drawer, returns focus to triggering clause row.
- `Arrow Down / Up` — navigates between clauses within drawer without closing.

| | |
|---|---|
| **Success State** | Founder reads explanation. Optionally adds to negotiation. Returns to full Decision Center view. |
| **Failure State** | Clause detail fails to load. |
| **Recovery** | Drawer renders with error state: "Could not load clause details. Try again." Retry button inside drawer. |

---

## Decision Flow 05 — Generate Negotiation Strategy

**User Goal:** Produce a negotiation plan and draft email based on the decision.

```
Decision Center
  ↓
Click "Generate Negotiation Strategy"
  ↓
Transition: "Decision accepted ✓" (full-width confirmation, 800ms, then fades)
  ↓
/contracts/:id/negotiate
  ↓
Negotiation Workspace loads
  ↓
Priorities list renders
  ↓
Clause rewrites render
  ↓
Negotiation email draft renders
  ↓
Founder edits (optional)
  ↓
Copy or Export
```

**Negotiation Workspace outputs:**

| Section | Content |
|---|---|
| Negotiation Priorities | Ranked list of clauses to push back on, with leverage rationale. |
| Clause Rewrites | Side-by-side: original clause vs. suggested replacement. |
| Negotiation Email | Complete draft addressed to counterparty. Editable inline. |
| Actions | Copy Email / Export PDF / Save Draft |

**Editing behavior:**
- All text sections are inline-editable on click.
- No separate edit mode. Click text to edit. Click away to save.
- Edits are auto-saved every 30 seconds and on blur.
- Export captures the current edited state, not the original AI output.

| | |
|---|---|
| **Success State** | Founder copies or exports negotiation materials. Agreement state → Negotiating. |
| **Failure State** | Generation failure / export failure. |
| **Recovery — Generation failure** | Error card: "Could not generate negotiation strategy. Retry." Retry re-calls Negotiation Coach agent only. |
| **Recovery — Export failure** | Toast: "Export failed. Try again." Copy to clipboard always available as fallback. |

---

## Decision Flow 06 — Continue Later (State Persistence)

**User Goal:** Leave mid-analysis and return without losing progress.

**Rule:** Pactra never loses state. Every action is persisted immediately.

| Scenario | System Behavior |
|---|---|
| Browser closed mid-analysis | Agreement state saved. Agents that completed are preserved. On return: Resume from Decision Stream at last completed agent. |
| Browser closed mid-negotiation | Draft auto-saved. On return: Negotiation Workspace reopens with all edits intact. |
| Session expired | On re-login: redirect to last active Agreement Workspace. |
| Network lost mid-analysis | Analysis pauses. On reconnect: resumes from last completed agent. No restart. |

**Continue Working hero always reflects the most recently touched Agreement Workspace** — not the most recently created one.

---

## Decision Flow 07 — Global Search

**User Goal:** Find any agreement, clause, or recommendation quickly.

```
Press ⌘K (or click search icon)
  ↓
Command palette opens (center modal, fade in 150ms)
  ↓
Type to search
  ↓
Results appear instantly (debounced, 200ms)
  ↓
Select result
  ↓
Navigate to Agreement Workspace or specific section
```

**Searchable entities:**

| Entity | Example Query | Result |
|---|---|---|
| Agreement by name | "Acme" | Opens Agreement Workspace |
| Agreement by type | "vendor" | Lists matching agreements |
| Clause by keyword | "liability" | Opens Decision Center, highlights clause |
| Decision by outcome | "negotiate" | Lists agreements with NEGOTIATE decision |
| History | "archived" | Opens Contracts → Archived tab |

**Keyboard behavior:**
- `⌘K` — opens palette.
- `Esc` — closes palette, returns focus to previous location.
- `Arrow Up / Down` — navigates results.
- `Enter` — selects highlighted result.
- `/` within Decision Center — scoped clause search (palette opens pre-filtered).

| | |
|---|---|
| **Success State** | Founder finds target in under 3 keystrokes. |
| **Failure State** | No results / search service unavailable. |
| **Recovery — No results** | "No results for '[query]'. Try a different search." Suggest: Upload New Agreement. |
| **Recovery — Service unavailable** | Palette renders with: "Search unavailable. Browse your contracts instead." Link to `/contracts`. |

---

## Decision Flow 08 — Update Founder Context

**User Goal:** Update startup profile so future analyses reflect current business reality.

```
Settings
  ↓
Startup Profile tab
  ↓
Edit any field (e.g. Risk Appetite: Moderate → Conservative)
  ↓
Click "Save Changes"
  ↓
Confirmation toast
```

**Critical rule:** Profile updates affect **future analyses only**. Previously completed analyses are never retroactively modified. This must be communicated explicitly on the Settings page:

> "Changes to your profile will apply to all future analyses. Past decisions are preserved as they were generated."

| | |
|---|---|
| **Success State** | Profile saved. Toast: "Profile updated. Future analyses will use your new context." |
| **Failure State** | Save failure. |
| **Recovery** | Preserve all edits. Retry silently. If retry fails: "Couldn't save changes. Check your connection and try again." Fields remain editable. |

---

## Decision Flow 09 — Error Recovery (Master Flow)

**User Goal:** Recover from any failure without losing work or confidence.

### Upload Failure
```
Upload fails
  ↓
Error card replaces progress bar
  ↓
"Upload failed. Your file was not saved."
  ↓
[Retry Upload]   [Choose Different File]
  ↓
On retry: re-initiates upload from scratch
```

### AI Analysis Timeout
```
Agent exceeds 30s without response
  ↓
Agent card shows: "Taking longer than expected…"
  ↓
Auto-retry (once, silently)
  ↓
If retry fails: "This agent couldn't complete its analysis."
  ↓
Analysis continues with remaining agents
  ↓
Decision Engine notes partial input in recommendation
  ↓
[Retry Full Analysis]  available as secondary option
```

### Network Disconnection
```
Network lost
  ↓
Persistent top banner: "You're offline. Reconnecting…"
  ↓
All writes queued locally
  ↓
On reconnect: banner updates: "Back online. Syncing…"
  ↓
Queue flushes
  ↓
Banner dismissed (200ms fade)
```

### Session Expiry
```
API returns 401
  ↓
Current state saved to sessionStorage
  ↓
Redirect to /login with ?redirect=[current_path]
  ↓
After login: restore saved state
  ↓
Return to exact location before expiry
```

### Empty States (Not Errors, but Require UI Treatment)

| State | Message | CTA |
|---|---|---|
| No agreements | "Upload your first agreement to get started." | Analyze New Agreement |
| No archived agreements | "Completed decisions will appear here." | View Active Contracts |
| No search results | "No results for '[query]'." | Clear Search |
| Analysis empty | "Something went wrong during analysis." | Retry Analysis |

---

## Trust Indicators

Trust indicators appear persistently during the AI Analysis flow and remain accessible in the Agreement Workspace. They are not modal interruptions — they are ambient signals that reinforce founder confidence without requiring attention.

**Displayed during analysis and within every Agreement Workspace:**

| Indicator | Message |
|---|---|
| 🔒 | Your agreement stays private. |
| 📄 | Your original document is preserved exactly as uploaded. |
| 🧠 | Recommendations are generated from both contract content and your founder context. |
| 👤 | Final decisions remain under your control. |

**Placement:** Bottom of the AI Workspace left panel, below agent cards. Subtle. Small type. Not competing with the Decision Stream.

**Rule:** Trust indicators are never shown as a modal, never require dismissal, and never repeat on subsequent analyses. They are part of the ambient environment — present but unobtrusive.

---

## Micro-Interactions

Every interaction has a physical response. These are not decorative — they confirm that the system received the founder's input.

| Trigger | Response |
|---|---|
| Card hover | Elevation increases. Shadow deepens. Y-axis lifts 2px. Duration: 150ms ease-out. |
| Button click | Scale 0.97 for 100ms. Returns to 1.0. |
| Decision card reveal | Scale from 0.95 → 1.0 + fade in. Duration: 300ms ease-out. |
| Drawer open | Slide from right (translateX 100% → 0). Duration: 300ms ease-out. |
| Drawer close | Slide to right. Duration: 200ms ease-in. |
| Decision Stream entry | Fade + translateX(-8px → 0). Stagger: 100ms between entries. |
| Number update | Count animation from previous value to new value. Duration: 600ms ease-out. |
| Skeleton loader | Shimmer left-to-right. Duration: 1.5s loop. |
| Toast notification | Slide up from bottom-right. Auto-dismiss after 3s. Manual dismiss on click. |
| Tab switch | Content fades out (100ms) then fades in (200ms). No slide. |
| Agent activation | Avatar brightness increases. Pulse ring expands and fades. Duration: 800ms. |
| Success state | Checkmark draws in (SVG stroke animation). Duration: 400ms. |

---

## Accessibility

All flows support keyboard-only navigation.

### Tab Order (Global)
1. Skip to main content link (visually hidden, appears on focus)
2. Sidebar navigation items (top to bottom)
3. Page primary content
4. Page secondary content
5. Footer / actions

### Focus States
- All interactive elements have visible focus rings.
- Focus ring: 2px offset, Indigo color, consistent across all components.
- Focus never disappears on click (no `outline: none` without replacement).

### Keyboard Shortcuts
| Key | Action |
|---|---|
| `⌘K` | Open global search |
| `N` | New agreement (when on Workspace or Contracts) |
| `/` | Clause search (when in Decision Center) |
| `Esc` | Close drawer / dismiss modal / clear search |
| `Tab` | Forward navigation |
| `Shift+Tab` | Backward navigation |
| `Enter` | Confirm / select |
| `Arrow Up/Down` | Navigate lists and search results |

### Screen Reader Considerations
- All agent status updates use `aria-live="polite"` so screen readers announce changes without interrupting.
- Decision Stream entries are announced as they appear.
- Decision Card label uses `role="status"` and `aria-label="Decision: NEGOTIATE"`.
- Drawer has `role="dialog"` with `aria-labelledby` pointing to clause heading.

---

## Responsive Behavior

Every flow has desktop, tablet, and mobile behavior defined.

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Sidebar | Full width, always visible | Icon-only, collapsed | Hidden. FAB at bottom-right. |
| Clause Explorer | Right panel (40% width) | Right panel (50% width) | Bottom sheet (85% height) |
| AI Workspace | Two-column (agents left, stream right) | Two-column (stacked) | Single column, tabbed |
| Decision Card | Full card centered | Full card centered | Full width, scrollable |
| Negotiation Workspace | Three sections side-by-side | Two columns | Single column |
| Upload Zone | Large centered area | Large centered area | Full-screen drop target |
| Command Palette | Center modal (600px wide) | Center modal (90% width) | Full screen |

---

## Decision Principles (Flow-Level)

Every flow ends with exactly one primary CTA. Secondary actions exist but are never equal in visual weight.

| Flow End State | Primary CTA | Secondary CTA |
|---|---|---|
| Analysis complete | View Decision | — |
| Decision rendered | Generate Negotiation Strategy | Export Report |
| Negotiation complete | Archive Agreement | Copy Email |
| Clause reviewed | Add to Negotiation | Close Drawer |
| Search result found | Open Workspace | — |
| Error encountered | Retry | Contact Support |

**Rule:** If a screen has more than two CTAs, one of them should be demoted to a text link or removed.

---

## Product Constitution Reference

This document is subordinate to `01_PRODUCT_VISION.md` and `02_INFORMATION_ARCHITECTURE.md`. Every interaction defined here serves the five Product Principles in the Vision document. Every flow follows the navigation structure defined in the Architecture document.

If an interaction conflicts with Principle 3 (Every analysis ends with an action), the interaction must be revised — not the principle.

---

*Document Status: Draft v1.0 — Pending Architect Review*
*All decisions owned by: Product Architect*
*Last reviewed: Sprint 0*
