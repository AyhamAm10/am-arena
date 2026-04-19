import type { PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";

export type TournamentJoinGate = {
  canJoin: boolean;
  message: string | null;
};

type ApiState = {
  activeTournaments: PubgTournamentDetail[] | undefined;
  pastTournaments: PubgTournamentDetail[] | undefined;
  IsLoadingActiveTournaments: boolean;
  IsLoadingPastTournaments: boolean;
  ActiveTournamentsError: string | null;
  PastTournamentsError: string | null;
  refetchActiveTournaments: () => Promise<unknown>;
  refetchPastTournaments: () => Promise<unknown>;
  joinGatesByTournamentId: Record<number, TournamentJoinGate>;
};

const store = (): ApiState => ({
  activeTournaments: undefined,
  pastTournaments: undefined,
  IsLoadingActiveTournaments: false,
  IsLoadingPastTournaments: false,
  ActiveTournamentsError: null,
  PastTournamentsError: null,
  refetchActiveTournaments: async () => {},
  refetchPastTournaments: async () => {},
  joinGatesByTournamentId: {},
});

export { store as ApiState };
export type { ApiState as ApiTournamentsState };
