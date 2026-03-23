import { InternalAxiosRequestConfig } from "axios";

export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {

  // نتأكد أن headers موجودة
  config.headers = config.headers ?? {};

  const token = localStorage.getItem("accessToken");

  if (token) {
    // type assertion لتجنب مشاكل TS
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  (config.headers as Record<string, string>)["Accept-Language"] = "en";

  return config;
};