import type { PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";

type InitState = {
  superTournaments: PubgTournamentDetail[];
  onJoinPress?: (id: number) => void;
};

const store = (): InitState => ({
  superTournaments: [],
  onJoinPress: undefined,
});

export { store as InitState };
export type { InitState as InitEliteSquadState };
