import { apiMarkRead } from "../api";
import { useMirror } from "../store";
import { formatNotificationTime } from "../utils";
import React, { useCallback, useState } from "react";
import { MotionPressable } from "@/src/components/motion";
import { ActivityIndicator, Text } from "react-native";
import { notificationCardStyles as s } from "./styles";
import { colors } from "@/src/theme/colors";
import { ReadBadge, notificationCardStateStyle } from "./common";
import { useRouter } from "expo-router";
import { navigateFromNotificationPayload } from "@/src/lib/notifications/notification-navigation";

export function createSystemMessageVariant(instanceId: string) {
  return function SystemMessageVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const router = useRouter();
    const [busy, setBusy] = useState(false);

    const onInvalidate = item?.onInvalidate;

    const markRead = useCallback(async () => {
      if (!item || item.read_at) return;
      setBusy(true);
      try {
        if (item.markAsRead) {
          await item.markAsRead(item.id);
        } else {
          await apiMarkRead(item.id);
        }
        onInvalidate?.();
      } finally {
        setBusy(false);
      }
    }, [item, onInvalidate]);

    const onPressCard = useCallback(async () => {
      if (!item) return;
      navigateFromNotificationPayload(router, item.type, item.data);
      await markRead();
    }, [item, markRead, router]);

    if (!item) return null;

    return (
      <MotionPressable
        style={notificationCardStateStyle(item.read_at)}
        onPress={() => void onPressCard()}
        disabled={busy}
      >
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <ReadBadge readAt={item.read_at} />
        <Text style={s.meta}>
          {formatNotificationTime(item.created_at)}
          {item.read_at ? " · مقروء" : busy ? " · …" : " · اضغط للتعليم كمقروء"}
        </Text>
        {busy ? <ActivityIndicator color={colors.grey} style={{ marginTop: 8 }} /> : null}
      </MotionPressable>
    );
  };
}
