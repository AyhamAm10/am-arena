import { parseApiResponse } from "../axios/apiResponseParser";
import axiosInstance from "../axios/axiosInstance";
import { ApiResponse } from "../types/api-response";
import {
  GetPubgTournamentsQuery,
  PubgTournamentDetail,
} from "../types/pubg-tournament.types";

export const getPubgTournaments = async (
  query: GetPubgTournamentsQuery
) => {
  const res = await axiosInstance.get<
    ApiResponse<PubgTournamentDetail[]>
  >("/pubg-tournament", {
    params: query,
  });

  return parseApiResponse(res);
};

export const getPubgTournamentById = async (
  tournamentId: string
): Promise<PubgTournamentDetail> => {
  const res = await axiosInstance.get<ApiResponse<PubgTournamentDetail>>(
    `/pubg-tournament/${tournamentId}`
  );

  return parseApiResponse(res);
};