import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getReelComments } from "@/src/api/services/reel.api";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import type { GetCommentsQuery, ReelCommentEntity } from "@/src/api/types/reel.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";

export type ReelCommentsResult = {
  data: ReelCommentEntity[];
  meta?: ApiPaginationMeta;
};

/**
 * Paginated comments for a reel.
 * GET /reel/{id}/comments — GetCommentsQuery (OpenAPI GetCommentsQuery).
 */
export function useFetchReelComments(
  reelId: string,
  query: GetCommentsQuery,
  options?: { enabled?: boolean }
): UseQueryResult<ReelCommentsResult, Error> {
  return useQuery({
    queryKey: ["reel", reelId, "comments", query],
    queryFn: () => getReelComments(reelId, query),
    ...apiHooksQueryDefaults,
    enabled: (options?.enabled ?? true) && Boolean(reelId),
  });
}
