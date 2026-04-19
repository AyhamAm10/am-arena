import { useMirror } from "../store";
import { formatNotificationTime, getNum } from "../utils";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { MotionPressable } from "@/src/components/motion";
import { Text } from "react-native";
import { notificationCardStyles as s } from "./styles";
import { ReadBadge, notificationCardStateStyle } from "./common";
import { navigateFromNotificationPayload } from "@/src/lib/notifications/notification-navigation";

export function createTournamentCreatedVariant(instanceId: string) {
  return function TournamentCreatedVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const router = useRouter();
    const tournamentId = getNum(item?.data ?? null, "tournamentId");
    const markAsRead = item?.markAsRead;

    const go = useCallback(async () => {
      if (tournamentId == null || !item) return;
      navigateFromNotificationPayload(router, item.type, item.data);
      if (!item.read_at && markAsRead) {
        await markAsRead(item.id);
      }
    }, [item, markAsRead, router, tournamentId]);

    if (!item) return null;

    return (
      <MotionPressable
        style={notificationCardStateStyle(item.read_at)}
        onPress={() => void go()}
        disabled={tournamentId == null}
      >
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <ReadBadge readAt={item.read_at} />
        <Text style={s.meta}>{formatNotificationTime(item.created_at)} · عرض البطولة</Text>
      </MotionPressable>
    );
  };
}
