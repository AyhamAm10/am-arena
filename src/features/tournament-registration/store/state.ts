type TournamentRegistrationState = {
  selectedFriendIds: number[];
  fieldValues: Record<number, string>;
  termsAccepted: boolean;
  friendSearch: string;
  setSelectedFriendIds: (ids: number[]) => void;
  toggleFriendSelection: (friendId: number) => void;
  setFieldValue: (fieldId: number, value: string) => void;
  setTermsAccepted: (v: boolean) => void;
  setFriendSearch: (q: string) => void;
};

const store = (): TournamentRegistrationState => ({
  selectedFriendIds: [],
  fieldValues: {},
  termsAccepted: false,
  friendSearch: "",
  setSelectedFriendIds: () => {},
  toggleFriendSelection: () => {},
  setFieldValue: () => {},
  setTermsAccepted: () => {},
  setFriendSearch: () => {},
});

export { store as TournamentRegistrationState };
export type { TournamentRegistrationState as TournamentRegistrationStateType };
