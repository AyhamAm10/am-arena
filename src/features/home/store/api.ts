import { ApiResponse } from "@/src/api/types/api-response";
import { HeroContent } from "@/src/api/types/hero-content.types";
import { PubgGame } from "@/src/api/types/pubg-tournament.types";
import { TournamentSummary, UserPublicSummary } from "@/src/api/types/user.types";
import { TopPlayerItem } from "@/src/components/home";


type ApiState = {
    tournaments: PubgGame[] | undefined
    IsLoadingTournaments: boolean
    superTournaments: PubgGame[] | undefined
    IsLoadingSuperTournaments: boolean
    bestPlayers: UserPublicSummary[] | undefined
    IsLoadingBestPlayers: boolean
    latestWinners: HeroContent[] | undefined
    IsLoadingLatestWinners: boolean
};

const store = (): ApiState => ({
    tournaments: undefined,
    IsLoadingTournaments: false,
    superTournaments: undefined,
    IsLoadingSuperTournaments: false,
    bestPlayers: undefined,
    IsLoadingBestPlayers: false,
    latestWinners: undefined,
    IsLoadingLatestWinners: false,
});

export { store as ApiState };
export type { ApiState as ApiHomeState };

