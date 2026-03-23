import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getRegistrationFields } from "@/src/api/services/pubg-tournament-registration.api";
import { apiHooksQueryDefaults } from "@/src/constants/apiHooksQueryDefaults";
import type { TournamentRegistrationField } from "@/src/api/types/pubg-tournament-registration.types";

/**
 * Registration fields for a PUBG tournament (public).
 * GET /pubg-tournament/{id}/registration-fields
 */
export function useFetchTournamentRegistrationFields(
  tournamentId: string,
  options?: { enabled?: boolean }
): UseQueryResult<TournamentRegistrationField[], Error> {
  return useQuery({
    queryKey: ["pubg-tournament", tournamentId, "registration-fields"],
    queryFn: () => getRegistrationFields(tournamentId),
    ...apiHooksQueryDefaults,
    enabled: (options?.enabled ?? true) && Boolean(tournamentId),
  });
}
