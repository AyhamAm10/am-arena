import type { UserPublicSummary } from "@/src/api/types/user.types";
import type { FriendListItem } from "../friendList.types";

export type FriendsScreenTab = "friends" | "public" | "requests";

type ApiState = {
  currentUserId: number | null;
  activeTab: FriendsScreenTab;
  setActiveTab: (t: FriendsScreenTab) => void;
  searchQuery: string;
  debouncedSearch: string;
  setSearchQuery: (q: string) => void;
  sortAscending: boolean;
  toggleSort: () => void;
  friendsListItems: FriendListItem[];
  publicListItems: UserPublicSummary[];
  /** User ids you have an outgoing pending request to (DISCOVER / suggested buttons). */
  pendingOutgoingUserIds: number[];
  suggestedUsers: UserPublicSummary[];
  isLoadingSuggested: boolean;
  requestsListItems: FriendListItem[];
  totalFriends: number;
  totalPublic: number;
  totalRequests: number;
  isLoadingFriends: boolean;
  isLoadingPublic: boolean;
  isLoadingRequests: boolean;
  isFetchingMoreFriends: boolean;
  isFetchingMorePublic: boolean;
  isFetchingMoreRequests: boolean;
  hasNextFriends: boolean;
  hasNextPublic: boolean;
  hasNextRequests: boolean;
  fetchMoreFriends: () => Promise<unknown>;
  fetchMorePublic: () => Promise<unknown>;
  fetchMoreRequests: () => Promise<unknown>;
  listError: string | null;
  onCancelRequest: (friendUserId: number) => Promise<void>;
  /** Withdraw an outgoing pending request (DISCOVER). */
  onCancelOutgoingPending: (friendUserId: number) => Promise<void>;
  onAddRequest: (friendUserId: number) => Promise<void>;
  onAcceptRequest: (requesterUserId: number) => Promise<void>;
  onRejectRequest: (requesterUserId: number) => Promise<void>;
  busyFriendId: number | null;
  sectionTitle: string;
};

const store = (): ApiState => ({
  currentUserId: null,
  activeTab: "friends",
  setActiveTab: () => {},
  searchQuery: "",
  debouncedSearch: "",
  setSearchQuery: () => {},
  sortAscending: true,
  toggleSort: () => {},
  friendsListItems: [],
  publicListItems: [],
  pendingOutgoingUserIds: [],
  suggestedUsers: [],
  isLoadingSuggested: false,
  requestsListItems: [],
  totalFriends: 0,
  totalPublic: 0,
  totalRequests: 0,
  isLoadingFriends: false,
  isLoadingPublic: false,
  isLoadingRequests: false,
  isFetchingMoreFriends: false,
  isFetchingMorePublic: false,
  isFetchingMoreRequests: false,
  hasNextFriends: false,
  hasNextPublic: false,
  hasNextRequests: false,
  fetchMoreFriends: async () => undefined,
  fetchMorePublic: async () => undefined,
  fetchMoreRequests: async () => undefined,
  listError: null,
  onCancelRequest: async () => undefined,
  onCancelOutgoingPending: async () => undefined,
  onAddRequest: async () => undefined,
  onAcceptRequest: async () => undefined,
  onRejectRequest: async () => undefined,
  busyFriendId: null,
  sectionTitle: "ACTIVE SQUAD",
});

export { store as ApiState };
export type { ApiState as FriendsApiState };
