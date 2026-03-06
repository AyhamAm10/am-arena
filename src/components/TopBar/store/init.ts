import { ImageSourcePropType } from "react-native";


type InitState = {
    type: "auth" | "unAuth",
    avatarSource?: ImageSourcePropType;
    level?: number;
    levelProgress?: number;
    coins?: number;
};

const store = (): InitState => ({
    type: "unAuth",
    avatarSource: undefined,
    level: 24,
    levelProgress: 0.75,
    coins: 1450,
});

export { store as InitState };
export type { InitState as InitTopBarState };

