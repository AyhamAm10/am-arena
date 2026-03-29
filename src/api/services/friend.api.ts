import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { ApiResponse } from "../types/api-response";
import type {
  AcceptFriendRequestBody,
  FriendEntityResponse,
  FriendRequestCreatedResponse,
  GetFriendsQuery,
  RemoveFriendUserBody,
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

export async function acceptFriendRequest(
  body: AcceptFriendRequestBody
): Promise<FriendEntityResponse> {
  const res = await axiosInstance.post<ApiResponse<FriendEntityResponse>>(
    "/friend/accept",
    body
  );
  return parseApiResponse(res);
}

export async function removeFriendship(
  body: RemoveFriendUserBody
): Promise<void> {
  const res = await axiosInstance.delete<ApiResponse<Record<string, never>>>(
    "/friend",
    { data: body }
  );
  parseApiResponse(res);
}

export async function removePendingFriendRequest(
  body: RemoveFriendUserBody
): Promise<void> {
  const res = await axiosInstance.delete<ApiResponse<Record<string, never>>>(
    "/friend/pending",
    { data: body }
  );
  parseApiResponse(res);
}
