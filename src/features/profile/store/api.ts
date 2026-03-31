import type { UserProfileResponse } from "@/src/api/types/user.types";
import type { FriendAction } from "../components/AddFriendButton";

export type ProfileVariant = "me" | "other";

type ApiState = {
  variant: ProfileVariant;
  /** Effective tab: visiting `/profile/:id` with your own id uses `"me"`. */
  displayVariant: ProfileVariant;
  targetUserId: string | null;
  profile: UserProfileResponse | null;
  isLoadingProfile: boolean;
  isProfileError: boolean;
  sendFriendRequest: (friendUserId: number) => Promise<unknown>;
  isSendingFriendRequest: boolean;
  handleAddFriend: () => void;
  friendAction: FriendAction;
  handleFriendAction: () => void;
  isFriendActionBusy: boolean;
  /** POST /auth/logout — wired in profile Api layer. */
  logout: () => Promise<void>;
  isLoggingOut: boolean;
};

const store = (): ApiState => ({
  variant: "me",
  displayVariant: "me",
  targetUserId: null,
  profile: null,
  isLoadingProfile: false,
  isProfileError: false,
  sendFriendRequest: async () => {},
  isSendingFriendRequest: false,
  handleAddFriend: () => {},
  friendAction: "add",
  handleFriendAction: () => {},
  isFriendActionBusy: false,
  logout: async () => {},
  isLoggingOut: false,
});

export { store as ApiState };
export type { ApiState as ProfileApiState };
