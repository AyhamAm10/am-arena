import { useAddReelComment } from "@/src/hooks/api/reels/useAddReelComment";
import { useFetchReelComments } from "@/src/hooks/api/reels/useFetchReelComments";
import { useFetchReels } from "@/src/hooks/api/reels/useFetchReels";
import { useLikeReel } from "@/src/hooks/api/reels/useLikeReel";
import { useRemoveReelLike } from "@/src/hooks/api/reels/useRemoveReelLike";
import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useMirrorRegistry } from "./store";

function Api({ children }: PropsWithChildren) {
  const [commentReelId, setCommentReelId] = useState<string | null>(null);

  const reelsQuery = useFetchReels({ page: 1, limit: 20 });
  const commentsQuery = useFetchReelComments(
    commentReelId ?? "",
    { page: 1, limit: 20 },
    { enabled: Boolean(commentReelId) }
  );

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

  useMirrorRegistry("reels", reels, reelsQuery.dataUpdatedAt);
  useMirrorRegistry("reelsMeta", reelsQuery.data?.meta, reelsQuery.dataUpdatedAt);
  useMirrorRegistry(
    "isLoadingReels",
    reelsQuery.isLoading || reelsQuery.isFetching,
    reelsQuery.isFetching
  );
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
  useMirrorRegistry(
    "comments",
    commentsQuery.data?.data ?? [],
    commentsQuery.dataUpdatedAt
  );
  useMirrorRegistry(
    "isLoadingComments",
    commentsQuery.isLoading || commentsQuery.isFetching,
    commentsQuery.isFetching
  );
  useMirrorRegistry("commentReelId", commentReelId, commentReelId);
  useMirrorRegistry("setCommentReelId", setCommentReelId, setCommentReelId);

  return children;
}

export { Api };
