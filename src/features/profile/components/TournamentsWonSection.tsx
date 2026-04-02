import type { TournamentSummary } from "@/src/api/types/user.types";
import { colors } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type TournamentsWonSectionProps = {
  tournaments: TournamentSummary[];
};

function formatTournamentDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ar", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function iconForGameType(gameType: string): string {
  const g = gameType.toLowerCase();
  if (g.includes("pubg")) return "sports-esports";
  if (g.includes("valorant")) return "emoji-events";
  if (g.includes("dota")) return "stars";
  if (g.includes("cs")) return "videogame-asset";
  return "emoji-events";
}

export function TournamentsWonSection({ tournaments }: TournamentsWonSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>البطولات الفائزة</Text>

      {tournaments.length === 0 ? (
        <Text style={styles.empty}>لم تفز بأي بطولة بعد.</Text>
      ) : (
        <View style={styles.list}>
          {tournaments.map((t) => (
            <View key={t.id} style={styles.row}>
              <View style={styles.accent} />
              <View style={styles.iconWrap}>
                <Icon
                  name={iconForGameType(t.game_type)}
                  size={22}
                  color={colors.primaryPurple}
                />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.tTitle} numberOfLines={2}>
                  {t.title}
                </Text>
                <Text style={styles.tDate}>
                  {formatTournamentDate(t.end_date ?? t.start_date)}
                </Text>
              </View>
              <Icon name="monetization-on" size={22} color={colors.gold} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  empty: {
    color: colors.grey,
    fontSize: 14,
  },
  list: {},
  row: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkBackground2,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    overflow: "hidden",
  },
  accent: {
    position: "absolute",
    start: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primaryPurple,
  },
  iconWrap: {
    marginLeft: 8,
    marginRight: 10,
  },
  textCol: {
    flex: 1,
  },
  tTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  tDate: {
    color: colors.grey,
    fontSize: 12,
    marginTop: 4,
  },
});
