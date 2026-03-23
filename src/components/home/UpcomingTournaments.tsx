import { colors } from "@/src/theme/colors";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TournamentCard } from "./tournament-card";
import type { TournamentCardState } from "./tournament-card";

export type TournamentItem = {
  id: string;
  title: string;
  prize: string;
  participantsCurrent: number;
  participantsMax: number;
  timeRemaining?: string ;
  imageSource?: TournamentCardState["imageSource"];
  onJoinPress?: () => void;
};

type Props = {
  tournaments: TournamentItem[];
  onViewAll?: () => void;
};

function buildById(
  tournaments: TournamentItem[]
): Record<string, TournamentCardState> {
  const byId: Record<string, TournamentCardState> = {};
  tournaments.forEach((t) => {
    byId[t.id] = {
      title: t.title,
      prize: t.prize,
      participantsCurrent: t.participantsCurrent,
      participantsMax: t.participantsMax,
      timeRemaining: t.timeRemaining ?? "",
      imageSource: t.imageSource,
      onJoinPress: t.onJoinPress,
    };
  });
  return byId;
}

const UpcomingTournaments: React.FC<Props> = ({
  tournaments,
  onViewAll,
}) => {
  const byId = useMemo(() => buildById(tournaments), [tournaments]);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Tournaments</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tournaments.map((t) => (
          <View key={t.id} style={styles.cardWrap}>
            <TournamentCard instanceId={t.id} byId={byId} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
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
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primaryPurple,
  },
  scrollContent: {
    gap: 12,
    paddingRight: 16,
  },
  cardWrap: {
    marginRight: 12,
  },
});

export default UpcomingTournaments;
