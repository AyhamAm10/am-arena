import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { login } from "@/src/api/services/auth.api";
import type { AuthLoginBody, AuthTokensResponse } from "@/src/api/types/auth.types";
import { persistAuthSession } from "@/src/api/axios/authSession";
import { useActionToast } from "@/src/lib/notifications/useActionToast";

/**
 * Login; returns user + access + refresh in body (refresh also httpOnly cookie on web).
 * POST /auth/login — AuthLoginBody / AuthTokensResponse.
 */
export function useLoginUser(): UseMutationResult<
  AuthTokensResponse,
  Error,
  AuthLoginBody
> {
  const queryClient = useQueryClient();
  const toast = useActionToast();
  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await persistAuthSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      await queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
      toast.success("Logged in successfully");
      router.replace("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
