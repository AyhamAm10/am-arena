import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getBestUsers } from "@/src/api/services/user.api";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import type { GetBestUsersQuery, UserPublicSummary } from "@/src/api/types/user.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";

export type BestPlayersResult = {
  data: UserPublicSummary[];
  meta?: ApiPaginationMeta;
};

/**
 * Top users by XP (paginated).
 * GET /user/best — data: UserPublicSummary[], meta (OpenAPI).
 */
export function useFetchBestPlayers(
  query: GetBestUsersQuery
): UseQueryResult<BestPlayersResult, Error> {
  return useQuery({
    queryKey: ["user", "best", query],
    queryFn: () => getBestUsers(query),
    ...apiHooksQueryDefaults,
  });
}
