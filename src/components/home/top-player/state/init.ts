

export type TopPlayerCardState = {
  rank: number;
  avatarSource?: string;
  name: string;
  tier: string;
  xp: string | number;
  xpProgress: number;
};

type InitState = {
  byId: Record<string, TopPlayerCardState>;
};

const store = (): InitState => ({
  byId: {},
});

export { store as InitState };
export type { InitState as InitTopPlayerState };
