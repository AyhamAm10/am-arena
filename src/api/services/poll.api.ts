import axiosInstance from "../axios/axiosInstance";
import { parseApiResponse } from "../axios/apiResponseParser";
import { parseApiResponseWithMeta } from "../utils/parseApiResponseWithMeta";
import type { ApiResponse } from "../types/api-response";
import type { PollResponse } from "../types/poll.types";
import type { PollType } from "../types/poll.types";
import type { ApiPaginationMeta } from "../types/pubg-tournament.types";

export type ListPollsQuery = {
  page?: number;
  limit?: number;
  type?: PollType;
  is_active?: boolean;
  tournament_id?: number;
  chat_id?: number;
  search?: string;
};

export async function getTournamentPolls(tournamentId: string): Promise<PollResponse[]> {
  const res = await axiosInstance.get<ApiResponse<PollResponse[]>>(
    `/poll/tournament/${tournamentId}`,
  );
  return parseApiResponse(res);
}

export async function getPolls(query: ListPollsQuery): Promise<{
  data: PollResponse[];
  meta?: ApiPaginationMeta;
}> {
  const res = await axiosInstance.get<ApiResponse<PollResponse[]>>("/poll", {
    params: query,
  });
  return parseApiResponseWithMeta(res);
}

export async function getGlobalPolls(
  query: Omit<ListPollsQuery, "type"> = {},
): Promise<{
  data: PollResponse[];
  meta?: ApiPaginationMeta;
}> {
  return getPolls({
    ...query,
    type: "global",
  });
}

/** Full poll including options (list endpoint may omit `options` and only send `options_count`). */
export async function getPollById(pollId: number | string): Promise<PollResponse> {
  const res = await axiosInstance.get<ApiResponse<PollResponse>>(`/poll/${pollId}`);
  return parseApiResponse(res);
}

export async function voteOnPoll(
  pollId: number | string,
  optionId: number,
): Promise<PollResponse> {
  const res = await axiosInstance.post<ApiResponse<PollResponse>>(
    `/poll/${pollId}/vote`,
    { option_id: optionId },
  );
  return parseApiResponse(res);
}
