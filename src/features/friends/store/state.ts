import type { FriendsScreenTab } from "./api";

type FriendsUiState = Record<string, never>;

const emptyFriendsUiState = (): FriendsUiState => ({});

export { emptyFriendsUiState };
export type { FriendsScreenTab };
