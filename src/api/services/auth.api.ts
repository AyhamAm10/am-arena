import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { ApiResponse } from "../types/api-response";
import type {
  AuthLoginBody,
  AuthTokensResponse,
} from "../types/auth.types";

export async function register(
  body: FormData
): Promise<AuthTokensResponse> {
  const res = await axiosInstance.post<ApiResponse<AuthTokensResponse>>(
    "/auth/register",
    body,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
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
  const res = await axiosInstance.post<ApiResponse<Record<string, unknown>>>(
    "/auth/logout"
  );
  parseApiResponse(res);
}

export async function getCurrentUser(): Promise<Record<string, unknown>> {
  const res = await axiosInstance.get<ApiResponse<Record<string, unknown>>>(
    "/auth/current-user"
  );
  return parseApiResponse(res);
}
