import { apiAcceptFriend, apiRejectFriend } from "../api";
import { useMirror } from "../store";
import { formatNotificationTime, getNum, getStr } from "../utils";
import { colors } from "@/src/theme/colors";
import React, { useCallback, useState } from "react";
import { MotionPressable } from "@/src/components/motion";
import { ActivityIndicator, Text, View } from "react-native";
import { notificationCardStyles as s } from "./styles";
import { ReadBadge, notificationCardStateStyle } from "./common";
import { navigateFromNotificationPayload } from "@/src/lib/notifications/notification-navigation";
import { useRouter } from "expo-router";

export function createFriendRequestVariant(instanceId: string) {
  return function FriendRequestVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const router = useRouter();
    const [busy, setBusy] = useState<"accept" | "reject" | null>(null);

    const fromUserId = getNum(item?.data ?? null, "fromUserId");
    const status = (getStr(item?.data ?? null, "status") || "pending").toLowerCase();
    const onInvalidate = item?.onInvalidate;
    const markAsRead = item?.markAsRead;

    const onAccept = useCallback(async () => {
      if (fromUserId == null) return;
      setBusy("accept");
      try {
        await apiAcceptFriend(fromUserId);
        if (item && !item.read_at && markAsRead) {
          await markAsRead(item.id);
        }
        onInvalidate?.();
      } finally {
        setBusy(null);
      }
    }, [fromUserId, item, markAsRead, onInvalidate]);

    const onReject = useCallback(async () => {
      if (fromUserId == null) return;
      setBusy("reject");
      try {
        await apiRejectFriend(fromUserId);
        if (item && !item.read_at && markAsRead) {
          await markAsRead(item.id);
        }
        onInvalidate?.();
      } finally {
        setBusy(null);
      }
    }, [fromUserId, item, markAsRead, onInvalidate]);

    if (!item) return null;

    const onPressCard = async () => {
      if (!item) return;
      navigateFromNotificationPayload(router, item.type, item.data);
      if (!item.read_at && markAsRead) {
        await markAsRead(item.id);
      }
    };

    if (status === "pending") {
      return (
        <View style={notificationCardStateStyle(item.read_at)}>
          <MotionPressable onPress={() => void onPressCard()}>
            <Text style={s.title}>{item.title}</Text>
            <Text style={s.body}>{item.body}</Text>
            <ReadBadge readAt={item.read_at} />
            <Text style={s.meta}>{formatNotificationTime(item.created_at)}</Text>
          </MotionPressable>
          <View style={s.row}>
            <MotionPressable
              style={s.btn}
              onPress={() => void onAccept()}
              disabled={busy !== null || fromUserId == null}
            >
              {busy === "accept" ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={s.btnText}>قبول</Text>
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
                <Text style={s.btnText}>رفض</Text>
              )}
            </MotionPressable>
          </View>
        </View>
      );
    }

    return (
      <MotionPressable style={notificationCardStateStyle(item.read_at)} onPress={() => void onPressCard()}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <ReadBadge readAt={item.read_at} />
        <Text style={s.meta}>{formatNotificationTime(item.created_at)}</Text>
      </MotionPressable>
    );
  };
}
