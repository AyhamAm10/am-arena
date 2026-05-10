import { getPubgTournaments } from "@/src/api/services/pubg-tournament.api";
import {
    GetPubgTournamentsQuery,
    PubgTournamentDetail,
} from "@/src/api/types/pubg-tournament.types";
import { defaultQueryOptions } from "@/src/constants/queryOptions";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

type PageWithMeta = { data: PubgTournamentDetail[]; meta?: { page: number; totalPages?: number } };

export const useGetPubgTournaments = (
    query: GetPubgTournamentsQuery
): UseQueryResult<PageWithMeta | undefined, Error> => {
    return useQuery<PageWithMeta | undefined, Error>({
        queryKey: ["pubg-tournaments", query],
        queryFn: () => getPubgTournaments(query),
        ...defaultQueryOptions,
    });
};