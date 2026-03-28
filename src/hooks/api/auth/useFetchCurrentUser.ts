import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getCurrentUser } from "@/src/api/services/auth.api";
import type { CurrentUserResponse } from "@/src/api/types/auth.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";

/**
 * Current authenticated user (self profile).
 * GET /auth/current-user — data: user object without password (OpenAPI).
 */
export function useFetchCurrentUser(options?: {
  enabled?: boolean;
}): UseQueryResult<CurrentUserResponse, Error> {
  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: getCurrentUser,
    ...apiHooksQueryDefaults,
    enabled: options?.enabled ?? true,
  });
}
