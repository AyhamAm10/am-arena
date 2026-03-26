import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { logout } from "@/src/api/services/auth.api";
import { clearAuthSession } from "@/src/api/axios/authSession";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      await clearAuthSession();
      queryClient.clear();
      router.replace("/login");
    },
  });
}
