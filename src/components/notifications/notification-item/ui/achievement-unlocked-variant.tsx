import { useMirror } from "../store";
import { formatNotificationTime } from "../utils";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { MotionPressable } from "@/src/components/motion";
import { Text } from "react-native";
import { notificationCardStyles as s } from "./styles";
import { ReadBadge, notificationCardStateStyle } from "./common";
import { navigateFromNotificationPayload } from "@/src/lib/notifications/notification-navigation";

export function createAchievementUnlockedVariant(instanceId: string) {
  return function AchievementUnlockedVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const router = useRouter();
    const markAsRead = item?.markAsRead;

    const go = useCallback(async () => {
      if (!item) return;
      navigateFromNotificationPayload(router, item.type, item.data);
      if (!item.read_at && markAsRead) {
        await markAsRead(item.id);
      }
    }, [item, markAsRead, router]);

    if (!item) return null;

    return (
      <MotionPressable style={notificationCardStateStyle(item.read_at)} onPress={() => void go()}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <ReadBadge readAt={item.read_at} />
        <Text style={s.meta}>{formatNotificationTime(item.created_at)} · الإنجازات</Text>
      </MotionPressable>
    );
  };
}
