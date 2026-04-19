import { notificationCardStyles as s } from "./styles";
import React from "react";
import { Text, View } from "react-native";

export function notificationCardStateStyle(readAt: string | null) {
  return [s.card, readAt ? s.cardRead : s.cardUnread];
}

export function ReadBadge({ readAt }: { readAt: string | null }) {
  const unread = !readAt;
  return (
    <View style={[s.readBadge, unread && s.readBadgeUnread]}>
      <Text style={[s.readBadgeText, unread && s.readBadgeTextUnread]}>
        {unread ? "غير مقروء" : "مقروء"}
      </Text>
    </View>
  );
}
