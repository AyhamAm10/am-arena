import type { TournamentSummary } from "@/src/api/types/user.types";
import { flexRowRtl, textRtl, writingRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type TournamentsWonSectionProps = {
  tournaments: TournamentSummary[];
  isOwnProfile: boolean;
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

export function TournamentsWonSection({
  tournaments,
  isOwnProfile,
}: TournamentsWonSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, writingRtl]}>
        {isOwnProfile ? "آخر البطولات الفائزة" : "بطولات فاز بها"}
      </Text>

      {tournaments.length === 0 ? (
        <Text style={[styles.empty, writingRtl]}>لا توجد بطولات فاز بها بعد.</Text>
      ) : (
        <View style={styles.list}>
          {tournaments.map((t) => (
            <View key={t.id} style={styles.row}>
              <View style={styles.accent} />
              <View style={styles.iconWrap}>
                <Icon
                  name={iconForGameType(t.game_type)}
                  size={22}
                  color={colors_V2.gold}
                />
              </View>
              <View style={styles.textCol}>
                <Text style={[styles.tTitle, textRtl]} numberOfLines={2}>
                  {t.title}
                </Text>
                <Text style={[styles.tDate, writingRtl]}>
                  {formatTournamentDate(t.end_date ?? t.start_date)}
                </Text>
              </View>
              <View style={styles.trailingWrap}>
                <Icon name="emoji-events" size={20} color={colors_V2.gold} />
              </View>
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
    color: colors_V2.lilac,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  empty: {
    color: colors_V2.slate,
    fontSize: 14,
  },
  list: {},
  row: {
    marginBottom: 10,
    ...flexRowRtl,
    alignItems: "center",
    backgroundColor: colors_V2.card,
    borderRadius: 12,
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
    backgroundColor: colors_V2.gold,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "rgba(233, 196, 0, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginStart: 10,
  },
  textCol: {
    flex: 1,
  },
  tTitle: {
    color: colors_V2.lilac,
    fontSize: 15,
    fontWeight: "600",
  },
  tDate: {
    color: colors_V2.slate,
    fontSize: 12,
    marginTop: 4,
  },
  trailingWrap: {
    marginStart: 12,
  },
});
