import type { PubgGame } from "@/src/api/types/pubg-tournament.types";
import type { TournamentRegistrationField } from "@/src/api/types/pubg-tournament-registration.types";

export type FriendOption = {
  id: number;
  name: string;
  status: string;
  avatarUrl?: string;
};

type ApiState = {
  tournamentId: string;
  tournament: PubgGame | null;
  isLoadingTournament: boolean;
  registrationFields: TournamentRegistrationField[];
  isLoadingRegistrationFields: boolean;
  friends: FriendOption[];
  hasNextFriendsPage: boolean;
  isLoadingFriends: boolean;
  isFetchingMoreFriends: boolean;
  fetchMoreFriends: () => Promise<unknown>;
  submitRegistration: (payload: {
    tournamentId: string;
    body: { field_values: { field_id: number; value: string }[]; friends: number[] };
  }) => Promise<unknown>;
  isSubmitting: boolean;
};

const store = (): ApiState => ({
  tournamentId: "",
  tournament: null,
  isLoadingTournament: false,
  registrationFields: [],
  isLoadingRegistrationFields: false,
  friends: [],
  hasNextFriendsPage: false,
  isLoadingFriends: false,
  isFetchingMoreFriends: false,
  fetchMoreFriends: async () => undefined,
  submitRegistration: async () => undefined,
  isSubmitting: false,
});

export { store as ApiState };
export type { ApiState as TournamentRegistrationApiState };
