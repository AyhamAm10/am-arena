import { useAuthStore } from "@/src/stores/authStore";
import { useLogout } from "@/src/hooks/api/auth/useLogout";

export function useAuth() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const clearSession = useAuthStore((s) => s.clearSession);
  const logoutMutation = useLogout();

  return {
    accessToken,
    isAuthenticated: !!accessToken,
    setAccessToken,
    clearSession,
    logout: () => logoutMutation.mutateAsync(),
    isLoggingOut: logoutMutation.isPending,
  };
}
