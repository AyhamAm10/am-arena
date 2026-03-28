/**
 * @todo When channel REST is merged into OpenAPI, replace placeholders with real
 * types and wire axios + React Query (see hooks/api/messages-channels-openapi-gap.ts).
 */

export type ChannelListItem = {
  id: string;
  title: string;
};

type ApiState = {
  channels: ChannelListItem[] | undefined;
  isLoadingChannels: boolean;
  refreshChannels: () => Promise<void>;
  onRefreshChannelsPress: () => void;
};

const store = (): ApiState => ({
  channels: undefined,
  isLoadingChannels: false,
  refreshChannels: async () => {},
  onRefreshChannelsPress: () => {},
});

export { store as ApiState };
export type { ApiState as ChannelsApiState };
