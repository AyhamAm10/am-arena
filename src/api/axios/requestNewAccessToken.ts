import "./setupAxiosWeb";
import axios from "axios";
import { apiUrl } from "./api-url";
import type { ApiResponse } from "../types/api-response";

/**
 * Calls POST /auth/refresh without the main axios instance (avoids interceptor recursion).
 */
export async function requestNewAccessToken(
  refreshTokenFromStorage?: string | null
): Promise<string> {
  const body =
    refreshTokenFromStorage && refreshTokenFromStorage.length > 0
      ? { refreshToken: refreshTokenFromStorage }
      : {};

  const res = await axios.post<ApiResponse<{ accessToken: string }>>(
    `${apiUrl}/auth/refresh`,
    body,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": "en",
      },
    }
  );

  const apiResponse = res.data;
  if (!apiResponse.success) {
    throw new Error(apiResponse.message);
  }
  return (apiResponse.data as { accessToken: string }).accessToken;
}
