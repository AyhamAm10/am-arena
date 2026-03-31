import type { ChannelPublic } from "@/src/api/types/chat.types";
import { FadeInListRow } from "@/src/components/motion";
import { colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMirror } from "./store";
import { channelsTheme, styles } from "./styles";

type FilterTab = "all" | "tournaments" | "private";

function iconForChat(c: ChannelPublic): string {
  const t = (c.title || "").toLowerCase();
  if (c.chat_type === "direct") return "person";
  if (c.tournament_id != null) return "sports-esports";
  if (!c.allow_user_messages) return "campaign";
  if (t.includes("support")) return "headset-mic";
  if (t.includes("strategy")) return "chat";
  return "tag";
}

function subtitleForChat(c: ChannelPublic): string {
  if (c.chat_type === "direct") {
    return c.member_count <= 1
      ? "Direct message"
      : `${c.member_count.toLocaleString()} participants`;
  }
  const n = c.member_count.toLocaleString();
  if (!c.allow_user_messages) return `Read only · ${n} members`;
  return `${n} members active now`;
}

function displayTitle(c: ChannelPublic): string {
  if (c.title?.trim()) return c.title.trim();
  return c.chat_type === "direct" ? `Direct #${c.id}` : `Channel #${c.id}`;
}

function filterChats(list: ChannelPublic[], tab: FilterTab): ChannelPublic[] {
  if (tab === "all") return list;
  if (tab === "tournaments")
    return list.filter((c) => c.chat_type === "channel");
  return list.filter((c) => c.chat_type === "direct");
}

function searchChats(list: ChannelPublic[], q: string): ChannelPublic[] {
  const s = q.trim().toLowerCase();
  if (!s) return list;
  return list.filter((c) => displayTitle(c).toLowerCase().includes(s));
}

export function Ui() {
  const router = useRouter();
  const channels = useMirror("channels");
  const isLoadingChannels = useMirror("isLoadingChannels");
  const isChannelsError = useMirror("isChannelsError");
  const channelsErrorMessage = useMirror("channelsErrorMessage");
  const onRefreshChannelsPress = useMirror("onRefreshChannelsPress");

  const [filterTab, setFilterTab] = useState<FilterTab>("tournaments");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const byTab = filterChats(channels, filterTab);
    return searchChats(byTab, searchQuery);
  }, [channels, filterTab, searchQuery]);

  const featuredId = useMemo(() => {
    const pool = filterChats(channels, "tournaments").filter(
      (c) => c.chat_type === "channel"
    );
    if (!pool.length) return null;
    return pool.reduce((a, b) =>
      a.member_count >= b.member_count ? a : b
    ).id;
  }, [channels]);

  const onBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, [router]);

  const keyExtractor = useCallback((item: ChannelPublic) => String(item.id), []);

  const renderItem = useCallback(
    ({ item, index }: { item: ChannelPublic; index: number }) => {
      const title = displayTitle(item);
      const icon = iconForChat(item);
      const subtitle = subtitleForChat(item);
      const featured =
        filterTab === "tournaments" && item.id === featuredId;
      const showOnline =
        item.chat_type === "channel" && item.allow_user_messages;

      return (
        <FadeInListRow index={index}>
          <Pressable
            style={[styles.card, featured && styles.cardFeatured]}
            onPress={() =>
              router.push({
                pathname: "/channel/[id]",
                params: { id: String(item.id), title },
              })
            }
          >
            <View
              style={[
                styles.iconCircle,
                featured && styles.iconCircleFeatured,
              ]}
            >
              <Icon
                name={icon}
                size={24}
                color={featured ? channelsTheme.white : channelsTheme.accent}
              />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {title}
                </Text>
                {featured ? (
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>ACTIVE</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.cardSubtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            </View>
            <View style={styles.cardMeta}>
              {showOnline ? <View style={styles.onlineDot} /> : null}
              <Icon
                name="chevron-right"
                size={22}
                color={channelsTheme.muted}
                style={styles.chevron}
              />
            </View>
          </Pressable>
        </FadeInListRow>
      );
    },
    [featuredId, filterTab, router]
  );

  const sectionIntro =
    filterTab === "private"
      ? "Your direct conversations"
      : filterTab === "tournaments"
        ? "Join the discussion in AM Arena tournaments"
        : "All tournament channels and private chats";

  const ListHeader = (
    <>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>ACTIVE CHANNELS</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
      </View>
      <Text style={styles.intro}>{sectionIntro}</Text>
    </>
  );

  const tabs = (
    <View style={styles.tabsRow}>
      {(
        [
          ["all", "All"],
          ["tournaments", "Tournaments"],
          ["private", "Private"],
        ] as const
      ).map(([key, label]) => {
        const on = filterTab === key;
        return (
          <TouchableOpacity
            key={key}
            style={styles.tabBtn}
            onPress={() => setFilterTab(key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, on && styles.tabLabelActive]}>
              {label}
            </Text>
            {on ? <View style={styles.tabUnderline} /> : <View style={{ height: 9 }} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" size={22} color={channelsTheme.accent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Channels</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => setSearchOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={searchOpen ? "Close search" : "Search"}
        >
          <Icon name="search" size={22} color={channelsTheme.accent} />
        </TouchableOpacity>
      </View>

      {searchOpen ? (
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Icon name="search" size={20} color={channelsTheme.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search channels…"
              placeholderTextColor={channelsTheme.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon name="close" size={20} color={channelsTheme.muted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}

      {tabs}

      {isChannelsError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {channelsErrorMessage ?? "Could not load chats."}
          </Text>
          <TouchableOpacity onPress={onRefreshChannelsPress}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingChannels && channels.length > 0}
              onRefresh={onRefreshChannelsPress}
              tintColor={colors.primaryPurple}
              colors={[colors.primaryPurple]}
            />
          }
          ListEmptyComponent={
            isLoadingChannels && channels.length === 0 ? (
              <View style={styles.center}>
                <ActivityIndicator size="large" color={channelsTheme.accent} />
              </View>
            ) : (
              <View style={styles.center}>
                <Text style={styles.mutedCenter}>
                  {searchQuery.trim()
                    ? "No channels match your search."
                    : "No chats in this tab yet."}
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}
