/** English countdown label for tournament start (tournaments tab copy). */
export function formatTournamentCountdownEn(
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
    return "LIVE";
  }
  return formatCountdownInnerFromMs(ms);
}

/** e.g. "3h 45m", "2d 5h" — used inside "Starts in …" on the active card. */
function formatCountdownInnerFromMs(ms: number): string {
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

/** Active card copy: "Starts in 3h 45m" or "Live now" when already started. */
export function formatActiveTournamentCountdown(
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
    return "Live now";
  }
  return `Starts in ${formatCountdownInnerFromMs(ms)}`;
}
