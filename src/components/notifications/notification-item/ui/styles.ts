import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";
import { flexRowRtl, textRtl, writingRtl } from "@/src/lib/rtl";

export const notificationCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.darkBackground2,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardUnread: {
    borderColor: colors.primaryPurple,
    backgroundColor: "rgba(111,45,189,0.18)",
  },
  cardRead: {
    opacity: 0.86,
  },
  title: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
    ...textRtl,
  },
  body: {
    color: colors.grey,
    fontSize: 13,
    marginTop: 6,
    ...textRtl,
  },
  meta: {
    color: colors.grey,
    fontSize: 11,
    marginTop: 8,
    ...writingRtl,
  },
  row: {
    ...flexRowRtl,
    gap: 10,
    marginTop: 12,
  },
  readBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  readBadgeUnread: {
    borderColor: colors.primaryPurple,
    backgroundColor: "rgba(111,45,189,0.24)",
  },
  readBadgeText: {
    color: colors.grey,
    fontSize: 10,
    fontWeight: "700",
    ...writingRtl,
  },
  readBadgeTextUnread: {
    color: colors.white,
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
    ...writingRtl,
  },
  btnTextDark: {
    color: colors.white,
  },
});
