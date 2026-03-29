import { useAddReelComment } from "@/src/hooks/api/reels/useAddReelComment";
import { useFetchReels } from "@/src/hooks/api/reels/useFetchReels";
import { useLikeReel } from "@/src/hooks/api/reels/useLikeReel";
import { useRemoveReelLike } from "@/src/hooks/api/reels/useRemoveReelLike";
import { useQueryClient } from "@tanstack/react-query";
import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useMirrorRegistry } from "./store";

function Api({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [commentReelId, setCommentReelId] = useState<string | null>(null);

  const reelsQuery = useFetchReels({ page: 1, limit: 20 });

  const likeMutation = useLikeReel();
  const removeLikeMutation = useRemoveReelLike();
  const addCommentMutation = useAddReelComment();

  const likeReel = useCallback(
    async (reelId: string) => likeMutation.mutateAsync(reelId),
    [likeMutation]
  );

  const removeReelLike = useCallback(
    async (reelId: string) => removeLikeMutation.mutateAsync(reelId),
    [removeLikeMutation]
  );

  const addReelComment = useCallback(
    async (reelId: string, comment: string) =>
      addCommentMutation.mutateAsync({ reelId, body: { comment } }),
    [addCommentMutation]
  );

  const reels = useMemo(
    () => reelsQuery.data?.data ?? [],
    [reelsQuery.data?.data]
  );

  const isReelLikeBusy = likeMutation.isPending || removeLikeMutation.isPending;

  const refreshReels = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["reels"] });
  }, [queryClient]);

  useMirrorRegistry("reels", reels, reelsQuery.dataUpdatedAt);
  useMirrorRegistry("reelsMeta", reelsQuery.data?.meta, reelsQuery.dataUpdatedAt);
  /** Initial load only — do not use isFetching or refetches hide the whole feed. */
  useMirrorRegistry("isLoadingReels", reelsQuery.isLoading, reelsQuery.isLoading);
  useMirrorRegistry(
    "isFetchingReels",
    reelsQuery.isFetching,
    reelsQuery.isFetching
  );
  useMirrorRegistry("refreshReels", refreshReels, refreshReels);
  useMirrorRegistry("isReelsError", reelsQuery.isError, reelsQuery.isError);
  useMirrorRegistry("likeReel", likeReel, likeReel);
  useMirrorRegistry("removeReelLike", removeReelLike, removeReelLike);
  useMirrorRegistry("isReelLikeBusy", isReelLikeBusy, isReelLikeBusy);
  useMirrorRegistry("addReelComment", addReelComment, addReelComment);
  useMirrorRegistry(
    "isAddingComment",
    addCommentMutation.isPending,
    addCommentMutation.isPending
  );
  useMirrorRegistry("commentReelId", commentReelId, commentReelId);
  useMirrorRegistry("setCommentReelId", setCommentReelId, setCommentReelId);

  return children;
}

export { Api };
