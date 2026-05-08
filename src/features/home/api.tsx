import { useGetPubgTournaments } from '@/src/hooks/api/usePubgTournaments';
import { PropsWithChildren, useCallback } from 'react';
import { useMirrorRegistry } from './store';
import { useFetchBestPlayers } from '@/src/hooks/api/players/useFetchBestPlayers';
import { useFetchHeroContents } from '@/src/hooks/api/hero/useFetchHeroContents';

function Api({ children }: PropsWithChildren) {


    const tournamentsQuery = useGetPubgTournaments({
        page: 1,
        limit: 10,
        is_active: true,
    });

    const superTournamentsQuery = useGetPubgTournaments({
        page: 1,
        limit: 10,
        is_active: true,
        is_super: true,
    });

    const bestPlayersQuery = useFetchBestPlayers({
        page: 1,
        limit: 4,
    });

    const latestWinnersQuery = useFetchHeroContents({
        page: 1,
        limit: 10,
    });

    useMirrorRegistry("latestWinners", latestWinnersQuery.data?.data, latestWinnersQuery.dataUpdatedAt);
    useMirrorRegistry("IsLoadingLatestWinners", latestWinnersQuery.isLoading, latestWinnersQuery.isFetching);
    useMirrorRegistry("tournaments", tournamentsQuery.data, tournamentsQuery.dataUpdatedAt);
    useMirrorRegistry("IsLoadingTournaments", tournamentsQuery.isLoading, tournamentsQuery.isFetching);
    useMirrorRegistry("superTournaments", superTournamentsQuery.data, superTournamentsQuery.dataUpdatedAt);
    useMirrorRegistry("IsLoadingSuperTournaments", superTournamentsQuery.isLoading, superTournamentsQuery.isFetching);
    useMirrorRegistry("bestPlayers", bestPlayersQuery.data?.data, bestPlayersQuery.dataUpdatedAt);
    useMirrorRegistry("IsLoadingBestPlayers", bestPlayersQuery.isLoading, bestPlayersQuery.isFetching);

    const refreshHome = useCallback(async () => {
        await Promise.allSettled([
            tournamentsQuery.refetch?.(),
            superTournamentsQuery.refetch?.(),
            bestPlayersQuery.refetch?.(),
            latestWinnersQuery.refetch?.(),
        ]);
    }, [tournamentsQuery, superTournamentsQuery, bestPlayersQuery, latestWinnersQuery]);

    useMirrorRegistry("refreshHome", refreshHome, refreshHome);

    return children;
}

export { Api };
