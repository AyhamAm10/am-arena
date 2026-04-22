import { getMyWallet } from "@/src/api/services/wallet.api";
import type { WalletSummary } from "@/src/api/types/wallet.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useFetchWallet(options?: { enabled?: boolean }): UseQueryResult<WalletSummary, Error> {
  return useQuery({
    queryKey: ["wallet", "me"],
    queryFn: getMyWallet,
    ...apiHooksQueryDefaults,
    enabled: options?.enabled ?? true,
  });
}
