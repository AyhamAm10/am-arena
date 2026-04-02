import type { AchievementPublic, UserAchievementEntry } from "@/src/api/types/user.types";
import { formatAchievementIconUrl } from "@/src/lib/utils/image-url-factory";
import { colors } from "@/src/theme/colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const EARNED_LABEL = "#D1D5DB";

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
        <Text style={styles.sectionTitle}>شارات الإنجاز</Text>
        {showViewAll ? (
          <Pressable
            onPress={() => router.push("/profile/achievements")}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="عرض كل الإنجازات"
          >
            <Text style={styles.viewAll}>عرض الكل</Text>
          </Pressable>
        ) : null}
      </View>

      {visibleEntries.length === 0 ? (
        <Text style={styles.empty}>لا توجد إنجازات بعد.</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rowScroll}
        >
          {visibleEntries.map(({ achievement }) => (
            <AchievementBadgeItem
              key={`badge-${achievement.id}`}
              achievement={achievement}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function AchievementBadgeItem({
  achievement,
}: {
  achievement: AchievementPublic;
}) {
  const accent = achievement.color_theme?.trim() || colors.primaryPurple;
  const uri = achievement.icon_url
    ? formatAchievementIconUrl(achievement.icon_url)
    : null;

  return (
    <View style={styles.badgeCell}>
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
            { backgroundColor: accent, opacity: 0.22 },
          ]}
        />
        <View style={styles.badgeCircleContent}>
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
      <Text style={[styles.badgeLabel, { color: EARNED_LABEL }]} numberOfLines={2}>
        {achievement.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  viewAll: {
    color: colors.primaryPurple,
    fontSize: 14,
    fontWeight: "600",
  },
  empty: {
    color: colors.grey,
    fontSize: 14,
  },
  rowScroll: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 4,
    paddingRight: 8,
    gap: 4,
  },
  badgeCell: {
    width: 76,
    marginRight: 12,
    alignItems: "center",
  },
  badgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    overflow: "hidden",
  },
  badgeCircleContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIcon: {
    width: 36,
    height: 36,
  },
  badgeLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
    maxWidth: 76,
  },
});
