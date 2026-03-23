/** Mirrors OpenAPI SendFriendRequestBody, GetFriendsQuery; friend rows are loosely typed where spec uses generic object */

export interface SendFriendRequestBody {
  friend_user_id: number;
}

export type FriendListStatus = "pending" | "accepted" | "blocked";

export interface GetFriendsQuery {
  status?: FriendListStatus;
  gamer_name?: string;
  page?: number;
  limit?: number;
}

/** GET /friend — schema lists items as generic objects */
export type FriendRecord = Record<string, unknown>;
