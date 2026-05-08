import { Href } from "expo-router";

type DeepLinkType = "reel" | "tournament" | "vote" | "profile" | "channel";

/**
 * Generate a platform deep link for the app scheme.
 * Example: amarena://reel/123
 */
export function generateDeepLink(type: DeepLinkType, id: string | number) {
  return `amarena://${type}/${id}`;
}

/**
 * Resolve an incoming URL to an internal Expo Router Href (or string path).
 * Returns null for unsupported/unsafe urls.
 */
export function resolveDeepLink(url: string | null): Href | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // Only accept our custom scheme or http(s) with host fallback
    const pathname = parsed.pathname || ""; // e.g. /reel/123
    const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
    if (parts.length === 0) return null;
    const [first, second] = parts;

    switch (first) {
      case "reel": {
        if (!second) return null;
        return {
          pathname: "/(tabs)/arena-space",
          params: { tab: "reels", reelId: String(second) },
        } as Href;
      }
      case "tournament": {
        if (!second) return null;
        return `/tournament/${second}/details` as Href;
      }
      case "vote": {
        if (!second) return null;
        return {
          pathname: "/(tabs)/arena-space",
          params: { tab: "voting", pollId: String(second) },
        } as Href;
      }
      case "profile": {
        if (!second) return null;
        return `/(tabs)/profile/${second}` as Href;
      }
      case "channel": {
        if (!second) return null;
        return `/channel/${second}` as Href;
      }
      default:
        return null;
    }
  } catch (e) {
    return null;
  }
}
