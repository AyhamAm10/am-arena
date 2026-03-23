import { colors } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#130a1e",
  },
  rootLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#130a1e",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonSpacer: {
    width: 30,
    height: 30,
  },
  backIcon: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  pageTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  card: {
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#1f1030",
    marginBottom: 16,
  },
  cardImage: {
    width: "100%",
    height: 138,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  entryFeeText: {
    fontSize: 12,
    color: "#9554ff",
    fontWeight: "800",
  },
  tournamentTitle: {
    fontSize: 30,
    lineHeight: 34,
    color: colors.white,
    fontWeight: "800",
  },
  metaText: {
    fontSize: 14,
    color: "#b8abc9",
    fontWeight: "500",
  },
  poolPill: {
    borderRadius: 14,
    backgroundColor: "#2b1247",
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  poolText: {
    color: "#a95dff",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 29,
    fontWeight: "800",
    marginBottom: 8,
  },
  detailsWrap: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#251437",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  detailKey: {
    color: "#b9a9cb",
    fontSize: 17,
    fontWeight: "500",
  },
  detailValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  squadHeader: {
    marginTop: 12,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCounter: {
    color: "#7f0df2",
    fontSize: 16,
    fontWeight: "700",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
  },
  friendRow: {
    backgroundColor: "#251337",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
  },
  friendRowBlocked: {
    opacity: 0.7,
  },
  avatarStub: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  friendTextWrap: {
    flex: 1,
  },
  friendName: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  friendStatus: {
    color: "#b7a9c7",
    fontSize: 14,
    marginTop: 2,
  },
  selectCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#4e336d",
  },
  selectCircleActive: {
    borderColor: "#8524ff",
    backgroundColor: "#8524ff",
  },
  loadingMoreWrap: {
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 10,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryPurple,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  walletHint: {
    marginTop: 8,
    textAlign: "center",
    color: "#8e7ea3",
    fontSize: 10,
    fontWeight: "600",
  },
});
