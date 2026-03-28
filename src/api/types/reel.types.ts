/** Mirrors OpenAPI CreateReelBody, GetReelsQuery, AddCommentBody, GetCommentsQuery */

import type { UserAccountDto } from "./user.types";

export interface CreateReelBody {
  title: string;
  video_url: string;
  description: string;
}

export interface GetReelsQuery {
  page?: number;
  limit?: number;
}

export interface AddCommentBody {
  comment: string;
}

export interface GetCommentsQuery {
  page?: number;
  limit?: number;
}

/**
 * Reel row from GET /reel and POST /reel.
 * Derived from backend `entities/Reel.ts`.
 */
export interface ReelEntity {
  id: number;
  title: string;
  video_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  user?: UserAccountDto | { id: number };
}

/**
 * Comment row from GET /reel/:id/comments and POST /reel/:id/comment.
 * Derived from backend `entities/ReelComment.ts` (user relation loaded for listing).
 */
export interface ReelCommentEntity {
  id: number;
  comment: string;
  created_at: string;
  updated_at: string;
  reel?: { id: number };
  user?: UserAccountDto | { id: number };
}

/**
 * Like row from POST /reel/:id/like.
 * Derived from backend `entities/ReelLike.ts`.
 */
export interface ReelLikeEntity {
  id: number;
  created_at: string;
  reel?: { id: number };
  user?: UserAccountDto | { id: number };
}
