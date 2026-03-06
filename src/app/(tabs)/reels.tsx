import { View, Text, StyleSheet } from "react-native";
import { AppLayout } from "../../components/layout";
import { colors } from "@/src/theme/colors";

export default function ReelsScreen() {
  return (
    <AppLayout>
      <View style={styles.placeholder}>
        <Text style={styles.text}>Reels</Text>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: colors.grey,
  },
});
