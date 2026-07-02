// src/constants/phases.ts
// Presentational grouping + scoring for the results view.
// The backend returns a flat { [key: string]: boolean } map of 10 checks.
// These constants slot each check into a strategic "phase" and compute a
// priority-weighted global readiness score. No backend change is involved.

import { AUDIT_METRICS_DATA } from './metrics';

interface MetricContent {
  title: string;
  priority: string;
  description: string;
  impact_if_false: string;
  recommendation: string | string[];
}

type MetricSet = Record<string, MetricContent>;
type AuditResults = Record<string, boolean>;

// The two /llms.txt backend checks are merged into a single "AI Agent Map" card.
export const LLMS_TXT_KEYS = ['llms_txt', 'llms_txt_quality'] as const;

// Phase 1 — Code & Governance (Quick Wins). The literal 'llms_txt' entry is the
// anchor for the merged /llms.txt card (llms_txt_quality is folded into it in the UI).
export const PHASE_1_KEYS = ['json_ld', 'security_headers', 'llms_txt', 'ai_governance'] as const;

// Phase 2 — Content Optimization (Ongoing Strategy).
export const PHASE_2_KEYS = ['citation_triggers', 'geo_optimized', 'token_efficiency'] as const;

// Orphan technical checks, shown collapsed in an "Additional Technical Checks" section.
export const ADDITIONAL_KEYS = ['bot_verification_ready', 'crawl_maturity'] as const;

// Priority weights. Keyed off the ENGLISH priority strings only, so scoring is
// language-independent (the ES set uses translated strings like "CRITICO").
export const PRIORITY_WEIGHTS: Record<string, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const METRICS_EN = AUDIT_METRICS_DATA['en'] as MetricSet;

/** English priority string for a check key (falls back to LOW), for weighting + sorting. */
export function priorityFor(key: string): string {
  return METRICS_EN[key]?.priority ?? 'LOW';
}

/**
 * Weighted global readiness score (0–100) over ALL returned checks.
 * Each check contributes its priority weight; passed checks earn that weight.
 * score = round( (Σ weight passed / Σ weight present) × 100 ).
 */
export function calculateReadinessScore(results: AuditResults): number {
  let earned = 0;
  let total = 0;
  for (const [key, passed] of Object.entries(results)) {
    const weight = PRIORITY_WEIGHTS[priorityFor(key)] ?? 1;
    total += weight;
    if (passed) earned += weight;
  }
  if (total === 0) return 0;
  return Math.round((earned / total) * 100);
}

export interface ScoreBand {
  ring: string; // SVG stroke class for the foreground ring
  text: string; // text color class for the number/verdict
  band: 'red' | 'yellow' | 'green';
}

/** Color band for a score: <50 red, 50–79 yellow, 80+ green. */
export function scoreColorClasses(score: number): ScoreBand {
  if (score < 50) return { ring: 'stroke-red-500', text: 'text-red-400', band: 'red' };
  if (score < 80) return { ring: 'stroke-amber-400', text: 'text-amber-300', band: 'yellow' };
  return { ring: 'stroke-green-500', text: 'text-green-400', band: 'green' };
}
