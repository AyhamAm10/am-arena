import { tournamentsTheme } from "@/src/features/tournaments/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tournamentsTheme.screenBg,
    direction: "rtl",
  },
  scrollContent: {
    paddingBottom: 32,
    direction: "rtl",
  },
  sectionPad: {
    paddingHorizontal: 18,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 8,
    textAlign: "right",
    writingDirection: "rtl",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: tournamentsTheme.title,
    marginBottom: 14,
    textAlign: "right",
    writingDirection: "rtl",
  },
  dividerWrap: {
    marginVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dividerLine: {
    position: "absolute",
    left: 18,
    right: 18,
    height: StyleSheet.hairlineWidth,
    backgroundColor: tournamentsTheme.divider,
    top: "50%",
  },
  dividerIcon: {
    backgroundColor: tournamentsTheme.screenBg,
    paddingHorizontal: 12,
  },
  search: {
    borderWidth: 1,
    borderColor: tournamentsTheme.searchBorder,
    backgroundColor: tournamentsTheme.searchBg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: tournamentsTheme.title,
    marginBottom: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },
  centerMsg: {
    paddingVertical: 28,
    alignItems: "center",
  },
  muted: {
    fontSize: 14,
    fontWeight: "600",
    color: tournamentsTheme.bodyMuted,
    textAlign: "center",
    writingDirection: "rtl",
  },
  errorBanner: {
    backgroundColor: "rgba(255, 90, 90, 0.12)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 90, 90, 0.35)",
  },
  errorText: {
    color: tournamentsTheme.error,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "right",
    writingDirection: "rtl",
  },
  retry: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "800",
    color: tournamentsTheme.openEntry,
    textAlign: "right",
    writingDirection: "rtl",
  },
  loader: {
    paddingVertical: 36,
    alignItems: "center",
  },
});
