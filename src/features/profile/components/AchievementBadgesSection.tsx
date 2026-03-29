import type { AchievementPublic } from "@/src/api/types/user.types";
import { useFetchAchievementCatalog } from "@/src/hooks/api/achievement/useFetchAchievementCatalog";
import { formatAchievementIconUrl } from "@/src/lib/utils/image-url-factory";
import { colors } from "@/src/theme/colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type Entry = {
  obtained_at: string;
  achievement: AchievementPublic | null;
};

const LOCK_BORDER = "#4B5563";
const LOCK_ICON = "#9CA3AF";
const LOCK_LABEL = "#6B7280";
const EARNED_LABEL = "#D1D5DB";
const CIRCLE_FILL_LOCKED = "#2a2438";

type Row = { achievement: AchievementPublic; locked: boolean };

function buildDisplayRows(
  entries: Entry[],
  catalog: AchievementPublic[] | undefined,
  useCatalog: boolean
): Row[] {
  const earned = entries
    .map((e) => e.achievement)
    .filter((a): a is AchievementPublic => a != null);
  const earnedIds = new Set(earned.map((a) => a.id));

  if (useCatalog && catalog != null && catalog.length > 0) {
    const sorted = [...catalog].sort(
      (a, b) => b.xp_reward - a.xp_reward || a.id - b.id
    );
    const fromCatalog: Row[] = sorted.map((a) => ({
      achievement: a,
      locked: !earnedIds.has(a.id),
    }));
    const orphaned = earned.filter((a) => !catalog.some((c) => c.id === a.id));
    const extra: Row[] = orphaned.map((a) => ({
      achievement: a,
      locked: false,
    }));
    return [...fromCatalog, ...extra];
  }

  return earned.map((a) => ({ achievement: a, locked: false }));
}

type AchievementBadgesSectionProps = {
  entries: Entry[];
  /** Only on own profile — shows catalog (incl. locked) and "View All". */
  showViewAll: boolean;
};

export function AchievementBadgesSection({
  entries,
  showViewAll,
}: AchievementBadgesSectionProps) {
  const router = useRouter();
  const { data: catalog, isLoading: catalogLoading } = useFetchAchievementCatalog(
    { enabled: showViewAll }
  );

  const useCatalog =
    showViewAll && catalog != null && catalog.length > 0;

  const rows = useMemo(
    () => buildDisplayRows(entries, catalog, useCatalog),
    [entries, catalog, useCatalog]
  );

  const earnedCount = entries.filter((e) => e.achievement != null).length;
  const showInitialLoader =
    showViewAll && catalogLoading && earnedCount === 0 && rows.length === 0;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Achievement Badges</Text>
        {showViewAll ? (
          <Pressable
            onPress={() => router.push("/profile/achievements")}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="View all achievements"
          >
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        ) : null}
      </View>

      {showInitialLoader ? (
        <View style={styles.loaderRow}>
          <ActivityIndicator color={colors.primaryPurple} />
        </View>
      ) : rows.length === 0 ? (
        <Text style={styles.empty}>No achievements yet.</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rowScroll}
        >
          {rows.map(({ achievement: a, locked }) => (
            <AchievementBadgeItem
              key={`badge-${a.id}-${locked ? "locked" : "earned"}`}
              achievement={a}
              locked={locked}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function AchievementBadgeItem({
  achievement: a,
  locked,
}: {
  achievement: AchievementPublic;
  locked: boolean;
}) {
  const accent = locked
    ? LOCK_BORDER
    : (a.color_theme?.trim() || colors.primaryPurple);
  const labelColor = locked ? LOCK_LABEL : EARNED_LABEL;

  const uri =
    !locked && a.icon_url
      ? /^https?:\/\//i.test(a.icon_url)
        ? a.icon_url
        : formatAchievementIconUrl(a.icon_url)
      : null;

  return (
    <View style={styles.badgeCell}>
      <View
        style={[
          styles.badgeCircle,
          locked
            ? { borderColor: accent, backgroundColor: CIRCLE_FILL_LOCKED }
            : { borderColor: accent, backgroundColor: "transparent" },
        ]}
      >
        {!locked ? (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: accent, opacity: 0.22 },
            ]}
          />
        ) : null}
        <View style={styles.badgeCircleContent}>
          {locked ? (
            <Icon name="lock" size={26} color={LOCK_ICON} />
          ) : uri ? (
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
      <Text style={[styles.badgeLabel, { color: labelColor }]} numberOfLines={2}>
        {a.name}
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
  loaderRow: {
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
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
