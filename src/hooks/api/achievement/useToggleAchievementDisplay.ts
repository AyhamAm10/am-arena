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
    onMutate: async (userAchievementId: number) => {
      await queryClient.cancelQueries({ queryKey: ["achievement", "my-achievements"] });
      await queryClient.cancelQueries({ queryKey: ["auth", "current-user"] });

      const previousMine = queryClient.getQueryData<any>(["achievement", "my-achievements"]);
      const previousAuth = queryClient.getQueryData<any>(["auth", "current-user"]);

      if (previousMine) {
        const next = (previousMine as any).map((entry: any) => {
          if (entry.id === userAchievementId) return { ...entry, displayed: !entry.displayed };
          return entry;
        });
        queryClient.setQueryData(["achievement", "my-achievements"], next);
      }

      if (previousAuth) {
        const authCopy = { ...previousAuth };
        if (Array.isArray(authCopy.achievements)) {
          authCopy.achievements = authCopy.achievements.map((ua: any) =>
            ua.id === userAchievementId ? { ...ua, displayed: !ua.displayed } : ua,
          );
        }
        queryClient.setQueryData(["auth", "current-user"], authCopy);
      }

      return { previousMine, previousAuth };
    },
    onError: (_err, _variables, context: any) => {
      if (context?.previousMine) {
        queryClient.setQueryData(["achievement", "my-achievements"], context.previousMine);
      }
      if (context?.previousAuth) {
        queryClient.setQueryData(["auth", "current-user"], context.previousAuth);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["achievement", "my-achievements"] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
    },
  });
}
