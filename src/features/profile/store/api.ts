import type { CurrentUserResponse } from "@/src/api/types/auth.types";
import type { UserProfileResponse } from "@/src/api/types/user.types";

export type ProfileVariant = "me" | "other";

type ApiState = {
  variant: ProfileVariant;
  targetUserId: string | null;
  currentUser: CurrentUserResponse | null;
  otherProfile: UserProfileResponse | null;
  isLoadingProfile: boolean;
  isProfileError: boolean;
  sendFriendRequest: (friendUserId: number) => Promise<unknown>;
  isSendingFriendRequest: boolean;
  handleAddFriend: () => void;
  /** POST /auth/logout — wired in profile Api layer. */
  logout: () => Promise<void>;
  isLoggingOut: boolean;
};

const store = (): ApiState => ({
  variant: "me",
  targetUserId: null,
  currentUser: null,
  otherProfile: null,
  isLoadingProfile: false,
  isProfileError: false,
  sendFriendRequest: async () => {},
  isSendingFriendRequest: false,
  handleAddFriend: () => {},
  logout: async () => {},
  isLoggingOut: false,
});

export { store as ApiState };
export type { ApiState as ProfileApiState };
