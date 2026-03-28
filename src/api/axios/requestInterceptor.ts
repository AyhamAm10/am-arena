import { InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { useAuthStore } from "@/src/stores/authStore";

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
