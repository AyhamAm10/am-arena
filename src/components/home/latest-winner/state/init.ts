import { ImageSourcePropType } from "react-native";

type InitState = {
  teamName: string;
  tournamentName: string;
  imageSource?: string;
};

const store = (): InitState => ({
  teamName: "",
  tournamentName: "",
  imageSource: undefined,
});

export { store as InitState };
export type { InitState as InitLatestWinnerState };
