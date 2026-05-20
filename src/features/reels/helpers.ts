import type { PollOptionResponse, PollResponse } from "@/src/api/types/poll.types";
import type { ReelCommentEntity, ReelEntity } from "@/src/api/types/reel.types";
import type { UserAccountDto } from "@/src/api/types/user.types";
import { resolveMediaUrl } from "@/src/lib/utils/resolve-media-url";

export function reelKey(item: ReelEntity, index: number) {
  const id = item.id;
  if (typeof id === "number" || typeof id === "string") {
    return String(id);
  }
  return `reel-${index}`;
}

export function commentAuthor(user: ReelCommentEntity["user"]): string {
  if (!user || typeof user !== "object") return "مستخدم";
  const account = user as UserAccountDto;
  return (account.gamer_name || account.full_name || "").trim() || "مستخدم";
}

export function commentAvatarUri(user: ReelCommentEntity["user"]): string | null {
  if (!user || typeof user !== "object") return null;
  const account = user as UserAccountDto;
  const raw = account.avatarUrl;
  if (!raw) return null;
  return resolveMediaUrl(raw, "image");
}

export function reelAuthorLabel(user: ReelEntity["user"]): string {
  if (!user || typeof user !== "object") return "AM ARENA";
  const account = user as UserAccountDto;
  return (account.gamer_name || account.full_name || "").trim() || "AM ARENA";
}

export function formatPollCountdown(expiresAt: string | null): string {
  if (!expiresAt) return "ينتهي قريباً";
  const end = new Date(expiresAt).getTime();
  if (Number.isNaN(end)) return "ينتهي قريباً";
  const diff = end - Date.now();
  if (diff <= 0) return "انتهى التصويت";
  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours > 0) return `ينتهي خلال ${hours}س ${mins}د`;
  return `ينتهي خلال ${mins}د`;
}

export function hasUserVoted(poll: PollResponse): boolean {
  if (poll.current_user_vote_option_id != null) return true;
  return Array.isArray(poll.options)
    ? poll.options.some((option) => option.selected === true)
    : false;
}

export function isOptionSelected(poll: PollResponse, option: PollOptionResponse): boolean {
  return option.selected === true || option.id === poll.current_user_vote_option_id;
}

export function pollOptionTitle(option: PollOptionResponse): string {
  return option.label || option.user?.gamer_name || `خيار #${option.id}`;
}