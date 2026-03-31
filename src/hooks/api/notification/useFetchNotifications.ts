import { getMyNotifications } from "@/src/api/services/notification.api";
import type { UserNotificationDto } from "@/src/api/types/notification.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export type NotificationsQuery = { page: number; limit: number };

export type NotificationsQueryResult = {
  data: UserNotificationDto[];
  meta?: ApiPaginationMeta;
};

export function useFetchNotifications(
  query: NotificationsQuery,
  options?: { enabled?: boolean }
): UseQueryResult<NotificationsQueryResult, Error> {
  return useQuery({
    queryKey: ["notification", "list", query],
    queryFn: () => getMyNotifications(query),
    ...apiHooksQueryDefaults,
    enabled: options?.enabled ?? true,
  });
}
