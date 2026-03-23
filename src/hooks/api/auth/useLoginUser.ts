import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { login } from "@/src/api/services/auth.api";
import type { AuthLoginBody, AuthTokensResponse } from "@/src/api/types/auth.types";

/**
 * Login; returns user + accessToken in body.
 * POST /auth/login — AuthLoginBody / AuthTokensResponse (OpenAPI).
 */
export function useLoginUser(): UseMutationResult<
  AuthTokensResponse,
  Error,
  AuthLoginBody
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
    },
  });
}
