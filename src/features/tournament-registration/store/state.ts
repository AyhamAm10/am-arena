type TournamentRegistrationState = {
  selectedFriendIds: number[];
  fieldValues: Record<number, string>;
  setSelectedFriendIds: (ids: number[]) => void;
  toggleFriendSelection: (friendId: number) => void;
  setFieldValue: (fieldId: number, value: string) => void;
};

const store = (): TournamentRegistrationState => ({
  selectedFriendIds: [],
  fieldValues: {},
  setSelectedFriendIds: () => {},
  toggleFriendSelection: () => {},
  setFieldValue: () => {},
});

export { store as TournamentRegistrationState };
export type { TournamentRegistrationState as TournamentRegistrationStateType };
