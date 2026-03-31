import { getChannelMessages } from "@/src/api/services/chat.api";
import type { ChannelMessage, GetMessagesQuery } from "@/src/api/types/chat.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export type ChannelMessagesResult = {
  data: ChannelMessage[];
  meta?: ApiPaginationMeta;
};

export function useFetchChannelMessages(
  channelId: number,
  query: GetMessagesQuery,
  options?: { enabled?: boolean },
): UseQueryResult<ChannelMessagesResult, Error> {
  return useQuery({
    queryKey: ["chat", "messages", channelId, query],
    queryFn: () => getChannelMessages(channelId, query),
    ...apiHooksQueryDefaults,
    enabled: options?.enabled ?? true,
  });
}
