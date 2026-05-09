import { InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { useAuthStore } from "@/src/stores/authStore";
import { Platform } from "react-native";
import * as Application from "expo-application";
import { APP_BUILD } from "@/src/constants/appBuild";

function getAppBuildHeader(): string {
  // Use centralized static build constant. Keep fallback to native values
  // for completeness but prefer the constant for deterministic behavior.
  try {
    if (typeof APP_BUILD !== "undefined" && APP_BUILD !== null) return String(APP_BUILD);
  } catch {
    // ignore and fallback
  }

  try {
    if (Platform.OS !== "web") {
      const build = (Application.nativeBuildVersion || Application.nativeApplicationVersion) as
        | string
        | undefined;
      if (build) return String(build);
    }
  } catch (e) {
    // ignore
  }

  return "0";
}

export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  const token = useAuthStore.getState().accessToken;
  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  if (config.headers instanceof AxiosHeaders) {
    config.headers.set("Accept-Language", "en");
  } else {
    (config.headers as Record<string, string>)["Accept-Language"] = "en";
  }

  // App build header for centralized update checks
  try {
    const buildHeader = getAppBuildHeader();
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("x-app-build", buildHeader);
    } else {
      (config.headers as Record<string, string>)["x-app-build"] = buildHeader;
    }
  } catch {
    /* best-effort */
  }

  // Multipart: default instance `Content-Type: application/json` breaks RN file uploads.
  // Let the native stack set `multipart/form-data` + boundary (same idea as auth register).
  if (
    typeof FormData !== "undefined" &&
    config.data instanceof FormData
  ) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.delete("Content-Type");
      config.headers.delete("content-type");
    } else if (config.headers && typeof config.headers === "object") {
      const raw = config.headers as Record<string, unknown>;
      delete raw["Content-Type"];
      delete raw["content-type"];
    }
  }

  return config;
};
