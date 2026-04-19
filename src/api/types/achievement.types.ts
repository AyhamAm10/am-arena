export interface GetAchievementsQuery {
  page?: number;
  limit?: number;
  name?: string;
}

export type AchievementType =
  | "tournament_join"
  | "tournament_win"
  | "tournament_rank"
  | "poll_participation"
  | "poll_win"
  | "highlight"
  | "custom"
  | "event_special";

export type AchievementLogicType = "progress" | "event" | "manual";
