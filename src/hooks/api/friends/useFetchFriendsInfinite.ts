import { getFriends } from "@/src/api/services/friend.api";
import type { FriendEntityResponse, GetFriendsQuery } from "@/src/api/types/friend.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useInfiniteQuery, type UseInfiniteQueryResult } from "@tanstack/react-query";

export type FriendsPageResult = {
  data: FriendEntityResponse[];
  meta?: ApiPaginationMeta;
};

type UseFetchFriendsInfiniteOptions = Omit<GetFriendsQuery, "page"> & {
  initialPage?: number;
  enabled?: boolean;
};

export function useFetchFriendsInfinite(
  options: UseFetchFriendsInfiniteOptions
): UseInfiniteQueryResult<FriendsPageResult, Error> {
  const { initialPage = 1, enabled = true, ...filters } = options;

  return useInfiniteQuery({
    queryKey: ["friends", "infinite", filters],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getFriends({
        ...filters,
        page: Number(pageParam),
      }),
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => {
      const page = lastPage.meta?.page ?? 1;
      const totalPages = lastPage.meta?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: apiHooksQueryDefaults.staleTime,
    refetchOnWindowFocus: apiHooksQueryDefaults.refetchOnWindowFocus,
    enabled,
  });
}
