import { HourIcon } from "@/src/components/icons/figma/HourIcon";
import { flexRowRtl, textRtl } from "@/src/lib/rtl";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { colors_V2 } from "@/src/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import type { TournamentCardState } from "../state/init";

type Props = {
  card: TournamentCardState | undefined;
};

function formatPrize(prize: string): string {
  const n = Number(prize);
  if (Number.isFinite(n)) {
    return `$${n.toLocaleString()}`;
  }
  return prize.startsWith("$") ? prize : `$${prize}`;
}

export default function TournamentCardView({ card }: Props) {
  if (!card) return null;

  const {
    title,
    prize,
    participantsCurrent,
    participantsMax,
    timeRemaining,
    imageSource,
    onJoinPress,
  } = card;

  const progressPct = participantsMax > 0
    ? Math.min(1, participantsCurrent / participantsMax)
    : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onJoinPress}
      activeOpacity={0.85}
    >
      {imageSource ? (
        <ImageBackground
          source={{ uri: formatImageUrl(imageSource) }}
          style={styles.imageWrap}
          imageStyle={styles.image}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(26,14,37,0.05)", "rgba(26,14,37,0.62)", "rgba(26,14,37,0.96)"]}
            style={styles.overlay}
          >
            <View style={styles.badgesRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>SQUAD</Text>
              </View>
              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>
                  {timeRemaining ? timeRemaining : "قريباً"}
                </Text>
              </View>
            </View>

            <View style={styles.body}>
              <Text style={[styles.title, textRtl]} numberOfLines={2}>
                {title}
              </Text>

              <View style={styles.progressSection}>
                <View style={[styles.progressHeader, flexRowRtl]}>
                  <Text style={[styles.progressLabel, textRtl]}>REGISTRATIONS</Text>
                  <Text style={styles.progressCount}>
                    {participantsCurrent}/{participantsMax}
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[styles.progressFill, { width: `${Math.max(8, progressPct * 100)}%` }]}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={[colors_V2.card, colors_V2.background]}
          style={styles.imageWrap}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 248,
    backgroundColor: colors_V2.card,
    borderRadius: 18,
    overflow: "hidden",
  },
  imageWrap: {
    minHeight: 188,
    backgroundColor: colors_V2.background,
    position: "relative",
  },
  image: {
    borderRadius: 18,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 14,
  },
  liveBadge: {
    backgroundColor: colors_V2.purple,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors_V2.lilac,
    letterSpacing: 0.4,
  },
  typeBadge: {
    backgroundColor: colors_V2.skyBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: colors_V2.background,
    letterSpacing: 0.5,
  },
  body: {
    gap: 10,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors_V2.lilac,
    lineHeight: 24,
  },
  progressSection: {
    gap: 6,
  },
  progressHeader: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors_V2.skyBlue,
    letterSpacing: 0.9,
  },
  progressCount: {
    fontSize: 13,
    fontWeight: "900",
    color: colors_V2.lilac,
  },
  progressTrack: {
    height: 5,
    backgroundColor: colors_V2.background,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors_V2.gradientEnd,
    borderRadius: 999,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaItem: {
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: colors_V2.slate,
    fontWeight: "600",
  },
});
