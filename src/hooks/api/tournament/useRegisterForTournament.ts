import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { registerForTournament } from "@/src/api/services/pubg-tournament-registration.api";
import type { RegisterForTournamentBody } from "@/src/api/types/pubg-tournament-registration.types";

type RegisterVariables = {
  tournamentId: string;
  body: RegisterForTournamentBody;
};

/**
 * Register for a tournament; sends field_values per RegisterForTournamentBody.
 * POST /pubg-tournament/{id}/register
 */
export function useRegisterForTournament(): UseMutationResult<
  Record<string, unknown>,
  Error,
  RegisterVariables
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tournamentId, body }) =>
      registerForTournament(tournamentId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pubg-tournaments"] });
      queryClient.invalidateQueries({
        queryKey: [
          "pubg-tournament",
          variables.tournamentId,
          "registration-fields",
        ],
      });
    },
  });
}
