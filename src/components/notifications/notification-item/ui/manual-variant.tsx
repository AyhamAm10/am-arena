import { useMirror } from "../store";
import { formatNotificationTime, getStr, isSafeInternalRoute } from "../utils";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { MotionPressable } from "@/src/components/motion";
import { Text, View } from "react-native";
import { notificationCardStyles as s } from "./styles";
import { ReadBadge, notificationCardStateStyle } from "./common";
import { navigateFromNotificationPayload } from "@/src/lib/notifications/notification-navigation";

export function createManualVariant(instanceId: string) {
  return function ManualVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const router = useRouter();
    const route = getStr(item?.data ?? null, "route");
    const actionLabel =
      getStr(item?.data ?? null, "actionLabel") ||
      getStr(item?.data ?? null, "action_label") ||
      "فتح";

    const go = useCallback(async () => {
      if (!item) return;
      const didNavigate = navigateFromNotificationPayload(router, item.type, item.data);
      if (!didNavigate) return;
      if (!item.read_at && item.markAsRead) {
        await item.markAsRead(item.id);
      }
    }, [item, router]);

    if (!item) return null;

    const canNavigate = isSafeInternalRoute(route);

    return (
      <View style={notificationCardStateStyle(item.read_at)}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <ReadBadge readAt={item.read_at} />
        <Text style={s.meta}>{formatNotificationTime(item.created_at)}</Text>
        {canNavigate ? (
          <MotionPressable
            style={[s.btn, { marginTop: 12, alignSelf: "flex-start" }]}
            onPress={() => void go()}
          >
            <Text style={s.btnText}>{actionLabel}</Text>
          </MotionPressable>
        ) : null}
      </View>
    );
  };
}
