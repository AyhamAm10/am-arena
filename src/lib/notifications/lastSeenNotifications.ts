import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const STORAGE_KEY = "amarena_last_seen_notifications_at";

export async function getLastSeenNotificationsAt(): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  try {
    return await SecureStore.getItemAsync(STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function setLastSeenNotificationsAt(value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    return;
  }

  try {
    await SecureStore.setItemAsync(STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

export async function setLastSeenNotificationsToNow(): Promise<void> {
  await setLastSeenNotificationsAt(new Date().toISOString());
}
