import { voteOnPoll } from "@/src/api/services/poll.api";
import type { PollResponse } from "@/src/api/types/poll.types";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

type VoteVariables = {
  pollId: number;
  optionId: number;
  tournamentId?: string;
};

export function useVoteOnPoll(): UseMutationResult<PollResponse, Error, VoteVariables> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pollId, optionId }) => voteOnPoll(pollId, optionId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      if (variables.tournamentId) {
        queryClient.invalidateQueries({
          queryKey: ["polls", "tournament", variables.tournamentId],
        });
        queryClient.invalidateQueries({
          queryKey: ["pubg-tournament", variables.tournamentId],
        });
      }
    },
  });
}
