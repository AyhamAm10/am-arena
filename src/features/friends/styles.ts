import { StyleSheet } from "react-native";
import { colors } from "@/src/theme/colors";

export const styles = StyleSheet.create({
  placeholder: {
    paddingVertical: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: colors.grey,
    textAlign: "center",
  },
});
