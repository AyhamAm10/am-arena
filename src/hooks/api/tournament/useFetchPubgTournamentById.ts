import { getPubgTournamentById } from "@/src/api/services/pubg-tournament.api";
import type { PubgGame } from "@/src/api/types/pubg-tournament.types";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function useFetchPubgTournamentById(
  tournamentId: string
): UseQueryResult<PubgGame, Error> {
  return useQuery({
    queryKey: ["pubg-tournament", tournamentId],
    queryFn: () => getPubgTournamentById(tournamentId),
    ...apiHooksQueryDefaults,
    enabled: Boolean(tournamentId),
  });
}
