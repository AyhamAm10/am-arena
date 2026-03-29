import type { CurrentUserResponse } from "@/src/api/types/auth.types";
import type {
  TournamentHistoryItem,
  UserProfileResponse,
} from "@/src/api/types/user.types";
import type { FriendAction } from "../components/AddFriendButton";

export type ProfileVariant = "me" | "other";

type ApiState = {
  variant: ProfileVariant;
  /** Effective tab: visiting `/profile/:id` with your own id uses `"me"`. */
  displayVariant: ProfileVariant;
  targetUserId: string | null;
  currentUser: CurrentUserResponse | null;
  otherProfile: UserProfileResponse | null;
  isLoadingProfile: boolean;
  isProfileError: boolean;
  sendFriendRequest: (friendUserId: number) => Promise<unknown>;
  isSendingFriendRequest: boolean;
  handleAddFriend: () => void;
  friendAction: FriendAction;
  handleFriendAction: () => void;
  isFriendActionBusy: boolean;
  tournamentHistory: TournamentHistoryItem[];
  /** POST /auth/logout — wired in profile Api layer. */
  logout: () => Promise<void>;
  isLoggingOut: boolean;
};

const store = (): ApiState => ({
  variant: "me",
  displayVariant: "me",
  targetUserId: null,
  currentUser: null,
  otherProfile: null,
  isLoadingProfile: false,
  isProfileError: false,
  sendFriendRequest: async () => {},
  isSendingFriendRequest: false,
  handleAddFriend: () => {},
  friendAction: "add",
  handleFriendAction: () => {},
  isFriendActionBusy: false,
  tournamentHistory: [],
  logout: async () => {},
  isLoggingOut: false,
});

export { store as ApiState };
export type { ApiState as ProfileApiState };
