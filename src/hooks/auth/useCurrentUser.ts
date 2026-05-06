import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useSyncExternalStore } from "react";
import type { CurrentUserResponse } from "@/src/api/types/auth.types";
import { resolveMediaUrl } from "@/src/lib/utils/resolve-media-url";

const CURRENT_USER_QUERY_KEY = ["auth", "current-user"] as const;

export type CurrentUserProfile = {
  user: CurrentUserResponse | null;
  fullName: string;
  gamerName: string;
  profileImageUrl: string | null;
};

function readCurrentUser(queryClient: QueryClient): CurrentUserResponse | null {
  return queryClient.getQueryData<CurrentUserResponse>(CURRENT_USER_QUERY_KEY) ?? null;
}

/**
 * Cache-only current authenticated user profile.
 * Reads the already-fetched `GET /auth/current-user` result from React Query cache.
 */
export function useCurrentUser(): CurrentUserProfile {
  const queryClient = useQueryClient();

  const user = useSyncExternalStore(
    (onStoreChange) =>
      queryClient.getQueryCache().subscribe(() => {
        onStoreChange();
      }),
    () => readCurrentUser(queryClient),
    () => readCurrentUser(queryClient)
  );

  return useMemo(() => {
    const fullName = user?.full_name?.trim() ?? "";
    const gamerName = user?.gamer_name?.trim() ?? "";
    const profileImageUrl = user?.avatarUrl
      ? resolveMediaUrl(user.avatarUrl, "image")
      : null;

    return {
      user,
      fullName,
      gamerName,
      profileImageUrl,
    };
  }, [user]);
}