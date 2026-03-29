import { toggleAchievementDisplay } from "@/src/api/services/achievement.api";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";

export function useToggleAchievementDisplay(): UseMutationResult<
  void,
  Error,
  number
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleAchievementDisplay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });
}
