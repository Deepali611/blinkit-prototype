# Mission Recovery — Blinkit

## The Problem
Blinkit already gets customers to try new categories — discovery isn't broken. What's missing: a customer tries a category once, hits a specific, nameable failure (expired product, no reviews, unresolved support, high-value hesitation), and nothing in that experience invites a second attempt. So they don't return. (Source: 1,176 reviews analyzed, 6 customer interviews — Parts 1-3, frozen.)

## Who This Targets
Lapsed Category Expanders: customers with exactly one order in a category outside their usual pattern, 14+ days old, zero repeat purchases since.

## The Mechanism
When a Lapsed Category Expander returns to their lapsed category, the system:
1. **Detects** eligibility (deterministic rule — order history only, no AI).
2. **Reasons** (AI-native core): given a confirmed signal (Path A — a return, low rating, or support ticket) or none (Path B — the majority case, per our own interviews), selects the evidence that most directly addresses that specific failure type and generates a grounded, non-templated reassurance.
3. **Gates** on a deterministic confidence score computed from real product data (reorder rate, return rate, seller consistency) — never the model's own self-assessment.
4. **Verifies** every claim against real evidence before display, and enforces a hard rule: Path B (no confirmed signal) can never claim to know a specific incident happened to that customer.
5. **Defaults to nothing** — most sessions, the customer sees the normal Blinkit screen. The intervention is the exception.
6. **Logs** every outcome for measurement.

## Why This Needs AI
Path A: selecting which of several valid evidence types answers a specific confirmed complaint isn't a lookup. Path B (the common case): inferring the most probable failure type with zero explicit signal, from aggregate evidence, is a reasoning task — there's nothing to look up. Remove the AI, and personalization collapses to one generic message for everyone, or nothing at all.

## Explicitly Out of Scope (stated, not hidden)
- **High-value purchase hesitation**: identified in our research as a real failure type, but this MVP does not yet have a validated remedy for it — evidence and process-based fixes don't clearly address it. Flagged as future work, not silently dropped.
- **Price and catalog/discovery**: out of scope per Part 3's original findings — real, secondary factors, deliberately deferred.

## Metrics

**Repeat-Category Conversion Rate (RCCR)**
- Numerator: lapsed customers who repurchase in their lapsed category within 30 days of an intervention.
- Denominator: lapsed customers who received an intervention.
- Rationale: the most direct signal that this specific intervention caused a specific abandoned purchase to complete.
- Note: this proves same-category recovery — the literal design objective from Part 3 — not the full platform KPI by itself.

**New-Category Expansion Rate (NCER)**
- Numerator: RCCR-converted customers who also purchase from a third, never-before-purchased category within 30 days.
- Denominator: all RCCR-converted customers.
- Rationale: tests whether recovery in one category spills over into genuine new-category exploration — the actual platform KPI. Known limitation: self-selection (recovered customers may simply be more exploratory to begin with) is not fully ruled out at this sample size.

Both metrics use a holdout group (no intervention shown) to isolate causal lift from coincidence.

## AI Risk & Mitigation
- **Path B wrong inference**: possible; mitigated by the anti-overclaim rule (never asserts a specific unconfirmed incident) and by outcome logging that tracks Path B conversion rate separately from Path A, surfacing inference quality issues over time.
- **False positives in detection**: a customer may be flagged as lapsed without genuine hesitation; cost is low (one unneeded card), mitigated by revisiting thresholds based on logged non-engagement.
- **Confidence threshold miscalibration**: thresholds are a first-pass estimate, not validated against a large real dataset; the holdout comparison by confidence tier is the intended mechanism for revisiting them.
- **Verification scope**: catches factual/overclaim errors, not tone or persuasiveness — a known, stated limitation, not a hidden one.

## Sample Size Note
Demo/seed data is synthetic, at small scale. Any percentage shown should be read as illustrative of the mechanism, not a statistically validated result.

## Evaluator Mode
Separate, internal-only route, not linked from the customer-facing app. Shows the full decision trace, metrics, and experiment logs for every case.