import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getMyAchievements } from "@/src/api/services/achievement.api";
import type { UserAchievementEntry } from "@/src/api/types/user.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";

export function useFetchMyAchievements(options?: {
  enabled?: boolean;
}): UseQueryResult<UserAchievementEntry[], Error> {
  return useQuery({
    queryKey: ["achievement", "my-achievements"],
    queryFn: getMyAchievements,
    ...apiHooksQueryDefaults,
    enabled: options?.enabled ?? true,
  });
}
