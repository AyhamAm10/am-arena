import { removeFriendship } from "@/src/api/services/friend.api";
import type { RemoveFriendUserBody } from "@/src/api/types/friend.types";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

export function useRemoveFriendship(): UseMutationResult<
  void,
  Error,
  RemoveFriendUserBody
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFriendship,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["user-search"] });
    },
  });
}
