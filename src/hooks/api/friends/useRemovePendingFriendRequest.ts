import { removePendingFriendRequest } from "@/src/api/services/friend.api";
import type { RemoveFriendUserBody } from "@/src/api/types/friend.types";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

export function useRemovePendingFriendRequest(): UseMutationResult<
  void,
  Error,
  RemoveFriendUserBody
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removePendingFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["user-search"] });
    },
  });
}
