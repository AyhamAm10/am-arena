import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { removeReelLike } from "@/src/api/services/reel.api";
import type { ReelEntity } from "@/src/api/types/reel.types";

type ReelsListResult = {
  data: ReelEntity[];
  meta?: unknown;
};

/**
 * Remove like from a reel.
 * DELETE /reel/{id}/like
 */
export function useRemoveReelLike(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeReelLike,
    onMutate: async (reelId) => {
      await queryClient.cancelQueries({ queryKey: ["reels"] });
      await queryClient.cancelQueries({ queryKey: ["reel", reelId] });

      const previousReels = queryClient.getQueriesData<ReelsListResult>({ queryKey: ["reels"] });
      const previousSingle = queryClient.getQueryData<ReelEntity>(["reel", reelId]);

      previousReels.forEach(([key, data]) => {
        if (!data) return;
        const next = {
          ...data,
          data: data.data.map((r) =>
            String(r.id) === String(reelId)
              ? { ...r, liked_by_current_user: false, likes_count: Math.max(0, (r.likes_count ?? 1) - 1) }
              : r,
          ),
        };
        queryClient.setQueryData(key, next);
      });

      if (previousSingle) {
        queryClient.setQueryData(["reel", reelId], {
          ...previousSingle,
          liked_by_current_user: false,
          likes_count: Math.max(0, (previousSingle.likes_count ?? 1) - 1),
        });
      }

      return { previousReels, previousSingle };
    },
    onError: (_err, reelId, context: any) => {
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
