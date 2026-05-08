import { colors, colors_V2 } from "@/src/theme/colors";
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
    borderRadius: 20,
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    // paddingHorizontal: 16,
    // paddingVertical: 12,
    // backgroundColor: chatTheme.footerBg,
    borderColor: colors_V2.primary,
    borderWidth: 1,
    borderRadius: 24,
  },
  input: {
    flex: 1,
    backgroundColor: chatTheme.cardBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: chatTheme.white,
    marginRight: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  /* message list layout */
  rowWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  rowLeft: {
    justifyContent: "flex-start",
  },
  rowRight: {
    justifyContent: "flex-end",
  },
  avatarWrap: {
    marginRight: 10,
  },
  avatarWrapRight: {
    marginLeft: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircleMine: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: chatTheme.cyan,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  avatarInitial: {
    color: chatTheme.white,
    fontWeight: "800",
  },
  avatarInitialMine: {
    color: "#000",
    fontWeight: "800",
    fontSize: 11,
  },
  bubbleContainer: {
    maxWidth: "78%",
  },
  bubbleLeftContainer: {
    alignItems: "flex-start",
  },
  bubbleRightContainer: {
    alignItems: "flex-end",
  },
  senderName: {
    fontSize: 12,
    color: chatTheme.muted,
    marginBottom: 4,
    fontWeight: "700",
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  bubbleOther: {
    backgroundColor: chatTheme.cardBg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  bubbleMine: {
    backgroundColor: chatTheme.cyan,
  },
  bubbleAdmin: {
    backgroundColor: "rgba(125,45,255,0.18)",
    borderWidth: 1,
    borderColor: chatTheme.cyan,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextOther: {
    color: chatTheme.white,
  },
  bubbleTextMine: {
    color: "#0b0812",
  },
  bubbleTimestamp: {
    fontSize: 10,
    color: chatTheme.muted,
    alignSelf: "flex-end",
    marginTop: 6,
  },
  editInput: {
    minWidth: 120,
    color: chatTheme.white,
    fontSize: 14,
    padding: 8,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  editActionText: {
    color: chatTheme.muted,
    fontSize: 13,
  },
  actionMenu: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  actionText: {
    color: chatTheme.white,
    marginLeft: 6,
    fontSize: 13,
  },
  timeText: {
    fontSize: 11,
    color: chatTheme.muted,
    marginTop: 6,
  },
  timeLeft: {
    textAlign: "left",
  },
  timeRight: {
    textAlign: "right",
  },
});
