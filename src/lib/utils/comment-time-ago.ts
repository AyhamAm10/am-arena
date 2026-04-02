/** Short relative label for comment timestamps. */
export function formatCommentTimeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const sec = Math.floor((Date.now() - t) / 1000);
  if (sec < 60) return "الآن";
  const min = Math.floor(sec / 60);
  if (min < 60) return `منذ ${min} د`;
  const h = Math.floor(min / 60);
  if (h < 48) return `منذ ${h} س`;
  const d = Math.floor(h / 24);
  if (d < 14) return `منذ ${d} ي`;
  const w = Math.floor(d / 7);
  return `منذ ${w} أ`;
}
