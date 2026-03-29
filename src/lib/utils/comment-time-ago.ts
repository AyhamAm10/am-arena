/** Short relative label e.g. "2H AGO", "3D AGO". */
export function formatCommentTimeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const sec = Math.floor((Date.now() - t) / 1000);
  if (sec < 60) return "NOW";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}M AGO`;
  const h = Math.floor(min / 60);
  if (h < 48) return `${h}H AGO`;
  const d = Math.floor(h / 24);
  if (d < 14) return `${d}D AGO`;
  const w = Math.floor(d / 7);
  return `${w}W AGO`;
}
