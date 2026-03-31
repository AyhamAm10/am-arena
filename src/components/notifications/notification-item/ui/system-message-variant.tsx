import { apiMarkRead } from "../api";
import { useMirror } from "../store";
import { formatNotificationTime } from "../utils";
import React, { useCallback, useState } from "react";
import { MotionPressable } from "@/src/components/motion";
import { ActivityIndicator, Text } from "react-native";
import { notificationCardStyles as s } from "./styles";
import { colors } from "@/src/theme/colors";

export function createSystemMessageVariant(instanceId: string) {
  return function SystemMessageVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const [busy, setBusy] = useState(false);

    const onInvalidate = item?.onInvalidate;

    const markRead = useCallback(async () => {
      if (!item || item.read_at) return;
      setBusy(true);
      try {
        await apiMarkRead(item.id);
        onInvalidate?.();
      } finally {
        setBusy(false);
      }
    }, [item, onInvalidate]);

    if (!item) return null;

    return (
      <MotionPressable
        style={s.card}
        onPress={() => void markRead()}
        disabled={busy || !!item.read_at}
      >
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <Text style={s.meta}>
          {formatNotificationTime(item.created_at)}
          {item.read_at ? " · Read" : busy ? " · …" : " · Tap to mark read"}
        </Text>
        {busy ? <ActivityIndicator color={colors.grey} style={{ marginTop: 8 }} /> : null}
      </MotionPressable>
    );
  };
}
