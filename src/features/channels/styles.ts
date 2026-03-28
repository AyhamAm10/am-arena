import { colors } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 18,
    color: colors.grey,
    textAlign: "center",
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: colors.grey,
    opacity: 0.8,
    textAlign: "center",
  },
});
