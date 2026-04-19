import { useFetchTournamentPolls } from "@/src/hooks/api/poll/useFetchTournamentPolls";
import { useVoteOnPoll } from "@/src/hooks/api/poll/useVoteOnPoll";
import { useFetchPubgTournamentById } from "@/src/hooks/api/tournament/useFetchPubgTournamentById";
import { useLocalSearchParams } from "expo-router";
import { type PropsWithChildren, useMemo } from "react";
import { useMirrorRegistry } from "./store";

function Api({ children }: PropsWithChildren) {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const tournamentId = useMemo(() => {
    if (Array.isArray(params.id)) return params.id[0] ?? "";
    return params.id ?? "";
  }, [params.id]);

  const tournamentQuery = useFetchPubgTournamentById(tournamentId);
  const pollsQuery = useFetchTournamentPolls(tournamentId, {
    enabled: Boolean(tournamentId),
  });
  const voteMutation = useVoteOnPoll();

  useMirrorRegistry("tournamentId", tournamentId, tournamentId);
  useMirrorRegistry("tournament", tournamentQuery.data ?? null, tournamentQuery.dataUpdatedAt);
  useMirrorRegistry(
    "polls",
    pollsQuery.data ?? tournamentQuery.data?.polls ?? [],
    pollsQuery.dataUpdatedAt || tournamentQuery.dataUpdatedAt,
  );
  useMirrorRegistry(
    "isLoadingTournament",
    tournamentQuery.isLoading,
    tournamentQuery.isFetching,
  );
  useMirrorRegistry(
    "isLoadingPolls",
    pollsQuery.isLoading,
    pollsQuery.isFetching,
  );
  useMirrorRegistry("isVoting", voteMutation.isPending, voteMutation.isPending);
  useMirrorRegistry(
    "voteOnPoll",
    async (pollId: number, optionId: number) =>
      voteMutation.mutateAsync({ pollId, optionId, tournamentId }),
    voteMutation.mutateAsync,
  );

  return children;
}

export { Api };
