import { colors } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: colors.grey,
  },
  reelPage: {
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  reelTitle: {
    fontSize: 20,
    color: colors.grey,
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
  },
  actionLabel: {
    color: colors.grey,
    fontSize: 14,
  },
  commentSpinner: {
    marginTop: 12,
  },
});
