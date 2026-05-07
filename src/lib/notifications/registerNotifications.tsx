import { registerExpoPushToken } from "@/src/api/services/notification.api";
import { useAuthStore } from "@/src/stores/authStore";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { navigateFromNotificationPayload } from "./notification-navigation";
import { io, type Socket } from "socket.io-client";
import { apiUrl } from "@/src/api/axios/api-url";
import { useQueryClient } from "@tanstack/react-query";
import type { UserNotificationDto } from "@/src/api/types/notification.types";
import type { NotificationsQueryResult } from "@/src/hooks/api/notification/useFetchNotifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function navigateFromPushData(
  router: ReturnType<typeof useRouter>,
  data: Record<string, unknown> | undefined
) {
  if (!data || typeof data !== "object") return;
  navigateFromNotificationPayload(router, String(data.type ?? ""), data);
}

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.MAX,
    // ensure visible in system tray with sound
    sound: "default",
  });
}

async function syncPushTokenToBackend() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return;
  }

  await ensureAndroidChannel();

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as unknown as { easConfig?: { projectId?: string } }).easConfig?.projectId;

  const tokenData = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined
  );
  const token = tokenData.data;
  if (token) {
    await registerExpoPushToken(token);
  }
}

/**
 * Registers Expo push permissions/token when authenticated and wires notification tap → navigation.
 */
export function RegisterNotifications() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const queryClient = useQueryClient();
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    if (Platform.OS !== "web") {
      void syncPushTokenToBackend().catch(() => undefined);
    }

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown> | undefined;
      navigateFromPushData(router, data);
    });

    const socket = io(apiUrl, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("notification:new", (incoming: UserNotificationDto) => {
      queryClient.setQueriesData<NotificationsQueryResult>(
        { queryKey: ["notification", "list"] },
        (prev) => {
          if (!prev) {
            return {
              data: [incoming],
              meta: undefined,
            };
          }
          const filtered = prev.data.filter((n) => n.id !== incoming.id);
          return {
            ...prev,
            data: [incoming, ...filtered],
          };
        },
      );
      void queryClient.invalidateQueries({ queryKey: ["notification", "list"] });
    });

    return () => {
      responseListener.current?.remove();
      responseListener.current = null;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, queryClient, router]);

  return null;
}
