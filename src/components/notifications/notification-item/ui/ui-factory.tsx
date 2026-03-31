import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useMirror } from "../store";
import { createAchievementUnlockedVariant } from "./achievement-unlocked-variant";
import { createChatMessageVariant } from "./chat-message-variant";
import { createFriendRequestVariant } from "./friend-request-variant";
import { createManualVariant } from "./manual-variant";
import { createSystemMessageVariant } from "./system-message-variant";
import { createTournamentCreatedVariant } from "./tournament-created-variant";
import { notificationCardStyles as s } from "./styles";

type Props = {
  instanceId: string;
};

export default function UiFactory({ instanceId }: Props) {
  const byId = useMirror("byId");
  const item = byId[instanceId];

  const Body = useMemo(() => {
    switch (item?.type) {
      case "FRIEND_REQUEST":
        return createFriendRequestVariant(instanceId);
      case "CHAT_MESSAGE":
        return createChatMessageVariant(instanceId);
      case "TOURNAMENT_CREATED":
        return createTournamentCreatedVariant(instanceId);
      case "ACHIEVEMENT_UNLOCKED":
        return createAchievementUnlockedVariant(instanceId);
      case "SYSTEM_MESSAGE":
        return createSystemMessageVariant(instanceId);
      case "MANUAL":
        return createManualVariant(instanceId);
      default:
        return null;
    }
  }, [instanceId, item?.type]);

  if (!item) {
    return null;
  }

  if (!Body) {
    return (
      <View style={s.card}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.body}>{item.body}</Text>
      </View>
    );
  }

  return <Body />;
}
