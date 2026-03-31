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
