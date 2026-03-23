import { colors } from "@/src/theme/colors";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import type { TopPlayerCardState } from "../state/init";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";

type Props = {
  card: TopPlayerCardState | undefined;
};

export default function TopPlayerCardView({ card }: Props) {
  if (!card) return null;

  const { rank, avatarSource, name, tier, xp, xpProgress } = card;
  console.log("avatarSource", avatarSource);
  const clampedProgress = Math.min(1, Math.max(0, xpProgress));

  return (
    <View style={styles.container}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
      {avatarSource ? (
        <Image source={{ uri: formatImageUrl(avatarSource) }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Icon name="person" size={28} color={colors.grey} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.tier}>{tier}</Text>
        <View style={styles.xpRow}>
          <View style={styles.xpBarTrack}>
            <View
              style={[
                styles.xpBarFill,
                { width: `${clampedProgress * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.xpValue}>{xp} XP</Text>
        </View>
      </View>
      <Icon name="military-tech" size={22} color={colors.gold} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkBackground2,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.darkBackground1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.darkBackground1,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  tier: {
    fontSize: 11,
    color: colors.grey,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  xpRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  xpBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.darkBackground1,
    borderRadius: 3,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: colors.primaryPurple,
    borderRadius: 3,
  },
  xpValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primaryPurple,
    minWidth: 60,
    textAlign: "right",
  },
});
