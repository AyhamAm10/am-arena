import { PropsWithChildren, useEffect } from "react";
import { Platform } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/src/stores/authStore";
import { getRefreshToken } from "@/src/lib/auth/refreshTokenStorage";
import {
  refreshSession,
  clearAuthSession,
} from "@/src/api/axios/authSession";

export function AuthBootstrap({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void (async () => {
      if (useAuthStore.getState().accessToken) {
        return;
      }
      try {
        if (Platform.OS === "web") {
          await refreshSession();
        } else {
          const rt = await getRefreshToken();
          if (!rt) {
            return;
          }
          await refreshSession();
        }
        await queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
      } catch {
        await clearAuthSession();
      }
    })();
  }, [queryClient]);

  return children;
}
