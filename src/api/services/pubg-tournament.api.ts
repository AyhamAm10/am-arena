import { parseApiResponse } from "../axios/apiResponseParser";
import axiosInstance from "../axios/axiosInstance";
import { ApiResponse } from "../types/api-response";
import { GetPubgTournamentsQuery, PubgGame } from "../types/pubg-tournament.types";

export const getPubgTournaments = async (
  query: GetPubgTournamentsQuery
) => {
  const res = await axiosInstance.get<
    ApiResponse<PubgGame[]>
  >("/pubg-tournament", {
    params: query,
  });

  return parseApiResponse(res);
};