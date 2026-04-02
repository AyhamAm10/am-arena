import { useMirror } from "../store";
import { formatNotificationTime } from "../utils";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { MotionPressable } from "@/src/components/motion";
import { Text } from "react-native";
import { notificationCardStyles as s } from "./styles";

export function createAchievementUnlockedVariant(instanceId: string) {
  return function AchievementUnlockedVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const router = useRouter();

    const go = useCallback(() => {
      router.push("/profile/achievements" as never);
    }, [router]);

    if (!item) return null;

    return (
      <MotionPressable style={s.card} onPress={go}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <Text style={s.meta}>{formatNotificationTime(item.created_at)} · الإنجازات</Text>
      </MotionPressable>
    );
  };
}
