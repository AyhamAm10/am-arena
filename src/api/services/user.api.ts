import { useAuthStore } from "@/src/stores/authStore";
import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { apiUrl } from "../axios/api-url";
import { ApiResponse } from "../types/api-response";
import type {
  GetBestUsersQuery,
  UserProfileResponse,
  UserPublicSummary,
} from "../types/user.types";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";
import type { ApiPaginationMeta } from "../types/pubg-tournament.types";
import axios from "axios";

export async function getUserProfile(
  userId: string
): Promise<UserProfileResponse> {
  const res = await axiosInstance.get<ApiResponse<UserProfileResponse>>(
    `/user/${userId}/profile`
  );
  return parseApiResponse(res);
}

export async function getBestUsers(query: GetBestUsersQuery): Promise<{
  data: UserPublicSummary[];
  meta?: ApiPaginationMeta;
}> {
  const res = await axiosInstance.get<ApiResponse<UserPublicSummary[]>>(
    "/user/best",
    { params: query }
  );
  return parseApiResponseWithMeta(res);
}

/**
 * Update profile with multipart FormData (field `profile_picture` = RN file `{ uri, name, type }`).
 * Uses `fetch` instead of axios: axios serializes RN file objects as the string "[object Object]",
 * so multer never receives a real file.
 */
export async function updateProfile(
  body: FormData
): Promise<UserProfileResponse> {
  const token = useAuthStore.getState().accessToken;
  const base = apiUrl.replace(/\/$/, "");

  const res = await axios.post<ApiResponse<UserProfileResponse>>(
    `${base}/user/profile`,
    body,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept-Language": "en",
      },
      withCredentials: true,
    }
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Request failed");
  }

  return res.data.data;
}
