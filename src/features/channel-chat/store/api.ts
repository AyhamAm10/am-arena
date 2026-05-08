import type { ChannelMessage } from "@/src/api/types/chat.types";

type ApiState = {
  messages: ChannelMessage[];
  channelTitle: string;
  channelId: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
  allowUserMessages: boolean;
};

const store = (): ApiState => ({
  messages: [],
  channelTitle: "",
  channelId: 0,
  isLoading: false,
  isError: false,
  errorMessage: null,
  onRefresh: () => {},
  allowUserMessages: false,
});

export { store as ApiState };
export type { ApiState as ChannelChatApiState };
