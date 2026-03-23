import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/src/api/services/auth.api";

/**
 * Logout (clears refresh cookie server-side; requires Bearer for some backends).
 * POST /auth/logout
 */
export function useLogoutUser(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
    },
  });
}
