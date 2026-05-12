import { useFetchFriendsInfinite } from "@/src/hooks/api/friends/useFetchFriendsInfinite";
import { useFetchPubgTournamentById } from "@/src/hooks/api/tournament/useFetchPubgTournamentById";
import { useFetchTournamentRegistrationFields } from "@/src/hooks/api/tournament/useFetchTournamentRegistrationFields";
import { useRegisterForTournament } from "@/src/hooks/api/tournament/useRegisterForTournament";
import { useLocalSearchParams } from "expo-router";
import { type PropsWithChildren, useMemo } from "react";
import { useFetchMyRegistration } from "@/src/hooks/api/tournament/useFetchMyRegistration";
import type { InfiniteData } from "@tanstack/react-query";
import type { FriendEntityResponse } from "@/src/api/types/friend.types";
import type { FriendsPageResult } from "@/src/hooks/api/friends/useFetchFriendsInfinite";
import { useHeaderUser } from "@/src/hooks/auth/useHeaderUser";
import { useMirrorRegistry } from "./store";
import type { FriendOption } from "./store/api";

function mapFriendRecordToOption(
  record: FriendEntityResponse,
  currentUserId?: number
): FriendOption | null {
  const userUser = record.user;
  const friendUser = record.friend;

  const otherUser =
    currentUserId !== undefined && userUser?.id === currentUserId
      ? friendUser
      : currentUserId !== undefined && friendUser?.id === currentUserId
        ? userUser
        : friendUser ?? userUser;

  const nestedId = otherUser?.id;
  const nestedName = otherUser?.gamer_name ?? "";
  const avatar = otherUser?.avatarUrl ?? undefined;

  const id = nestedId ?? record.friend_user_id ?? record.user_id;
  const name = nestedName;

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    status: record.status || "Online",
    avatarUrl: avatar,
  };
}

function Api({ children }: PropsWithChildren) {
  const header = useHeaderUser();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const tournamentId = useMemo(() => {
    if (Array.isArray(params.id)) return params.id[0] ?? "";
    return params.id ?? "";
  }, [params.id]);

  const tournamentQuery = useFetchPubgTournamentById(tournamentId);
  const requiresFriendsSelection =
    tournamentQuery.data?.game?.type === "duo" ||
    tournamentQuery.data?.game?.type === "squad";
  const fieldsQuery = useFetchTournamentRegistrationFields(tournamentId, {
    enabled: Boolean(tournamentId),
  });
  const friendsQuery = useFetchFriendsInfinite({
    initialPage: 1,
    limit: 10,
    status: "accepted",
    enabled:
      Boolean(tournamentId) &&
      tournamentQuery.isSuccess &&
      requiresFriendsSelection,
  });
  const registerMutation = useRegisterForTournament();
  const myRegQuery = useFetchMyRegistration(tournamentId);

  const friendsData = friendsQuery.data as
    | InfiniteData<FriendsPageResult>
    | undefined;

  const friends = useMemo(() => {
    const rows =
      friendsData?.pages.flatMap((p: FriendsPageResult) => p.data) ?? [];
    const mapped = rows
      .map((friend: FriendEntityResponse) => mapFriendRecordToOption(friend, header.user?.id))
      .filter((friend): friend is FriendOption => Boolean(friend));

    const seen = new Set<number>();
    return mapped.filter((friend) => {
      if (seen.has(friend.id)) return false;
      seen.add(friend.id);
      return true;
    });
  }, [friendsData?.pages, header.user?.id]);

  const friendsTotalCount =
    friendsData?.pages[0]?.meta?.total ?? friends.length;

  useMirrorRegistry("tournamentId", tournamentId, tournamentId);
  useMirrorRegistry("tournament", tournamentQuery.data ?? null, tournamentQuery.dataUpdatedAt);
  useMirrorRegistry(
    "isLoadingTournament",
    tournamentQuery.isLoading,
    tournamentQuery.isFetching
  );
  useMirrorRegistry(
    "registrationFields",
    fieldsQuery.data ?? [],
    fieldsQuery.dataUpdatedAt
  );
  useMirrorRegistry(
    "isLoadingRegistrationFields",
    fieldsQuery.isLoading,
    fieldsQuery.isFetching
  );
  useMirrorRegistry("friends", friends, friendsQuery.dataUpdatedAt);
  useMirrorRegistry("hasNextFriendsPage", Boolean(friendsQuery.hasNextPage), friendsQuery.hasNextPage);
  const isLoadingFriendsEffective = requiresFriendsSelection ? friendsQuery.isLoading : false;
  useMirrorRegistry(
    "isLoadingFriends",
    isLoadingFriendsEffective,
    isLoadingFriendsEffective
  );
  useMirrorRegistry(
    "isFetchingMoreFriends",
    friendsQuery.isFetchingNextPage,
    friendsQuery.isFetchingNextPage
  );
  useMirrorRegistry(
    "fetchMoreFriends",
    async () => friendsQuery.fetchNextPage(),
    friendsQuery.fetchNextPage
  );
  useMirrorRegistry(
    "submitRegistration",
    async (payload) => registerMutation.mutateAsync(payload),
    registerMutation.mutateAsync
  );
  useMirrorRegistry("isSubmitting", registerMutation.isPending, registerMutation.isPending);
  useMirrorRegistry(
    "friendsTotalCount",
    friendsTotalCount,
    friendsTotalCount
  );
  useMirrorRegistry(
    "isRegistered",
    Boolean(myRegQuery.data?.registered ?? false),
    myRegQuery.dataUpdatedAt
  );

  return children;
}

export { Api };
