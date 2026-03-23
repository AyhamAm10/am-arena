import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getHeroContentById } from "@/src/api/services/hero-content.api";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import type { HeroContent } from "@/src/api/types/hero-content.types";

/**
 * Fetch one hero content row by id.
 * GET /hero-content/{id} — HeroContent (OpenAPI HeroContent).
 */
export function useFetchHeroContentById(
  id: string,
  options?: { enabled?: boolean }
): UseQueryResult<HeroContent, Error> {
  return useQuery({
    queryKey: ["hero-content", id],
    queryFn: () => getHeroContentById(id),
    ...apiHooksQueryDefaults,
    enabled: (options?.enabled ?? true) && Boolean(id),
  });
}
