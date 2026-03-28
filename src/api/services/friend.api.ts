import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { ApiResponse } from "../types/api-response";
import type {
  FriendEntityResponse,
  FriendRequestCreatedResponse,
  GetFriendsQuery,
  SendFriendRequestBody,
} from "../types/friend.types";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";
import type { ApiPaginationMeta } from "../types/pubg-tournament.types";

export async function sendFriendRequest(
  body: SendFriendRequestBody
): Promise<FriendRequestCreatedResponse> {
  const res = await axiosInstance.post<ApiResponse<FriendRequestCreatedResponse>>(
    "/friend/request",
    body
  );
  return parseApiResponse(res);
}

export async function getFriends(query: GetFriendsQuery): Promise<{
  data: FriendEntityResponse[];
  meta?: ApiPaginationMeta;
}> {
  const res = await axiosInstance.get<ApiResponse<FriendEntityResponse[]>>("/friend", {
    params: query,
  });
  return parseApiResponseWithMeta(res);
}
