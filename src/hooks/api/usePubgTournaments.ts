import { getPubgTournaments } from "@/src/api/services/pubg-tournament.api";
import {
  GetPubgTournamentsQuery,
  PubgTournamentDetail,
} from "@/src/api/types/pubg-tournament.types";
import { defaultQueryOptions } from "@/src/constants/queryOptions";
import { useQuery, UseQueryResult } from "@tanstack/react-query";


export const useGetPubgTournaments = (
    query: GetPubgTournamentsQuery
): UseQueryResult<PubgTournamentDetail[], Error> => {
    return useQuery<PubgTournamentDetail[], Error>({
        queryKey: ["pubg-tournaments", query],
        queryFn: () => getPubgTournaments(query),
        ...defaultQueryOptions,
    });
};