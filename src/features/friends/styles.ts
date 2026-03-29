import { StyleSheet } from "react-native";

/** Friends screen — Aether Arena mock (deep purple, cyan tabs, cards). */
export const friendsColors = {
  bg: "#120c1a",
  cardBg: "#1e1529",
  inputBg: "#1e1529",
  tabInactive: "#9B8FB8",
  tabActive: "#22D3EE",
  labelMuted: "#8B7FA3",
  white: "#FFFFFF",
  online: "#22C55E",
  offline: "#6B7280",
  brandPurple: "#A855F7",
  pillTrack: "#261a35",
};

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  searchWrap: {
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: friendsColors.inputBg,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2d2440",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: friendsColors.white,
    fontSize: 15,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: friendsColors.pillTrack,
    borderRadius: 999,
    padding: 4,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 999,
  },
  tabBtnActive: {},
  tabLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: friendsColors.tabInactive,
  },
  tabLabelActive: {
    color: friendsColors.tabActive,
  },
  tabUnderline: {
    marginTop: 4,
    height: 2,
    width: "60%",
    backgroundColor: friendsColors.tabActive,
    borderRadius: 1,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: friendsColors.labelMuted,
  },
  filterBtn: {
    padding: 6,
  },
  card: {
    backgroundColor: friendsColors.cardBg,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2d2440",
  },
  avatarWrap: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2d2440",
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
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
  },
  gamerName: {
    fontSize: 16,
    fontWeight: "700",
    color: friendsColors.white,
  },
  statusText: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  statusOnlineText: {
    color: friendsColors.online,
  },
  statusOfflineText: {
    color: friendsColors.offline,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#2a1f3d",
    borderWidth: 1,
    borderColor: "#3d3450",
  },
  actionBtnText: {
    color: friendsColors.white,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  acceptBtn: {
    backgroundColor: "#0e3d32",
    borderColor: friendsColors.online,
  },
  rejectBtn: {
    backgroundColor: "#3d1f24",
    borderColor: "#9f4a54",
  },
  discoverHeader: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: friendsColors.labelMuted,
  },
  suggestedRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  suggestedCard: {
    flex: 1,
    height: 140,
    backgroundColor: friendsColors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2d2440",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  suggestedSilhouette: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2d2440",
    marginBottom: 12,
  },
  suggestedBar: {
    width: "80%",
    height: 10,
    borderRadius: 4,
    backgroundColor: "#2d2440",
  },
  suggestedGamerName: {
    fontSize: 13,
    fontWeight: "700",
    color: friendsColors.white,
    marginBottom: 10,
    textAlign: "center",
    width: "100%",
  },
  centerMessage: {
    paddingVertical: 40,
    alignItems: "center",
  },
  errorText: {
    color: "#f87171",
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
