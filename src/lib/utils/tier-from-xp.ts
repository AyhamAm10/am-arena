/** Display tier label for leaderboards (no backend tier field). */
export function tierLabelFromXp(xp: number): string {
  const x = Number.isFinite(xp) ? xp : 0;
  if (x >= 20000) return "MYTHIC TIER";
  if (x >= 12000) return "DIAMOND TIER";
  if (x >= 8000) return "PLATINUM TIER";
  if (x >= 4000) return "GOLD TIER";
  if (x >= 1500) return "SILVER TIER";
  return "BRONZE TIER";
}
