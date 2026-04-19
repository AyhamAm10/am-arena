import { useFetchFriendsInfinite } from "@/src/hooks/api/friends/useFetchFriendsInfinite";
import { useFetchPubgTournamentById } from "@/src/hooks/api/tournament/useFetchPubgTournamentById";
import { useFetchTournamentRegistrationFields } from "@/src/hooks/api/tournament/useFetchTournamentRegistrationFields";
import { useRegisterForTournament } from "@/src/hooks/api/tournament/useRegisterForTournament";
import { useLocalSearchParams } from "expo-router";
import { type PropsWithChildren, useMemo } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import type { FriendEntityResponse } from "@/src/api/types/friend.types";
import type { FriendsPageResult } from "@/src/hooks/api/friends/useFetchFriendsInfinite";
import { useMirrorRegistry } from "./store";
import type { FriendOption } from "./store/api";

function mapFriendRecordToOption(record: FriendEntityResponse): FriendOption | null {
  const friendUser = record.friend;
  const userUser = record.user;
  const nestedName = friendUser?.gamer_name ?? userUser?.gamer_name ?? "";
  const nestedId = friendUser?.id ?? userUser?.id;
  const avatar =
    friendUser?.avatarUrl ?? userUser?.avatarUrl ?? undefined;

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
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const tournamentId = useMemo(() => {
    if (Array.isArray(params.id)) return params.id[0] ?? "";
    return params.id ?? "";
  }, [params.id]);

  const tournamentQuery = useFetchPubgTournamentById(tournamentId);
  const isSquadTournament =
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
      isSquadTournament,
  });
  const registerMutation = useRegisterForTournament();

  const friendsData = friendsQuery.data as
    | InfiniteData<FriendsPageResult>
    | undefined;

  const friends = useMemo(() => {
    const rows =
      friendsData?.pages.flatMap((p: FriendsPageResult) => p.data) ?? [];
    return rows
      .map((friend: FriendEntityResponse) => mapFriendRecordToOption(friend))
      .filter((friend): friend is FriendOption => Boolean(friend));
  }, [friendsData?.pages]);

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
  const isLoadingFriendsEffective = isSquadTournament ? friendsQuery.isLoading : false;
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

  return children;
}

export { Api };
