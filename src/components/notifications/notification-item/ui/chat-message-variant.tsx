import { useMirror } from "../store";
import { formatNotificationTime, getNum } from "../utils";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { MotionPressable } from "@/src/components/motion";
import { Text } from "react-native";
import { notificationCardStyles as s } from "./styles";

export function createChatMessageVariant(instanceId: string) {
  return function ChatMessageVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const router = useRouter();

    const chatId = getNum(item?.data ?? null, "chatId");

    const openChat = useCallback(() => {
      if (chatId == null) return;
      router.push({
        pathname: "/channel/[id]",
        params: { id: String(chatId), title: item?.title ?? "" },
      } as never);
    }, [chatId, item?.title, router]);

    if (!item) return null;

    return (
      <MotionPressable
        style={s.card}
        onPress={openChat}
        disabled={chatId == null}
      >
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <Text style={s.meta}>{formatNotificationTime(item.created_at)} · فتح المحادثة</Text>
      </MotionPressable>
    );
  };
}
