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
