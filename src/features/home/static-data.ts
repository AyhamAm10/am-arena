import { TopPlayerItem, TournamentItem } from "@/src/components/home";

const STATIC_TOURNAMENTS: TournamentItem[] = [
    {
        id: '1',
        title: 'ببجي برو ماسترز',
        prize: '2500',
        participantsCurrent: 120,
        participantsMax: 200,
        timeRemaining: '2س 15د',
        imageSource: require('../../assets/pubg.jpg'),
    },
    {
        id: '2',
        title: 'بطولة إي فوت',
        prize: '1200',
        participantsCurrent: 45,
        participantsMax: 64,
        timeRemaining: '5س 30د',
        imageSource: require('../../assets/esF.jpg'),
    },
]

const STATIC_PLAYERS: TopPlayerItem[] = [
    {
        id: '1',
        rank: 1,
        name: 'سكاي_٩٩',
        tier: 'مستوى الماس',
        xp: '12500',
        xpProgress: 0.85,
    },
    {
        id: '2',
        rank: 2,
        name: 'شبح_إكس',
        tier: 'مستوى البلاتين',
        xp: '10200',
        xpProgress: 0.72,
    },
    {
        id: '3',
        rank: 3,
        name: 'نوفا_كوين',
        tier: 'مستوى البلاتين',
        xp: '9850',
        xpProgress: 0.68,
    },
]

export { STATIC_PLAYERS, STATIC_TOURNAMENTS };

