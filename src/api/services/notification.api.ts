import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import type { ApiResponse } from "../types/api-response";
import type { UserNotificationDto } from "../types/notification.types";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";
import type { ApiPaginationMeta } from "../types/pubg-tournament.types";

export async function getMyNotifications(params: {
  page?: number;
  limit?: number;
}): Promise<{ data: UserNotificationDto[]; meta?: ApiPaginationMeta }> {
  const res = await axiosInstance.get<ApiResponse<UserNotificationDto[]>>("/notification", {
    params,
  });
  return parseApiResponseWithMeta(res);
}

export async function markNotificationRead(notificationId: number): Promise<void> {
  const res = await axiosInstance.patch<ApiResponse<{ id: number; read_at: string }>>(
    `/notification/${notificationId}/read`
  );
  parseApiResponse(res);
}

export async function registerExpoPushToken(expoPushToken: string): Promise<void> {
  const res = await axiosInstance.post<ApiResponse<{ ok: boolean }>>("/notification/push-token", {
    expo_push_token: expoPushToken,
  });
  parseApiResponse(res);
}
