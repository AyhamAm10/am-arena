import { ChatIcon } from "@/src/components/icons/figma/ChatIcon";
import { NotificationsIcon } from "@/src/components/icons/figma/NotificationsIcon";
import { flexRowRtl, textRtl } from "@/src/lib/rtl";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { colors_V2 } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMirror } from "../store";

const LOGO = require("../../../assets/main_Logo.png");

const LoggedInTopBar: React.FC = () => {
  const router = useRouter();
  const avatarSource = useMirror("avatarSource");
  const achievementColor = useMirror("achievementColor") as string | null;
  const achievementIconUrl = useMirror("achievementIconUrl") as string | null;
  const achievementName = useMirror("achievementName") as string | null | undefined;

  const borderColor = achievementColor || colors_V2.purple;
  const titleLabel =
    typeof achievementName === "string" && achievementName.trim().length > 0
      ? achievementName.trim()
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.logoWrap}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={[styles.logoText, textRtl]}>NEON KINETIC</Text>
      </View>

      <View style={[styles.userRow, flexRowRtl]}>
        <TouchableOpacity
          style={styles.avatarContainer}
          accessibilityRole="button"
          accessibilityLabel="الملف الشخصي"
          onPress={() => router.push("/(tabs)/profile" as never)}
          activeOpacity={0.85}
        >
          <View style={[styles.avatarBorder, { borderColor }]}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
          </View>
          {achievementIconUrl ? (
            <View style={styles.achievementBadge}>
              <Image
                source={{ uri: achievementIconUrl }}
                style={styles.achievementIcon}
                resizeMode="contain"
              />
            </View>
          ) : null}
        </TouchableOpacity>

        <View style={[styles.userInfo, flexRowRtl]}>
          {titleLabel ? (
            <Text style={[styles.rankText, textRtl]} numberOfLines={2}>
              {titleLabel}
            </Text>
          ) : null}
        </View>

        <View style={[styles.actionsRow, flexRowRtl]}>
          <TouchableOpacity
            style={styles.actionBtn}
            accessibilityRole="button"
            accessibilityLabel="الإشعارات"
            onPress={() => router.push("/(tabs)/notifications" as never)}
          >
            <NotificationsIcon width={20} height={22} color={colors_V2.lavender} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            accessibilityRole="button"
            accessibilityLabel="الدردشة"
            onPress={() => router.push("/(tabs)/channels" as never)}
          >
            <ChatIcon width={20} height={20} color={colors_V2.lavender} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors_V2.background,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  logoWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors_V2.card,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    width: 22,
    height: 22,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors_V2.lavender,
    letterSpacing: 1.5,
  },
  userRow: {
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
  },
  avatarBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors_V2.card,
  },
  achievementBadge: {
    position: "absolute",
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors_V2.background,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementIcon: {
    width: 14,
    height: 14,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  rankText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors_V2.dustyLavender,
    letterSpacing: 0.5,
  },
  actionsRow: {
    gap: 16,
    alignItems: "center",
  },
  actionBtn: {
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
    backgroundColor: colors_V2.gold,
  },
});

export default LoggedInTopBar;
