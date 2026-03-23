import { getPubgTournaments } from "@/src/api/services/pubg-tournament.api";
import { ApiResponse } from "@/src/api/types/api-response";
import { GetPubgTournamentsQuery, PubgGame } from "@/src/api/types/pubg-tournament.types";
import { defaultQueryOptions } from "@/src/constants/queryOptions";
import { useQuery, UseQueryResult } from "@tanstack/react-query";


export const useGetPubgTournaments = (
    query: GetPubgTournamentsQuery
): UseQueryResult<PubgGame[], Error> => {
    return useQuery<PubgGame[], Error>({
        queryKey: ["pubg-tournaments", query],
        queryFn: () => getPubgTournaments(query),
        ...defaultQueryOptions,
    });
};