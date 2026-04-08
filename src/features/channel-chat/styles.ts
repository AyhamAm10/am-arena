import { colors } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const chatTheme = {
  bg: colors.screenBackground,
  headerBg: colors.darkBackground1,
  cardBg: colors.darkBackground1,
  cardBorder: colors.darkBackground1,
  cyan: colors.neonBlue,
  white: colors.white,
  muted: colors.grey,
  accent: colors.primaryPurple,
  footerBg: colors.darkBackground1,
};

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: chatTheme.bg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: chatTheme.headerBg,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: chatTheme.white,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  messageCard: {
    backgroundColor: chatTheme.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: chatTheme.cardBorder,
    borderLeftWidth: 3,
    borderLeftColor: chatTheme.cyan,
    padding: 16,
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: chatTheme.cyan,
    textTransform: "uppercase",
  },
  messageContent: {
    fontSize: 14,
    lineHeight: 22,
    color: chatTheme.white,
    fontStyle: "italic",
  },
  timestamp: {
    marginTop: 10,
    fontSize: 12,
    color: chatTheme.muted,
    textAlign: "right",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: chatTheme.bg,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: chatTheme.cardBorder,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "700",
    color: chatTheme.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    marginBottom: 12,
  },
  retryText: {
    color: chatTheme.cyan,
    fontWeight: "600",
  },
});
