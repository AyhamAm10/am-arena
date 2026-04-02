import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import type { UserPublicSummary } from "@/src/api/types/user.types";
import { AppLayout } from "@/src/components/layout";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import type { FriendListItem } from "./friendList.types";
import { useMirror } from "./store";
import { friendsColors, styles } from "./styles";
import { requesterIdFromIncomingRow } from "./utils";

export function Ui() {
  const router = useRouter();
  const activeTab = useMirror("activeTab");
  const setActiveTab = useMirror("setActiveTab");
  const searchQuery = useMirror("searchQuery");
  const setSearchQuery = useMirror("setSearchQuery");
  const sectionTitle = useMirror("sectionTitle");
  const toggleSort = useMirror("toggleSort");

  const friendsListItems = useMirror("friendsListItems");
  const requestsListItems = useMirror("requestsListItems");
  const publicListItems = useMirror("publicListItems");
  const totalFriends = useMirror("totalFriends");
  const totalPublic = useMirror("totalPublic");
  const totalRequests = useMirror("totalRequests");

  const isLoadingFriends = useMirror("isLoadingFriends");
  const isLoadingRequests = useMirror("isLoadingRequests");
  const isLoadingPublic = useMirror("isLoadingPublic");
  const isFetchingMoreFriends = useMirror("isFetchingMoreFriends");
  const isFetchingMoreRequests = useMirror("isFetchingMoreRequests");
  const isFetchingMorePublic = useMirror("isFetchingMorePublic");
  const hasNextFriends = useMirror("hasNextFriends");
  const hasNextRequests = useMirror("hasNextRequests");
  const hasNextPublic = useMirror("hasNextPublic");
  const fetchMoreFriends = useMirror("fetchMoreFriends");
  const fetchMoreRequests = useMirror("fetchMoreRequests");
  const fetchMorePublic = useMirror("fetchMorePublic");
  const listError = useMirror("listError");

  const onCancelRequest = useMirror("onCancelRequest");
  const onCancelOutgoingPending = useMirror("onCancelOutgoingPending");
  const onAddRequest = useMirror("onAddRequest");
  const onAcceptRequest = useMirror("onAcceptRequest");
  const onRejectRequest = useMirror("onRejectRequest");
  const busyFriendId = useMirror("busyFriendId");
  const currentUserId = useMirror("currentUserId");
  const pendingOutgoingUserIds = useMirror("pendingOutgoingUserIds");
  const suggestedUsers = useMirror("suggestedUsers");
  const isLoadingSuggested = useMirror("isLoadingSuggested");

  const listData = useMemo((): (FriendListItem | UserPublicSummary)[] => {
    if (activeTab === "friends") return friendsListItems;
    if (activeTab === "requests") return requestsListItems;
    return publicListItems;
  }, [activeTab, friendsListItems, requestsListItems, publicListItems]);

  const sectionCount =
    activeTab === "friends"
      ? totalFriends
      : activeTab === "public"
        ? totalPublic
        : totalRequests;

  const isLoading =
    activeTab === "friends"
      ? isLoadingFriends
      : activeTab === "public"
        ? isLoadingPublic
        : isLoadingRequests;

  const isFetchingMore =
    activeTab === "friends"
      ? isFetchingMoreFriends
      : activeTab === "public"
        ? isFetchingMorePublic
        : isFetchingMoreRequests;

  const hasNext =
    activeTab === "friends"
      ? hasNextFriends
      : activeTab === "public"
        ? hasNextPublic
        : hasNextRequests;

  const fetchMore =
    activeTab === "friends"
      ? fetchMoreFriends
      : activeTab === "public"
        ? fetchMorePublic
        : fetchMoreRequests;

  const onEndReached = useCallback(() => {
    if (!hasNext || isFetchingMore) return;
    void fetchMore();
  }, [hasNext, isFetchingMore, fetchMore]);

  const keyExtractor = useCallback(
    (item: FriendListItem | UserPublicSummary) => {
      if (activeTab === "public") {
        return `u-${(item as UserPublicSummary).id}`;
      }
      return `f-${(item as FriendListItem).user.id}`;
    },
    [activeTab]
  );

  const renderItem = useCallback(
    ({ item }: { item: FriendListItem | UserPublicSummary }) => {
      if (activeTab === "public") {
        const u = item as UserPublicSummary;
        const online = u.is_active;
        const uri = u.profile_picture_url
          ? formatImageUrl(u.profile_picture_url)
          : null;
        const busy = busyFriendId === u.id;
        const outgoingPending =
          u.friend_status === "pending" || pendingOutgoingUserIds.includes(u.id);
        const isFriend = u.friend_status === "accepted";

        const actionLabel = isFriend
          ? "إزالة الصديق"
          : outgoingPending
            ? "إلغاء الطلب"
            : "إضافة صديق";
        const actionHandler = isFriend
          ? () => void onCancelRequest(u.id)
          : outgoingPending
            ? () => void onCancelOutgoingPending(u.id)
            : () => void onAddRequest(u.id);

        return (
          <View style={styles.card}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              onPress={() => router.push(`/profile/${u.id}`)}
            >
              <View style={styles.avatarWrap}>
                {uri ? (
                  <Image source={{ uri }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatar} />
                )}
                <View
                  style={[
                    styles.statusDot,
                    online ? styles.statusOnline : styles.statusOffline,
                  ]}
                />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.gamerName}>{u.gamer_name}</Text>
                <Text
                  style={[
                    styles.statusText,
                    online ? styles.statusOnlineText : styles.statusOfflineText,
                  ]}
                >
                  {online ? "متصل" : "غير متصل"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, busy && styles.actionBtnDisabled]}
              onPress={actionHandler}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color={friendsColors.white} size="small" />
              ) : (
                <Text style={styles.actionBtnText}>{actionLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      }

      const fi = item as FriendListItem;
      const u = fi.user;
      const online = u.is_active;
      const uri = u.profile_picture_url
        ? formatImageUrl(u.profile_picture_url)
        : null;
      const busy = busyFriendId === u.id;

      if (activeTab === "friends") {
        return (
          <View style={styles.card}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              onPress={() => router.push(`/profile/${u.id}`)}
            >
              <View style={styles.avatarWrap}>
                {uri ? (
                  <Image source={{ uri }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatar} />
                )}
                <View
                  style={[
                    styles.statusDot,
                    online ? styles.statusOnline : styles.statusOffline,
                  ]}
                />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.gamerName}>{u.gamer_name}</Text>
                <Text
                  style={[
                    styles.statusText,
                    online ? styles.statusOnlineText : styles.statusOfflineText,
                  ]}
                >
                  {online ? "متصل" : "غير متصل"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, busy && styles.actionBtnDisabled]}
              onPress={() => void onCancelRequest(u.id)}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color={friendsColors.white} size="small" />
              ) : (
                <Text style={styles.actionBtnText}>إزالة الصديق</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      }

      const requesterId =
        currentUserId != null
          ? requesterIdFromIncomingRow(fi.row, currentUserId)
          : null;

      return (
        <View style={styles.card}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            onPress={() => router.push(`/profile/${u.id}`)}
          >
            <View style={styles.avatarWrap}>
              {uri ? (
                <Image source={{ uri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar} />
              )}
              <View
                style={[
                  styles.statusDot,
                  online ? styles.statusOnline : styles.statusOffline,
                ]}
              />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.gamerName}>{u.gamer_name}</Text>
              <Text
                style={[
                  styles.statusText,
                  online ? styles.statusOnlineText : styles.statusOfflineText,
                ]}
              >
                {online ? "متصل" : "غير متصل"}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.requestActions}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.acceptBtn,
                busy && styles.actionBtnDisabled,
              ]}
              onPress={() => {
                if (requesterId != null) void onAcceptRequest(requesterId);
              }}
              disabled={busy || requesterId == null}
            >
              {busy ? (
                <ActivityIndicator color={friendsColors.white} size="small" />
              ) : (
                <Text style={styles.actionBtnText}>قبول</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.rejectBtn,
                busy && styles.actionBtnDisabled,
              ]}
              onPress={() => {
                if (requesterId != null) void onRejectRequest(requesterId);
              }}
              disabled={busy || requesterId == null}
            >
              {busy ? (
                <ActivityIndicator color={friendsColors.white} size="small" />
              ) : (
                <Text style={styles.actionBtnText}>رفض</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [
      activeTab,
      busyFriendId,
      currentUserId,
      onAcceptRequest,
      onAddRequest,
      onCancelOutgoingPending,
      onCancelRequest,
      onRejectRequest,
      pendingOutgoingUserIds,
      router,
    ]
  );

  const ListHeader = (
    <>
      <View style={styles.searchWrap}>
        <View style={styles.searchRow}>
          <Icon
            name="search"
            size={22}
            color={friendsColors.labelMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن الأصدقاء…"
            placeholderTextColor={friendsColors.labelMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.tabBar}>
        {(
          [
            ["friends", "أصدقائي"],
            ["public", "اكتشف"],
            ["requests", "الطلبات"],
          ] as const
        ).map(([key, label]) => {
          const on = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              style={styles.tabBtn}
              onPress={() => setActiveTab(key)}
            >
              <Text style={[styles.tabLabel, on && styles.tabLabelActive]}>
                {label}
              </Text>
              {on ? <View style={styles.tabUnderline} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>
          {sectionTitle} ({sectionCount})
        </Text>
        <TouchableOpacity style={styles.filterBtn} onPress={toggleSort}>
          <Icon name="filter-list" size={22} color={friendsColors.labelMuted} />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderSuggestedSlot = useCallback(
    (u: UserPublicSummary | undefined, key: string) => {
      if (!u) {
        return (
          <View key={key} style={styles.suggestedCard}>
            <View style={styles.suggestedSilhouette} />
            <View style={styles.suggestedBar} />
          </View>
        );
      }
      const uri = u.profile_picture_url
        ? formatImageUrl(u.profile_picture_url)
        : null;
      const busy = busyFriendId === u.id;
      const outgoingPending = pendingOutgoingUserIds.includes(u.id);
      return (
        <View key={key} style={styles.suggestedCard}>
          {uri ? (
            <Image source={{ uri }} style={styles.suggestedSilhouette} />
          ) : (
            <View style={styles.suggestedSilhouette} />
          )}
          <Text
            style={styles.suggestedGamerName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {u.gamer_name}
          </Text>
          <TouchableOpacity
            style={[styles.actionBtn, busy && styles.actionBtnDisabled]}
            onPress={() =>
              void (outgoingPending
                ? onCancelOutgoingPending(u.id)
                : onAddRequest(u.id))
            }
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color={friendsColors.white} size="small" />
            ) : (
              <Text style={styles.actionBtnText}>
                {outgoingPending ? "إلغاء الطلب" : "إضافة صديق"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      );
    },
    [
      busyFriendId,
      onAddRequest,
      onCancelOutgoingPending,
      pendingOutgoingUserIds,
    ]
  );

  const ListFooter = (
    <>
      {isFetchingMore ? (
        <ActivityIndicator
          style={{ marginVertical: 16 }}
          color={friendsColors.tabActive}
        />
      ) : null}
      {activeTab === "public" ? (
        <>
          <Text style={styles.discoverHeader}>مقترحات لك</Text>
          {isLoadingSuggested && suggestedUsers.length === 0 ? (
            <ActivityIndicator
              style={{ marginVertical: 20 }}
              color={friendsColors.tabActive}
            />
          ) : (
            <View style={styles.suggestedRow}>
              {renderSuggestedSlot(suggestedUsers[0], "s0")}
              {renderSuggestedSlot(suggestedUsers[1], "s1")}
            </View>
          )}
        </>
      ) : null}
    </>
  );

  const empty = !isLoading && listData.length === 0;

  return (
    <AppLayout scrollable={false}>
      <FlatList
        style={styles.flex}
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerMessage}>
              <ActivityIndicator size="large" color={friendsColors.tabActive} />
            </View>
          ) : listError ? (
            <View style={styles.centerMessage}>
              <Text style={styles.errorText}>{listError}</Text>
            </View>
          ) : empty ? (
            <View style={styles.centerMessage}>
              <Text style={styles.mutedText}>لا نتائج.</Text>
            </View>
          ) : null
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.35}
        contentContainerStyle={
          listData.length === 0 && !isLoading
            ? { flexGrow: 1 }
            : { paddingBottom: 24 }
        }
      />
    </AppLayout>
  );
}
