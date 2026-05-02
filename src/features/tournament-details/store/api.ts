import type { PollResponse } from "@/src/api/types/poll.types";
import type { PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";

type ApiState = {
  tournamentId: string;
  tournament: PubgTournamentDetail | null;
  polls: PollResponse[];
  isLoadingTournament: boolean;
  isLoadingPolls: boolean;
  isVoting: boolean;
  votePendingPollId: number | null;
  votePendingOptionId: number | null;
  voteOnPoll: (pollId: number, optionId: number) => Promise<unknown>;
};

const store = (): ApiState => ({
  tournamentId: "",
  tournament: null,
  polls: [],
  isLoadingTournament: false,
  isLoadingPolls: false,
  isVoting: false,
  votePendingPollId: null,
  votePendingOptionId: null,
  voteOnPoll: async () => undefined,
});

export { store as ApiState };
export type { ApiState as TournamentDetailsApiState };
