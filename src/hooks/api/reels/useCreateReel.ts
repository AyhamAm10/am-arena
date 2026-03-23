import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { createReel } from "@/src/api/services/reel.api";
import type { CreateReelBody, ReelEntity } from "@/src/api/types/reel.types";

/**
 * Create a reel (authenticated).
 * POST /reel — CreateReelBody (OpenAPI CreateReelBody).
 */
export function useCreateReel(): UseMutationResult<
  ReelEntity,
  Error,
  CreateReelBody
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reels"] });
    },
  });
}
