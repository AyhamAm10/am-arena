import {
    LatestWinner,
    SuperSub,
    TopPlayersSection,
    UpcomingTournaments,
} from '@/src/components/home'
import { AppLayout } from '@/src/components/layout'
import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { STATIC_PLAYERS, STATIC_TOURNAMENTS } from './static-data'
import { useMirror } from './store'
import { styles } from './styles'
import { PubgGame } from '@/src/api/types/pubg-tournament.types'
import { colors } from '@/src/theme/colors'
import { UserPublicSummary } from '@/src/api/types/user.types'
import { useRouter } from 'expo-router'

export function Ui() {      
    const router = useRouter();
    const tournaments = useMirror("tournaments");
    const isLoading = useMirror("IsLoadingTournaments");
    const bestPlayers = useMirror("bestPlayers");
    const isLoadingBestPlayers = useMirror("IsLoadingBestPlayers");
    const latestWinners = useMirror("latestWinners");
    const isLoadingLatestWinners = useMirror("IsLoadingLatestWinners");

    console.log("LATEST WINNERS:", latestWinners?.[0]?.image);
    useEffect(() => {
        console.log("STORE DATA:", tournaments);
    }, [tournaments]);
    


    if (isLoading) {
        return (<View>
            <ActivityIndicator size="large" color={colors.primaryPurple} />
        </View>)
    }
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
                <UpcomingTournaments tournaments={tournaments?.map((game: PubgGame) => ({
                    id: game.id.toString(),
                    title: game.title,
                    prize: game.prize_pool.toString(),
                    participantsCurrent: game.max_players,
                    participantsMax: game.max_players,
                    // timeRemaining: game.start_date ? new Date(game.start_date).getTime() - new Date().getTime() : undefined,
                    imageSource: game.game.image,
                    onJoinPress: () => {
                        router.push(`/tournament/${game.id}` as any);
                    },
                })) ?? []} />
                <TopPlayersSection players={bestPlayers?.map((player: UserPublicSummary) => ({
                    id: player.id.toString(),
                    rank: player.xp_points,
                    avatarSource: player.profile_picture_url || undefined,
                    name: player.gamer_name,
                    tier: player.xp_points.toString(),
                    xp: player.xp_points.toString(),
                    xpProgress: player.xp_points / 100,
                })) ?? []} seasonLabel="Season 12" />
            </View>
        </AppLayout>
    )
}
