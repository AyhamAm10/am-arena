import { useFetchFriendsInfinite } from "@/src/hooks/api/friends/useFetchFriendsInfinite";
import { useFetchPubgTournamentById } from "@/src/hooks/api/tournament/useFetchPubgTournamentById";
import { useFetchTournamentRegistrationFields } from "@/src/hooks/api/tournament/useFetchTournamentRegistrationFields";
import { useRegisterForTournament } from "@/src/hooks/api/tournament/useRegisterForTournament";
import { useLocalSearchParams } from "expo-router";
import { type PropsWithChildren, useMemo } from "react";
import { useMirrorRegistry } from "./store";
import type { FriendOption } from "./store/api";

function asString(value: unknown): string {
  if (typeof value === "string") return value;
  return "";
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function mapFriendRecordToOption(record: Record<string, unknown>): FriendOption | null {
  const directName = asString(record.gamer_name);
  const directStatus = asString(record.status);
  const directId = asNumber(record.id) ?? asNumber(record.friend_user_id) ?? asNumber(record.user_id);

  const friendObj = (record.friend ?? {}) as Record<string, unknown>;
  const userObj = (record.user ?? {}) as Record<string, unknown>;

  const nestedName = asString(friendObj.gamer_name) || asString(userObj.gamer_name);
  const nestedId = asNumber(friendObj.id) ?? asNumber(userObj.id);
  const avatar =
    asString(friendObj.profile_picture_url) || asString(userObj.profile_picture_url) || undefined;

  const id = directId ?? nestedId;
  const name = directName || nestedName;

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    status: directStatus || "Online",
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
  const fieldsQuery = useFetchTournamentRegistrationFields(tournamentId, {
    enabled: Boolean(tournamentId),
  });
  const friendsQuery = useFetchFriendsInfinite({
    initialPage: 1,
    limit: 10,
    status: "accepted",
  });
  const registerMutation = useRegisterForTournament();

  const friends = useMemo(() => {
    const mapped = (friendsQuery.data?.pages ?? [])
      .flatMap((page) => page.data)
      .map((friend) => mapFriendRecordToOption(friend))
      .filter((friend): friend is FriendOption => Boolean(friend));

    const byId = new Map<number, FriendOption>();
    mapped.forEach((friend) => byId.set(friend.id, friend));
    return Array.from(byId.values());
  }, [friendsQuery.data?.pages]);

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
  useMirrorRegistry("isLoadingFriends", friendsQuery.isLoading, friendsQuery.isLoading);
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

  return children;
}

export { Api };
