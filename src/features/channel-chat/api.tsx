import { useFetchChannelMessages } from "@/src/hooks/api/chat/useFetchChannelMessages";
import { useFetchPublicChannels } from "@/src/hooks/api/chat/useFetchPublicChannels";
import type { ChannelMessage } from "@/src/api/types/chat.types";
import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useSocket } from "@/src/hooks/useSocket";
import { useMirrorRegistry } from "./store";

const MESSAGES_QUERY = { page: 1, limit: 100 } as const;

function Api({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const channelId = Number(id);
  const channelTitle = title ?? "";

  const messagesQuery = useFetchChannelMessages(
    channelId,
    MESSAGES_QUERY,
    { enabled: channelId > 0 },
  );

  const messages = useMemo(
    () => messagesQuery.data?.data ?? [],
    [messagesQuery.data?.data],
  );

  const publicChannelsQuery = useFetchPublicChannels({ page: 1, limit: 100 }, { enabled: channelId > 0 });
  const channelMeta = useMemo(() => {
    const list = publicChannelsQuery.data?.data ?? [];
    return list.find((c) => c.id === channelId) ?? null;
  }, [publicChannelsQuery.data?.data, channelId]);

  const messagesRef = useRef<ChannelMessage[]>(messages);
  messagesRef.current = messages;

  const { onNewMessage, onMessageUpdated, onMessageDeleted } = useSocket(channelId > 0 ? channelId : null);

  useEffect(() => {
    onNewMessage((msg: ChannelMessage) => {
      queryClient.setQueryData(
        ["chat", "messages", channelId, MESSAGES_QUERY],
        (old: { data: ChannelMessage[]; meta?: unknown } | undefined) => {
          if (!old) return { data: [msg] };
          const exists = old.data.some((m) => m.id === msg.id);
          if (exists) return old;
          return { ...old, data: [...old.data, msg] };
        },
      );
    });
  }, [channelId, onNewMessage, queryClient]);

  useEffect(() => {
    onMessageUpdated((msg: ChannelMessage) => {
      queryClient.setQueryData(
        ["chat", "messages", channelId, MESSAGES_QUERY],
        (old: { data: ChannelMessage[]; meta?: unknown } | undefined) => {
          if (!old) return { data: [msg] };
          return { ...old, data: old.data.map((m) => (m.id === msg.id ? msg : m)) };
        },
      );
    });
  }, [channelId, onMessageUpdated, queryClient]);

  useEffect(() => {
    onMessageDeleted(({ id }) => {
      queryClient.setQueryData(
        ["chat", "messages", channelId, MESSAGES_QUERY],
        (old: { data: ChannelMessage[]; meta?: unknown } | undefined) => {
          if (!old) return old;
          return { ...old, data: old.data.filter((m) => m.id !== id) };
        },
      );
    });
  }, [channelId, onMessageDeleted, queryClient]);

  const onRefresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["chat", "messages", channelId] });
  }, [queryClient, channelId]);

  const errorMessage =
    messagesQuery.error instanceof Error
      ? messagesQuery.error.message
      : messagesQuery.isError
        ? "Could not load messages."
        : null;

  useMirrorRegistry("messages", messages, messagesQuery.dataUpdatedAt);
  useMirrorRegistry("channelTitle", channelTitle, channelTitle);
  useMirrorRegistry("channelId", channelId, channelId);
  useMirrorRegistry(
    "isLoading",
    messagesQuery.isLoading || messagesQuery.isFetching,
    messagesQuery.isFetching,
  );
  useMirrorRegistry("isError", messagesQuery.isError, messagesQuery.isError);
  useMirrorRegistry("errorMessage", errorMessage, errorMessage);
  useMirrorRegistry("onRefresh", onRefresh, onRefresh);
  useMirrorRegistry("allowUserMessages", Boolean(channelMeta?.allow_user_messages), channelMeta?.allow_user_messages ?? false);

  return children;
}

export { Api };
