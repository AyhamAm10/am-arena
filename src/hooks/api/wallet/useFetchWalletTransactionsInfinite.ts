import { getMyWalletTransactions } from "@/src/api/services/wallet.api";
import type { WalletTransactionItem } from "@/src/api/types/wallet.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useInfiniteQuery } from "@tanstack/react-query";

export type WalletTransactionsPageResult = {
  data: WalletTransactionItem[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};

export function useFetchWalletTransactionsInfinite(options?: {
  enabled?: boolean;
  initialPage?: number;
  limit?: number;
}) {
  const { enabled = true, initialPage = 1, limit = 15 } = options ?? {};
  return useInfiniteQuery({
    queryKey: ["wallet", "transactions", { limit }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getMyWalletTransactions({ page: Number(pageParam), limit }),
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => {
      const page = lastPage.meta?.page ?? 1;
      const totalPages = lastPage.meta?.totalPages ?? 1;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: apiHooksQueryDefaults.staleTime,
    refetchOnWindowFocus: apiHooksQueryDefaults.refetchOnWindowFocus,
    enabled,
  });
}
