import { useMirror } from "../store";
import { formatNotificationTime, getNum } from "../utils";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { MotionPressable } from "@/src/components/motion";
import { Text } from "react-native";
import { notificationCardStyles as s } from "./styles";
import { ReadBadge, notificationCardStateStyle } from "./common";
import { navigateFromNotificationPayload } from "@/src/lib/notifications/notification-navigation";
import { getStr } from "../utils";

export function createChatMessageVariant(instanceId: string) {
  return function ChatMessageVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const router = useRouter();

    const chatId = getNum(item?.data ?? null, "chatId");
    const messagePreview = getStr(item?.data ?? null, "messagePreview");
    const markAsRead = item?.markAsRead;

    const openChat = useCallback(async () => {
      if (chatId == null || !item) return;
      navigateFromNotificationPayload(router, item.type, item.data);
      if (!item.read_at && markAsRead) {
        await markAsRead(item.id);
      }
    }, [chatId, item, markAsRead, router]);

    if (!item) return null;

    return (
      <MotionPressable
        style={notificationCardStateStyle(item.read_at)}
        onPress={() => void openChat()}
        disabled={chatId == null}
      >
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{messagePreview || item.body}</Text>
        <ReadBadge readAt={item.read_at} />
        <Text style={s.meta}>{formatNotificationTime(item.created_at)} · فتح المحادثة</Text>
      </MotionPressable>
    );
  };
}
