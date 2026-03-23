// src/constants/queryOptions.ts
import { keepPreviousData, QueryObserverOptions } from "@tanstack/react-query";

export const defaultQueryOptions: Partial<QueryObserverOptions<any, Error>> = {
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
};