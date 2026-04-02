import { flexRowRtl, textRtl } from "@/src/lib/rtl";
import { colors } from "@/src/theme/colors";
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
      <View style={[styles.header, flexRowRtl]}>
        <Text style={[styles.title, textRtl]}>أفضل اللاعبين</Text>
        {seasonLabel ? (
          <View style={styles.seasonPill}>
            <Text style={[styles.seasonLabel, textRtl]}>{seasonLabel}</Text>
          </View>
        ) : null}
      </View>
      {players.map((p) => (
        <TouchableOpacity key={p.id} onPress={() => {
          router.push(`/profile/${p.id}`);
        }}>

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
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
  },
  seasonPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primaryPurple,
    backgroundColor: colors.darkBackground2,
  },
  seasonLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryPurple,
    letterSpacing: 0.3,
  },
});

export default TopPlayersSection;
