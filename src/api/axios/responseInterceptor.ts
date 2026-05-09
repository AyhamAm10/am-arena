import axios, {
  AxiosError,
  AxiosResponse,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { handleApiError } from "./errorHandler";
import { refreshSession, clearAuthSession } from "./authSession";
import { useAuthStore } from "@/src/stores/authStore";
import { Platform, Linking } from "react-native";
import * as Application from "expo-application";
import useUpdateStore, { setAppUpdate } from "@/src/stores/updateStore";

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
  onSuccess: (response: AxiosResponse) => {
    // run update detection as a best-effort side-effect and return response
    try {
      responseInterceptor._onSuccessWithUpdate(response);
    } catch {
      /* ignore */
    }
    return response;
  },

  // Inspect successful responses for update metadata and set the global update store.
  // Backend may include update info in headers (e.g. `x-app-update`) as JSON string
  // or in the response body under `update` / `app_update` keys.
  _onSuccessWithUpdate: (response: AxiosResponse) => {
    try {
      const headers = response.headers as Record<string, any> | undefined;
      let payload: any = undefined;
      if (headers && headers["x-app-update"]) {
        try {
          payload = JSON.parse(headers["x-app-update"]);
        } catch {
          payload = headers["x-app-update"];
        }
      }

      if (!payload && response.data) {
        payload = response.data.update || response.data.app_update || response.data.appUpdate;
      }

      if (!payload) return response;

      // normalize fields
      const latest = payload.latest_build ?? payload.latest ?? null;
      const minSupported = payload.min_supported_build ?? payload.min_supported ?? null;
      const url = payload.update_url ?? payload.url ?? payload.updateUrl ?? null;
      const mandatory = typeof payload.mandatory === "boolean" ? payload.mandatory : !!payload.force;

      if (latest == null || minSupported == null || !url) return response;

      const normalized = {
        latest_build: Number(latest) || latest,
        min_supported_build: Number(minSupported) || minSupported,
        update_url: String(url),
        mandatory: Boolean(mandatory),
      };

      // If update is optional and user dismissed it this session, suppress showing again.
      try {
        const state = useUpdateStore.getState ? useUpdateStore.getState() : null;
        if (state && !normalized.mandatory && state.hasDismissedOptionalUpdate) {
          return response;
        }
      } catch {
        // ignore and proceed to set update
      }

      setAppUpdate(normalized);
    } catch (e) {
      // best-effort only
    }
    return response;
  },

  onError: async (error: AxiosError) => {
    // If the server returned a response with update metadata (e.g., 426 forced upgrade)
    // make sure we parse it and set the global update store before any rejection
    try {
      if (error.response) {
        // Best-effort: inspect error response for update metadata so modal can show
        try {
          responseInterceptor._onSuccessWithUpdate(error.response as AxiosResponse);
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }

    const status = error.response?.status;
    const config = error.config as InternalAxiosRequestConfig | undefined;
    const data = error.response?.data as
      | { error?: string; message?: string }
      | undefined;
    const responseMessage =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : undefined;

    // Prefer the backend-provided message where available so callers
    // that read `error.message` will display the server message.
    if (responseMessage) {
      try {
        (error as any).serverMessage = responseMessage;
        error.message = responseMessage;
      } catch {
        // ignore; best-effort only
      }
    }

    if (status !== 401 || !config) {
      handleApiError(status, responseMessage);
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
