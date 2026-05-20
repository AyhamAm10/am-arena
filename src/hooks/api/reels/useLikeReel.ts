import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { likeReel } from "@/src/api/services/reel.api";
import type { ReelLikeEntity, ReelEntity } from "@/src/api/types/reel.types";

type ReelsListResult =
  | {
      data?: ReelEntity[];
      meta?: unknown;
    }
  | {
      pages?: Array<{
        data?: ReelEntity[];
        meta?: unknown;
      }>;
      pageParams?: unknown[];
    };

function patchLikeState(data: ReelsListResult | undefined, reelId: string) {
  if (!data) return data;

  if (Array.isArray((data as any).pages)) {
    return {
      ...data,
      pages: (data as any).pages.map((page: any) => {
        if (!page || !Array.isArray(page.data)) return page;
        return {
          ...page,
          data: page.data.map((reel: ReelEntity) =>
            String(reel.id) === String(reelId)
              ? { ...reel, liked_by_current_user: true, likes_count: (reel.likes_count ?? 0) + 1 }
              : reel,
          ),
        };
      }),
    };
  }

  if (Array.isArray((data as any).data)) {
    return {
      ...data,
      data: (data as any).data.map((reel: ReelEntity) =>
        String(reel.id) === String(reelId)
          ? { ...reel, liked_by_current_user: true, likes_count: (reel.likes_count ?? 0) + 1 }
          : reel,
      ),
    };
  }

  return data;
}

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
        queryClient.setQueryData(key, patchLikeState(data, reelId));
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
