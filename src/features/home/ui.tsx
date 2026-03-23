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

// const STATIC_TOURNAMENTS: TournamentItem[] = [
//     {
//         id: '1',
//         title: 'PUBG Pro Masters',
//         prize: '$2,500',
//         participantsCurrent: 120,
//         participantsMax: 200,
//         timeRemaining: '2h15m',
//         imageSource: require('../../assets/pubg.jpg'),
//     },
//     {
//         id: '2',
//         title: 'eFoot Championship',
//         prize: '$1,200',
//         participantsCurrent: 45,
//         participantsMax: 64,
//         timeRemaining: '5h30m',
//         imageSource: require('../../assets/esF.jpg'),
//     },
// ]

// const STATIC_PLAYERS: TopPlayerItem[] = [
//     {
//         id: '1',
//         rank: 1,
//         name: 'SkyWalker_99',
//         tier: 'DIAMOND TIER',
//         xp: '12,500',
//         xpProgress: 0.85,
//     },
//     {
//         id: '2',
//         rank: 2,
//         name: 'GhostRider_X',
//         tier: 'PLATINUM TIER',
//         xp: '10,200',
//         xpProgress: 0.72,
//     },
//     {
//         id: '3',
//         rank: 3,
//         name: 'Nova_Queen',
//         tier: 'PLATINUM TIER',
//         xp: '9,850',
//         xpProgress: 0.68,
//     },
// ]

export function Ui() {
    const data = useMirror("data");
    const isLoading = useMirror("isLoading");

    useEffect(() => {
        console.log("STORE DATA:", data);
    }, [data]);
    


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
                        imageSource={require('../../assets/victory.jpg')}
                        teamName="Team Shadow Elite"
                        tournamentName="Winners of the Grand Royale Tournament"
                    />
                </View>
                <UpcomingTournaments tournaments={data?.map((game: PubgGame) => ({
                    id: game.id.toString(),
                    title: game.title,
                    prize: game.prize_pool.toString(),
                    participantsCurrent: game.max_players,
                    participantsMax: game.max_players,
                    // timeRemaining: game.start_date ? new Date(game.start_date).getTime() - new Date().getTime() : undefined,
                    imageSource: game.game.image,
                    onJoinPress: () => {
                        console.log("Join press");
                    },
                })) ?? []} />
                <TopPlayersSection players={STATIC_PLAYERS} seasonLabel="Season 12" />
            </View>
        </AppLayout>
    )
}
