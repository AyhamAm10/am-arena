import { NotificationItem } from "@/src/components/notifications/notification-item";
import type { NotificationItemState } from "@/src/components/notifications/notification-item";
import { colors } from "@/src/theme/colors";
import { useFetchNotifications } from "@/src/hooks/api/notification/useFetchNotifications";
import { useAuthStore } from "@/src/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { rtlMirrorIconStyle } from "@/src/lib/rtl";
import Icon from "react-native-vector-icons/MaterialIcons";
import type { UserNotificationDto } from "@/src/api/types/notification.types";
import { FadeInListRow, ScreenEnterTransition } from "@/src/components/motion";
import { markNotificationRead } from "@/src/api/services/notification.api";

const LIST_QUERY = { page: 1, limit: 50 } as const;

function toItemState(
  n: UserNotificationDto,
  onInvalidate: () => void
): NotificationItemState {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    data: n.data,
    read_at: n.read_at,
    created_at: n.created_at,
    onInvalidate,
    markAsRead: async (notificationId: number) => {
      await markNotificationRead(notificationId);
      onInvalidate();
    },
  };
}

export default function NotificationsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["notification", "list"] });
  }, [queryClient]);

  const listQuery = useFetchNotifications(LIST_QUERY, {
    enabled: !!accessToken,
  });

  const items = listQuery.data?.data ?? [];

  const byId = useMemo(() => {
    const m: Record<string, NotificationItemState> = {};
    items.forEach((n) => {
      m[String(n.id)] = toItemState(n, invalidate);
    });
    return m;
  }, [items, invalidate]);

  const onBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, [router]);

  return (
    <ScreenEnterTransition from="top" style={{ flex: 1 }}>
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.headerBtn} accessibilityLabel="رجوع">
          <Icon
            name="arrow-back"
            size={24}
            color={colors.white}
            style={rtlMirrorIconStyle}
          />
        </Pressable>
        <Text style={styles.headerTitle}>الإشعارات</Text>
        <View style={styles.headerBtn} />
      </View>

      {listQuery.isLoading && !items.length ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primaryPurple} />
        </View>
      ) : listQuery.isError ? (
        <View style={styles.center}>
          <Text style={styles.err}>{listQuery.error?.message ?? "فشل التحميل"}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(n) => String(n.id)}
          contentContainerStyle={styles.list}
          refreshing={listQuery.isFetching}
          onRefresh={() => void listQuery.refetch()}
          renderItem={({ item, index }) => (
            <FadeInListRow index={index}>
              <NotificationItem instanceId={String(item.id)} byId={byId} />
            </FadeInListRow>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>لا إشعارات بعد.</Text>
          }
        />
      )}
    </SafeAreaView>
    </ScreenEnterTransition>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.screenBackground },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBackground2,
  },
  headerBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { color: colors.white, fontSize: 17, fontWeight: "700" },
  list: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  err: { color: colors.error, padding: 16 },
  empty: { color: colors.grey, textAlign: "center", marginTop: 24 },
});
