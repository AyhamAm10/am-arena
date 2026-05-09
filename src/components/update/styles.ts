import { StyleSheet } from "react-native";
import { colors_V2 } from "@/src/theme/colors";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  host: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: colors_V2.card,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    color: colors_V2.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    color: colors_V2.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 18,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors_V2.primary,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors_V2.primary,
  },
  primaryLabel: {
    color: colors_V2.textPrimary,
    fontWeight: "700",
  },
  secondaryLabel: {
    color: colors_V2.primary,
    fontWeight: "600",
  },
});
