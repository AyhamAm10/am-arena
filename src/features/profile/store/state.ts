type ProfileFeatureStateType = Record<string, never>;

const ProfileEmptyState = (): ProfileFeatureStateType => ({});

export { ProfileEmptyState };
export type { ProfileFeatureStateType };
