// src/components/TopBar/ui/GuestTopBar.tsx
import { colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GuestTopBar: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AM Arena</Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/login")}
        accessibilityRole="button"
        accessibilityLabel="Login or register"
      >
        <Text style={styles.loginText}>Login / Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: colors.darkBackground1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBackground2,
  },
  logo: { color: colors.primaryPurple, fontWeight: "bold", fontSize: 18 },
  loginButton: {
    backgroundColor: colors.neonBlue,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  loginText: { color: colors.white, fontWeight: "700", fontSize: 13 },
});

export default GuestTopBar;
