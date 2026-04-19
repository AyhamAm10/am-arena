import { getPollById } from "@/src/api/services/poll.api";
import type { PollResponse } from "@/src/api/types/poll.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useFetchGlobalPolls, type GlobalPollsResult } from "./useFetchGlobalPolls";

function pollNeedsOptionsHydration(p: PollResponse): boolean {
  const count = p.options_count ?? 0;
  const opts = p.options;
  return count > 0 && (!Array.isArray(opts) || opts.length === 0);
}

type HookOptions = Parameters<typeof useFetchGlobalPolls>[0];

/**
 * Global poll list often returns summaries without `options` (only `options_count`).
 * Fetches `GET /poll/:id` per poll that needs options and merges into list data.
 */
export function useHydratedGlobalPolls(
  options?: HookOptions,
): UseQueryResult<GlobalPollsResult, Error> {
  const listQuery = useFetchGlobalPolls(options);
  const items = listQuery.data?.data ?? [];

  const idsToHydrate = useMemo(
    () => items.filter(pollNeedsOptionsHydration).map((p) => p.id),
    [items],
  );

  const detailQueries = useQueries({
    queries: idsToHydrate.map((id) => ({
      queryKey: ["polls", "detail", id] as const,
      queryFn: () => getPollById(id),
      enabled: listQuery.isSuccess && idsToHydrate.length > 0,
      ...apiHooksQueryDefaults,
    })),
  });

  const mergedData = useMemo((): GlobalPollsResult | undefined => {
    if (!listQuery.data) return undefined;
    const byId = new Map<number, PollResponse>();
    idsToHydrate.forEach((id, i) => {
      const row = detailQueries[i]?.data;
      if (row) byId.set(id, row);
    });
    const merged = items.map((p) => {
      const d = byId.get(p.id);
      if (!d) return p;
      const optionsNext =
        Array.isArray(d.options) && d.options.length > 0 ? d.options : (p.options ?? []);
      return { ...p, ...d, options: optionsNext };
    });
    return { data: merged, meta: listQuery.data.meta };
  }, [detailQueries, idsToHydrate, items, listQuery.data]);

  const detailFetching = detailQueries.some((q) => q.isFetching);

  return {
    ...listQuery,
    data: mergedData ?? listQuery.data,
    isFetching: listQuery.isFetching || detailFetching,
  } as UseQueryResult<GlobalPollsResult, Error>;
}
