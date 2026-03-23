import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { removeReelLike } from "@/src/api/services/reel.api";

/**
 * Remove like from a reel.
 * DELETE /reel/{id}/like
 */
export function useRemoveReelLike(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeReelLike,
    onSuccess: (_data, reelId) => {
      queryClient.invalidateQueries({ queryKey: ["reels"] });
      queryClient.invalidateQueries({ queryKey: ["reel", reelId] });
    },
  });
}
