import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { ApiResponse } from "../types/api-response";
import { Platform } from "react-native";
import type {
  AuthLoginBody,
  AuthRegisterBody,
  AuthTokensResponse,
  CurrentUserResponse,
} from "../types/auth.types";

export async function register(
  body: AuthRegisterBody
): Promise<AuthTokensResponse> {
  const res = await axiosInstance.post<ApiResponse<AuthTokensResponse>>(
    "/auth/register",
    body,
    Platform.OS === "web"
      ? undefined
      : {
          headers: {
            "X-Refresh-Token-Delivery": "body",
          },
        }
  );
  return parseApiResponse(res);
}

export async function login(body: AuthLoginBody): Promise<AuthTokensResponse> {
  const res = await axiosInstance.post<ApiResponse<AuthTokensResponse>>(
    "/auth/login",
    body,
    Platform.OS === "web"
      ? undefined
      : {
          headers: {
            "X-Refresh-Token-Delivery": "body",
          },
        }
  );
  return parseApiResponse(res);
}

export async function logout(): Promise<void> {
  const res = await axiosInstance.post<ApiResponse<Record<string, never>>>(
    "/auth/logout"
  );
  parseApiResponse(res);
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const res = await axiosInstance.get<ApiResponse<CurrentUserResponse>>(
    "/auth/current-user"
  );
  return parseApiResponse(res);
}
