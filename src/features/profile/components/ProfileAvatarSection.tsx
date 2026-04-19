import type { AchievementPublic } from "@/src/api/types/user.types";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { computeLevelAndProgress } from "@/src/lib/utils/level-from-xp";
import { flexRowRtl, progressFillRtl, writingRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type ProfileAvatarSectionProps = {
  gamerName: string;
  fullName: string;
  profilePictureUrl: string | null | undefined;
  xpPoints: number;
  level: number;
  selectedTitle: string | null;
  selectedAchievement: AchievementPublic | null;
  titlesCount: number;
  tournamentsParticipatedCount: number;
};

export function ProfileAvatarSection({
  gamerName,
  fullName,
  profilePictureUrl,
  xpPoints,
  level,
  selectedTitle,
  selectedAchievement,
  titlesCount,
  tournamentsParticipatedCount,
}: ProfileAvatarSectionProps) {
  const { progress } = useMemo(
    () => computeLevelAndProgress(xpPoints),
    [xpPoints]
  );

  const uri = profilePictureUrl ? formatImageUrl(profilePictureUrl) : "";
  const accent = selectedAchievement?.color_theme?.trim() || colors_V2.gold;
  const titleLabel = selectedTitle?.trim() || "بدون لقب محدد";

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.avatarRing,
          {
            borderColor: accent,
            shadowColor: accent,
          },
        ]}
      >
        <View style={styles.avatarCircle}>
          {uri ? (
            <Image source={{ uri }} style={styles.avatarImg} contentFit="cover" />
          ) : (
            <Icon name="person" size={56} color={colors_V2.slate} />
          )}
        </View>
        <View style={[styles.levelBadge, { backgroundColor: accent }]}>
          <Icon name="emoji-events" size={14} color={colors_V2.background} />
        </View>
      </View>

      <Text style={[styles.playerName, writingRtl]}>{fullName}</Text>
      <View style={[styles.titleBadge, { borderColor: accent, backgroundColor: `${accent}22` }]}>
        <Text style={[styles.titleBadgeText, { color: accent }, writingRtl]}>
          {titleLabel}
        </Text>
      </View>
      <Text style={[styles.gamerName, writingRtl]}>@{gamerName}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{level}</Text>
          <Text style={[styles.statLabel, writingRtl]}>المستوى</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{titlesCount.toLocaleString("ar")}</Text>
          <Text style={[styles.statLabel, writingRtl]}>إجمالي الألقاب</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {tournamentsParticipatedCount.toLocaleString("ar")}
          </Text>
          <Text style={[styles.statLabel, writingRtl]}>المشاركات</Text>
        </View>
      </View>

      <View style={styles.xpBarTrack}>
        <View
          style={[
            styles.xpBarFill,
            { width: `${Math.round(progress * 100)}%`, backgroundColor: accent },
            progressFillRtl,
          ]}
        />
      </View>
    </View>
  );
}

const AVATAR = 112;

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarRing: {
    width: AVATAR + 18,
    height: AVATAR + 18,
    borderRadius: (AVATAR + 18) / 2,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  avatarCircle: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: colors_V2.card,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  levelBadge: {
    position: "absolute",
    bottom: -6,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors_V2.background,
  },
  playerName: {
    color: colors_V2.lilac,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  titleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  titleBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  gamerName: {
    color: colors_V2.slate,
    fontSize: 15,
    marginBottom: 18,
    textAlign: "center",
  },
  statsRow: {
    ...flexRowRtl,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: colors_V2.skyBlue,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: colors_V2.slate,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 16,
  },
  xpBarTrack: {
    width: "100%",
    maxWidth: 220,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors_V2.card,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    borderRadius: 999,
  },
});
