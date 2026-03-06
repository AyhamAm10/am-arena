// src/components/BottomNav/ui/BottomTabItem.tsx
import { colors } from "@/src/theme/colors";
import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";


type Props = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onPress: () => void;
};

const BottomTabItem: React.FC<Props> = ({ label, icon, active, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={{ opacity: active ? 1 : 0.5 }}>{icon}</View>
      <Text style={[styles.label, { color: active ? colors.primaryPurple : colors.white }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 6 },
  label: { fontSize: 12, marginTop: 2 },
});

export default BottomTabItem;