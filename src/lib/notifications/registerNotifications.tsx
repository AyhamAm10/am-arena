import { registerExpoPushToken } from "@/src/api/services/notification.api";
import { useAuthStore } from "@/src/stores/authStore";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { navigateFromNotificationPayload } from "./notification-navigation";

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
    importance: Notifications.AndroidImportance.DEFAULT,
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
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (Platform.OS === "web" || !accessToken) {
      return;
    }

    void syncPushTokenToBackend().catch(() => undefined);

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown> | undefined;
      navigateFromPushData(router, data);
    });

    return () => {
      responseListener.current?.remove();
      responseListener.current = null;
    };
  }, [accessToken, router]);

  return null;
}
