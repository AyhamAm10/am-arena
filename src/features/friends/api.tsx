import { useFetchCurrentUser } from "@/src/hooks/api/auth/useFetchCurrentUser";
import { useAcceptFriendRequest } from "@/src/hooks/api/friends/useAcceptFriendRequest";
import { useFetchFriendsInfinite } from "@/src/hooks/api/friends/useFetchFriendsInfinite";
import { useRemoveFriendship } from "@/src/hooks/api/friends/useRemoveFriendship";
import { useRemovePendingFriendRequest } from "@/src/hooks/api/friends/useRemovePendingFriendRequest";
import { useSendFriendRequest } from "@/src/hooks/api/friends/useSendFriendRequest";
import { useSearchUsersInfinite } from "@/src/hooks/api/user/useSearchUsersInfinite";
import type { UserPublicSummary } from "@/src/api/types/user.types";
import type { InfiniteData } from "@tanstack/react-query";
import type { FriendsPageResult } from "@/src/hooks/api/friends/useFetchFriendsInfinite";
import type { SearchUsersPageResult } from "@/src/hooks/api/user/useSearchUsersInfinite";
import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import type { FriendListItem } from "./friendList.types";
import { useMirror, useMirrorRegistry } from "./store";
import { otherUserFromFriendRow } from "./utils";

function sortFriendItems(
  items: FriendListItem[],
  ascending: boolean
): FriendListItem[] {
  const copy = [...items];
  copy.sort((a, b) => {
    const c = a.user.gamer_name.localeCompare(b.user.gamer_name);
    return ascending ? c : -c;
  });
  return copy;
}

function sortPublicUsers(
  users: UserPublicSummary[],
  ascending: boolean
): UserPublicSummary[] {
  const copy = [...users];
  copy.sort((a, b) => {
    const c = a.gamer_name.localeCompare(b.gamer_name);
    return ascending ? c : -c;
  });
  return copy;
}

function Api({ children }: PropsWithChildren) {
  const activeTab = useMirror("activeTab");
  const debouncedSearch = useMirror("debouncedSearch");
  const sortAscending = useMirror("sortAscending");

  const meQuery = useFetchCurrentUser();
  const currentUserId = meQuery.data?.id ?? null;

  const friendsInfinite = useFetchFriendsInfinite({
    status: "accepted",
    gamer_name: debouncedSearch || undefined,
    limit: 10,
    enabled: Boolean(currentUserId) && activeTab === "friends",
  });

  const requestsInfinite = useFetchFriendsInfinite({
    status: "pending",
    direction: "incoming",
    gamer_name: debouncedSearch || undefined,
    limit: 10,
    enabled: Boolean(currentUserId) && activeTab === "requests",
  });

  const publicInfinite = useSearchUsersInfinite({
    gamer_name: debouncedSearch || undefined,
    exclude_friends: true,
    limit: 10,
    enabled: Boolean(currentUserId) && activeTab === "public",
  });

  const outgoingPendingInfinite = useFetchFriendsInfinite({
    status: "pending",
    direction: "outgoing",
    limit: 100,
    enabled: Boolean(currentUserId) && activeTab === "public",
  });

  const suggestedInfinite = useSearchUsersInfinite({
    limit: 30,
    enabled: Boolean(currentUserId) && activeTab === "public",
  });

  const acceptMut = useAcceptFriendRequest();
  const removeFriendMut = useRemoveFriendship();
  const removePendingMut = useRemovePendingFriendRequest();
  const sendMut = useSendFriendRequest();

  const [busyRowId, setBusyRowId] = useState<number | null>(null);

  const friendsData = friendsInfinite.data as
    | InfiniteData<FriendsPageResult>
    | undefined;
  const requestsData = requestsInfinite.data as
    | InfiniteData<FriendsPageResult>
    | undefined;
  const publicData = publicInfinite.data as
    | InfiniteData<SearchUsersPageResult>
    | undefined;
  const outgoingPendingData = outgoingPendingInfinite.data as
    | InfiniteData<FriendsPageResult>
    | undefined;
  const suggestedData = suggestedInfinite.data as
    | InfiniteData<SearchUsersPageResult>
    | undefined;

  const friendsRowsRaw = useMemo(
    () => friendsData?.pages.flatMap((p: FriendsPageResult) => p.data) ?? [],
    [friendsData?.pages]
  );

  const requestsRowsRaw = useMemo(
    () => requestsData?.pages.flatMap((p: FriendsPageResult) => p.data) ?? [],
    [requestsData?.pages]
  );

  const publicRowsRaw = useMemo(
    () =>
      publicData?.pages.flatMap((p: SearchUsersPageResult) => p.data) ?? [],
    [publicData?.pages]
  );

  const outgoingPendingRowsRaw = useMemo(
    () =>
      outgoingPendingData?.pages.flatMap((p: FriendsPageResult) => p.data) ??
      [],
    [outgoingPendingData?.pages]
  );

  const friendsListItems = useMemo((): FriendListItem[] => {
    if (!currentUserId) return [];
    const items: FriendListItem[] = [];
    for (const row of friendsRowsRaw) {
      const user = otherUserFromFriendRow(row, currentUserId);
      if (user) {
        items.push({ row, user });
      }
    }
    return sortFriendItems(items, sortAscending);
  }, [friendsRowsRaw, currentUserId, sortAscending]);

  const requestsListItems = useMemo((): FriendListItem[] => {
    if (!currentUserId) return [];
    const items: FriendListItem[] = [];
    for (const row of requestsRowsRaw) {
      const user = otherUserFromFriendRow(row, currentUserId);
      if (user) {
        items.push({ row, user });
      }
    }
    return sortFriendItems(items, sortAscending);
  }, [requestsRowsRaw, currentUserId, sortAscending]);

  const publicListItems = useMemo(
    () => sortPublicUsers(publicRowsRaw, sortAscending),
    [publicRowsRaw, sortAscending]
  );

  const pendingOutgoingUserIds = useMemo((): number[] => {
    if (currentUserId == null) return [];
    const ids: number[] = [];
    for (const row of outgoingPendingRowsRaw) {
      if (row.user_id === currentUserId) {
        ids.push(row.friend_user_id);
      }
    }
    return ids;
  }, [outgoingPendingRowsRaw, currentUserId]);

  const suggestedUsers = useMemo((): UserPublicSummary[] => {
    if (currentUserId == null) return [];
    const discoverIds = new Set(publicListItems.map((u) => u.id));
    const picked: UserPublicSummary[] = [];
    const pages = suggestedData?.pages ?? [];
    outer: for (const page of pages) {
      for (const u of page.data) {
        if (u.id === currentUserId) continue;
        if (discoverIds.has(u.id)) continue;
        picked.push(u);
        if (picked.length >= 2) break outer;
      }
    }
    return picked;
  }, [suggestedData?.pages, currentUserId, publicListItems]);

  const isLoadingSuggested =
    !suggestedInfinite.data &&
    (suggestedInfinite.isLoading || suggestedInfinite.isFetching);

  const totalFriends =
    friendsData?.pages[0]?.meta?.total ?? friendsListItems.length;
  const totalRequests =
    requestsData?.pages[0]?.meta?.total ?? requestsListItems.length;
  const totalPublic =
    publicData?.pages[0]?.meta?.total ?? publicListItems.length;

  const listError =
    friendsInfinite.error?.message ??
    requestsInfinite.error?.message ??
    publicInfinite.error?.message ??
    outgoingPendingInfinite.error?.message ??
    suggestedInfinite.error?.message ??
    null;

  const onCancelRequest = useCallback(
    async (friendUserId: number) => {
      setBusyRowId(friendUserId);
      try {
        await removeFriendMut.mutateAsync({ friend_user_id: friendUserId });
      } catch (e) {
        Alert.alert(
          "Error",
          e instanceof Error ? e.message : "Could not update friendship."
        );
      } finally {
        setBusyRowId(null);
      }
    },
    [removeFriendMut]
  );

  const onAddRequest = useCallback(
    async (friendUserId: number) => {
      setBusyRowId(friendUserId);
      try {
        await sendMut.mutateAsync({ friend_user_id: friendUserId });
      } catch (e) {
        Alert.alert(
          "Error",
          e instanceof Error ? e.message : "Could not send friend request."
        );
      } finally {
        setBusyRowId(null);
      }
    },
    [sendMut]
  );

  const onAcceptRequest = useCallback(
    async (requesterUserId: number) => {
      setBusyRowId(requesterUserId);
      try {
        await acceptMut.mutateAsync({ user_id: requesterUserId });
      } catch (e) {
        Alert.alert(
          "Error",
          e instanceof Error ? e.message : "Could not accept request."
        );
      } finally {
        setBusyRowId(null);
      }
    },
    [acceptMut]
  );

  const onRejectRequest = useCallback(
    async (requesterUserId: number) => {
      setBusyRowId(requesterUserId);
      try {
        await removePendingMut.mutateAsync({
          friend_user_id: requesterUserId,
        });
      } catch (e) {
        Alert.alert(
          "Error",
          e instanceof Error ? e.message : "Could not reject request."
        );
      } finally {
        setBusyRowId(null);
      }
    },
    [removePendingMut]
  );

  const onCancelOutgoingPending = useCallback(
    async (friendUserId: number) => {
      setBusyRowId(friendUserId);
      try {
        await removePendingMut.mutateAsync({
          friend_user_id: friendUserId,
        });
      } catch (e) {
        Alert.alert(
          "Error",
          e instanceof Error ? e.message : "Could not cancel request."
        );
      } finally {
        setBusyRowId(null);
      }
    },
    [removePendingMut]
  );

  useMirrorRegistry("currentUserId", currentUserId, currentUserId);
  useMirrorRegistry("friendsListItems", friendsListItems, friendsListItems);
  useMirrorRegistry("requestsListItems", requestsListItems, requestsListItems);
  useMirrorRegistry("publicListItems", publicListItems, publicListItems);
  useMirrorRegistry(
    "pendingOutgoingUserIds",
    pendingOutgoingUserIds,
    pendingOutgoingUserIds
  );
  useMirrorRegistry("suggestedUsers", suggestedUsers, suggestedUsers);
  useMirrorRegistry(
    "isLoadingSuggested",
    isLoadingSuggested,
    isLoadingSuggested
  );
  useMirrorRegistry("totalFriends", totalFriends, totalFriends);
  useMirrorRegistry("totalRequests", totalRequests, totalRequests);
  useMirrorRegistry("totalPublic", totalPublic, totalPublic);
  useMirrorRegistry(
    "isLoadingFriends",
    friendsInfinite.isLoading,
    friendsInfinite.isFetching
  );
  useMirrorRegistry(
    "isLoadingRequests",
    requestsInfinite.isLoading,
    requestsInfinite.isFetching
  );
  useMirrorRegistry(
    "isLoadingPublic",
    publicInfinite.isLoading,
    publicInfinite.isFetching
  );
  useMirrorRegistry(
    "isFetchingMoreFriends",
    friendsInfinite.isFetchingNextPage,
    friendsInfinite.isFetchingNextPage
  );
  useMirrorRegistry(
    "isFetchingMoreRequests",
    requestsInfinite.isFetchingNextPage,
    requestsInfinite.isFetchingNextPage
  );
  useMirrorRegistry(
    "isFetchingMorePublic",
    publicInfinite.isFetchingNextPage,
    publicInfinite.isFetchingNextPage
  );
  useMirrorRegistry(
    "hasNextFriends",
    Boolean(friendsInfinite.hasNextPage),
    friendsInfinite.hasNextPage
  );
  useMirrorRegistry(
    "hasNextRequests",
    Boolean(requestsInfinite.hasNextPage),
    requestsInfinite.hasNextPage
  );
  useMirrorRegistry(
    "hasNextPublic",
    Boolean(publicInfinite.hasNextPage),
    publicInfinite.hasNextPage
  );
  useMirrorRegistry(
    "fetchMoreFriends",
    async () => friendsInfinite.fetchNextPage(),
    friendsInfinite.fetchNextPage
  );
  useMirrorRegistry(
    "fetchMoreRequests",
    async () => requestsInfinite.fetchNextPage(),
    requestsInfinite.fetchNextPage
  );
  useMirrorRegistry(
    "fetchMorePublic",
    async () => publicInfinite.fetchNextPage(),
    publicInfinite.fetchNextPage
  );
  useMirrorRegistry("listError", listError, listError);
  useMirrorRegistry("onCancelRequest", onCancelRequest, onCancelRequest);
  useMirrorRegistry(
    "onCancelOutgoingPending",
    onCancelOutgoingPending,
    onCancelOutgoingPending
  );
  useMirrorRegistry("onAddRequest", onAddRequest, onAddRequest);
  useMirrorRegistry("onAcceptRequest", onAcceptRequest, onAcceptRequest);
  useMirrorRegistry("onRejectRequest", onRejectRequest, onRejectRequest);
  useMirrorRegistry("busyFriendId", busyRowId, busyRowId);

  return children;
}

export { Api };
