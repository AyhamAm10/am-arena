/**
 * Arabic countdown for tournament start (matches app RTL copy; units like home tournaments).
 */
function innerAr(ms: number): string {
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;
  if (days > 0) {
    return `${days}ي ${hours}س`;
  }
  if (hours > 0) {
    return `${hours}س ${mins}د`;
  }
  return `${mins}د`;
}

export function formatActiveTournamentCountdownAr(
  startDate: string | null | undefined
): string {
  if (startDate == null || startDate === "") {
    return "—";
  }
  const start = new Date(startDate).getTime();
  if (Number.isNaN(start)) {
    return "—";
  }
  const ms = start - Date.now();
  if (ms <= 0) {
    return "مباشرة الآن";
  }
  return `تبدأ خلال ${innerAr(ms)}`;
}
