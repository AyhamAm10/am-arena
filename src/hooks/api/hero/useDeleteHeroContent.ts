import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { deleteHeroContent } from "@/src/api/services/hero-content.api";

/**
 * Delete hero content by id.
 * DELETE /hero-content/{id}
 */
export function useDeleteHeroContent(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHeroContent,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["hero-content"] });
      queryClient.invalidateQueries({ queryKey: ["hero-content", id] });
    },
  });
}
