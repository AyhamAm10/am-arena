/** Mirrors OpenAPI User*, AchievementPublic, TournamentSummary, UserProfileResponse */

import type { ApiPaginationMeta } from "./pubg-tournament.types";

export type UserRole = "user" | "admin" | "super_admin";

/**
 * User entity as returned by the API (JSON), excluding password_hash.
 * Derived from backend `entities/User.ts` scalar columns; dates are ISO strings.
 */
export interface UserAccountDto {
  id: number;
  full_name: string;
  gamer_name: string;
  profile_picture_url: string | null;
  email: string;
  phone: string;
  role: UserRole;
  is_active: boolean;
  coins: number | string;
  xp_points: number;
  created_at: string;
  updated_at: string;
}

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
  friend_status?: "accepted" | "pending" | null;
}

export interface AchievementPublic {
  id: number;
  name: string;
  description: string;
  color_theme: string | null;
  icon_url: string;
  xp_reward: number;
}

/**
 * UserAchievement row with nested achievement, as returned on relations.
 * Derived from backend `entities/UserAchievement.ts`.
 */
export interface UserAchievementApi {
  id: number;
  obtained_at: string;
  displayed: boolean;
  achievement: AchievementPublic | null;
}

export interface UserAchievementEntry {
  id: number;
  obtained_at: string;
  displayed: boolean;
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

export interface TournamentHistoryItem {
  tournament_id: number;
  title: string;
  entry_fee: number;
  prize_pool: number;
  xp_reward: number;
  is_active: boolean;
  result: "won" | "lost" | "free";
  amount: number;
  registered_at: string;
}

export interface UserProfileResponse {
  user: UserProfilePublic;
  achievements: UserAchievementEntry[];
  won_tournaments: TournamentSummary[];
  tournament_history?: TournamentHistoryItem[];
}

export interface GetBestUsersQuery {
  page?: number;
  limit?: number;
}

/** GET /user/search — authenticated public user discovery */
export interface GetSearchUsersQuery {
  gamer_name?: string;
  exclude_friends?: boolean;
  page?: number;
  limit?: number;
}

/**
 * RN multipart part for `profile_picture` (e.g. `FormData.append('profile_picture', { uri, name, type })`).
 * Same pattern as registration; field name matches backend multer.
 */
export type ProfilePictureFormPart = {
  uri: string;
  name: string;
  type: string;
};

/**
 * Fields for PATCH /user/profile (multipart). Append strings and optional `profile_picture` to FormData.
 */
export type UpdateProfileFormFields = Partial<{
  full_name: string;
  gamer_name: string;
  email: string;
  phone: string;
  profile_picture: ProfilePictureFormPart;
}>;

export type PaginatedBestUsers = {
  data: UserPublicSummary[];
  meta?: ApiPaginationMeta;
};
