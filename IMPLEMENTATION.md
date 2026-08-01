# Mission Recovery — Implementation Checklist

## Architectural Principles & Core Rules

- [x] **Target User**: Lapsed Category Expanders — customers who made exactly one trial purchase in a category outside their usual pattern and have not returned.
- [x] **Corrected Trigger**: Return-visit moment — when a Lapsed Category Expander returns to browse the lapsed category or a related product (NOT first-time product browsing).
- [x] **Stage 2 AI Reasoning Path Split**:
  - **Path A (Known Signal)**: Explicit negative signal on record (return, rating ≤ 3, support ticket). AI addresses specific confirmed failure type.
  - **Path B (Inferred Signal - Primary Majority Case)**: No explicit failure signal on record. AI infers the most probable of the 4 failure types from aggregate reviews, product evidence, and customer order context.
- [x] **Path B Hard Safety Rule**: Path B generated messages must **NEVER** assert or claim knowledge of a specific unconfirmed incident (e.g., must NOT say "we know your last order arrived expired"). Messages must remain general and evidence-forward. Verification (Stage 4) must enforce this and reject/suppress violations.
- [x] **Primary & Secondary Surfaces**:
  - Primary: Native "Order Again" tab row styling.
  - Secondary: Inline category/PDP re-entry row matching the native Blinkit "72 hours only replacement" convention.
- [x] **Metric**: Repeat-Category Conversion Rate (RCCR) with holdout group.

---

## Sequential 10-Task Build Order

- [x] **Task 1: Scaffold Next.js App & Styling System**
  - Scaffold Next.js app with TypeScript and Vanilla CSS / Tailwind visual tokens matching Blinkit design conventions (colors, fonts, PDP/nav components).

- [x] **Task 2: Seed Data Infrastructure**
  - Create mock datasets for customers, order histories (with lapsed category orders), negative signal flags, and rich category/product evidence fields (reorder rate, return rate, seller consistency score, expiry verification data, aggregate review themes).

- [x] **Task 3: Deterministic Lapse Detection Module (`lib/detection/detectLapse.ts`)**
  - Implement Stage 1 deterministic rule engine to flag eligible Lapsed Category Expanders based on single category order, age threshold (N days), lack of repeat purchase, and presence/absence of negative signals.

- [x] **Task 4: AI Reasoning Route (`app/api/reason/route.ts`)**
  - Build server-side Groq integration to perform Stage 2 reasoning for Path A (confirmed signal) and Path B (inferred probable failure type), selecting evidence, generating grounded reassurance text, and recommending an allowed action (`highlight_seller`, `show_expiry_verification`, `show_replacement_guarantee`, `jump_to_reviews`, `focus_cta`, `no_action`).

- [x] **Task 5: Deterministic Confidence Gate (`lib/decision/confidenceGate.ts` & `app/api/gate/route.ts`)**
  - Implement Stage 3 confidence calculation using numeric thresholds over raw evidence (never LLM self-assessment) to gate interventions.

- [x] **Task 6: Verification Engine & Anti-Hallucination Guard (`lib/verification/verifyEvidence.ts`)**
  - Implement Stage 4 verification engine to validate claims against underlying evidence. Enforce hard check for Path B: ensure message does NOT claim any specific unconfirmed incident occurred. Fail closed if verification fails.

- [x] **Task 7: Native "Order Again" Tab Integration**
  - Implement primary customer surface on the "Order Again" tab using native Blinkit UI row styling to present contextually grounded re-engagement interventions.

- [x] **Task 8: Category / PDP Re-Entry Row Integration**
  - Implement secondary customer surface inline on product/category re-entry, styling the Mission Recovery module to match the real Blinkit "72 hours only replacement" row pattern.

- [x] **Task 9: Outcome Logging & RCCR Metric Pipeline**
  - Implement Stage 6 logging for interventions, confidence scores, verification outcomes, and holdout groups, and compute the Repeat-Category Conversion Rate (RCCR) metric.

- [x] **Task 10: Internal Evaluator Mode UI**
  - Build the internal-only Evaluator Mode featuring Customer Case Explorer, AI Decision Trace, Metrics Dashboard with RCCR holdout comparison, System Architecture visual pipeline, and System Experiment Logs.
