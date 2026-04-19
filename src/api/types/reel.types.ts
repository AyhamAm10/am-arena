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
  mentioned_user_ids?: number[];
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
  /** Present on GET /reel feed (enriched). */
  liked_by_current_user?: boolean;
  likes_count?: number;
  comments_count?: number;
  comments?: ReelCommentEntity[];
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

export interface MentionableUser {
  id: number;
  gamer_name: string;
  full_name: string;
  avatarUrl: string | null;
  avatarPublicId?: string | null;
}
