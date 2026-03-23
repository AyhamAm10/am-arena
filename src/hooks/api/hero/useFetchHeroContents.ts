import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getHeroContents } from "@/src/api/services/hero-content.api";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import type {
  GetHeroContentsQuery,
  HeroContent,
} from "@/src/api/types/hero-content.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";

export type HeroContentsResult = {
  data: HeroContent[];
  meta?: ApiPaginationMeta;
};

/**
 * List hero content with pagination.
 * GET /hero-content - GetHeroContentsQuery (OpenAPI).
 */
export function useFetchHeroContents(
  query: GetHeroContentsQuery
): UseQueryResult<HeroContentsResult, Error> {
  return useQuery({
    queryKey: ["hero-content", query],
    queryFn: () => getHeroContents(query),
    ...apiHooksQueryDefaults,
  });
}
