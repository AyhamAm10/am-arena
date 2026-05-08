import { ChatIcon } from "@/src/components/icons/figma/ChatIcon";
import { NotificationsIcon } from "@/src/components/icons/figma/NotificationsIcon";
import RankAvatar from "@/src/components/avatar/RankAvatar";
import { flexRowRtl, textRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMirror } from "../store";
import { useFetchNotifications } from "@/src/hooks/api/notification/useFetchNotifications";
import { useAuthStore } from "@/src/stores/authStore";
import { getLastSeenNotificationsAt, setLastSeenNotificationsToNow } from "@/src/lib/notifications/lastSeenNotifications";

const LOGO = require("../../../assets/main_Logo.png");

type NotificationsButtonProps = { router: any };

function NotificationsButton({ router }: NotificationsButtonProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const listQuery = useFetchNotifications({ page: 1, limit: 1 }, { enabled: !!accessToken });
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const latest = listQuery.data?.data?.[0];
      if (!latest) {
        if (mounted) setHasNew(false);
        return;
      }
      const latestAt = latest.created_at;
      const lastSeen = await getLastSeenNotificationsAt();
      const isNew = !lastSeen || new Date(latestAt) > new Date(lastSeen);
      if (mounted) setHasNew(isNew);
    }
    void check();
    return () => {
      mounted = false;
    };
  }, [listQuery.data]);

  const onPress = async () => {
    // Clear badge immediately and navigate
    await setLastSeenNotificationsToNow();
    setHasNew(false);
    router.push("/(tabs)/notifications" as never);
  };

  return (
    <TouchableOpacity
      style={styles.actionBtn}
      accessibilityRole="button"
      accessibilityLabel="الإشعارات"
      onPress={onPress}
    >
      <NotificationsIcon width={20} height={22} color={colors_V2.gradientEnd} />
      {hasNew ? <View style={styles.notifBadge} /> : null}
    </TouchableOpacity>
  );
}

const LoggedInTopBar: React.FC = () => {
  const router = useRouter();
  const avatarSource = useMirror("avatarSource");
  const achievementColor = useMirror("achievementColor") as string | null;
  const achievementIconUrl = useMirror("achievementIconUrl") as string | null;
  const achievementName = useMirror("achievementName") as string | null | undefined;
  const hasActiveRank = Boolean(
    achievementName?.trim() &&
      achievementColor?.trim() &&
      achievementIconUrl?.trim()
  );

  const borderColor =
    hasActiveRank && achievementColor?.trim()
      ? achievementColor.trim()
      : colors_V2.primary;
  const titleLabel =
    hasActiveRank && typeof achievementName === "string" && achievementName.trim().length > 0
      ? achievementName.trim()
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.logoWrap}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={[styles.logoText, textRtl]}>AM ARENA</Text>
      </View>

      <View style={[styles.userRow, flexRowRtl]}>
        <TouchableOpacity
          style={styles.avatarContainer}
          accessibilityRole="button"
          accessibilityLabel="الملف الشخصي"
          onPress={() => router.push("/(tabs)/profile" as never)}
          activeOpacity={0.85}
        >
          <RankAvatar
            avatarSource={avatarSource}
            achievementColor={achievementColor}
            achievementIconUrl={achievementIconUrl}
            hasActiveRank={hasActiveRank}
            neutralBorderColor={colors_V2.primary}
            frameStyle={styles.avatarBorder}
            imageStyle={styles.avatar}
            placeholderStyle={styles.avatarPlaceholder}
            badgeStyle={styles.achievementBadge}
            badgeIconStyle={styles.achievementIcon}
          />
        </TouchableOpacity>

        <View style={[styles.userInfo, flexRowRtl]}>
          {titleLabel ? (
            <Text style={[styles.rankText, textRtl, { color: borderColor }]} numberOfLines={2}>
              {titleLabel}
            </Text>
          ) : null}
        </View>

        <View style={[styles.actionsRow, flexRowRtl]}>
          <NotificationsButton router={router} />
          <TouchableOpacity
            style={styles.actionBtn}
            accessibilityRole="button"
            accessibilityLabel="الدردشة"
            onPress={() => router.push("/(tabs)/channels" as never)}
          >
            <ChatIcon width={20} height={20} color={colors_V2.gradientEnd} />
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
    color: colors_V2.gradientEnd,
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
    color: colors_V2.textSecondary,
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
  notifBadge: {
    position: "absolute",
    top: 3,
    end: 3,
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: colors_V2.primaryLight,
    borderWidth: 1,
    borderColor: colors_V2.card,
    shadowColor: colors_V2.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default LoggedInTopBar;
