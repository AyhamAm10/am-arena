import { useGetPubgTournaments } from '@/src/hooks/api/usePubgTournaments';
import { PropsWithChildren } from 'react';
import { useMirrorRegistry } from './store';

function Api({ children }: PropsWithChildren) {


    const { data, isLoading  , dataUpdatedAt    , isFetching } = useGetPubgTournaments({
        page: 1,
        limit: 10,
    });

    useMirrorRegistry("data", data , dataUpdatedAt);
    useMirrorRegistry("isLoading", isLoading, isFetching);

    return children;
}

export { Api };
