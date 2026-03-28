/** Mirrors OpenAPI components/schemas AuthRegisterBody, AuthLoginBody, AuthTokensResponse */

import type { FriendEntityResponse } from "./friend.types";
import type {
  UserAccountDto,
  UserAchievementApi,
  UserRole,
} from "./user.types";

/**
 * POST /auth/login — user object after password is stripped (AuthService.login select list).
 * Derived from backend `services/repo/auth/auth.service.ts` `login`.
 */
export interface LoginUserResponse {
  id: number;
  email: string;
  coins: number | string;
  role: UserRole;
  full_name: string;
  gamer_name: string;
  is_active: boolean;
  achievements?: UserAchievementApi[];
}

/**
 * GET /auth/current-user — user with relations (AuthController.getMe).
 * Derived from backend `auth.controller.ts` `getMe` + `entities/User.ts`.
 */
export interface CurrentUserResponse extends UserAccountDto {
  achievements?: UserAchievementApi[];
  friends?: FriendEntityResponse[];
}

export interface AuthRegisterBody {
  full_name: string;
  gamer_name: string;
  email: string;
  password: string;
  phone?: string;
  profile_picture_url?: string;
}

export interface AuthLoginBody {
  email: string;
  password: string;
}

export interface AuthTokensResponse {
  /** Register returns full `User` sans password; login returns the narrowed login payload. */
  user: UserAccountDto | LoginUserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface AuthRefreshResponse {
  accessToken: string;
}
