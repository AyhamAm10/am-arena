import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequest } from "@/src/api/services/friend.api";
import type {
  FriendRequestCreatedResponse,
  SendFriendRequestBody,
} from "@/src/api/types/friend.types";

/**
 * Send a friend request (pending).
 * POST /friend/request — SendFriendRequestBody (OpenAPI).
 */
export function useSendFriendRequest(): UseMutationResult<
  FriendRequestCreatedResponse,
  Error,
  SendFriendRequestBody
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
}
