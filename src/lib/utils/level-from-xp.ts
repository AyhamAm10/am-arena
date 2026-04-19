/**
 * Level and bar progress within the current level (same rules as profile header).
 * 500 XP per level segment; level capped at 999.
 */
export function computeLevelAndProgress(xp: number): {
  level: number;
  progress: number;
} {
  const safe = Number.isFinite(xp) ? xp : 0;
  const level = Math.max(1, Math.floor(safe / 500) + 1);
  const progress = (safe % 500) / 500;
  return { level: Math.min(level, 999), progress };
}

/**
 * Minimum player level implied by a total-XP gate (e.g. tournament `Xp_condition`).
 * Uses the same formula as {@link computeLevelAndProgress}: level = floor(xp/500)+1 (capped).
 * Returns 0 when xp ≤ 0 (no gate / not set).
 */
export function requiredLevelFromXpThreshold(xp: number): number {
  const safe = Number.isFinite(xp) ? Math.max(0, Math.trunc(xp)) : 0;
  if (safe <= 0) return 0;
  const { level } = computeLevelAndProgress(safe);
  return level;
}
