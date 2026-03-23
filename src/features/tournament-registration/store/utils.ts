type TournamentRegistrationUtils = {
  selectedCountLabel: string;
  canSubmit: boolean;
  onConfirmJoin: () => Promise<void>;
  onFriendsListEndReached: () => void;
};

const store = (): TournamentRegistrationUtils => ({
  selectedCountLabel: "1/4 Selected",
  canSubmit: false,
  onConfirmJoin: async () => {},
  onFriendsListEndReached: () => {},
});

export { store as TournamentRegistrationUtils };
export type { TournamentRegistrationUtils as TournamentRegistrationUtilsType };
