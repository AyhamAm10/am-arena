import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { likeReel } from "@/src/api/services/reel.api";
import type { ReelLikeEntity } from "@/src/api/types/reel.types";

/**
 * Like a reel.
 * POST /reel/{id}/like
 */
export function useLikeReel(): UseMutationResult<
  ReelLikeEntity,
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likeReel,
    onSuccess: (_data, reelId) => {
      queryClient.invalidateQueries({ queryKey: ["reels"] });
      queryClient.invalidateQueries({ queryKey: ["reel", reelId] });
    },
  });
}
