import { apiAcceptFriend, apiRejectFriend } from "../api";
import { useMirror } from "../store";
import { formatNotificationTime, getNum } from "../utils";
import { colors } from "@/src/theme/colors";
import React, { useCallback, useState } from "react";
import { MotionPressable } from "@/src/components/motion";
import { ActivityIndicator, Text, View } from "react-native";
import { notificationCardStyles as s } from "./styles";

export function createFriendRequestVariant(instanceId: string) {
  return function FriendRequestVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const [busy, setBusy] = useState<"accept" | "reject" | null>(null);

    const fromUserId = getNum(item?.data ?? null, "fromUserId");
    const onInvalidate = item?.onInvalidate;

    const onAccept = useCallback(async () => {
      if (fromUserId == null) return;
      setBusy("accept");
      try {
        await apiAcceptFriend(fromUserId);
        onInvalidate?.();
      } finally {
        setBusy(null);
      }
    }, [fromUserId, onInvalidate]);

    const onReject = useCallback(async () => {
      if (fromUserId == null) return;
      setBusy("reject");
      try {
        await apiRejectFriend(fromUserId);
        onInvalidate?.();
      } finally {
        setBusy(null);
      }
    }, [fromUserId, onInvalidate]);

    if (!item) return null;

    return (
      <View style={s.card}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <Text style={s.meta}>{formatNotificationTime(item.created_at)}</Text>
        <View style={s.row}>
          <MotionPressable
            style={s.btn}
            onPress={() => void onAccept()}
            disabled={busy !== null || fromUserId == null}
          >
            {busy === "accept" ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={s.btnText}>Accept</Text>
            )}
          </MotionPressable>
          <MotionPressable
            style={[s.btn, s.btnSecondary]}
            onPress={() => void onReject()}
            disabled={busy !== null || fromUserId == null}
          >
            {busy === "reject" ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={s.btnText}>Reject</Text>
            )}
          </MotionPressable>
        </View>
      </View>
    );
  };
}
