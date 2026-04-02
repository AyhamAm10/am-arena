/** Formats compact counts for reel overlays (Arabic-friendly). */
export function formatCompactCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n < 1000) return String(Math.floor(n));
  if (n < 10_000) {
    const k = n / 1000;
    const s = k >= 10 ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, "");
    return `${s} ألف`;
  }
  if (n < 1_000_000) return `${Math.round(n / 1000)} ألف`;
  const m = n / 1_000_000;
  const s = m >= 10 ? m.toFixed(0) : m.toFixed(1).replace(/\.0$/, "");
  return `${s} مليون`;
}
