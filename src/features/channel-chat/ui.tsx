import type { ChannelMessage } from "@/src/api/types/chat.types";
import { FadeInListRow } from "@/src/components/motion";
import { colors, colors_V2 } from "@/src/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePullToRefresh } from "@/src/hooks/usePullToRefresh";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SentIcon, ChampionIcon, FavouriteIcon, Delete02Icon, MessageEdit01Icon } from "@hugeicons/core-free-icons";
import { TextInput } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useMirror } from "./store";
import { chatTheme, styles } from "./styles";
import { useHeaderUser } from "@/src/hooks/auth/useHeaderUser";
import { useQueryClient } from "@tanstack/react-query";
import { createChannelMessage, updateChannelMessage, deleteChannelMessage } from "@/src/api/services/chat.api";
// TextInput already imported above with Keyboard helpers

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("ar", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function Ui() {
  const params = useLocalSearchParams<{ messageId?: string }>();
  const router = useRouter();
  const messages = useMirror("messages");
  const channelTitle = useMirror("channelTitle");
  const isLoading = useMirror("isLoading");
  const isError = useMirror("isError");
  const errorMessage = useMirror("errorMessage");
  const onRefresh = useMirror("onRefresh");
  const allowUserMessages = useMirror("allowUserMessages");
  const channelId = useMirror("channelId");
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingDraft, setEditingDraft] = useState("");
  
  const headerUser = useHeaderUser();
  const { refreshing, onRefresh: onRefreshWrapped } = usePullToRefresh(() =>
    onRefresh ? onRefresh() : Promise.resolve()
  );

  const flatListRef = useRef<FlatList<ChannelMessage>>(null);
  const didJumpRef = useRef<string | null>(null);
  const focusMessageId = Number(params.messageId ?? 0);
  const focusMessageIdStr = Number.isFinite(focusMessageId) && focusMessageId > 0 ? String(focusMessageId) : null;

  useEffect(() => {
    if (!focusMessageIdStr) return;
    if (!flatListRef.current) return;
    if (!messages.length) return;
    if (didJumpRef.current === focusMessageIdStr) return;

    const index = messages.findIndex((m) => Number(m.id) === focusMessageId);
    if (index < 0) {
      // Target message missing/deleted: preserve existing scroll behavior (scrollToEnd).
      didJumpRef.current = focusMessageIdStr;
      flatListRef.current?.scrollToEnd({ animated: false });
      return;
    }

    didJumpRef.current = focusMessageIdStr;
    flatListRef.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0.5,
    });
  }, [focusMessageId, focusMessageIdStr, messages]);

  const onBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/channels");
  }, [router]);

  const keyExtractor = useCallback((item: ChannelMessage) => String(item.id), []);

  const renderItem = useCallback(
    ({ item, index }: { item: ChannelMessage; index: number }) => {
      const currentUser = headerUser.user;
      const currentUserId = currentUser?.id ?? null;
      const isMine = currentUserId != null && Number(currentUserId) === Number(item.sender_id);
      const isAdmin = String(item.sender_name || "").toLowerCase().includes("official") || String(item.sender_name || "").toLowerCase().includes("am_arena");
      const openMenu = () => setMenuFor(item.id === menuFor ? null : item.id);

      return (
        <FadeInListRow index={index}>
          <View style={[styles.rowWrap, isMine ? styles.rowRight : styles.rowLeft]}>
            {!isMine ? (
              <View style={styles.avatarWrap}>
                {item.sender_avatar_url ? (
                  <Image source={{ uri: item.sender_avatar_url }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>{(item.sender_name || "?").charAt(0)}</Text>
                  </View>
                )}
              </View>
            ) : null}

            <View style={[styles.bubbleContainer, isMine ? styles.bubbleRightContainer : styles.bubbleLeftContainer]}>
              {!isMine ? <Text style={styles.senderName}>{item.sender_name}</Text> : null}
              <TouchableOpacity activeOpacity={0.85} onLongPress={openMenu} onPress={() => setMenuFor(null)}>
                  <View style={[styles.bubble, isMine ? styles.bubbleMine : isAdmin ? styles.bubbleAdmin : styles.bubbleOther]}>
                    {editingMessageId === item.id ? (
                      <View>
                        <TextInput
                          value={editingDraft}
                          onChangeText={setEditingDraft}
                          style={styles.editInput}
                          multiline
                        />
                        <View style={styles.editActions}>
                          <TouchableOpacity onPress={() => { setEditingMessageId(null); setEditingDraft(""); }}>
                            <Text style={[styles.editActionText, { fontWeight: "700", color: colors_V2.card }]}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={async () => {
                            try {
                              const trimmed = (editingDraft || "").trim();
                              if (!trimmed) return;
                              await updateChannelMessage(channelId, item.id, { content: trimmed });
                              setEditingMessageId(null);
                              setEditingDraft("");
                              void queryClient.invalidateQueries({ queryKey: ["chat", "messages", channelId] });
                            } catch (e) {
                              console.warn("edit message failed", e);
                            }
                          }}>
                            <Text style={[styles.editActionText, { fontWeight: "700", color: colors_V2.card }]}>Save</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <>
                        <Text style={[styles.bubbleText, isMine ? styles.bubbleTextMine : styles.bubbleTextOther]}>{item.content}</Text>
                        <Text style={[styles.bubbleTimestamp, { color: colors_V2.card }]}>{formatTime(item.created_at)}</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
                {menuFor === item.id ? (
                  <View style={styles.actionMenu}>
                    {isMine ? (
                      <TouchableOpacity onPress={() => { setEditingMessageId(item.id); setEditingDraft(item.content); setMenuFor(null); }} style={styles.actionBtn}>
                        <HugeiconsIcon icon={MessageEdit01Icon} size={16} color={chatTheme.white} />
                        <Text style={styles.actionText}>Edit</Text>
                      </TouchableOpacity>
                    ) : null}
                    {(isMine || headerUser.user?.role === "admin" || headerUser.user?.role === "super_admin") ? (
                      <TouchableOpacity onPress={async () => {
                        try {
                          await deleteChannelMessage(channelId, item.id);
                          setMenuFor(null);
                          void queryClient.invalidateQueries({ queryKey: ["chat", "messages", channelId] });
                        } catch (e) {
                          console.warn("delete message failed", e);
                        }
                      }} style={styles.actionBtn}>
                        <HugeiconsIcon icon={Delete02Icon} size={16} color={chatTheme.white} />
                        <Text style={styles.actionText}>Delete</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : null}
            </View>

            {isMine ? (
              <View style={styles.avatarWrapRight}>
                {headerUser.avatarUri ? (
                  <Image source={{ uri: headerUser.avatarUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarCircleMine}>
                    <Text style={styles.avatarInitialMine}>You</Text>
                  </View>
                )}
              </View>
            ) : null}
          </View>
        </FadeInListRow>
      );
    },
    [headerUser.user?.id, menuFor, editingMessageId, editingDraft, channelId, queryClient]
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
          <HugeiconsIcon icon={ChampionIcon} size={22} color={chatTheme.cyan} strokeWidth={1.6} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {displayTitle}
          </Text>
        </View>
        
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
          contentContainerStyle={[styles.listContent]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={() => undefined}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              if (focusMessageIdStr) {
                if (didJumpRef.current === focusMessageIdStr) return;
                // Let the effect below handle the jump; this prevents conflicting scrollToEnd.
                return;
              }
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefreshWrapped}
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

      <KeyboardStickyView offset={{ opened: 8, closed: 0 }}>
        <View style={styles.footer}>
          {allowUserMessages ? (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="اكتب رسالة..."
                placeholderTextColor={chatTheme.muted}
                value={draft}
                onChangeText={setDraft}
              />
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={async () => {
                  try {
                    const trimmed = (draft || "").trim();
                    if (!trimmed) return;
                    await createChannelMessage(channelId, { content: trimmed });
                    setDraft("");
                    void queryClient.invalidateQueries({ queryKey: ["chat", "messages", channelId] });
                  } catch (e) {
                    console.warn("send message failed", e);
                  }
                }}
              >
                <HugeiconsIcon icon={SentIcon} size={20} color={chatTheme.cyan} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <HugeiconsIcon icon={FavouriteIcon} size={16} color={chatTheme.muted} strokeWidth={1.6} />
              <Text style={styles.footerText}>المشرفون فقط يمكنهم الإرسال</Text>
            </>
          )}
        </View>
      </KeyboardStickyView>
    </SafeAreaView>
  );
}
