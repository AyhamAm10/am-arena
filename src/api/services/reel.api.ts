import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { ApiResponse } from "../types/api-response";
import type {
  AddCommentBody,
  CreateReelBody,
  GetCommentsQuery,
  GetReelsQuery,
  ReelCommentEntity,
  ReelEntity,
  ReelLikeEntity,
} from "../types/reel.types";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";
import type { ApiPaginationMeta } from "../types/pubg-tournament.types";

export async function createReel(
  body: CreateReelBody
): Promise<ReelEntity> {
  const res = await axiosInstance.post<ApiResponse<ReelEntity>>("/reel", body);
  return parseApiResponse(res);
}

export async function getReels(query: GetReelsQuery): Promise<{
  data: ReelEntity[];
  meta?: ApiPaginationMeta;
}> {
  const res = await axiosInstance.get<ApiResponse<ReelEntity[]>>("/reel", {
    params: query,
  });
  return parseApiResponseWithMeta(res);
}

export async function addReelComment(
  reelId: string,
  body: AddCommentBody
): Promise<ReelCommentEntity> {
  const res = await axiosInstance.post<ApiResponse<ReelCommentEntity>>(
    `/reel/${reelId}/comment`,
    body
  );
  return parseApiResponse(res);
}

export async function getReelComments(
  reelId: string,
  query: GetCommentsQuery
): Promise<{
  data: ReelCommentEntity[];
  meta?: ApiPaginationMeta;
}> {
  const res = await axiosInstance.get<ApiResponse<ReelCommentEntity[]>>(
    `/reel/${reelId}/comments`,
    { params: query }
  );
  return parseApiResponseWithMeta(res);
}

export async function likeReel(reelId: string): Promise<ReelLikeEntity> {
  const res = await axiosInstance.post<ApiResponse<ReelLikeEntity>>(
    `/reel/${reelId}/like`
  );
  return parseApiResponse(res);
}

export async function removeReelLike(reelId: string): Promise<void> {
  const res = await axiosInstance.delete<ApiResponse<Record<string, never>>>(
    `/reel/${reelId}/like`
  );
  parseApiResponse(res);
}
