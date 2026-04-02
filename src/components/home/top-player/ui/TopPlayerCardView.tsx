import { AchievementIcon } from "@/src/components/icons/figma/AchievementIcon";
import { flexRowRtl, progressFillRtl, textRtl } from "@/src/lib/rtl";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { colors } from "@/src/theme/colors";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import type { TopPlayerCardState } from "../state/init";

type Props = {
  card: TopPlayerCardState | undefined;
};

function medalColorForRank(rank: number): string {
  if (rank === 1) return "#FFD700";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return colors.primaryPurple;
}

function rankBadgeColor(rank: number): string {
  if (rank <= 3) return medalColorForRank(rank);
  return colors.grey;
}

export default function TopPlayerCardView({ card }: Props) {
  if (!card) return null;

  const { rank, avatarSource, name, tier, xp, xpProgress } = card;
  const clampedProgress = Math.min(1, Math.max(0, xpProgress));

  return (
    <View style={[styles.container, flexRowRtl]}>
      <View style={styles.avatarCol}>
        <View style={[styles.rankBadge, { backgroundColor: rankBadgeColor(rank) }]}>
          <Text
            style={[
              styles.rankText,
              rank <= 3 ? styles.rankTextOnMedal : styles.rankTextMuted,
            ]}
          >
            {rank}
          </Text>
        </View>
        {avatarSource ? (
          <Image
            source={{ uri: formatImageUrl(avatarSource) }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </View>
      <View style={styles.info}>
        <View style={[styles.nameRow, flexRowRtl]}>
          <Text style={[styles.name, textRtl]} numberOfLines={1}>
            {name}
          </Text>
          <AchievementIcon
            width={20}
            height={24}
            color={medalColorForRank(rank)}
          />
        </View>
        <View style={styles.xpBarTrack}>
          <View
            style={[
              styles.xpBarFill,
              progressFillRtl,
              { width: `${clampedProgress * 100}%` },
            ]}
          />
        </View>
        <View style={[styles.statsRow, flexRowRtl]}>
          <Text style={[styles.tier, textRtl]}>{tier}</Text>
          <Text style={[styles.xpValue, textRtl]}>
            {typeof xp === "number" ? xp.toLocaleString("ar") : xp} نقطة خبرة
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.darkBackground2,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: "#3d2a55",
  },
  avatarCol: {
    position: "relative",
    width: 48,
    height: 48,
    justifyContent: "center",
  },
  rankBadge: {
    position: "absolute",
    top: -4,
    start: -4,
    zIndex: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.darkBackground2,
  },
  rankText: {
    fontSize: 11,
    fontWeight: "900",
  },
  rankTextOnMedal: {
    color: colors.darkBackground1,
  },
  rankTextMuted: {
    color: colors.white,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.darkBackground1,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 6,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  xpBarTrack: {
    height: 6,
    backgroundColor: colors.darkBackground1,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: colors.primaryPurple,
    borderRadius: 3,
  },
  statsRow: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  tier: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.grey,
    letterSpacing: 0.6,
  },
  xpValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#22D3EE",
  },
});
