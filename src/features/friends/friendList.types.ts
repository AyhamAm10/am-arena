import type { FriendEntityResponse } from "@/src/api/types/friend.types";
import type { UserPublicSummary } from "@/src/api/types/user.types";

export type FriendListItem = {
  row: FriendEntityResponse;
  user: UserPublicSummary;
};
