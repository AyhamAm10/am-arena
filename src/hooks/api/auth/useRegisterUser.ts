import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { register } from "@/src/api/services/auth.api";
import type { AuthTokensResponse } from "@/src/api/types/auth.types";

/**
 * Register a new user.
 * POST /auth/register — request: AuthRegisterBody (OpenAPI AuthRegisterBody), response: AuthTokensResponse.
 */
export function useRegisterUser(): UseMutationResult<
  AuthTokensResponse,
  Error,
  FormData
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
    },
  });
}
