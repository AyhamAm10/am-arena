import type { ChannelMessage } from "@/src/api/types/chat.types";
import { FadeInListRow } from "@/src/components/motion";
import { colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMirror } from "./store";
import { chatTheme, styles } from "./styles";

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  const min = m < 10 ? `0${m}` : String(m);
  return `${hour}:${min} ${ampm}`;
}

export function Ui() {
  const router = useRouter();
  const messages = useMirror("messages");
  const channelTitle = useMirror("channelTitle");
  const isLoading = useMirror("isLoading");
  const isError = useMirror("isError");
  const errorMessage = useMirror("errorMessage");
  const onRefresh = useMirror("onRefresh");

  const flatListRef = useRef<FlatList<ChannelMessage>>(null);

  const onBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/channels");
  }, [router]);

  const keyExtractor = useCallback((item: ChannelMessage) => String(item.id), []);

  const renderItem = useCallback(
    ({ item, index }: { item: ChannelMessage; index: number }) => {
      return (
        <FadeInListRow index={index}>
          <View style={styles.messageCard}>
            <View style={styles.labelRow}>
              <Icon name="lightbulb-outline" size={16} color={chatTheme.cyan} />
              <Text style={styles.labelText}>PRO TIP OF THE DAY</Text>
            </View>
            <Text style={styles.messageContent}>
              &quot;{item.content}&quot;
            </Text>
            <Text style={styles.timestamp}>{formatTime(item.created_at)}</Text>
          </View>
        </FadeInListRow>
      );
    },
    []
  );

  const displayTitle = channelTitle || "CHANNEL CHAT";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="sports-esports" size={24} color={chatTheme.cyan} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {displayTitle}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Icon name="notifications-none" size={24} color={chatTheme.white} />
        </TouchableOpacity>
      </View>

      {isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {errorMessage ?? "Could not load messages."}
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading && messages.length > 0}
              onRefresh={onRefresh}
              tintColor={colors.primaryPurple}
              colors={[colors.primaryPurple]}
            />
          }
          ListEmptyComponent={
            isLoading && messages.length === 0 ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color={chatTheme.cyan} />
              </View>
            ) : (
              <View style={styles.center}>
                <Text style={{ color: chatTheme.muted, textAlign: "center" }}>
                  No messages yet.
                </Text>
              </View>
            )
          }
        />
      )}

      <View style={styles.footer}>
        <Icon name="lock-outline" size={16} color={chatTheme.muted} />
        <Text style={styles.footerText}>ONLY ADMINS CAN SEND MESSAGES</Text>
      </View>
    </SafeAreaView>
  );
}
