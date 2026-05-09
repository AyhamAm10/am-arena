import { useInfiniteQuery, type UseInfiniteQueryResult } from "@tanstack/react-query";
import { getReels } from "@/src/api/services/reel.api";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import type { GetReelsQuery, ReelEntity } from "@/src/api/types/reel.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";

export type ReelsPageResult = {
  data: ReelEntity[];
  meta?: ApiPaginationMeta;
};

type UseFetchReelsInfiniteOptions = Omit<GetReelsQuery, "page"> & {
  initialPage?: number;
  enabled?: boolean;
};

export function useFetchReelsInfinite(
  options: UseFetchReelsInfiniteOptions
): UseInfiniteQueryResult<ReelsPageResult, Error> {
  const { initialPage = 1, enabled = true, ...filters } = options;

  return useInfiniteQuery({
    queryKey: ["reels", "infinite", filters],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getReels({ ...(filters as GetReelsQuery), page: Number(pageParam) }),
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
