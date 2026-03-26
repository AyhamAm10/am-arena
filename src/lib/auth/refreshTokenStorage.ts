import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const REFRESH_KEY = "amarena_refresh_token";

export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return null;
  }
  try {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  } catch {
    return null;
  }
}

export async function setRefreshToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }
  await SecureStore.setItemAsync(REFRESH_KEY, token);
}

export async function clearRefreshToken(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }
  try {
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  } catch {
    /* ignore */
  }
}
