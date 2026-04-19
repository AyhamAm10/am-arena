import React from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { useMirror } from "../state";
import type { PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";
import EliteSquadCard from "./EliteSquadCard";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function UiFactory() {
  const superTournaments = useMirror("superTournaments") as PubgTournamentDetail[];
  const onJoinPress = useMirror("onJoinPress") as ((id: number) => void) | undefined;

  if (!superTournaments || superTournaments.length === 0) {
    return null;
  }

  if (superTournaments.length === 1) {
    return (
      <View style={styles.container}>
        <EliteSquadCard
          tournament={superTournaments[0]}
          onJoinPress={onJoinPress}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={superTournaments}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      snapToInterval={SCREEN_WIDTH - 32 + 12}
      decelerationRate="fast"
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <View style={styles.cardWrap}>
          <EliteSquadCard tournament={item} onJoinPress={onJoinPress} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  listContent: {
    gap: 12,
  },
  cardWrap: {
    width: SCREEN_WIDTH - 32,
  },
});
