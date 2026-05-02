import { colors as c } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

/** Friends screen — AM ARENA mock (deep purple, cyan tabs, cards). */
export const friendsColors = {
  bg: c.screenBackground,
  cardBg: c.darkBackground1,
  inputBg: c.darkBackground2,
  tabInactive: c.grey,
  tabActive: c.neonBlue,
  labelMuted: c.grey,
  white: c.white,
  online: "#22C55E",
  offline: c.grey,
  brandPurple: c.primaryPurple,
  pillTrack: c.darkBackground2,
};

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  searchWrap: {
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: friendsColors.inputBg,
    borderRadius: 18,
    minHeight: 52,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: friendsColors.white,
    fontSize: 15,
    textAlign: "right",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: friendsColors.pillTrack,
    borderRadius: 18,
    padding: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },
  tabBtnActive: {},
  tabLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.2,
    color: friendsColors.tabInactive,
  },
  tabLabelActive: {
    color: friendsColors.tabActive,
  },
  tabUnderline: {
    marginTop: 6,
    height: 3,
    width: 34,
    backgroundColor: friendsColors.tabActive,
    borderRadius: 999,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: friendsColors.labelMuted,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: friendsColors.cardBg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  card: {
    backgroundColor: friendsColors.cardBg,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardPressable: {
    flexDirection: "row-reverse",
    alignItems: "stretch",
    flex: 1,
    minWidth: 0,
  },
  avatarWrap: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: c.darkBackground1,
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
    borderColor: friendsColors.cardBg,
  },
  statusOnline: {
    backgroundColor: friendsColors.online,
  },
  statusOffline: {
    backgroundColor: friendsColors.offline,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-end",
    marginRight: 6,
  },
  gamerName: {
    fontSize: 18,
    fontWeight: "700",
    color: friendsColors.white,
    textAlign: "right",
  },
  statusText: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
  },
  statusOnlineText: {
    color: friendsColors.online,
  },
  statusOfflineText: {
    color: friendsColors.offline,
  },
  actionBtn: {
    minWidth: 74,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: c.darkBackground2,
    borderWidth: 1,
    borderColor: c.primaryPurple,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    color: friendsColors.white,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  acceptBtn: {
    backgroundColor: "rgba(34, 197, 94, 0.08)",
    borderColor: friendsColors.online,
  },
  rejectBtn: {
    backgroundColor: "rgba(244, 114, 182, 0.08)",
    borderColor: c.error,
  },
  centerMessage: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: c.error,
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  mutedText: {
    color: friendsColors.labelMuted,
    fontSize: 14,
    textAlign: "center",
  },
});
