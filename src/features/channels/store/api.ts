import type { ChannelPublic } from "@/src/api/types/chat.types";

type ApiState = {
  channels: ChannelPublic[];
  isLoadingChannels: boolean;
  isChannelsError: boolean;
  channelsErrorMessage: string | null;
  refreshChannels: () => Promise<void>;
  onRefreshChannelsPress: () => void;
};

const store = (): ApiState => ({
  channels: [],
  isLoadingChannels: false,
  isChannelsError: false,
  channelsErrorMessage: null,
  refreshChannels: async () => {},
  onRefreshChannelsPress: () => {},
});

export { store as ApiState };
export type { ApiState as ChannelsApiState };
