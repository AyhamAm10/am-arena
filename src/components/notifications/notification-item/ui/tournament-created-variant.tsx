import { useMirror } from "../store";
import { formatNotificationTime, getNum } from "../utils";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { MotionPressable } from "@/src/components/motion";
import { Text } from "react-native";
import { notificationCardStyles as s } from "./styles";

export function createTournamentCreatedVariant(instanceId: string) {
  return function TournamentCreatedVariant() {
    const byId = useMirror("byId");
    const item = byId[instanceId];
    const router = useRouter();
    const tournamentId = getNum(item?.data ?? null, "tournamentId");

    const go = useCallback(() => {
      if (tournamentId == null) return;
      router.push(`/tournament/${tournamentId}` as never);
    }, [router, tournamentId]);

    if (!item) return null;

    return (
      <MotionPressable style={s.card} onPress={go} disabled={tournamentId == null}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
        <Text style={s.meta}>{formatNotificationTime(item.created_at)} · View tournament</Text>
      </MotionPressable>
    );
  };
}
