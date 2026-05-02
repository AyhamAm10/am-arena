import { useFetchTournamentPolls } from "@/src/hooks/api/poll/useFetchTournamentPolls";
import { useVoteOnPoll } from "@/src/hooks/api/poll/useVoteOnPoll";
import { useFetchPubgTournamentById } from "@/src/hooks/api/tournament/useFetchPubgTournamentById";
import { useLocalSearchParams } from "expo-router";
import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useMirrorRegistry } from "./store";

function Api({ children }: PropsWithChildren) {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const tournamentId = useMemo(() => {
    if (Array.isArray(params.id)) return params.id[0] ?? "";
    return params.id ?? "";
  }, [params.id]);

  const [votePendingPollId, setVotePendingPollId] = useState<number | null>(null);
  const [votePendingOptionId, setVotePendingOptionId] = useState<number | null>(null);

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
  useMirrorRegistry("votePendingPollId", votePendingPollId, votePendingPollId);
  useMirrorRegistry("votePendingOptionId", votePendingOptionId, votePendingOptionId);
  const voteOnPoll = useCallback(
    async (pollId: number, optionId: number) => {
      if (voteMutation.isPending) return;
      setVotePendingPollId(pollId);
      setVotePendingOptionId(optionId);
      try {
        await voteMutation.mutateAsync({ pollId, optionId, tournamentId });
      } finally {
        setVotePendingPollId((current) => (current === pollId ? null : current));
        setVotePendingOptionId((current) => (current === optionId ? null : current));
      }
    },
    [voteMutation, tournamentId]
  );
  useMirrorRegistry("voteOnPoll", voteOnPoll, voteOnPoll);

  return children;
}

export { Api };
