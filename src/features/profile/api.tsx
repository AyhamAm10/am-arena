import { useFetchCurrentUser } from "@/src/hooks/api/auth/useFetchCurrentUser";
import { useLogout } from "@/src/hooks/api/auth/useLogout";
import { useSendFriendRequest } from "@/src/hooks/api/friends/useSendFriendRequest";
import { useFetchUserProfile } from "@/src/hooks/api/profile/useFetchUserProfile";
import { type PropsWithChildren, useCallback, useMemo } from "react";
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

  const meQuery = useFetchCurrentUser({ enabled: variant === "me" });
  const otherQuery = useFetchUserProfile(targetId, {
    enabled: variant === "other" && Boolean(targetId),
  });
  const friendRequest = useSendFriendRequest();
  const logoutMutation = useLogout();

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const sendFriendRequest = useCallback(
    async (friendUserId: number) =>
      friendRequest.mutateAsync({ friend_user_id: friendUserId }),
    [friendRequest]
  );

  const handleAddFriend = useCallback(() => {
    const id = otherQuery.data?.user?.id;
    if (typeof id === "number") {
      void sendFriendRequest(id);
    }
  }, [otherQuery.data?.user?.id, sendFriendRequest]);

  const isLoading =
    variant === "me"
      ? meQuery.isLoading || meQuery.isFetching
      : otherQuery.isLoading || otherQuery.isFetching;

  const isError = variant === "me" ? meQuery.isError : otherQuery.isError;

  useMirrorRegistry("variant", variant, variant);
  useMirrorRegistry("targetUserId", variant === "other" ? targetId : null, targetId);
  useMirrorRegistry("currentUser", meQuery.data ?? null, meQuery.dataUpdatedAt);
  useMirrorRegistry("otherProfile", otherQuery.data ?? null, otherQuery.dataUpdatedAt);
  useMirrorRegistry("isLoadingProfile", isLoading, isLoading);
  useMirrorRegistry("isProfileError", isError, isError);
  useMirrorRegistry("sendFriendRequest", sendFriendRequest, sendFriendRequest);
  useMirrorRegistry(
    "isSendingFriendRequest",
    friendRequest.isPending,
    friendRequest.isPending
  );
  useMirrorRegistry("handleAddFriend", handleAddFriend, handleAddFriend);
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
