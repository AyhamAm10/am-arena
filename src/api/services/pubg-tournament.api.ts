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

  // The backend returns an envelope { success, data, meta }
  // For infinite queries we need both `data` and `meta` per page.
  const apiResponse = res.data as any;
  if (!apiResponse.success) {
    throw new Error(apiResponse.message || "Failed to fetch tournaments");
  }

  return {
    data: apiResponse.data as PubgTournamentDetail[],
    meta: apiResponse.meta,
  };
};

export const getPubgTournamentById = async (
  tournamentId: string
): Promise<PubgTournamentDetail> => {
  const res = await axiosInstance.get<ApiResponse<PubgTournamentDetail>>(
    `/pubg-tournament/${tournamentId}`
  );

  return parseApiResponse(res);
};