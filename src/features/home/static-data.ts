import { TopPlayerItem, TournamentItem } from "@/src/components/home";

const STATIC_TOURNAMENTS: TournamentItem[] = [
    {
        id: '1',
        title: 'PUBG Pro Masters',
        prize: '$2,500',
        participantsCurrent: 120,
        participantsMax: 200,
        timeRemaining: '2h15m',
        imageSource: require('../../assets/pubg.jpg'),
    },
    {
        id: '2',
        title: 'eFoot Championship',
        prize: '$1,200',
        participantsCurrent: 45,
        participantsMax: 64,
        timeRemaining: '5h30m',
        imageSource: require('../../assets/esF.jpg'),
    },
]

const STATIC_PLAYERS: TopPlayerItem[] = [
    {
        id: '1',
        rank: 1,
        name: 'SkyWalker_99',
        tier: 'DIAMOND TIER',
        xp: '12,500',
        xpProgress: 0.85,
    },
    {
        id: '2',
        rank: 2,
        name: 'GhostRider_X',
        tier: 'PLATINUM TIER',
        xp: '10,200',
        xpProgress: 0.72,
    },
    {
        id: '3',
        rank: 3,
        name: 'Nova_Queen',
        tier: 'PLATINUM TIER',
        xp: '9,850',
        xpProgress: 0.68,
    },
]

export { STATIC_PLAYERS, STATIC_TOURNAMENTS };

