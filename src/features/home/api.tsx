import { useGetPubgTournaments } from '@/src/hooks/api/usePubgTournaments';
import { PropsWithChildren } from 'react';
import { useMirrorRegistry } from './store';
import { useFetchBestPlayers } from '@/src/hooks/api/players/useFetchBestPlayers';
import { useFetchHeroContents } from '@/src/hooks/api/hero/useFetchHeroContents';

function Api({ children }: PropsWithChildren) {


    const { data, isLoading  , dataUpdatedAt    , isFetching } = useGetPubgTournaments({
        page: 1,
        limit: 10,
    });

    const { data: bestPlayers, isLoading: isLoadingBestPlayers, dataUpdatedAt: dataUpdatedAtBestPlayers, isFetching: isFetchingBestPlayers } = useFetchBestPlayers({
        page: 1,
        limit: 10,
    });

    const { data: latestWinners, isLoading: isLoadingLatestWinners, dataUpdatedAt: dataUpdatedAtLatestWinners, isFetching: isFetchingLatestWinners } = useFetchHeroContents({
        page: 1,
        limit: 10,
    });

    useMirrorRegistry("latestWinners", latestWinners?.data, dataUpdatedAtLatestWinners);
    useMirrorRegistry("IsLoadingLatestWinners", isLoadingLatestWinners, isFetchingLatestWinners);
    useMirrorRegistry("tournaments", data , dataUpdatedAt);
    useMirrorRegistry("IsLoadingTournaments", isLoading, isFetching);
    useMirrorRegistry("bestPlayers", bestPlayers?.data, dataUpdatedAtBestPlayers);
    useMirrorRegistry("IsLoadingBestPlayers", isLoadingBestPlayers, isFetchingBestPlayers);

    return children;
}

export { Api };
