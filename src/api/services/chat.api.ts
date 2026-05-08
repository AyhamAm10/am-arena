import axiosInstance from "../axios/axiosInstance";
import type { ApiResponse } from "../types/api-response";
import type {
  ChannelMessage,
  ChannelPublic,
  GetChannelsQuery,
  GetMessagesQuery,
} from "../types/chat.types";
import type { ApiPaginationMeta } from "../types/pubg-tournament.types";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";

export async function getPublicChannels(query: GetChannelsQuery): Promise<{
  data: ChannelPublic[];
  meta?: ApiPaginationMeta;
}> {
  const res = await axiosInstance.get<ApiResponse<ChannelPublic[]>>(
    "/chat/channels",
    { params: query },
  );
  return parseApiResponseWithMeta(res);
}

export async function getChannelMessages(
  channelId: number,
  query: GetMessagesQuery,
): Promise<{ data: ChannelMessage[]; meta?: ApiPaginationMeta }> {
  const res = await axiosInstance.get<ApiResponse<ChannelMessage[]>>(
    `/chat/channels/${channelId}/messages`,
    { params: query },
  );
  return parseApiResponseWithMeta(res);
}

export async function createChannelMessage(channelId: number, body: { content: string }) {
  const res = await axiosInstance.post<ApiResponse<any>>(`/chat/channels/${channelId}/messages`, body);
  return res.data;
}

export async function updateChannelMessage(channelId: number, messageId: number, body: { content: string }) {
  const res = await axiosInstance.patch<ApiResponse<any>>(`/chat/channels/${channelId}/messages/${messageId}`, body);
  return res.data;
}

export async function deleteChannelMessage(channelId: number, messageId: number) {
  const res = await axiosInstance.delete<ApiResponse<any>>(`/chat/channels/${channelId}/messages/${messageId}`);
  return res.data;
}
