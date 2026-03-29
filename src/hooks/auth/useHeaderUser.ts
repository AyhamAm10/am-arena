import type { CurrentUserResponse } from "@/src/api/types/auth.types";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { computeLevelAndProgress } from "@/src/lib/utils/level-from-xp";
import { useAuthStore } from "@/src/stores/authStore";
import { useMemo } from "react";
import { useFetchCurrentUser } from "../api/auth/useFetchCurrentUser";

export type HeaderUserState = {
  isLoggedIn: boolean;
  user: CurrentUserResponse | undefined;
  isUserLoading: boolean;
  level: number;
  levelProgress: number;
  coins: number;
  avatarUri: string | null;
};

/**
 * Auth gate + current user for the global TopBar (coins, XP level, avatar).
 */
export function useHeaderUser(): HeaderUserState {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isLoggedIn = Boolean(accessToken);

  const query = useFetchCurrentUser({ enabled: isLoggedIn });
  const user = isLoggedIn ? query.data : undefined;

  return useMemo((): HeaderUserState => {
    if (!isLoggedIn) {
      return {
        isLoggedIn: false,
        user: undefined,
        isUserLoading: false,
        level: 1,
        levelProgress: 0,
        coins: 0,
        avatarUri: null,
      };
    }

    const xp = Number(user?.xp_points ?? 0);
    const { level, progress } = computeLevelAndProgress(xp);
    const coinsRaw = user?.coins;
    const coins =
      typeof coinsRaw === "string" ? Number(coinsRaw) || 0 : Number(coinsRaw ?? 0);
    const avatarUri = user?.profile_picture_url
      ? formatImageUrl(user.profile_picture_url)
      : null;

    return {
      isLoggedIn,
      user,
      isUserLoading: isLoggedIn && query.isLoading,
      level,
      levelProgress: progress,
      coins,
      avatarUri,
    };
  }, [isLoggedIn, user, query.isLoading]);
}
