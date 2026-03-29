/**
 * Human-readable time until tournament start (no extra date libs).
 */
export function formatTournamentTimeRemaining(
  startDate: string | null | undefined
): string {
  if (startDate == null || startDate === "") {
    return "—";
  }
  const start = new Date(startDate).getTime();
  if (Number.isNaN(start)) {
    return "—";
  }
  const now = Date.now();
  const ms = start - now;
  if (ms <= 0) {
    return "Started";
  }
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}
