import { useGetPubgTournaments } from "@/src/hooks/api/usePubgTournaments";
import { useGetPubgTournamentsInfinite } from "@/src/hooks/api/usePubgTournamentsInfinite";
import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

function Api({ children }: PropsWithChildren) {
  const activeQuery = useGetPubgTournamentsInfinite({
    initialPage: 1,
    limit: 20,
    is_active: true,
    is_super: false,
  });

  const pastQuery = useGetPubgTournamentsInfinite({
    initialPage: 1,
    limit: 50,
    is_active: false,
  });

  const activeError =
    activeQuery.isError && activeQuery.error
      ? activeQuery.error.message || "Failed to load active events"
      : null;
  const pastError =
    pastQuery.isError && pastQuery.error
      ? pastQuery.error.message || "Failed to load past events"
      : null;

  useMirrorRegistry(
    "activeTournaments",
    activeQuery.data ? activeQuery.data.pages.flatMap((p) => p.data ?? []) : [],
    activeQuery.dataUpdatedAt ?? Date.now()
  );
  useMirrorRegistry(
    "IsLoadingActiveTournaments",
    activeQuery.isLoading,
    activeQuery.isFetching
  );
  useMirrorRegistry("ActiveTournamentsError", activeError, activeError);

  useMirrorRegistry(
    "pastTournaments",
    pastQuery.data ? pastQuery.data.pages.flatMap((p) => p.data ?? []) : [],
    pastQuery.dataUpdatedAt ?? Date.now()
  );
  useMirrorRegistry(
    "IsLoadingPastTournaments",
    pastQuery.isLoading,
    pastQuery.isFetching
  );
  useMirrorRegistry("PastTournamentsError", pastError, pastError);

  useMirrorRegistry("fetchMoreActiveTournaments", activeQuery.fetchNextPage, activeQuery.fetchNextPage);
  useMirrorRegistry("isFetchingMoreActiveTournaments", activeQuery.isFetchingNextPage, activeQuery.isFetchingNextPage);
  useMirrorRegistry("hasNextActiveTournaments", Boolean(activeQuery.hasNextPage), activeQuery.dataUpdatedAt ?? Date.now());

  useMirrorRegistry("fetchMorePastTournaments", pastQuery.fetchNextPage, pastQuery.fetchNextPage);
  useMirrorRegistry("isFetchingMorePastTournaments", pastQuery.isFetchingNextPage, pastQuery.isFetchingNextPage);
  useMirrorRegistry("hasNextPastTournaments", Boolean(pastQuery.hasNextPage), pastQuery.dataUpdatedAt ?? Date.now());

  useMirrorRegistry(
    "refetchActiveTournaments",
    activeQuery.refetch,
    activeQuery.refetch
  );
  useMirrorRegistry("refetchPastTournaments", pastQuery.refetch, pastQuery.refetch);

  return children;
}

export { Api };
