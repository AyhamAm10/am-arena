import { ChatIcon } from "@/src/components/icons/figma/ChatIcon";
import { NotificationsIcon } from "@/src/components/icons/figma/NotificationsIcon";
import RankAvatar from "@/src/components/avatar/RankAvatar";
import { flexRowRtl, textRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useMirror } from "../store";
import { useFetchNotifications } from "@/src/hooks/api/notification/useFetchNotifications";
import { useAuthStore } from "@/src/stores/authStore";
import { getLastSeenNotificationsAt, setLastSeenNotificationsToNow } from "@/src/lib/notifications/lastSeenNotifications";

const LOGO = require("../../../assets/main_Logo.png");

function WalletIcon({ color }: { color: string }) {
  return (
    <Svg width={25} height={28} viewBox="0 0 25 28" fill="none">
      <Path
        d="M5.20445 20.8056V7.19444C5.20445 7.19444 5.20445 7.55498 5.20445 8.27604C5.20445 8.99711 5.20445 9.93287 5.20445 11.0833V16.9167C5.20445 18.0671 5.20445 19.0029 5.20445 19.724C5.20445 20.445 5.20445 20.8056 5.20445 20.8056ZM5.20445 22.75C4.66973 22.75 4.21198 22.5596 3.83119 22.1788C3.4504 21.798 3.26001 21.3403 3.26001 20.8056V7.19444C3.26001 6.65972 3.4504 6.20197 3.83119 5.82118C4.21198 5.44039 4.66973 5.25 5.20445 5.25H18.8156C19.3503 5.25 19.808 5.44039 20.1888 5.82118C20.5696 6.20197 20.76 6.65972 20.76 7.19444V9.625H18.8156V7.19444H5.20445V20.8056H18.8156V18.375H20.76V20.8056C20.76 21.3403 20.5696 21.798 20.1888 22.1788C19.808 22.5596 19.3503 22.75 18.8156 22.75H5.20445ZM12.9822 18.8611C12.4475 18.8611 11.9898 18.6707 11.609 18.2899C11.2282 17.9091 11.0378 17.4514 11.0378 16.9167V11.0833C11.0378 10.5486 11.2282 10.0909 11.609 9.71007C11.9898 9.32928 12.4475 9.13889 12.9822 9.13889H19.7878C20.3225 9.13889 20.7803 9.32928 21.1611 9.71007C21.5418 10.0909 21.7322 10.5486 21.7322 11.0833V16.9167C21.7322 17.4514 21.5418 17.9091 21.1611 18.2899C20.7803 18.6707 20.3225 18.8611 19.7878 18.8611H12.9822ZM19.7878 16.9167V11.0833H12.9822V16.9167H19.7878ZM15.8989 15.4583C15.8989 15.4583 16.0002 15.4583 16.2027 15.4583C16.4053 15.4583 16.6483 15.3166 16.9319 15.033C17.2155 14.7494 17.3572 14.4051 17.3572 14C17.3572 13.5949 17.2155 13.2506 16.9319 12.967C16.6483 12.6834 16.304 12.5417 15.8989 12.5417C15.4938 12.5417 15.1495 12.6834 14.8659 12.967C14.5823 13.2506 14.4406 13.5949 14.4406 14C14.4406 14.4051 14.5823 14.7494 14.8659 15.033C15.1495 15.3166 15.4938 15.4583 15.8989 15.4583Z"
        fill={color}
      />
    </Svg>
  );
}

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
  const segments = useSegments();
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
          onPress={() => {
            const isProfileRoute = segments.includes("profile");
            if (isProfileRoute) router.replace("/(tabs)/profile" as never);
            else router.push("/(tabs)/profile" as never);
          }}
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
          <TouchableOpacity
            style={styles.actionBtn}
            accessibilityRole="button"
            accessibilityLabel="المحفظة"
            onPress={() => router.push("/wallet" as never)}
          >
            <WalletIcon color={colors_V2.gradientEnd} />
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
