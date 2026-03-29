import { searchUsers } from "@/src/api/services/user.api";
import type { GetSearchUsersQuery } from "@/src/api/types/user.types";
import type { UserPublicSummary } from "@/src/api/types/user.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useInfiniteQuery, type UseInfiniteQueryResult } from "@tanstack/react-query";

export type SearchUsersPageResult = {
  data: UserPublicSummary[];
  meta?: ApiPaginationMeta;
};

type Options = Omit<GetSearchUsersQuery, "page"> & {
  initialPage?: number;
  enabled?: boolean;
};

export function useSearchUsersInfinite(
  options: Options
): UseInfiniteQueryResult<SearchUsersPageResult, Error> {
  const { initialPage = 1, enabled = true, ...filters } = options;

  return useInfiniteQuery({
    queryKey: ["user-search", "infinite", filters],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      searchUsers({
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
