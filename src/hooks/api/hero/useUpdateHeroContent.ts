import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { updateHeroContent } from "@/src/api/services/hero-content.api";
import type {
  HeroContent,
  UpdateHeroContentBody,
} from "@/src/api/types/hero-content.types";

type UpdateHeroContentVariables = {
  id: string;
  body: UpdateHeroContentBody;
};

/**
 * Update hero content by id.
 * PATCH /hero-content/{id} — UpdateHeroContentBody (OpenAPI).
 */
export function useUpdateHeroContent(): UseMutationResult<
  HeroContent,
  Error,
  UpdateHeroContentVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }) => updateHeroContent(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hero-content"] });
      queryClient.invalidateQueries({ queryKey: ["hero-content", variables.id] });
    },
  });
}
