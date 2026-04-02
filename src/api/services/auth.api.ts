import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { ApiResponse } from "../types/api-response";
import type {
  AuthLoginBody,
  AuthTokensResponse,
  CurrentUserResponse,
} from "../types/auth.types";

export async function register(
  body: FormData
): Promise<AuthTokensResponse> {
  const res = await axiosInstance.post<ApiResponse<AuthTokensResponse>>(
    "/auth/register",
    body
  );
  return parseApiResponse(res);
}

export async function login(body: AuthLoginBody): Promise<AuthTokensResponse> {
  const res = await axiosInstance.post<ApiResponse<AuthTokensResponse>>(
    "/auth/login",
    body
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
