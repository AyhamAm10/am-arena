/** Mirrors OpenAPI User*, AchievementPublic, TournamentSummary, UserProfileResponse */

import type { ApiPaginationMeta } from "./pubg-tournament.types";

export type UserRole = "user" | "admin" | "super_admin";

export interface UserPublicSummary {
  id: number;
  full_name: string;
  gamer_name: string;
  profile_picture_url: string | null;
  xp_points: number;
  coins: number | string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AchievementPublic {
  id: number;
  name: string;
  description: string;
  color_theme: string | null;
  icon_url: string;
  xp_reward: number;
}

export interface UserAchievementEntry {
  obtained_at: string;
  achievement: AchievementPublic | null;
}

export interface TournamentSummary {
  id: number;
  game_type: string;
  game_ref_id: number;
  title: string;
  description: string;
  entry_fee: number | string;
  prize_pool: number | string;
  max_players: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfilePublic {
  id: number;
  full_name: string;
  gamer_name: string;
  profile_picture_url: string | null;
  xp_points: number;
  coins: number | string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfileResponse {
  user: UserProfilePublic;
  achievements: UserAchievementEntry[];
  won_tournaments: TournamentSummary[];
}

export interface GetBestUsersQuery {
  page?: number;
  limit?: number;
}

export type PaginatedBestUsers = {
  data: UserPublicSummary[];
  meta?: ApiPaginationMeta;
};
