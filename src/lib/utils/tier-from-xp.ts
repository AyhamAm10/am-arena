/** Display tier label for leaderboards (no backend tier field). */
export function tierLabelFromXp(xp: number): string {
  const x = Number.isFinite(xp) ? xp : 0;
  if (x >= 20000) return "مستوى أسطوري";
  if (x >= 12000) return "مستوى الماس";
  if (x >= 8000) return "مستوى البلاتين";
  if (x >= 4000) return "مستوى الذهب";
  if (x >= 1500) return "مستوى الفضة";
  return "مستوى البرونز";
}
