import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { ApiResponse } from "../types/api-response";
import type {
  FriendRecord,
  GetFriendsQuery,
  SendFriendRequestBody,
} from "../types/friend.types";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";
import type { ApiPaginationMeta } from "../types/pubg-tournament.types";

export async function sendFriendRequest(
  body: SendFriendRequestBody
): Promise<Record<string, unknown>> {
  const res = await axiosInstance.post<ApiResponse<Record<string, unknown>>>(
    "/friend/request",
    body
  );
  return parseApiResponse(res);
}

export async function getFriends(query: GetFriendsQuery): Promise<{
  data: FriendRecord[];
  meta?: ApiPaginationMeta;
}> {
  const res = await axiosInstance.get<ApiResponse<FriendRecord[]>>("/friend", {
    params: query,
  });
  return parseApiResponseWithMeta(res);
}
