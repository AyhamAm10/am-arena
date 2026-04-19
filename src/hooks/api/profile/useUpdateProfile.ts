import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { updateProfile } from "@/src/api/services/user.api";
import type { CurrentUserResponse } from "@/src/api/types/auth.types";
import type { UpdateProfileBody, UserProfileResponse } from "@/src/api/types/user.types";

/**
 * Update current user's profile with JSON metadata only.
 */
export function useUpdateProfile(): UseMutationResult<
  UserProfileResponse,
  Error,
  UpdateProfileBody
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData<CurrentUserResponse>(
        ["auth", "current-user"],
        (prev) => {
          if (!prev || prev.id !== data.user.id) return prev;
          return {
            ...prev,
            avatarUrl: data.user.avatarUrl,
            avatarPublicId: data.user.avatarPublicId ?? null,
            full_name: data.user.full_name,
            gamer_name: data.user.gamer_name,
            xp_points: data.user.xp_points,
            coins: data.user.coins,
            is_active: data.user.is_active,
            updated_at: data.user.updated_at,
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", String(data.user.id)],
      });
    },
  });
}
