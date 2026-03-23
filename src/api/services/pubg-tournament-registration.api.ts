import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { ApiResponse } from "../types/api-response";
import type {
  RegisterForTournamentBody,
  TournamentRegistrationField,
} from "../types/pubg-tournament-registration.types";

export async function getRegistrationFields(
  tournamentId: string
): Promise<TournamentRegistrationField[]> {
  const res = await axiosInstance.get<
    ApiResponse<TournamentRegistrationField[]>
  >(`/pubg-tournament/${tournamentId}/registration-fields`);
  return parseApiResponse(res);
}

export async function registerForTournament(
  tournamentId: string,
  body: RegisterForTournamentBody
): Promise<Record<string, unknown>> {
  const res = await axiosInstance.post<ApiResponse<Record<string, unknown>>>(
    `/pubg-tournament/${tournamentId}/register`,
    body
  );
  return parseApiResponse(res);
}
