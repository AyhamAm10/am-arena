import { getTournamentPolls } from "@/src/api/services/poll.api";
import type { PollResponse } from "@/src/api/types/poll.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useFetchTournamentPolls(
  tournamentId: string,
  options?: { enabled?: boolean },
): UseQueryResult<PollResponse[], Error> {
  return useQuery({
    queryKey: ["polls", "tournament", tournamentId],
    queryFn: () => getTournamentPolls(tournamentId),
    ...apiHooksQueryDefaults,
    enabled: (options?.enabled ?? true) && Boolean(tournamentId),
  });
}
