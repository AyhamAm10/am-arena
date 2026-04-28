import { colors_V2 } from "@/src/theme/colors";

/**
 * Feature-local tokens for the Tournaments tab (pixel tuning on top of global `colors_V2`).
 */
export const tournamentsTheme = {
  screenBg: colors_V2.background,
  surface: colors_V2.card,
  /** Active card stats panel (slightly lifted from screen bg). */
  activeCardPanel: "#221A2E",
  surfaceMuted: "#16111F",
  eyebrowLive: colors_V2.primaryLight,
  eyebrowArchive: colors_V2.textSecondary,
  title: colors_V2.textPrimary,
  bodyMuted: colors_V2.textSecondary,
  statLabelMuted: "#8E8AA0",
  openEntry: colors_V2.primaryLight,
  openEntryBadgeBg: colors_V2.primaryLight,
  openEntryBadgeText: colors_V2.background,
  openEntryBg: "rgba(167, 139, 250, 0.2)",
  /** Primary → gradient end (active JOIN button). */
  joinGradient: [colors_V2.gradientStart, colors_V2.gradientEnd] as const,
  joinDisabled: ["#3D3550", "#3D3550"] as const,
  joinTextOnGradient: colors_V2.background,
  joinTextDisabled: colors_V2.textSecondary,
  progressTrack: "#1E1828",
  progressFill: colors_V2.primaryLight,
  countdownBright: colors_V2.primaryLight,
  divider: "#2A2438",
  searchBg: colors_V2.card,
  searchBorder: "#3D3550",
  error: colors_V2.error,
  champion: colors_V2.accent,
  /** Past card */
  pastCardBg: "#141018",
  pastWinnerLine: colors_V2.gradientEnd,
  replayLavender: colors_V2.primaryLight,
} as const;
