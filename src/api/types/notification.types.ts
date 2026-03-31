export type NotificationItemType =
  | "FRIEND_REQUEST"
  | "CHAT_MESSAGE"
  | "TOURNAMENT_CREATED"
  | "ACHIEVEMENT_UNLOCKED"
  | "SYSTEM_MESSAGE"
  | "MANUAL";

export type UserNotificationDto = {
  id: number;
  type: NotificationItemType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
};
