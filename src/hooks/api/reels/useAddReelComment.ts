import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { addReelComment } from "@/src/api/services/reel.api";
import type { AddCommentBody, ReelCommentEntity } from "@/src/api/types/reel.types";

type Variables = { reelId: string; body: AddCommentBody };

/**
 * Add a comment to a reel.
 * POST /reel/{id}/comment — AddCommentBody (OpenAPI AddCommentBody).
 */
export function useAddReelComment(): UseMutationResult<
  ReelCommentEntity,
  Error,
  Variables
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reelId, body }) => addReelComment(reelId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reel", variables.reelId, "comments"],
      });
    },
  });
}
