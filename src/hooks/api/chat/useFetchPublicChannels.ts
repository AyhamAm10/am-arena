import { getPublicChannels } from "@/src/api/services/chat.api";
import type { ChannelPublic, GetChannelsQuery } from "@/src/api/types/chat.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export type PublicChannelsResult = {
  data: ChannelPublic[];
  meta?: ApiPaginationMeta;
};

export function useFetchPublicChannels(
  query: GetChannelsQuery,
  options?: { enabled?: boolean }
): UseQueryResult<PublicChannelsResult, Error> {
  return useQuery({
    queryKey: ["chat", "channels", query],
    queryFn: () => getPublicChannels(query),
    ...apiHooksQueryDefaults,
    enabled: options?.enabled ?? true,
  });
}
