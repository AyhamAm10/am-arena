import { useFetchPublicChannels } from "@/src/hooks/api/chat/useFetchPublicChannels";
import { type PropsWithChildren, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMirrorRegistry } from "./store";

function Api({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const channelsQuery = useFetchPublicChannels(
    { page: 1, limit: 50 },
    { enabled: true }
  );

  const channels = useMemo(
    () => channelsQuery.data?.data ?? [],
    [channelsQuery.data?.data]
  );

  const refreshChannels = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["chat", "channels"] });
  }, [queryClient]);

  const onRefreshChannelsPress = useCallback(() => {
    void refreshChannels();
  }, [refreshChannels]);

  const errorMessage =
    channelsQuery.error instanceof Error
      ? channelsQuery.error.message
      : channelsQuery.isError
        ? "Could not load channels."
        : null;

  useMirrorRegistry("channels", channels, channelsQuery.dataUpdatedAt);
  useMirrorRegistry(
    "isLoadingChannels",
    channelsQuery.isLoading || channelsQuery.isFetching,
    channelsQuery.isFetching
  );
  useMirrorRegistry("isChannelsError", channelsQuery.isError, channelsQuery.isError);
  useMirrorRegistry(
    "channelsErrorMessage",
    errorMessage,
    errorMessage
  );
  useMirrorRegistry("refreshChannels", refreshChannels, refreshChannels);
  useMirrorRegistry(
    "onRefreshChannelsPress",
    onRefreshChannelsPress,
    onRefreshChannelsPress
  );

  return children;
}

export { Api };
