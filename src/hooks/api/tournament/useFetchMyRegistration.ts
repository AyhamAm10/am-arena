import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/src/api/axios/axiosInstance";
import { parseApiResponse } from "@/src/api/axios/apiResponseParser";

export function fetchMyRegistration(tournamentId: string) {
  return axiosInstance.get(`/pubg-tournament/${tournamentId}/registration`).then(parseApiResponse);
}

export function useFetchMyRegistration(tournamentId: string | undefined) {
  return useQuery({
    queryKey: ["pubg-tournament", tournamentId, "my-registration"],
    queryFn: () => fetchMyRegistration(tournamentId ?? ""),
    enabled: Boolean(tournamentId),
    staleTime: 1000 * 30,
  });
}
