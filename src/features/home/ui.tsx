import {
  LatestWinner,
  SuperSub,
  TopPlayersSection,
  UpcomingTournaments,
} from "@/src/components/home";
import { AppLayout } from "@/src/components/layout";
import { PubgGame } from "@/src/api/types/pubg-tournament.types";
import { UserPublicSummary } from "@/src/api/types/user.types";
import { computeLevelAndProgress } from "@/src/lib/utils/level-from-xp";
import { formatTournamentTimeRemaining } from "@/src/lib/utils/tournament-time-remaining";
import { tierLabelFromXp } from "@/src/lib/utils/tier-from-xp";
import { colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useMirror } from "./store";
import { styles } from "./styles";

function formatPrizePool(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(n) ? String(n) : String(value);
}

export function Ui() {
  const router = useRouter();
  const tournaments = useMirror("tournaments");
  const isLoading = useMirror("IsLoadingTournaments");
  const bestPlayers = useMirror("bestPlayers");
  const isLoadingBestPlayers = useMirror("IsLoadingBestPlayers");
  const latestWinners = useMirror("latestWinners");

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
            teamName={latestWinners?.[0]?.title ?? ""}
            tournamentName={latestWinners?.[0]?.description ?? ""}
            imageSource={latestWinners?.[0]?.image || undefined}
          />
        </View>
        {isLoading && !tournaments?.length ? (
          <View style={styles.loaderSection}>
            <ActivityIndicator size="large" color={colors.primaryPurple} />
          </View>
        ) : (
          <UpcomingTournaments
            tournaments={
              tournaments?.map((game: PubgGame) => ({
                id: game.id.toString(),
                title: game.title,
                prize: formatPrizePool(game.prize_pool),
                participantsCurrent: game.registered_count ?? 0,
                participantsMax: game.max_players,
                timeRemaining: formatTournamentTimeRemaining(game.start_date),
                imageSource: game.game.image,
                onJoinPress: () => {
                  router.push(`/tournament/${game.id}` as never);
                },
              })) ?? []
            }
            onViewAll={() => router.push("/tournaments" as never)}
          />
        )}
        {isLoadingBestPlayers && !bestPlayers?.length ? (
          <View style={styles.loaderSection}>
            <ActivityIndicator color={colors.primaryPurple} />
          </View>
        ) : (
          <TopPlayersSection
            players={
              bestPlayers?.map((player: UserPublicSummary, index: number) => {
                const xp = Number(player.xp_points ?? 0);
                const { progress } = computeLevelAndProgress(xp);
                return {
                  id: player.id.toString(),
                  rank: index + 1,
                  avatarSource: player.profile_picture_url || undefined,
                  name: player.gamer_name,
                  tier: tierLabelFromXp(xp),
                  xp,
                  xpProgress: progress,
                };
              }) ?? []
            }
            seasonLabel="Season 12"
          />
        )}
      </View>
    </AppLayout>
  );
}
