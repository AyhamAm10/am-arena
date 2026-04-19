import type { PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";
import { tournamentsAr } from "@/src/features/tournaments/strings";
import {
  arDirection,
  arText,
  arWriting,
} from "@/src/features/tournaments/tournaments-rtl";
import { tournamentsTheme } from "@/src/features/tournaments/theme";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type Props = {
  tournament: PubgTournamentDetail;
  onReplayPress: (id: number) => void;
};

const HERO_HEIGHT = 168;

function formatPastDateAr(t: PubgTournamentDetail): string {
  const raw = t.end_date ?? t.start_date ?? t.updated_at ?? t.created_at;
  if (!raw) return tournamentsAr.noWinner;
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("ar", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return tournamentsAr.noWinner;
  }
}

export function PastTournamentCard({ tournament, onReplayPress }: Props) {
  const imageUri = tournament.game?.image
    ? formatImageUrl(tournament.game.image)
    : undefined;
  const champion =
    tournament.winners && tournament.winners.length > 0
      ? tournament.winners[0].gamer_name
      : tournamentsAr.noWinner;
  const dateLabel = formatPastDateAr(tournament);
  const winnerLine =
    champion === tournamentsAr.noWinner
      ? `${tournamentsAr.winnerPrefix} ${tournamentsAr.noWinner}`
      : `${tournamentsAr.winnerPrefix} ${champion}`;

  return (
    <View style={[styles.card, arDirection]}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.hero}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder]} />
      )}

      <View style={styles.body}>
        <Text style={[styles.title, arWriting]} numberOfLines={2}>
          {tournament.title}
        </Text>
        <Text style={[styles.date, arWriting]}>{dateLabel}</Text>

        <View style={styles.championBlock}>
          <Icon
            name="emoji-events"
            size={28}
            color={tournamentsTheme.champion}
            style={styles.medal}
          />
          <View style={styles.championTextCol}>
            <Text style={[styles.championLabel, arText]}>
              {tournamentsAr.champion}
            </Text>
            <Text style={[styles.winnerLine, arText]} numberOfLines={2}>
              {winnerLine}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onReplayPress(tournament.id)}
          accessibilityRole="button"
          accessibilityLabel={tournamentsAr.replayA11y}
          hitSlop={8}
          style={styles.replayWrap}
        >
          <Text style={[styles.replay, arWriting]}>
            {tournamentsAr.replayBracket}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: tournamentsTheme.pastCardBg,
    marginBottom: 16,
  },
  hero: {
    width: "100%",
    height: HERO_HEIGHT,
    backgroundColor: "#111",
  },
  heroPlaceholder: {
    backgroundColor: "#252525",
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  date: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: tournamentsTheme.bodyMuted,
    textAlign: "center",
  },
  championBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 20,
    gap: 12,
    paddingHorizontal: 8,
  },
  medal: {
    marginTop: 2,
  },
  championTextCol: {
    flexShrink: 1,
    gap: 4,
    alignItems: "flex-start",
  },
  championLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: tournamentsTheme.bodyMuted,
    letterSpacing: 0.6,
  },
  winnerLine: {
    fontSize: 15,
    fontWeight: "700",
    color: tournamentsTheme.pastWinnerLine,
    lineHeight: 22,
  },
  replayWrap: {
    marginTop: 22,
    alignSelf: "stretch",
    alignItems: "center",
  },
  replay: {
    fontSize: 12,
    fontWeight: "800",
    color: tournamentsTheme.replayLavender,
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
