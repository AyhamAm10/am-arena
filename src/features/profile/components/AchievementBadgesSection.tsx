import type { AchievementPublic, UserAchievementEntry } from "@/src/api/types/user.types";
import { formatAchievementIconUrl } from "@/src/lib/utils/image-url-factory";
import { flexRowRtl, textRtl, writingRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";



type AchievementBadgesSectionProps = {
  entries: UserAchievementEntry[];
  showViewAll: boolean;
};

export function AchievementBadgesSection({
  entries,
  showViewAll,
}: AchievementBadgesSectionProps) {
  const router = useRouter();
  const visibleEntries = entries.filter(
    (entry): entry is UserAchievementEntry & { achievement: AchievementPublic } =>
      entry.achievement != null
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, writingRtl]}>الألقاب المكتسبة</Text>
        {showViewAll ? (
          <Pressable
            onPress={() => router.push("/profile/achievements")}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="مشاهدة جميع الانجازات"
          >
            <Text style={[styles.viewAll, writingRtl]}>مشاهدة الجميع</Text>
          </Pressable>
        ) : null}
      </View>

      {visibleEntries.length === 0 ? (
        <Text style={[styles.empty, writingRtl]}>لا توجد ألقاب معروضة بعد.</Text>
      ) : (
        <View style={styles.list}>
          {visibleEntries.map(({ achievement }) => (
            <AchievementBadgeItem
              key={`badge-${achievement.id}`}
              achievement={achievement}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function AchievementBadgeItem({
  achievement,
}: {
  achievement: AchievementPublic;
}) {
  const accent = achievement.color_theme?.trim() || colors_V2.gold;
  const uri = achievement.icon_url
    ? formatAchievementIconUrl(achievement.icon_url)
    : null;

  return (
    <View style={[styles.card, { borderStartColor: accent }]}>
      <Text style={[styles.tierLabel, { color: accent }, writingRtl]}>
        {achievement.name}
      </Text>
      <View style={[styles.cardTop, flexRowRtl]}>
        <View style={styles.textCol}>
          <Text style={[styles.badgeLabel, writingRtl]} numberOfLines={2}>
            {achievement.description || achievement.name}
          </Text>
        </View>
        <View
          style={[
            styles.badgeCircle,
            { borderColor: accent, backgroundColor: "transparent" },
          ]}
        >
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: accent, opacity: 0.14 },
            ]}
          />
          {uri ? (
            <Image
              source={{ uri }}
              style={styles.badgeIcon}
              contentFit="contain"
            />
          ) : (
            <View
              style={[styles.badgeIcon, { backgroundColor: accent, opacity: 0.35 }]}
            />
          )}
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { backgroundColor: accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    ...flexRowRtl,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors_V2.lilac,
    fontSize: 20,
    fontWeight: "700",
  },
  viewAll: {
    color: colors_V2.skyBlue,
    fontSize: 14,
    fontWeight: "600",
  },
  empty: {
    color: colors_V2.slate,
    fontSize: 14,
    ...textRtl,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors_V2.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderStartWidth: 3,
  },
  tierLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  cardTop: {
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  textCol: {
    flex: 1,
  },
  badgeCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIcon: {
    width: 36,
    height: 36,
  },
  badgeLabel: {
    color: colors_V2.lilac,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    ...textRtl,
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(216, 185, 255, 0.16)",
    overflow: "hidden",
  },
  progressFill: {
    width: "88%",
    height: "100%",
    borderRadius: 999,
  },
});
