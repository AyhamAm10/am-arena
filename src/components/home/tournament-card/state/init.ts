import { ImageSourcePropType } from "react-native";

export type TournamentCardState = {
  title: string;
  prize: string;
  participantsCurrent: number;
  participantsMax: number;
  timeRemaining: string;
  imageSource?: string;
  onJoinPress?: () => void;
};

type InitState = {
  byId: Record<string, TournamentCardState>;
};

const store = (): InitState => ({
  byId: {},
});

export { store as InitState };
export type { InitState as InitTournamentCardState };
