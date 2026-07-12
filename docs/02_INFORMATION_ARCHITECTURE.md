# 02 — Information Architecture
**Pactra: Founder Decision Intelligence Platform**
*Version 1.0 — Frozen*

---

## Overview

This document defines the operating system of Pactra.

It is not a sitemap. It is the structural logic behind every page, every route, every navigation decision, and every state transition in the product. Every engineering, design, and UX decision that follows must be consistent with the architecture defined here.

The guiding principle:

> Every screen exists to move the founder one step closer to a confident decision.

---

## 1. Product Structure

Pactra is organized into three distinct layers. Each layer has a single purpose. Mixing concerns across layers is not permitted.

```
Marketing Layer
      ↓
Application Layer
      ↓
Analysis Layer
```

### Marketing Layer
**Purpose:** Convince founders that Pactra is the right tool before they create an account.

This layer exists entirely outside of authentication. No founder data. No sidebar. No application chrome.

| Page | Purpose |
|---|---|
| Landing | Primary acquisition. Communicates value proposition and drives sign-up. |
| Features | Expands on AI specialist capabilities. |
| Why Pactra | Category differentiation. Business context vs. legal review. |
| Pricing | Placeholder for V1. Signals product seriousness. |
| About | Team and product story. |
| Contact | Support entry point. |
| Authentication | Sign in / Sign up. Bridge between Marketing and Application layers. |

### Application Layer
**Purpose:** Help founders manage their decision-making work across all agreements.

This layer is the persistent workspace the founder returns to daily. It provides orientation, history, and navigation — but does not perform analysis itself.

| Page | Purpose |
|---|---|
| Workspace | Primary landing screen after login. Not a dashboard — a living workspace. |
| Contracts | Index of all uploaded agreements and their current status. |
| Negotiations | Active negotiation drafts across all agreements. |
| Analytics | Decision patterns, risk trends, clause frequency. |
| History | Completed and archived agreements. |
| Notifications | Meaningful system alerts only. |
| Settings | Founder profile, startup profile, preferences. |

### Analysis Layer
**Purpose:** Make a decision on a specific agreement.

This layer is entered when the founder begins or continues analysis of a specific contract. It is agreement-scoped, not account-scoped. The sidebar collapses or adapts to keep focus on the analysis.

| Page | Purpose |
|---|---|
| Upload | Contract ingestion entry point. |
| AI Workspace | Live multi-agent analysis command center. |
| Decision Center | Final recommendation with supporting reasoning. |
| Clause Explorer | Deep dive into specific clauses flagged during analysis. |
| Negotiation Workspace | AI-generated negotiation strategy, clause rewrites, and email draft. |

**Architectural reasoning:** Separating the Analysis Layer from the Application Layer prevents the common UX failure where users lose their place during deep analysis. When a founder is in an Agreement Workspace, the entire interface is dedicated to that agreement. They are not one click away from their inbox or dashboard. This is intentional.

---

## 2. The Agreement Workspace Concept

Each uploaded agreement creates its own dedicated Workspace. The founder does not open a PDF. They enter a Workspace.

```
Acme Vendor Agreement Workspace
├── Decision Timeline (spine)
├── Decision
├── AI Insights
├── Clause Explorer (right drawer)
├── Negotiation
└── Timeline
```

**Decision Snapshot** appears in the Agreement Workspace header at all times — visible from every tab within the workspace.

```
Acme Vendor Agreement
─────────────────────────────────────
NEGOTIATE    Risk: High    Confidence: 92%    Last Updated: 2 min ago
─────────────────────────────────────
```

The founder always knows where they stand without scrolling. The snapshot updates as agents complete their analysis.

**The Decision Timeline** is the spine of every Agreement Workspace. It is a persistent vertical feed that records every action, AI output, note, and version change for that agreement — in chronological order.

```
Vendor Agreement
──────────────────
● Uploaded              ✓
● AI Analysis           ✓
● Decision Generated    ✓
● Negotiation Draft     ✓
● Founder Accepted      Pending
──────────────────
```

Every agent finding, every clause flag, every founder action appears here. The timeline makes the workspace feel alive and gives the founder a complete audit trail of how the decision was reached.

**Architectural reasoning:** A static report has no memory. A workspace with a timeline has history, context, and continuity. The Decision Timeline transforms each Agreement Workspace from a one-time analysis into an ongoing record of a business decision — which is exactly what Pactra is.

---

## 3. Navigation Hierarchy

```
Landing
  └── Sign In / Create Account
        └── Founder Onboarding (first login only)
              └── Workspace (primary home)
                    ├── Contracts (Active · Archived · Search)
                    ├── Negotiations
                    ├── Analytics
                    ├── Notifications
                    └── Settings
                          └── Agreement Workspace (per agreement)
                                ├── Decision Timeline
                                ├── AI Workspace
                                ├── Decision Center + Clause Explorer (drawer)
                                └── Negotiation Workspace
```

**Rule:** Navigation depth never exceeds three levels. Founders should never feel lost.

---

## 4. Primary User Journey (Golden Path)

This is the intended experience for every new founder. It is also the demo flow.

```
Landing
  ↓
Create Account
  ↓
Founder Profile Setup
  ↓
Workspace
  ↓
Upload Agreement
  ↓
Founder Context Review
  ↓
AI Analysis (live)
  ↓
Decision Center
  ↓
Negotiation Workspace
  ↓
Save & Archive (inside Contracts)
```

**Architectural reasoning:** This path has no dead ends and no optional detours that distract from the core value. Every step moves the founder forward. If a step is skipped (e.g., founder skips onboarding), the product degrades gracefully but nudges the founder to complete their profile, because context is the engine of personalization.

---

## 5. Page Inventory

Every page is defined by its purpose, inputs, outputs, and primary call to action.

---

### Landing
| | |
|---|---|
| **Purpose** | Communicate value proposition. Drive sign-up. |
| **Input** | None. |
| **Output** | Sign-up intent. |
| **Primary CTA** | Start Free Analysis |

---

### Founder Onboarding
| | |
|---|---|
| **Purpose** | Capture founder business context. This is the Founder Context Engine entry point. |
| **Input** | Company name, industry, funding stage, employees, revenue range, risk appetite, current goal. |
| **Output** | Founder Decision Profile. |
| **Primary CTA** | Build My Decision Profile |

**Architectural reasoning:** Onboarding is not a form. It is the personalization engine initialization. Without this data, every subsequent AI recommendation is generic. This step must feel significant — not like account setup, but like the product is learning to understand the founder.

---

### Workspace (Post-Login Home)
| | |
|---|---|
| **Purpose** | Command center. Orientation. Continuity. |
| **Input** | Founder profile. Contract history. Active workspaces. |
| **Output** | Continue Working hero. Today's priorities. Quick actions. Recent decisions. |
| **Primary CTA** | Analyze New Agreement |

**Continue Working Hero:** The primary section of the Workspace is not a list of contracts. It is a single hero card surfacing the most recently active Agreement Workspace.

```
Continue Working
─────────────────────────────
Vendor Agreement · Decision Ready
Resume →
─────────────────────────────
```

Most founders return to continue existing work, not start new work. The hero section meets them where they are — exactly like Cursor or Figma. New analysis is a secondary action, not the first thing the founder sees.

**Architectural reasoning:** The first screen after login is not a reporting dashboard. It is a workspace. The founder immediately sees where they left off, what needs attention, and what to do next. This is inspired by the interaction model of Cursor, Linear, and Notion — tools that feel alive because they meet the user where they are, not where the product wants them to be.

---

### Contracts
| | |
|---|---|
| **Purpose** | Index of all agreements — active, archived, and searchable. History lives here. |
| **Input** | All uploaded agreements and their lifecycle state. |
| **Output** | Tabbed view: Active · Archived · Search |
| **Primary CTA** | Upload New Agreement |

```
Contracts
├── Active        (In progress agreements)
├── Archived      (Completed decisions — replaces standalone History page)
└── Search        (Global agreement search)
```

**Architectural reasoning:** A standalone History page duplicates what Contracts already knows. Active and Archived are simply two states of the same entity. Collapsing History into Contracts reduces top-level navigation clutter and gives the founder one place to find any agreement regardless of status.

---

### Upload
| | |
|---|---|
| **Purpose** | Agreement ingestion. Entry point to Analysis Layer. |
| **Input** | PDF, DOCX, or TXT file. |
| **Output** | Agreement Workspace created. Founder Context Review triggered. |
| **Primary CTA** | Begin Analysis |

---

### Founder Context Review
| | |
|---|---|
| **Purpose** | Confirm or update founder business context before analysis begins. Reinforces the USP. |
| **Input** | Existing founder profile from onboarding. |
| **Output** | Confirmed or updated context passed to all AI agents. |
| **Primary CTA** | Continue / Update |

This step appears after every upload. It is not optional.

```
Before we analyze this agreement...
Is your startup context still accurate?

Employees        12
Revenue          ₹50L ARR
Funding Stage    Pre-Seed
Risk Appetite    Moderate

[Update Profile]     [Looks Good — Continue]
```

**Architectural reasoning:** Context is the engine of Pactra's personalization. If a founder's funding stage changed, or their risk appetite shifted after a difficult quarter, their previous profile would produce outdated recommendations. The Founder Context Review makes the personalization visible — not hidden in settings. It signals to the founder that Pactra is using their business situation, not just the contract text, to generate its recommendations. This is our biggest differentiator. We should show it, not hide it.

---

### AI Workspace
| | |
|---|---|
| **Purpose** | Live multi-agent analysis. The WOW moment. |
| **Input** | Parsed agreement. Founder context. |
| **Output** | Agent progress panels. Live Decision Feed. Completion signals. |
| **Primary CTA** | View Decision |

**Two-panel layout:**

Left panel — Agent Progress: Visual progress bars and status indicators per agent (Legal Advisor, Financial Strategist, Growth Advisor, Negotiation Coach, Decision Engine).

Right panel — Decision Stream: A real-time log of agent reasoning as it emerges. Not just status — actual findings.

```
Decision Stream
─────────────────────────────
🧠 Legal Advisor
   Found unlimited liability clause in §4.2
─────────────────────────────
💰 Financial Strategist
   Estimated exposure increased to 3× contract value
─────────────────────────────
📈 Growth Advisor
   Identified potential scaling restriction in §7
─────────────────────────────
```

**Architectural reasoning:** Progress bars tell the founder that something is happening. The Decision Stream shows them what is being discovered. Watching reasoning unfold in real time — like GitHub Actions logs or an event stream — transforms a loading screen into the most engaging moment in the product.

---

### Decision Center
| | |
|---|---|
| **Purpose** | Primary recommendation. The moment of truth. |
| **Input** | All agent outputs. Decision Engine synthesis. |
| **Output** | SIGN / NEGOTIATE / WAIT / ESCALATE. Business impact. Risk level. Top 3 actions. |
| **Primary CTA** | Generate Negotiation Strategy |

---

### Clause Explorer (Right Drawer)
| | |
|---|---|
| **Purpose** | Deep dive into flagged clauses without breaking Decision Center flow. |
| **Input** | Clause selected from Decision Center. |
| **Output** | Plain-English explanation. Business impact. Risk rating. Suggested rewrite. |
| **Primary CTA** | Add to Negotiation |

**Architectural reasoning:** Clause Explorer is not a page. It is a right-side drawer that opens within the Decision Center. Navigating away from the Decision Center to inspect a clause — then navigating back — breaks the founder's flow at exactly the wrong moment. The drawer preserves context. The founder sees the full decision while simultaneously exploring a specific clause.

```
Decision Center                    │ Clause Explorer Drawer
───────────────────────────────────│────────────────────────
NEGOTIATE                          │ §4.2 Unlimited Liability
                                   │
Business Impact  Financial Risk    │ Plain English
                                   │ This clause holds you
Top Clauses                        │ responsible for all
· Unlimited Liability    [View →]  │ damages with no cap.
· Auto-Renewal           [View →]  │
· IP Assignment          [View →]  │ Business Impact
                                   │ High exposure for a
                                   │ pre-seed startup.
                                   │
                                   │ Suggested Rewrite
                                   │ "Liability shall not
                                   │ exceed the total fees..."
                                   │
                                   │ [Add to Negotiation]
```

---

### Negotiation Workspace
| | |
|---|---|
| **Purpose** | Structured negotiation output. |
| **Input** | Decision Center output. Clause Explorer flags. |
| **Output** | Negotiation priorities. Clause rewrites. Negotiation email draft. |
| **Primary CTA** | Copy Email / Export |

---

### Analytics
| | |
|---|---|
| **Purpose** | Pattern recognition across all agreements. |
| **Input** | All completed analyses. |
| **Output** | Decision distribution. Risk trend. Clause frequency. Contract types. Negotiation success rate. |
| **Primary CTA** | Export Report |

---

### Notifications
| | |
|---|---|
| **Purpose** | Meaningful system alerts only. No noise. |
| **Input** | System events. |
| **Output** | Analysis complete. Negotiation ready. Contract archived. |
| **Primary CTA** | View |

---

### Settings
| | |
|---|---|
| **Purpose** | Founder profile management. Startup profile updates. Preferences. |
| **Input** | Existing profile data. |
| **Output** | Updated founder context. |
| **Primary CTA** | Save Changes |

---

## 6. Route Structure

```
/                          Landing
/login                     Authentication
/onboarding                Founder Profile Setup (first login only)
/workspace                 Workspace (post-login home)
/contracts                 Contract Index (Active · Archived · Search)
/contracts/new             Upload Entry Point
/contracts/new/context     Founder Context Review
/contracts/:id             Agreement Workspace
/contracts/:id/analysis    AI Workspace
/contracts/:id/decision    Decision Center (Clause Explorer as drawer)
/contracts/:id/negotiate   Negotiation Workspace
/analytics                 Analytics
/settings                  Settings
```

**Note on `/dashboard`:** The route is `/workspace` to reinforce the product's identity as a decision workspace, not a reporting dashboard. The page title reads "Welcome back, [Name]" — the URL signals product philosophy.

---

## 7. Sidebar Rules

The sidebar is the primary navigation element inside the Application Layer.

| Context | Behavior |
|---|---|
| Marketing Layer | Not visible. |
| Application Layer | Always visible. Full width. |
| Analysis Layer | Collapsed to icon-only. Agreement context takes priority. |
| Tablet | Collapsed by default. Expandable on demand. |
| Mobile | Hidden. Replaced by floating action button. |

**Sidebar navigation items (Application Layer):**
```
Workspace
Contracts
Negotiations
Analytics
Settings
```

History is not a sidebar item. It lives inside Contracts → Archived tab.

**Architectural reasoning:** The sidebar disappears when it would compete with the analysis experience. This is not a technical constraint — it is a deliberate focus mechanism. When a founder is analyzing a contract, nothing should distract them.

---

## 8. Keyboard Shortcuts

Pactra supports keyboard-first interactions for power users.

| Shortcut | Action |
|---|---|
| ⌘K | Global search |
| N | New agreement upload |
| / | Search clauses (within Decision Center) |
| Esc | Close drawer / dismiss modal |

**Architectural reasoning:** Keyboard shortcut support signals engineering maturity and attracts power users. These shortcuts do not need to be discoverable on first use — a command palette (⌘K) surfaces them naturally.

---

## 8. Information Priority

Every page has one primary piece of information. Everything else supports it.

| Page | Primary Information |
|---|---|
| Workspace | Where did I leave off and what needs my attention today? |
| Contracts | What is the status of each agreement? |
| AI Workspace | Which agents are working and what are they finding right now? |
| Decision Center | Should I sign this agreement? |
| Clause Explorer (drawer) | What does this clause actually mean for my business? |
| Negotiation Workspace | What should I ask for and how should I ask for it? |
| Analytics | What patterns exist across all my agreements? |

**Rule:** If a page attempts to answer two primary questions simultaneously, it should be split or one question should be demoted to secondary status.

---

## 9. Contract State Flow

Every agreement follows a strict lifecycle. States are linear with one exception: Archived can be reopened.

```
No Contract
    ↓
Uploaded
    ↓
Analyzing
    ↓
Decision Ready
    ↓
Negotiation Active
    ↓
Completed
    ↓
Archived
```

Each state has:
- A visual status badge
- A default next action
- A defined UI treatment in the Contracts index

---

## 10. Error States

Every error state has a dedicated UI treatment. Empty states are not allowed to be blank screens.

| Error | UI Response |
|---|---|
| No contracts uploaded | Illustrated empty state with CTA: "Analyze Your First Agreement" |
| Upload failed | Inline error with retry option and supported format reminder |
| AI analysis timeout | Progress indicator replaced with retry prompt and estimated wait |
| Network lost | Persistent banner with reconnection status |
| Empty history | Motivational empty state: "Your completed decisions will appear here" |
| Analysis unavailable | Graceful degradation message with support contact |

---

## 11. Global Search

Search is accessible from every page in the Application Layer via keyboard shortcut and persistent search icon.

**Searchable entities:**
- Agreements (by name, date, type)
- Clauses (by keyword)
- Recommendations (by decision outcome)
- History entries

**Not searchable in V1:** Notifications, settings, analytics data.

---

## 12. Notifications

Notifications are minimal and meaningful. Every notification must represent a state change that requires founder attention.

**Permitted notification triggers:**
- Analysis complete
- Negotiation draft ready
- Agreement archived
- Profile incomplete (onboarding nudge)

**Not permitted:**
- Marketing messages
- Feature announcements
- Generic activity digests
- Engagement prompts

---

## 13. User Roles

V1 has exactly one user role: **Founder.**

There is no admin panel, no reviewer role, no lawyer access, no team collaboration, and no enterprise hierarchy. Every feature is designed for a single founder operating independently.

**Architectural reasoning:** Role complexity is the fastest way to bloat a hackathon product into something that feels unfinished. One role means one experience, fully polished.

---

## 14. Future Expansion (Document, Do Not Build)

The following features are intentionally excluded from V1. They are documented here to demonstrate product vision without adding scope.

| Future Feature | Rationale for Deferral |
|---|---|
| Investor agreement templates | Requires legal review workflow |
| Team collaboration | Requires role system |
| CRM integration | Requires third-party auth |
| Calendar reminders | Requires notification infrastructure |
| Email sync | Requires OAuth and inbox permissions |
| DocuSign integration | Requires signing workflow |
| Procurement workflows | Requires enterprise features |

---

## 15. What Pactra Does Not Surface (UI Constraints)

Pactra does not include a floating chat panel, AI assistant bubble, or chatbot interface of any kind.

Intelligence is communicated through:
- Agent cards with progress and reasoning
- Decision Stream (live output)
- Decision Timeline (audit trail)
- Decision Center (final recommendation)

That is sufficient. A chat panel would reduce a structured decision workflow to a conversation — which is exactly what Pactra is not.

---

## 16. The Demo Script (Embedded in Architecture)

The primary user journey is also the submission demo script. No separate storyboarding required.

```
Landing
  ↓
Workspace
  ↓
Upload
  ↓
Context Review
  ↓
Decision Stream
  ↓
Decision Center
  ↓
Clause Drawer
  ↓
Negotiation Workspace
  ↓
Archive
```

Every architectural decision made in this document was made to make this sequence feel inevitable, not constructed.

---

## Product Constitution Reference

This document is subordinate to `01_PRODUCT_VISION.md`. Every architectural decision here serves the five Product Principles defined in the Vision document. If any structural decision appears to conflict with those principles, the Vision document takes precedence.

---

*Document Status: Draft v1.0 — Pending Architect Review*
*All decisions owned by: Product Architect*
*Last reviewed: Sprint 0*
