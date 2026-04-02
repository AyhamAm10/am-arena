import { useMirror } from "../store";
import { formatNotificationTime, getStr, isSafeInternalRoute } from "../utils";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { MotionPressable } from "@/src/components/motion";
import { Text, View } from "react-native";
import { notificationCardStyles as s } from "./styles";

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

    const go = useCallback(() => {
      if (!isSafeInternalRoute(route)) return;
      router.push(route as never);
    }, [route, router]);

    if (!item) return null;

    const canNavigate = isSafeInternalRoute(route);

    return (
      <View style={s.card}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <Text style={s.meta}>{formatNotificationTime(item.created_at)}</Text>
        {canNavigate ? (
          <MotionPressable
            style={[s.btn, { marginTop: 12, alignSelf: "flex-start" }]}
            onPress={go}
          >
            <Text style={s.btnText}>{actionLabel}</Text>
          </MotionPressable>
        ) : null}
      </View>
    );
  };
}
