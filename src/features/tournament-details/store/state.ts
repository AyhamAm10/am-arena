export type TournamentDetailsTab = "tournament" | "voting" | "votingDetails";

type TournamentDetailsState = {
  activeTab: TournamentDetailsTab;
  setActiveTab: (tab: TournamentDetailsTab) => void;
};

const TournamentDetailsState = (): TournamentDetailsState => ({
  activeTab: "tournament",
  setActiveTab: () => undefined,
});

export { TournamentDetailsState };
export type { TournamentDetailsState as TournamentDetailsFeatureState };
