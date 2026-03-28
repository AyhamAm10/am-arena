import { AppLayout } from "@/src/components/layout";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useMirror } from "./store";
import { styles } from "./styles";

export function Ui() {
  const channels = useMirror("channels");
  const isLoadingChannels = useMirror("isLoadingChannels");
  const onRefreshChannelsPress = useMirror("onRefreshChannelsPress");

  return (
    <AppLayout>
      <View style={styles.placeholder}>
        <Text style={styles.text}>Channels</Text>
        <Text style={styles.hint}>
          {isLoadingChannels
            ? "Loading…"
            : channels === undefined
              ? "No channel API wired yet (OpenAPI gap)."
              : `${channels.length} channel(s)`}
        </Text>
        <Pressable onPress={onRefreshChannelsPress}>
          <Text style={styles.hint}>Tap to refresh (no-op until API exists)</Text>
        </Pressable>
      </View>
    </AppLayout>
  );
}
