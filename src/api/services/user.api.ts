import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { ApiResponse } from "../types/api-response";
import type {
  GetBestUsersQuery,
  UserProfileResponse,
  UserPublicSummary,
} from "../types/user.types";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";
import type { ApiPaginationMeta } from "../types/pubg-tournament.types";

export async function getUserProfile(
  userId: string
): Promise<UserProfileResponse> {
  const res = await axiosInstance.get<ApiResponse<UserProfileResponse>>(
    `/user/${userId}/profile`
  );
  return parseApiResponse(res);
}

export async function getBestUsers(query: GetBestUsersQuery): Promise<{
  data: UserPublicSummary[];
  meta?: ApiPaginationMeta;
}> {
  const res = await axiosInstance.get<ApiResponse<UserPublicSummary[]>>(
    "/user/best",
    { params: query }
  );
  return parseApiResponseWithMeta(res);
}
