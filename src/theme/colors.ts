export const colors_V2 = {
  background: "#0D0A14",
  card: "#191423",
  primary: "#8B5CF6",
  primaryLight: "#A78BFA",
  textPrimary: "#FFFFFF",
  textSecondary: "#A5A3B3",
  accent: "#E9C400",
  success: "#10B981",
  error: "#F43F5E",
  gradientStart: "#8B5CF6",
  gradientEnd: "#D8B9FF",
  skyBlue: "#007AFF",
  slate: "#808080",
};

/**
 * Legacy palette keys — map to `colors_V2` for gradual migration in styles.
 * Prefer `colors_V2` directly in new code.
 */
export const colors = {
  primaryPurple: colors_V2.primary,
  neonBlue: colors_V2.primaryLight,
  gold: colors_V2.accent,
  screenBackground: colors_V2.background,
  darkBackground1: colors_V2.background,
  darkBackground2: colors_V2.card,
  white: colors_V2.textPrimary,
  grey: colors_V2.textSecondary,
  error: colors_V2.error,
};
