import type { FriendEntityResponse } from "@/src/api/types/friend.types";
import type { UserAccountDto } from "@/src/api/types/user.types";
import type { UserPublicSummary } from "@/src/api/types/user.types";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";

function accountToPublic(u: UserAccountDto): UserPublicSummary {
  return {
    id: u.id,
    full_name: u.full_name,
    gamer_name: u.gamer_name,
    avatarUrl: u.avatarUrl,
    avatarPublicId: u.avatarPublicId ?? null,
    xp_points: u.xp_points,
    coins: u.coins,
    role: u.role,
    is_active: u.is_active,
    created_at: u.created_at,
    updated_at: u.updated_at,
  };
}

/** The other party in a friend row relative to the current user. */
export function otherUserFromFriendRow(
  row: FriendEntityResponse,
  currentUserId: number
): UserPublicSummary | null {
  if (row.user_id === currentUserId) {
    const f = row.friend;
    return f ? accountToPublic(f as UserAccountDto) : null;
  }
  const u = row.user;
  return u ? accountToPublic(u as UserAccountDto) : null;
}

/** Requester user id for an incoming pending row (they sent the request). */
export function requesterIdFromIncomingRow(
  row: FriendEntityResponse,
  currentUserId: number
): number | null {
  if (row.friend_user_id !== currentUserId) {
    return null;
  }
  return row.user_id;
}

function Utils({ children }: PropsWithChildren) {
  const activeTab = useMirror("activeTab");

  const sectionTitle = useMemo(() => {
    if (activeTab === "friends") return "الفريق النشط";
    if (activeTab === "public") return "اكتشف";
    return "الطلبات";
  }, [activeTab]);

  useMirrorRegistry("sectionTitle", sectionTitle, sectionTitle);

  return children;
}

export { Utils };
