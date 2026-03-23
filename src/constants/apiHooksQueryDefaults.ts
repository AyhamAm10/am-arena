import { QueryObserverOptions } from "@tanstack/react-query";

/**
 * Defaults for OpenAPI-generated query hooks (5m stale, no refetch on focus).
 * Uses `any` for the data slot so spreading does not force `unknown` on useQuery results.
 */
export const apiHooksQueryDefaults: Partial<QueryObserverOptions<any, Error>> = {
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
};
