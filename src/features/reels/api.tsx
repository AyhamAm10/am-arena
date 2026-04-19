import { useHydratedGlobalPolls } from "@/src/hooks/api/poll/useHydratedGlobalPolls";
import { useVoteOnPoll } from "@/src/hooks/api/poll/useVoteOnPoll";
import { useAddReelComment } from "@/src/hooks/api/reels/useAddReelComment";
import { useFetchReels } from "@/src/hooks/api/reels/useFetchReels";
import { useLikeReel } from "@/src/hooks/api/reels/useLikeReel";
import { useRemoveReelLike } from "@/src/hooks/api/reels/useRemoveReelLike";
import { useQueryClient } from "@tanstack/react-query";
import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { useMirrorRegistry } from "./store";

function Api({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"reels" | "voting">("reels");
  const [commentReelId, setCommentReelId] = useState<string | null>(null);

  const reelsQuery = useFetchReels({ page: 1, limit: 20 });
  const globalPollsQuery = useHydratedGlobalPolls();

  const likeMutation = useLikeReel();
  const removeLikeMutation = useRemoveReelLike();
  const addCommentMutation = useAddReelComment();
  const voteMutation = useVoteOnPoll();

  const likeReel = useCallback(
    async (reelId: string) => likeMutation.mutateAsync(reelId),
    [likeMutation]
  );

  const removeReelLike = useCallback(
    async (reelId: string) => removeLikeMutation.mutateAsync(reelId),
    [removeLikeMutation]
  );

  const addReelComment = useCallback(
    async (reelId: string, comment: string, mentionedUserIds: number[] = []) =>
      addCommentMutation.mutateAsync({
        reelId,
        body: { comment, mentioned_user_ids: mentionedUserIds },
      }),
    [addCommentMutation]
  );

  const reels = useMemo(
    () => reelsQuery.data?.data ?? [],
    [reelsQuery.data?.data]
  );
  const globalPolls = useMemo(
    () => globalPollsQuery.data?.data ?? [],
    [globalPollsQuery.data?.data]
  );

  const isReelLikeBusy = likeMutation.isPending || removeLikeMutation.isPending;

  const refreshReels = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["reels"] });
  }, [queryClient]);

  const refreshGlobalPolls = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["polls"] });
  }, [queryClient]);

  const voteOnPoll = useCallback(
    async (pollId: number, optionId: number) =>
      voteMutation.mutateAsync({ pollId, optionId }),
    [voteMutation]
  );

  useMirrorRegistry("activeTab", activeTab, activeTab);
  useMirrorRegistry("setActiveTab", setActiveTab, setActiveTab);
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
  useMirrorRegistry("globalPolls", globalPolls, globalPollsQuery.dataUpdatedAt);
  useMirrorRegistry("globalPollsMeta", globalPollsQuery.data?.meta, globalPollsQuery.dataUpdatedAt);
  useMirrorRegistry(
    "isLoadingGlobalPolls",
    globalPollsQuery.isLoading,
    globalPollsQuery.isLoading
  );
  useMirrorRegistry(
    "isFetchingGlobalPolls",
    globalPollsQuery.isFetching,
    globalPollsQuery.isFetching
  );
  useMirrorRegistry(
    "isGlobalPollsError",
    globalPollsQuery.isError,
    globalPollsQuery.isError
  );
  useMirrorRegistry("refreshGlobalPolls", refreshGlobalPolls, refreshGlobalPolls);
  useMirrorRegistry("likeReel", likeReel, likeReel);
  useMirrorRegistry("removeReelLike", removeReelLike, removeReelLike);
  useMirrorRegistry("isReelLikeBusy", isReelLikeBusy, isReelLikeBusy);
  useMirrorRegistry("voteOnPoll", voteOnPoll, voteOnPoll);
  useMirrorRegistry("isVotingPoll", voteMutation.isPending, voteMutation.isPending);
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
