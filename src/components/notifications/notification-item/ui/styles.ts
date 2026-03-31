import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";

export const notificationCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.darkBackground2,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  title: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  body: {
    color: colors.grey,
    fontSize: 13,
    marginTop: 6,
  },
  meta: {
    color: colors.grey,
    fontSize: 11,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.primaryPurple,
  },
  btnSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.grey,
  },
  btnText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 13,
  },
  btnTextDark: {
    color: colors.white,
  },
});
