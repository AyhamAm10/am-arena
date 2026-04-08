import { colors } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

/** Channels screen — dark purple, neon purple accents (Figma-aligned). */
export const channelsTheme = {
  bg: colors.screenBackground,
  cardBg: colors.darkBackground1,
  cardBorder: colors.darkBackground1,
  muted: colors.grey,
  white: colors.white,
  accent: colors.primaryPurple,
  liveBg: colors.primaryPurple,
  online: "#22C55E",
};

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: channelsTheme.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.darkBackground2,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: channelsTheme.white,
    letterSpacing: 0.2,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkBackground2,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: channelsTheme.cardBorder,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: channelsTheme.white,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBackground2,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: channelsTheme.muted,
  },
  tabLabelActive: {
    color: channelsTheme.accent,
  },
  tabUnderline: {
    marginTop: 6,
    height: 3,
    width: "55%",
    backgroundColor: channelsTheme.accent,
    borderRadius: 2,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: channelsTheme.accent,
  },
  liveBadge: {
    backgroundColor: channelsTheme.liveBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: channelsTheme.white,
  },
  intro: {
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 18,
    color: channelsTheme.muted,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: channelsTheme.cardBg,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: channelsTheme.cardBorder,
  },
  cardFeatured: {
    borderColor: channelsTheme.accent,
    borderWidth: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.darkBackground2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconCircleFeatured: {
    backgroundColor: "rgba(111, 45, 189, 0.35)",
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: channelsTheme.white,
  },
  activePill: {
    backgroundColor: "rgba(127, 13, 242, 0.45)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: "800",
    color: channelsTheme.white,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: channelsTheme.muted,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: channelsTheme.online,
    marginRight: 10,
  },
  chevron: {
    marginLeft: 4,
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
    color: channelsTheme.accent,
    fontWeight: "600",
  },
  mutedCenter: {
    color: channelsTheme.muted,
    textAlign: "center",
  },
});
