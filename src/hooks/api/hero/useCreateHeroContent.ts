import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { createHeroContent } from "@/src/api/services/hero-content.api";
import type {
  CreateHeroContentBody,
  HeroContent,
} from "@/src/api/types/hero-content.types";

/**
 * Create hero content.
 * POST /hero-content — CreateHeroContentBody (OpenAPI).
 */
export function useCreateHeroContent(): UseMutationResult<
  HeroContent,
  Error,
  CreateHeroContentBody
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHeroContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-content"] });
    },
  });
}
