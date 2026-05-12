import { setActiveAchievement } from "@/src/api/services/achievement.api";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

export function useSetActiveAchievement(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setActiveAchievement,
    onMutate: async (userAchievementId: number) => {
      await queryClient.cancelQueries({ queryKey: ["achievement", "my-achievements"] });
      await queryClient.cancelQueries({ queryKey: ["auth", "current-user"] });

      const previousMine = queryClient.getQueryData<any>(["achievement", "my-achievements"]);
      const previousAuth = queryClient.getQueryData<any>(["auth", "current-user"]);

      // find achievement id from my-achievements cache
      let achievementObj = null;
      if (previousMine) {
        const found = (previousMine as any).find((entry: any) => entry.id === userAchievementId);
        achievementObj = found?.achievement ?? null;
      }

      if (previousAuth && achievementObj) {
        const authCopy = { ...previousAuth };
        authCopy.selected_achievement = achievementObj;
        queryClient.setQueryData(["auth", "current-user"], authCopy);
      }

      return { previousMine, previousAuth };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previousAuth) {
        queryClient.setQueryData(["auth", "current-user"], context.previousAuth);
      }
      if (context?.previousMine) {
        queryClient.setQueryData(["achievement", "my-achievements"], context.previousMine);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["achievement", "my-achievements"] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
    },
  });
}
