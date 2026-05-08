import type { FriendEntityResponse } from "@/src/api/types/friend.types";
import { useFetchCurrentUser } from "@/src/hooks/api/auth/useFetchCurrentUser";
import { useLogout } from "@/src/hooks/api/auth/useLogout";
import {
  useFetchFriendsInfinite,
  type FriendsPageResult,
} from "@/src/hooks/api/friends/useFetchFriendsInfinite";
import { useAcceptFriendRequest } from "@/src/hooks/api/friends/useAcceptFriendRequest";
import { useRemoveFriendship } from "@/src/hooks/api/friends/useRemoveFriendship";
import { useRemovePendingFriendRequest } from "@/src/hooks/api/friends/useRemovePendingFriendRequest";
import { useSendFriendRequest } from "@/src/hooks/api/friends/useSendFriendRequest";
import { useFetchUserProfile } from "@/src/hooks/api/profile/useFetchUserProfile";
import type { InfiniteData } from "@tanstack/react-query";
import { type PropsWithChildren, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import type { FriendAction } from "./components/AddFriendButton";
import { useMirrorRegistry } from "./store";
import type { ProfileVariant } from "./store/api";

type ApiProps = PropsWithChildren<{
  variant: ProfileVariant;
  userId?: string;
}>;

function Api({ children, variant, userId }: ApiProps) {
  const targetId = useMemo(() => {
    if (!userId) return "";
    return Array.isArray(userId) ? userId[0] ?? "" : userId;
  }, [userId]);

  const needsMeForComparison = variant === "other" && Boolean(targetId);
  const meQuery = useFetchCurrentUser({
    enabled: variant === "me" || needsMeForComparison,
  });

  const isViewingSelf =
    needsMeForComparison &&
    typeof meQuery.data?.id === "number" &&
    Number(targetId) === meQuery.data.id;

  const displayVariant: ProfileVariant =
    variant === "me" || isViewingSelf ? "me" : "other";

  const currentUserId = meQuery.data?.id ?? null;
  const meProfileId = displayVariant === "me" && currentUserId ? String(currentUserId) : "";
  const profileId = displayVariant === "me" ? meProfileId : targetId;

  const profileQuery = useFetchUserProfile(profileId, {
    enabled: Boolean(profileId),
  });
  const friendRequest = useSendFriendRequest();
  const acceptFriendMut = useAcceptFriendRequest();
  const removeFriendMut = useRemoveFriendship();
  const removePendingMut = useRemovePendingFriendRequest();
  const logoutMutation = useLogout();
  const viewedUserId = displayVariant === "other" && targetId ? Number(targetId) : null;

  const acceptedFriends = useFetchFriendsInfinite({
    status: "accepted",
    limit: 100,
    enabled: Boolean(currentUserId) && displayVariant === "other" && Boolean(viewedUserId),
  });
  const outgoingPending = useFetchFriendsInfinite({
    status: "pending",
    direction: "outgoing",
    limit: 100,
    enabled: Boolean(currentUserId) && displayVariant === "other" && Boolean(viewedUserId),
  });
  const incomingPending = useFetchFriendsInfinite({
    status: "pending",
    direction: "incoming",
    limit: 100,
    enabled: Boolean(currentUserId) && displayVariant === "other" && Boolean(viewedUserId),
  });

  const acceptedData = acceptedFriends.data as InfiniteData<FriendsPageResult> | undefined;
  const outgoingData = outgoingPending.data as InfiniteData<FriendsPageResult> | undefined;
  const incomingData = incomingPending.data as InfiniteData<FriendsPageResult> | undefined;

  const friendAction: FriendAction = useMemo(() => {
    if (displayVariant !== "other" || !viewedUserId) return "add";

    const acceptedRows: FriendEntityResponse[] =
      acceptedData?.pages.flatMap((p: FriendsPageResult) => p.data) ?? [];
    const isFriend = acceptedRows.some(
      (r) => r.user_id === viewedUserId || r.friend_user_id === viewedUserId,
    );
    if (isFriend) return "remove";

    const incomingRows: FriendEntityResponse[] =
      incomingData?.pages.flatMap((p: FriendsPageResult) => p.data) ?? [];
    const hasIncomingRequest = incomingRows.some((r) => r.user_id === viewedUserId);
    if (hasIncomingRequest) return "accept";

    const pendingRows: FriendEntityResponse[] =
      outgoingData?.pages.flatMap((p: FriendsPageResult) => p.data) ?? [];
    const isPending = pendingRows.some(
      (r) => r.friend_user_id === viewedUserId,
    );
    if (isPending) return "cancel";

    return "add";
  }, [
    displayVariant,
    viewedUserId,
    acceptedData?.pages,
    incomingData?.pages,
    outgoingData?.pages,
  ]);

  const isFriendActionBusy =
    friendRequest.isPending || acceptFriendMut.isPending || removeFriendMut.isPending || removePendingMut.isPending;

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const sendFriendRequest = useCallback(
    async (friendUserId: number) =>
      friendRequest.mutateAsync({ friend_user_id: friendUserId }),
    [friendRequest]
  );

  const handleAddFriend = useCallback(() => {
    const id = profileQuery.data?.user?.id;
    if (typeof id === "number") {
      void sendFriendRequest(id);
    }
  }, [profileQuery.data?.user?.id, sendFriendRequest]);

  const handleFriendAction = useCallback(() => {
    const id = profileQuery.data?.user?.id;
    if (typeof id !== "number") return;
    const run = async () => {
      try {
        if (friendAction === "remove") {
          await removeFriendMut.mutateAsync({ friend_user_id: id });
        } else if (friendAction === "cancel") {
          await removePendingMut.mutateAsync({ friend_user_id: id });
        } else if (friendAction === "accept") {
          await acceptFriendMut.mutateAsync({ user_id: id });
        } else {
          await friendRequest.mutateAsync({ friend_user_id: id });
        }
      } catch (e) {
        Alert.alert(
          "خطأ",
          e instanceof Error ? e.message : "فشلت العملية."
        );
      }
    };
    void run();
  }, [profileQuery.data?.user?.id, friendAction, removeFriendMut, removePendingMut, acceptFriendMut, friendRequest]);

  const handleRejectFriendRequest = useCallback(() => {
    const id = profileQuery.data?.user?.id;
    if (typeof id !== "number") return;
    const run = async () => {
      try {
        await removePendingMut.mutateAsync({ friend_user_id: id });
      } catch (e) {
        Alert.alert("خطأ", e instanceof Error ? e.message : "فشلت العملية.");
      }
    };
    void run();
  }, [profileQuery.data?.user?.id, removePendingMut]);

  const isLoading =
    ((variant === "me" || needsMeForComparison) &&
      (meQuery.isLoading || meQuery.isFetching)) ||
    (Boolean(profileId) && (profileQuery.isLoading || profileQuery.isFetching));

  const isError =
    ((variant === "me" || needsMeForComparison) && meQuery.isError) ||
    (Boolean(profileId) && profileQuery.isError);

  useMirrorRegistry("variant", variant, variant);
  useMirrorRegistry("displayVariant", displayVariant, displayVariant);
  useMirrorRegistry(
    "targetUserId",
    variant === "other" ? targetId : null,
    `${displayVariant}:${targetId}`,
  );
  useMirrorRegistry(
    "profile",
    profileQuery.data ?? null,
    `${displayVariant}:${profileId}:${profileQuery.dataUpdatedAt ?? ""}`,
  );
  useMirrorRegistry("isLoadingProfile", isLoading, `${displayVariant}:${profileId}`);
  useMirrorRegistry("isProfileError", isError, `${displayVariant}:${profileId}`);
  useMirrorRegistry("sendFriendRequest", sendFriendRequest, sendFriendRequest);
  useMirrorRegistry(
    "isSendingFriendRequest",
    friendRequest.isPending,
    friendRequest.isPending
  );
  useMirrorRegistry("handleAddFriend", handleAddFriend, handleAddFriend);
  useMirrorRegistry("friendAction", friendAction, friendAction);
  useMirrorRegistry("handleFriendAction", handleFriendAction, handleFriendAction);
  useMirrorRegistry("handleRejectFriendRequest", handleRejectFriendRequest, handleRejectFriendRequest);
  useMirrorRegistry("isFriendActionBusy", isFriendActionBusy, isFriendActionBusy);
  useMirrorRegistry("logout", logout, logoutMutation.mutateAsync);
  useMirrorRegistry(
    "isLoggingOut",
    logoutMutation.isPending,
    logoutMutation.isPending
  );

  return children;
}

export { Api };
export type { ApiProps as ProfileApiProps };
