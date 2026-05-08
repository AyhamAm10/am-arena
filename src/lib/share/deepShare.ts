import { Share } from "react-native";
import { generateDeepLink } from "@/src/lib/deeplink";

export async function shareDeepLink(type: Parameters<typeof generateDeepLink>[0], id: string | number, message?: string) {
  const url = generateDeepLink(type, id);
  const content = message ? `${message}\n\n${url}` : url;
  try {
    await Share.share({ message: content, url });
    return true;
  } catch (e) {
    return false;
  }
}
