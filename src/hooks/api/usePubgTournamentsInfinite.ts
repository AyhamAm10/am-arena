import { useInfiniteQuery, type UseInfiniteQueryResult } from "@tanstack/react-query";
import { getPubgTournaments } from "@/src/api/services/pubg-tournament.api";
import { defaultQueryOptions } from "@/src/constants/queryOptions";
import type { GetPubgTournamentsQuery, PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";

type UseGetPubgTournamentsInfiniteOptions = Omit<GetPubgTournamentsQuery, "page"> & {
  initialPage?: number;
  enabled?: boolean;
};

export function useGetPubgTournamentsInfinite(
  options: UseGetPubgTournamentsInfiniteOptions
): UseInfiniteQueryResult<{ data: PubgTournamentDetail[]; meta?: { page: number; totalPages?: number } }, Error> {
  const { initialPage = 1, enabled = true, ...filters } = options;

  return useInfiniteQuery({
    queryKey: ["pubg-tournaments", "infinite", filters],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getPubgTournaments({ ...(filters as GetPubgTournamentsQuery), page: Number(pageParam) }),
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => {
      const page = lastPage.meta?.page ?? 1;
      const totalPages = lastPage.meta?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
    ...defaultQueryOptions,
    enabled,
  });
}
