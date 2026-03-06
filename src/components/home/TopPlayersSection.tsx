import { colors } from "@/src/theme/colors";
import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TopPlayer } from "./top-player";
import type { TopPlayerCardState } from "./top-player";

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
        <Text style={styles.title}>Top Players</Text>
        {seasonLabel && (
          <Text style={styles.seasonLabel}>{seasonLabel}</Text>
        )}
      </View>
      {players.map((p) => (
        <TopPlayer
          key={p.id}
          instanceId={p.id}
          byId={byId}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
  },
  seasonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primaryPurple,
  },
});

export default TopPlayersSection;
