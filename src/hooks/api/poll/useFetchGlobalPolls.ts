import { getGlobalPolls } from "@/src/api/services/poll.api";
import type { PollResponse } from "@/src/api/types/poll.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export type GlobalPollsResult = {
  data: PollResponse[];
  meta?: ApiPaginationMeta;
};

type Options = {
  enabled?: boolean;
  isActive?: boolean;
  limit?: number;
};

export function useFetchGlobalPolls(
  options?: Options,
): UseQueryResult<GlobalPollsResult, Error> {
  const query = {
    type: "global" as const,
    is_active: options?.isActive ?? true,
    limit: options?.limit ?? 25,
  };

  return useQuery({
    queryKey: ["polls", "global", query],
    queryFn: () => getGlobalPolls(query),
    ...apiHooksQueryDefaults,
    enabled: options?.enabled ?? true,
  });
}
