import { StyleSheet, View } from "react-native";
import type { TopPlayerItem, TournamentItem } from "../../components/home";
import {
  SuperSub,
  LatestWinner,
  TopPlayersSection,
  UpcomingTournaments,
} from "../../components/home";
import { AppLayout } from "../../components/layout";

const STATIC_TOURNAMENTS: TournamentItem[] = [
  {
    id: "1",
    title: "PUBG Pro Masters",
    prize: "$2,500",
    participantsCurrent: 120,
    participantsMax: 200,
    timeRemaining: "2h15m",
    imageSource: require("../../assets/pubg.jpg"),
  },
  {
    id: "2",
    title: "eFoot Championship",
    prize: "$1,200",
    participantsCurrent: 45,
    participantsMax: 64,
    timeRemaining: "5h30m",
    imageSource: require("../../assets/esF.jpg"),

  },
];

const STATIC_PLAYERS: TopPlayerItem[] = [
  {
    id: "1",
    rank: 1,
    name: "SkyWalker_99",
    tier: "DIAMOND TIER",
    xp: "12,500",
    xpProgress: 0.85,
  },
  {
    id: "2",
    rank: 2,
    name: "GhostRider_X",
    tier: "PLATINUM TIER",
    xp: "10,200",
    xpProgress: 0.72,
  },
  {
    id: "3",
    rank: 3,
    name: "Nova_Queen",
    tier: "PLATINUM TIER",
    xp: "9,850",
    xpProgress: 0.68,
  },
];

export default function HomeScreen() {
  return (
    <AppLayout>
      <View style={styles.content}>
        <View style={styles.section}>
          <SuperSub
            title="DAILY CHALLENGE"
            description="Win 2 Matches: +500 XP"
            progress={0.4}
          />
        </View>
        <View style={styles.section}>
          <LatestWinner
            imageSource={require("../../assets/victory.jpg")}
            teamName="Team Shadow Elite"
            tournamentName="Winners of the Grand Royale Tournament"
          />
        </View>
        <UpcomingTournaments tournaments={STATIC_TOURNAMENTS} />
        <TopPlayersSection players={STATIC_PLAYERS} seasonLabel="Season 12" />
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
  },
  section: {
    marginTop: 16,
  },
});
