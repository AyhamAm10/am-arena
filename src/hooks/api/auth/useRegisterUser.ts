import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { register } from "@/src/api/services/auth.api";
import type { AuthRegisterBody, AuthTokensResponse } from "@/src/api/types/auth.types";
import { persistAuthSession } from "@/src/api/axios/authSession";

/**
 * Register a new user with JSON metadata only.
 */
export function useRegisterUser(): UseMutationResult<
  AuthTokensResponse,
  Error,
  AuthRegisterBody
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      await persistAuthSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      await queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
      router.replace("/");
    },
  });
}
