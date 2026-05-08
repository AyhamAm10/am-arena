import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { likeReel } from "@/src/api/services/reel.api";
import type { ReelLikeEntity, ReelEntity } from "@/src/api/types/reel.types";

type ReelsListResult = {
  data: ReelEntity[];
  meta?: unknown;
};

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
    // optimistic update
    onMutate: async (reelId) => {
      await queryClient.cancelQueries({ queryKey: ["reels"] });
      await queryClient.cancelQueries({ queryKey: ["reel", reelId] });

      const previousReels = queryClient.getQueriesData<ReelsListResult>({ queryKey: ["reels"] });
      const previousSingle = queryClient.getQueryData<ReelEntity>(["reel", reelId]);

      // apply optimistic update to all reels list queries
      previousReels.forEach(([key, data]) => {
        if (!data) return;
        const next: ReelsListResult = {
          ...data,
          data: data.data.map((r) =>
            String(r.id) === String(reelId)
              ? { ...r, liked_by_current_user: true, likes_count: (r.likes_count ?? 0) + 1 }
              : r,
          ),
        };
        queryClient.setQueryData(key, next);
      });

      if (previousSingle) {
        queryClient.setQueryData(["reel", reelId], {
          ...previousSingle,
          liked_by_current_user: true,
          likes_count: (previousSingle.likes_count ?? 0) + 1,
        });
      }

      return { previousReels, previousSingle };
    },
    onError: (_err, reelId, context: any) => {
      // rollback
      if (context?.previousReels) {
        context.previousReels.forEach(([key, data]: any) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousSingle) {
        queryClient.setQueryData(["reel", reelId], context.previousSingle);
      }
    },
    onSettled: (_data, reelId) => {
      queryClient.invalidateQueries({ queryKey: ["reels"] });
      queryClient.invalidateQueries({ queryKey: ["reel", reelId] });
    },
  });
}
