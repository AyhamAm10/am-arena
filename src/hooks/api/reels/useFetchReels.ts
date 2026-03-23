import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getReels } from "@/src/api/services/reel.api";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import type { GetReelsQuery, ReelEntity } from "@/src/api/types/reel.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";

export type ReelsListResult = {
  data: ReelEntity[];
  meta?: ApiPaginationMeta;
};

/**
 * Paginated reels feed.
 * GET /reel — GetReelsQuery (OpenAPI GetReelsQuery).
 */
export function useFetchReels(
  query: GetReelsQuery
): UseQueryResult<ReelsListResult, Error> {
  return useQuery({
    queryKey: ["reels", query],
    queryFn: () => getReels(query),
    ...apiHooksQueryDefaults,
  });
}
