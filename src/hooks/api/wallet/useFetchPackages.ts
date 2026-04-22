import { getPackages } from "@/src/api/services/wallet.api";
import type { WalletPackageItem } from "@/src/api/types/wallet.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useFetchPackages(options?: { enabled?: boolean }): UseQueryResult<WalletPackageItem[], Error> {
  return useQuery({
    queryKey: ["wallet", "packages"],
    queryFn: getPackages,
    ...apiHooksQueryDefaults,
    enabled: options?.enabled ?? true,
  });
}
