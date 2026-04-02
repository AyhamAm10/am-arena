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
  return d.toLocaleTimeString("ar", {
    hour: "numeric",
    minute: "2-digit",
  });
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
              <Text style={styles.labelText}>نصيحة اليوم</Text>
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

  const displayTitle = channelTitle || "محادثة القناة";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="رجوع"
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
          accessibilityLabel="الإشعارات"
        >
          <Icon name="notifications-none" size={24} color={chatTheme.white} />
        </TouchableOpacity>
      </View>

      {isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {errorMessage ?? "تعذّر تحميل الرسائل."}
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={styles.retryText}>اضغط لإعادة المحاولة</Text>
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
                  لا رسائل بعد.
                </Text>
              </View>
            )
          }
        />
      )}

      <View style={styles.footer}>
        <Icon name="lock-outline" size={16} color={chatTheme.muted} />
        <Text style={styles.footerText}>المشرفون فقط يمكنهم الإرسال</Text>
      </View>
    </SafeAreaView>
  );
}
