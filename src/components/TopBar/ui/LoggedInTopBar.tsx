// src/components/TopBar/ui/LoggedInTopBar.tsx
import { colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMirror } from "../store";



const LoggedInTopBar: React.FC = () => {
  const router = useRouter();
  const avatarSource = useMirror("avatarSource");
  const level = useMirror("level");
  const levelProgress = useMirror("levelProgress");
  const coins = useMirror("coins");
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {/* <Icon name="sports-esports" size={24} color={colors.primaryPurple} /> */}
        <Image source={require("../../../assets/main_Logo.png")} style={styles.logo} />
        <Text style={styles.levelText}>LVL {level}</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(1, Math.max(0, levelProgress ?? 0)) * 100}%` },
            ]}
          />
        </View>
      </View>
      <View style={styles.right}>
        <TouchableOpacity>
          <Icon name="notifications" size={26} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.coinsRow}>
          <Icon name="attach-money" size={20} color={colors.gold} />
          <Text style={styles.coinsText}>{coins?.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarWrap}
          onPress={() => router.push("/profile")}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={24} color={colors.grey} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
  },
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
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
  progressTrack: {
    height: 8,
    flex: 1,
    maxWidth: 120,
    backgroundColor: colors.darkBackground2,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primaryPurple,
    borderRadius: 4,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coinsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  coinsText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
  avatarWrap: {
    marginLeft: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.darkBackground2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoggedInTopBar;
