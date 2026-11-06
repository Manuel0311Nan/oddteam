import type { PoolEntry } from "@/lib/types";

export type CaptureEffort = "low" | "medium" | "high";

export const CAPTURE_EFFORT_LABELS: Record<CaptureEffort, string> = {
  low: "bajo",
  medium: "medio",
  high: "alto",
};

/** specs/03: high with any very rare or 2+ rare members; medium with one rare; low otherwise. */
export function captureEffort(team: readonly PoolEntry[]): CaptureEffort {
  const veryRare = team.filter((m) => m.rarity === "very-rare").length;
  const rare = team.filter((m) => m.rarity === "rare").length;
  if (veryRare > 0 || rare >= 2) return "high";
  if (rare === 1) return "medium";
  return "low";
}
