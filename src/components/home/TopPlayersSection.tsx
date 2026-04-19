import { textRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TopPlayer } from "./top-player";
import type { TopPlayerCardState } from "./top-player";
import { router } from "expo-router";

export type TopPlayerItem = {
  id: string;
  rank: number;
  avatarSource?: TopPlayerCardState["avatarSource"];
  name: string;
  tier: string;
  xp: string | number;
  xpProgress: number;
};

type Props = {
  players: TopPlayerItem[];
  seasonLabel?: string;
};

function buildById(players: TopPlayerItem[]): Record<string, TopPlayerCardState> {
  const byId: Record<string, TopPlayerCardState> = {};
  players.forEach((p) => {
    byId[p.id] = {
      rank: p.rank,
      avatarSource: p.avatarSource,
      name: p.name,
      tier: p.tier,
      xp: p.xp,
      xpProgress: p.xpProgress,
    };
  });
  return byId;
}

const TopPlayersSection: React.FC<Props> = ({
  players,
  seasonLabel,
}) => {
  const byId = useMemo(() => buildById(players), [players]);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.title, textRtl]}>قاعة الشهرة</Text>
      </View>
      {players.map((p) => (
        <TouchableOpacity
          key={p.id}
          style={styles.cardPressable}
          activeOpacity={0.85}
          onPress={() => {
            router.push(`/profile/${p.id}`);
          }}
        >
          <TopPlayer
            instanceId={p.id}
            byId={byId}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  cardPressable: {
    alignSelf: "stretch",
    width: "100%",
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});

export default TopPlayersSection;
