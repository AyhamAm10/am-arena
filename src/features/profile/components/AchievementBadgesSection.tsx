import type { AchievementPublic } from "@/src/api/types/user.types";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { colors } from "@/src/theme/colors";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Entry = {
  obtained_at: string;
  achievement: AchievementPublic | null;
};

type AchievementBadgesSectionProps = {
  entries: Entry[];
};

export function AchievementBadgesSection({ entries }: AchievementBadgesSectionProps) {
  const earned = entries.filter((e) => e.achievement != null);
  const count = earned.length;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Achievement Badges</Text>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeCountText}>{count} Earned</Text>
        </View>
      </View>

      {earned.length === 0 ? (
        <Text style={styles.empty}>No achievements yet.</Text>
      ) : (
        <View style={styles.grid}>
          {earned.map((row) => {
            const a = row.achievement;
            if (!a) return null;
            const accent = a.color_theme || colors.primaryPurple;
            return (
              <View
                key={`${row.obtained_at}-${a.id}`}
                style={[styles.card, { borderColor: `${accent}66` }]}
              >
                {a.icon_url ? (
                  <Image
                    source={{
                      uri: /^https?:\/\//i.test(a.icon_url)
                        ? a.icon_url
                        : formatImageUrl(a.icon_url),
                    }}
                    style={styles.cardIcon}
                    contentFit="contain"
                  />
                ) : (
                  <View style={[styles.cardIconPlaceholder, { backgroundColor: `${accent}33` }]} />
                )}
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {a.name}
                </Text>
                <Text style={styles.cardDesc} numberOfLines={3}>
                  {a.description}
                </Text>
              </View>
            );
          })}
        </View>
      )}
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
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  badgeCount: {
    backgroundColor: colors.darkBackground2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCountText: {
    color: colors.grey,
    fontSize: 12,
    fontWeight: "600",
  },
  empty: {
    color: colors.grey,
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 12,
    backgroundColor: colors.darkBackground2,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  cardIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardDesc: {
    color: colors.grey,
    fontSize: 11,
    lineHeight: 15,
  },
});
