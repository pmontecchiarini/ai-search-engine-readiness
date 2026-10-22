// Shared shape for a single check's display copy, used by metrics.ts (data),
// phases.ts (scoring/grouping) and page.tsx (rendering).
export interface MetricContent {
  title: string;
  friendlyTitle: string;
  priority: string;
  description: string;
  impact_if_false: string;
  recommendation: string | string[];
}

export type MetricSet = Record<string, MetricContent>;
export type AuditResults = Record<string, boolean>;
