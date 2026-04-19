import { useGetPubgTournaments } from "@/src/hooks/api/usePubgTournaments";
import type { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

function Api({ children }: PropsWithChildren) {
  const activeQuery = useGetPubgTournaments({
    page: 1,
    limit: 20,
    is_active: true,
    is_super: false,
  });

  const pastQuery = useGetPubgTournaments({
    page: 1,
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

  useMirrorRegistry("activeTournaments", activeQuery.data, activeQuery.dataUpdatedAt);
  useMirrorRegistry(
    "IsLoadingActiveTournaments",
    activeQuery.isLoading,
    activeQuery.isFetching
  );
  useMirrorRegistry("ActiveTournamentsError", activeError, activeError);

  useMirrorRegistry("pastTournaments", pastQuery.data, pastQuery.dataUpdatedAt);
  useMirrorRegistry(
    "IsLoadingPastTournaments",
    pastQuery.isLoading,
    pastQuery.isFetching
  );
  useMirrorRegistry("PastTournamentsError", pastError, pastError);

  useMirrorRegistry(
    "refetchActiveTournaments",
    activeQuery.refetch,
    activeQuery.refetch
  );
  useMirrorRegistry("refetchPastTournaments", pastQuery.refetch, pastQuery.refetch);

  return children;
}

export { Api };
