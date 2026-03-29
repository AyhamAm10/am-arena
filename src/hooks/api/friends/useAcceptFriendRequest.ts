import { acceptFriendRequest } from "@/src/api/services/friend.api";
import type {
  AcceptFriendRequestBody,
  FriendEntityResponse,
} from "@/src/api/types/friend.types";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

export function useAcceptFriendRequest(): UseMutationResult<
  FriendEntityResponse,
  Error,
  AcceptFriendRequestBody
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["user-search"] });
    },
  });
}
