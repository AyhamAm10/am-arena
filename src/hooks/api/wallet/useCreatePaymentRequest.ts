import { createPaymentRequest } from "@/src/api/services/wallet.api";
import type {
  CreatePaymentRequestBody,
  CreatePaymentRequestResponse,
} from "@/src/api/types/wallet.types";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

export function useCreatePaymentRequest(): UseMutationResult<
  CreatePaymentRequestResponse,
  Error,
  CreatePaymentRequestBody
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPaymentRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] });
      await queryClient.invalidateQueries({ queryKey: ["notification"] });
    },
  });
}
