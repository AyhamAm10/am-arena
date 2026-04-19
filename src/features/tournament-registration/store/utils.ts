import type { FriendOption } from "./api";

type TournamentRegistrationUtils = {
  selectedCountLabel: string;
  levelGateMessage: string | null;
  canSubmit: boolean;
  onConfirmJoin: () => Promise<void>;
  onFriendsListEndReached: () => void;
  showSquadFriends: boolean;
  maxSelectableFriends: number;
  filteredFriends: FriendOption[];
};

const store = (): TournamentRegistrationUtils => ({
  selectedCountLabel: "0 SELECTED",
  levelGateMessage: null,
  canSubmit: false,
  onConfirmJoin: async () => {},
  onFriendsListEndReached: () => {},
  showSquadFriends: false,
  maxSelectableFriends: 3,
  filteredFriends: [],
});

export { store as TournamentRegistrationUtils };
export type { TournamentRegistrationUtils as TournamentRegistrationUtilsType };
