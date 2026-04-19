import { flexRowRtl, progressFillRtl, textRtl } from "@/src/lib/rtl";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { colors_V2 } from "@/src/theme/colors";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import type { TopPlayerCardState } from "../state/init";

type Props = {
  card: TopPlayerCardState | undefined;
};

function rankBadgeColor(rank: number): string {
  if (rank === 1) return colors_V2.gold;
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return colors_V2.purple;
}

export default function TopPlayerCardView({ card }: Props) {
  if (!card) return null;

  const { rank, avatarSource, name, tier, xp, xpProgress } = card;

  const xpRaw = Number(xpProgress);
  const xpPct = Number.isFinite(xpRaw)
    ? Math.max(0, Math.min(1, xpRaw))
    : 0;

  const xpLabel =
    typeof xp === "number" ? `${xp.toLocaleString("ar")} XP` : `${xp} XP`;

  return (
    <View style={styles.outer}>
      <View style={[flexRowRtl, styles.container]}>
        <View style={styles.cellAvatar}>
          <View style={styles.avatarFrame}>
            {avatarSource ? (
              <Image
                source={{ uri: formatImageUrl(avatarSource) }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
            <View
              style={[
                styles.rankBadgeOverlay,
                { backgroundColor: rankBadgeColor(rank) },
              ]}
            >
              <Text style={styles.rankText}>{rank}</Text>
            </View>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, textRtl]} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                progressFillRtl,
                { width: `${Math.round(xpPct * 100)}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.statsCol}>
          <Text style={[styles.xpValue, textRtl]} numberOfLines={1}>
            {xpLabel}
          </Text>
          <Text style={[styles.tier, textRtl]} numberOfLines={1}>
            {tier}
          </Text>
        </View>
      </View>
    </View>
  );
}

const AVATAR = 52;

const styles = StyleSheet.create({
  outer: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors_V2.card,
    borderWidth: 1,
    borderColor: "rgba(216,185,255,0.1)",
  },
  container: {
    width: "100%",
    minHeight: 72,
    alignItems: "stretch",
    paddingVertical: 12,
    paddingEnd: 14,
    paddingStart: 12,
    gap: 12,
    borderStartWidth: 3,
    borderStartColor: colors_V2.gold,
  },
  cellAvatar: {
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  avatarFrame: {
    width: AVATAR,
    height: AVATAR,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: 12,
  },
  avatarPlaceholder: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: 12,
    backgroundColor: colors_V2.background,
  },
  rankBadgeOverlay: {
    position: "absolute",
    top: -2,
    start: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors_V2.card,
  },
  rankText: {
    fontSize: 11,
    fontWeight: "900",
    color: colors_V2.background,
  },
  info: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    gap: 8,
    alignSelf: "stretch",
  },
  name: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    color: colors_V2.lilac,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors_V2.lavender,
  },
  statsCol: {
    justifyContent: "center",
    alignItems: "stretch",
    flexShrink: 0,
    minWidth: 96,
    maxWidth: "38%",
    alignSelf: "stretch",
    gap: 4,
  },
  tier: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
    color: colors_V2.slate,
    letterSpacing: 0.4,
  },
  xpValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
