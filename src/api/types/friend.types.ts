/** Mirrors backend `dto/friend/*` and `entities/Friend.ts` response shapes */

import type { UserAccountDto } from "./user.types";

export interface SendFriendRequestBody {
  friend_user_id: number;
}

export type FriendListStatus = "pending" | "accepted" | "blocked";

export type FriendListDirection = "incoming" | "outgoing";

export interface GetFriendsQuery {
  status?: FriendListStatus;
  direction?: FriendListDirection;
  gamer_name?: string;
  page?: number;
  limit?: number;
}

export interface AcceptFriendRequestBody {
  user_id: number;
}

export interface RemoveFriendUserBody {
  friend_user_id: number;
}

/**
 * Friend row as returned by GET /friend (joined `user` and `friend` relations).
 * Derived from backend `entities/Friend.ts`.
 */
export interface FriendEntityResponse {
  user_id: number;
  friend_user_id: number;
  status: FriendListStatus;
  created_at: string;
  updated_at: string;
  user?: UserAccountDto;
  friend?: UserAccountDto;
}

/**
 * POST /friend/request — created Friend row (no relations loaded).
 * Derived from backend `FriendService.sendRequest` / `entities/Friend.ts`.
 */
export type FriendRequestCreatedResponse = Pick<
  FriendEntityResponse,
  "user_id" | "friend_user_id" | "status" | "created_at" | "updated_at"
>;
