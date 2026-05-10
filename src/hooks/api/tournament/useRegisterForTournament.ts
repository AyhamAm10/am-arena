import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { registerForTournament } from "@/src/api/services/pubg-tournament-registration.api";
import type {
  PubgRegistrationResponse,
  RegisterForTournamentBody,
} from "@/src/api/types/pubg-tournament-registration.types";
import { useActionToast } from "@/src/lib/notifications/useActionToast";
import { useRouter } from "expo-router";

type RegisterVariables = {
  tournamentId: string;
  body: RegisterForTournamentBody;
};

/**
 * Register for a tournament; sends field_values per RegisterForTournamentBody.
 * POST /pubg-tournament/{id}/register
 */
export function useRegisterForTournament(): UseMutationResult<
  PubgRegistrationResponse,
  Error,
  RegisterVariables
> {
  const queryClient = useQueryClient();
  const toast = useActionToast();
  const router = useRouter();
  return useMutation({
    mutationFn: ({ tournamentId, body }) =>
      registerForTournament(tournamentId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pubg-tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["pubg-tournament", variables.tournamentId] });
      queryClient.invalidateQueries({
        queryKey: [
          "pubg-tournament",
          variables.tournamentId,
          "registration-fields",
        ],
      });
      toast.success("Successfully joined tournament!");
      // After successful registration, navigate to tournament details
      try {
        router.replace(`/tournament/${variables.tournamentId}/details`);
      } catch (err) {
        // ignore navigation errors
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
