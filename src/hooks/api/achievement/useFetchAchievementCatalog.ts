import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAchievements } from "@/src/api/services/achievement.api";
import type { AchievementPublic } from "@/src/api/types/user.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";

const CATALOG_LIMIT = 100;

/**
 * All achievements (catalog) for profile badge strip + achievements list.
 * GET /achievement — paginated; we request a single large page.
 */
export function useFetchAchievementCatalog(options?: {
  enabled?: boolean;
}): UseQueryResult<AchievementPublic[], Error> {
  return useQuery({
    queryKey: ["achievement", "catalog", CATALOG_LIMIT],
    queryFn: async () => {
      const { data } = await getAchievements({
        page: 1,
        limit: CATALOG_LIMIT,
      });
      return data;
    },
    ...apiHooksQueryDefaults,
    enabled: options?.enabled ?? true,
  });
}
