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

  return config;
};
