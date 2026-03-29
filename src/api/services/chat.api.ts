import axiosInstance from "../axios/axiosInstance";
import type { ApiResponse } from "../types/api-response";
import type { ChannelPublic, GetChannelsQuery } from "../types/chat.types";
import type { ApiPaginationMeta } from "../types/pubg-tournament.types";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";

export async function getPublicChannels(query: GetChannelsQuery): Promise<{
  data: ChannelPublic[];
  meta?: ApiPaginationMeta;
}> {
  const res = await axiosInstance.get<ApiResponse<ChannelPublic[]>>(
    "/chat/channels",
    { params: query }
  );
  return parseApiResponseWithMeta(res);
}
