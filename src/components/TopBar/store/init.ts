import { ImageSourcePropType } from "react-native";


type InitState = {
    type: "auth" | "unAuth",
    avatarSource?: ImageSourcePropType;
    level?: number;
    levelProgress?: number;
    coins?: number;
    achievementColor?: string | null;
    achievementIconUrl?: string | null;
    achievementName?: string | null;
};

const store = (): InitState => ({
    type: "unAuth",
    avatarSource: undefined,
    level: 24,
    levelProgress: 0.75,
    coins: 1450,
    achievementColor: null,
    achievementIconUrl: null,
    achievementName: null,
});

export { store as InitState };
export type { InitState as InitTopBarState };

