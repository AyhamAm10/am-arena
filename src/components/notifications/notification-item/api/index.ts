import { acceptFriendRequest, removePendingFriendRequest } from "@/src/api/services/friend.api";
import { markNotificationRead } from "@/src/api/services/notification.api";

export async function apiAcceptFriend(fromUserId: number) {
  await acceptFriendRequest({ user_id: fromUserId });
}

export async function apiRejectFriend(fromUserId: number) {
  await removePendingFriendRequest({ friend_user_id: fromUserId });
}

export async function apiMarkRead(notificationId: number) {
  await markNotificationRead(notificationId);
}
