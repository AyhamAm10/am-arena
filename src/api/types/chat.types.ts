/** GET /chat/channels — paginated chats (`channel` and `direct`). */

export interface ChannelPublic {
  id: number;
  chat_type: "direct" | "channel";
  title: string;
  allow_user_messages: boolean;
  tournament_id: number | null;
  member_count: number;
  created_at: string;
}

export interface GetChannelsQuery {
  page?: number;
  limit?: number;
}
