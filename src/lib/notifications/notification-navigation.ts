import type { Href } from "expo-router";

type NotificationData = Record<string, unknown> | null | undefined;

function num(data: NotificationData, key: string): number | undefined {
  if (!data) return undefined;
  const value = data[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function str(data: NotificationData, key: string): string {
  if (!data) return "";
  const value = data[key];
  return typeof value === "string" ? value.trim() : "";
}

function isSafeInternalRoute(route: string): boolean {
  return route.startsWith("/") && !route.includes("..") && !route.startsWith("//");
}

export function resolveNotificationHref(
  type: string | undefined,
  data: NotificationData,
): Href | null {
  const notificationType = (type || str(data, "type")).toUpperCase();

  if (notificationType === "FRIEND_REQUEST") {
    const status = (str(data, "status") || "pending").toLowerCase();
    const profileId = num(data, "fromUserId") ?? num(data, "focusUserId");
    if (status === "pending") {
      return {
        pathname: "/(tabs)/friends",
        params: {
          tab: "requests",
          ...(profileId != null ? { focusUserId: String(profileId) } : {}),
        },
      };
    }
    if (profileId != null) {
      return `/profile/${profileId}` as Href;
    }
    return { pathname: "/(tabs)/friends", params: { tab: "requests" } };
  }

  if (notificationType === "CHAT_MESSAGE") {
    const chatId = num(data, "chatId");
    if (chatId == null) return null;
    return {
      pathname: "/channel/[id]",
      params: { id: String(chatId), title: str(data, "chatTitle") || str(data, "title") },
    };
  }

  if (notificationType === "TOURNAMENT_CREATED") {
    const tournamentId = num(data, "tournamentId");
    if (tournamentId == null) return null;
    return `/tournament/${tournamentId}/details` as Href;
  }

  if (notificationType === "ACHIEVEMENT_UNLOCKED") {
    const achievementId = num(data, "achievementId") ?? num(data, "focusAchievementId");
    return {
      pathname: "/(tabs)/achievements",
      params: achievementId != null ? { achievementId: String(achievementId) } : {},
    };
  }

  if (notificationType === "REEL_HIGHLIGHT") {
    const reelId = num(data, "reelId");
    if (reelId == null) return null;
    const commentId = num(data, "commentId");
    return {
      pathname: "/(tabs)/arena-space",
      params: {
        tab: "reels",
        reelId: String(reelId),
        ...(commentId != null ? { commentId: String(commentId) } : {}),
      },
    };
  }

  if (notificationType === "GLOBAL_POLL") {
    const pollId = num(data, "pollId") ?? num(data, "focusPollId");
    return {
      pathname: "/(tabs)/arena-space",
      params: pollId != null ? { tab: "voting", pollId: String(pollId) } : { tab: "voting" },
    };
  }

  if (notificationType === "MANUAL" || notificationType === "SYSTEM_MESSAGE") {
    const route = str(data, "route");
    if (route && isSafeInternalRoute(route)) return route as Href;
    return null;
  }

  const route = str(data, "route") || str(data, "deepLink");
  if (route && isSafeInternalRoute(route)) return route as Href;
  return null;
}

export function navigateFromNotificationPayload(
  router: { push: (href: Href) => void },
  type: string | undefined,
  data: NotificationData,
) {
  const href = resolveNotificationHref(type, data);
  if (!href) return false;
  router.push(href);
  return true;
}
