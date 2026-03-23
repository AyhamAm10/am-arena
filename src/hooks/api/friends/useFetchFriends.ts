import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getFriends } from "@/src/api/services/friend.api";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import type { FriendRecord, GetFriendsQuery } from "@/src/api/types/friend.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";

export type FriendsListResult = {
  data: FriendRecord[];
  meta?: ApiPaginationMeta;
};

/**
 * Friends list with optional filters and pagination.
 * GET /friend — GetFriendsQuery (OpenAPI GetFriendsQuery).
 */
export function useFetchFriends(
  query: GetFriendsQuery
): UseQueryResult<FriendsListResult, Error> {
  return useQuery({
    queryKey: ["friends", query],
    queryFn: () => getFriends(query),
    ...apiHooksQueryDefaults,
  });
}
