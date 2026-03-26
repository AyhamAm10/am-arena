import { useAuthStore } from "@/src/stores/authStore";
import {
  clearRefreshToken,
  getRefreshToken,
  setRefreshToken,
} from "@/src/lib/auth/refreshTokenStorage";
import { requestNewAccessToken } from "./requestNewAccessToken";
import { Platform } from "react-native";

let refreshInFlight: Promise<void> | null = null;

export async function refreshSession(): Promise<void> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const rt = await getRefreshToken();
      if (Platform.OS !== "web" && (!rt || rt.length === 0)) {
        throw new Error("No refresh token");
      }
      const access = await requestNewAccessToken(rt ?? undefined);
      useAuthStore.getState().setAccessToken(access);
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  await refreshInFlight;
}

export async function persistAuthSession(tokens: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  useAuthStore.getState().setAccessToken(tokens.accessToken);
  await setRefreshToken(tokens.refreshToken);
}

export async function clearAuthSession(): Promise<void> {
  useAuthStore.getState().clearSession();
  await clearRefreshToken();
}
