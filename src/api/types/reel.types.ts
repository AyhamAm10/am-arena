/** Mirrors OpenAPI CreateReelBody, GetReelsQuery, AddCommentBody, GetCommentsQuery */

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

export type ReelEntity = Record<string, unknown>;
export type ReelCommentEntity = Record<string, unknown>;
