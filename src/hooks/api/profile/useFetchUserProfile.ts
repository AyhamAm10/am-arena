import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getUserProfile } from "@/src/api/services/user.api";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import type { UserProfileResponse } from "@/src/api/types/user.types";

/**
 * Public profile for another user: user fields, achievements (titles), won tournaments.
 * GET /user/{id}/profile — UserProfileResponse (OpenAPI UserProfileResponse).
 */
export function useFetchUserProfile(
  userId: string,
  options?: { enabled?: boolean }
): UseQueryResult<UserProfileResponse, Error> {
  return useQuery({
    queryKey: ["user", "profile", userId],
    queryFn: () => getUserProfile(userId),
    ...apiHooksQueryDefaults,
    enabled: (options?.enabled ?? true) && Boolean(userId),
  });
}
