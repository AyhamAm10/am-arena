import { AppLayout } from "@/src/components/layout";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";

export function Ui() {
  return (
    <AppLayout>
      <View style={styles.placeholder}>
        <Text style={styles.title}>Friends</Text>
        <Text style={styles.hint}>Your friends list will appear here.</Text>
      </View>
    </AppLayout>
  );
}
