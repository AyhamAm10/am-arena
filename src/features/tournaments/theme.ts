/**
 * Feature-local tokens for the Tournaments tab (pixel tuning without changing global theme).
 */
export const tournamentsTheme = {
  screenBg: "#1a1125",
  surface: "#2b1d3d",
  /** Active card stats panel (slightly lifted from screen bg). */
  activeCardPanel: "#322248",
  surfaceMuted: "#241833",
  eyebrowLive: "#7ec8ff",
  eyebrowArchive: "#a89bc4",
  title: "#f2e9ff",
  bodyMuted: "#9a8bb0",
  statLabelMuted: "#8b7aa0",
  openEntry: "#00a3ff",
  openEntryBadgeBg: "#00a3ff",
  openEntryBadgeText: "#0a0a0a",
  openEntryBg: "rgba(0, 163, 255, 0.2)",
  /** Purple → lavender (active JOIN button). */
  joinGradient: ["#7b5cff", "#c9a8ff"] as const,
  joinDisabled: ["#4a3d5c", "#4a3d5c"] as const,
  joinTextOnGradient: "#2d0f52",
  joinTextDisabled: "#6a5c78",
  progressTrack: "#2a1f38",
  progressFill: "#5ecbff",
  countdownBright: "#7ecbff",
  divider: "#3d2f52",
  searchBg: "#241833",
  searchBorder: "#4a3d5c",
  error: "#ff8a8a",
  champion: "#ffd36a",
  /** Past card (mock ~#1A1A1A). */
  pastCardBg: "#1a1a1a",
  pastWinnerLine: "#c4b0e8",
  replayLavender: "#b8a0e8",
} as const;
