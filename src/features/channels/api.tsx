import { type PropsWithChildren, useCallback } from "react";
import { useMirrorRegistry } from "./store";

function Api({ children }: PropsWithChildren) {
  const refreshChannels = useCallback(async () => {}, []);

  const onRefreshChannelsPress = useCallback(() => {
    void refreshChannels();
  }, [refreshChannels]);

  useMirrorRegistry("channels", undefined, 0);
  useMirrorRegistry("isLoadingChannels", false, 0);
  useMirrorRegistry("refreshChannels", refreshChannels, refreshChannels);
  useMirrorRegistry(
    "onRefreshChannelsPress",
    onRefreshChannelsPress,
    onRefreshChannelsPress
  );

  return children;
}

export { Api };
