// src/components/TopBar/ui/LoggedInTopBar.tsx
import { CoinsIcon } from "@/src/components/icons/figma/CoinsIcon";
import { NotificationsIcon } from "@/src/components/icons/figma/NotificationsIcon";
import { flexRowRtl, progressFillRtl, textRtl } from "@/src/lib/rtl";
import { colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMirror } from "../store";

const LOGO = require("../../../assets/main_Logo.png");

const LoggedInTopBar: React.FC = () => {
  const router = useRouter();
  const avatarSource = useMirror("avatarSource");
  const level = useMirror("level");
  const levelProgress = useMirror("levelProgress");
  const coins = useMirror("coins");
  const pct = Math.round(
    Math.min(1, Math.max(0, levelProgress ?? 0)) * 100
  );

  return (
    <View style={[styles.container, flexRowRtl]}>
      <View style={[styles.left, flexRowRtl]}>
        <View style={styles.logoCircle}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.levelColumn}>
          <View style={[styles.levelRow, flexRowRtl]}>
            <Text style={[styles.levelText, textRtl]}>مستوى {level}</Text>
            <Text style={[styles.pctText, textRtl]}>{pct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                progressFillRtl,
                {
                  width: `${Math.min(1, Math.max(0, levelProgress ?? 0)) * 100}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>
      <View style={[styles.right, flexRowRtl]}>
        <TouchableOpacity
          style={styles.notifWrap}
          accessibilityRole="button"
          accessibilityLabel="الإشعارات"
          onPress={() => router.push("/(tabs)/notifications" as never)}
        >
          <NotificationsIcon width={20} height={25} color={colors.white} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
        <View style={[styles.walletPill, flexRowRtl]}>
          <CoinsIcon width={12} height={12} color={colors.gold} />
          <Text style={[styles.coinsText, textRtl]}>
            {Number(coins ?? 0).toLocaleString("ar")}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.avatarWrap}
          onPress={() => router.push("/profile")}
          accessibilityRole="button"
          accessibilityLabel="الملف الشخصي"
        >
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    backgroundColor: colors.darkBackground1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBackground2,
  },
  left: {
    alignItems: "center",
    flex: 1,
    minWidth: 0,
    gap: 10,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkBackground2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    width: 28,
    height: 28,
  },
  levelColumn: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  levelRow: {
    alignItems: "baseline",
    gap: 8,
    marginBottom: 4,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
  pctText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primaryPurple,
  },
  progressTrack: {
    height: 6,
    width: "100%",
    maxWidth: 160,
    backgroundColor: colors.darkBackground2,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primaryPurple,
    borderRadius: 3,
  },
  right: {
    alignItems: "center",
    gap: 10,
    marginStart: 8,
  },
  notifWrap: {
    position: "relative",
    padding: 4,
  },
  notifDot: {
    position: "absolute",
    top: 2,
    end: 2,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primaryPurple,
  },
  walletPill: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primaryPurple,
    backgroundColor: colors.darkBackground2,
  },
  coinsText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
  },
  avatarWrap: {
    marginStart: 2,
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
    borderWidth: 1,
    borderColor: colors.darkBackground1,
  },
});

export default LoggedInTopBar;
