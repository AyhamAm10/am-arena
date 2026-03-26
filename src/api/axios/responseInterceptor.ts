import axios, {
  AxiosError,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { handleApiError } from "./errorHandler";
import { refreshSession, clearAuthSession } from "./authSession";
import { useAuthStore } from "@/src/stores/authStore";

const RETRY_HEADER = "x-retry-after-refresh";

function isAuthRoute(url?: string) {
  if (!url) return false;
  const u = url.toLowerCase();
  return (
    u.includes("/auth/login") ||
    u.includes("/auth/register") ||
    u.includes("/auth/refresh")
  );
}

function applyAuthHeaders(
  config: InternalAxiosRequestConfig,
  accessToken: string
) {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }
  if (config.headers instanceof AxiosHeaders) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
    config.headers.set(RETRY_HEADER, "1");
  } else {
    const h = config.headers as Record<string, string>;
    h.Authorization = `Bearer ${accessToken}`;
    h[RETRY_HEADER] = "1";
  }
}

export const responseInterceptor = {
  onSuccess: (response: AxiosResponse) => response,

  onError: async (error: AxiosError) => {
    const status = error.response?.status;
    const config = error.config as InternalAxiosRequestConfig | undefined;

    if (status !== 401 || !config) {
      handleApiError(status);
      return Promise.reject(error);
    }

    const headers = config.headers;
    const alreadyRetried =
      headers instanceof AxiosHeaders
        ? headers.get(RETRY_HEADER) === "1"
        : !!(headers as Record<string, string> | undefined)?.[RETRY_HEADER];

    if (alreadyRetried) {
      await clearAuthSession();
      handleApiError(401);
      return Promise.reject(error);
    }

    if (isAuthRoute(config.url)) {
      handleApiError(401);
      return Promise.reject(error);
    }

    try {
      await refreshSession();
      const token = useAuthStore.getState().accessToken;
      if (!token) {
        await clearAuthSession();
        handleApiError(401);
        return Promise.reject(error);
      }
      applyAuthHeaders(config, token);
      return axios.request(config);
    } catch {
      await clearAuthSession();
      handleApiError(401);
      return Promise.reject(error);
    }
  },
};
