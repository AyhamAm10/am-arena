import type { PollOptionResponse, PollResponse } from "@/src/api/types/poll.types";
import type { MentionableUser, ReelCommentEntity, ReelEntity } from "@/src/api/types/reel.types";
import { searchTagUsers } from "@/src/api/services/reel.api";
import type { UserAccountDto } from "@/src/api/types/user.types";
import { NotificationsIcon } from "@/src/components/icons/figma/NotificationsIcon";
import {
  AnimatedBottomSheet,
  SheetDimmedBackdrop,
  SheetSlidePanel,
} from "@/src/components/motion";
import { useHeaderUser } from "@/src/hooks/auth/useHeaderUser";
import { flexRowRtl } from "@/src/lib/rtl";
import { formatCommentTimeAgo } from "@/src/lib/utils/comment-time-ago";
import { formatCompactCount } from "@/src/lib/utils/format-compact-count";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { formatReelVideoUrl } from "@/src/lib/utils/reel-video-url";
import { colors_V2 } from "@/src/theme/colors";
import { useIsFocused } from "@react-navigation/native";
import type { AVPlaybackStatus } from "expo-av";
import { Audio, ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  Share,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useMirror } from "./store";
import { styles } from "./styles";

const DESCRIPTION_CHAR_THRESHOLD = 96;
const DESCRIPTION_MAX_LINES = 2;
const LAYOUT_PAD_X = 16;

function FavActionIcon({ color = colors_V2.lavenderLight }: { color?: string }) {
  return (
    <Svg width={25} height={28} viewBox="0 0 25 28" fill="none">
      <Path
        d="M12.0103 22.75L10.6006 21.4861C8.96401 20.0116 7.611 18.7396 6.54156 17.6701C5.47211 16.6007 4.62142 15.6406 3.98947 14.7899C3.35753 13.9392 2.91598 13.1574 2.66482 12.4444C2.41366 11.7315 2.28809 11.0023 2.28809 10.2569C2.28809 8.7338 2.7985 7.46181 3.81934 6.44097C4.84017 5.42014 6.11216 4.90972 7.63531 4.90972C8.4779 4.90972 9.27998 5.08796 10.0416 5.44444C10.8031 5.80093 11.4594 6.30324 12.0103 6.95139C12.5612 6.30324 13.2175 5.80093 13.9791 5.44444C14.7406 5.08796 15.5427 4.90972 16.3853 4.90972C17.9085 4.90972 19.1804 5.42014 20.2013 6.44097C21.2221 7.46181 21.7325 8.7338 21.7325 10.2569C21.7325 11.0023 21.607 11.7315 21.3558 12.4444C21.1046 13.1574 20.6631 13.9392 20.0311 14.7899C19.3992 15.6406 18.5485 16.6007 17.4791 17.6701C16.4096 18.7396 15.0566 20.0116 13.42 21.4861L12.0103 22.75ZM12.0103 20.125C13.5659 18.7315 14.846 17.5365 15.8506 16.5399C16.8552 15.5434 17.6492 14.6765 18.2325 13.9392C18.8159 13.202 19.221 12.5457 19.4478 11.9705C19.6747 11.3953 19.7881 10.8241 19.7881 10.2569C19.7881 9.28472 19.464 8.47454 18.8159 7.82639C18.1677 7.17824 17.3575 6.85417 16.3853 6.85417C15.6237 6.85417 14.9189 7.06887 14.2707 7.49826C13.6226 7.92766 13.177 8.47454 12.9339 9.13889H11.0867C10.8436 8.47454 10.398 7.92766 9.74989 7.49826C9.10174 7.06887 8.39688 6.85417 7.63531 6.85417C6.66309 6.85417 5.8529 7.17824 5.20475 7.82639C4.5566 8.47454 4.23253 9.28472 4.23253 10.2569C4.23253 10.8241 4.34596 11.3953 4.57281 11.9705C4.79966 12.5457 5.20475 13.202 5.78809 13.9392C6.37142 14.6765 7.1654 15.5434 8.17003 16.5399C9.17466 17.5365 10.4548 18.7315 12.0103 20.125Z"
        fill={color}
      />
    </Svg>
  );
}

function CommentRailIcon({ color = colors_V2.skyBlue }: { color?: string }) {
  return (
    <Svg width={25} height={28} viewBox="0 0 25 28" fill="none">
      <Path
        d="M6.17697 15.9445H17.8436V14H6.17697V15.9445ZM6.17697 13.0278H17.8436V11.0833H6.17697V13.0278ZM6.17697 10.1111H17.8436V8.16667H6.17697V10.1111ZM21.7325 23.7222L17.8436 19.8333H4.23253C3.69781 19.8333 3.24005 19.6429 2.85927 19.2622C2.47848 18.8814 2.28809 18.4236 2.28809 17.8889V6.22223C2.28809 5.68751 2.47848 5.22975 2.85927 4.84896C3.24005 4.46818 3.69781 4.27778 4.23253 4.27778H19.7881C20.3228 4.27778 20.7806 4.46818 21.1614 4.84896C21.5421 5.22975 21.7325 5.68751 21.7325 6.22223V23.7222ZM4.23253 17.8889H18.67L19.7881 18.9826V6.22223H4.23253V17.8889Z"
        fill={color}
      />
    </Svg>
  );
}

function ShareRailIcon({ color = colors_V2.lilac }: { color?: string }) {
  return (
    <Svg width={25} height={28} viewBox="0 0 25 28" fill="none">
      <Path
        d="M16.8714 23.7222C16.0612 23.7222 15.3726 23.4387 14.8054 22.8715C14.2383 22.3044 13.9548 21.6157 13.9548 20.8056C13.9548 20.7083 13.9791 20.4815 14.0277 20.125L7.19781 16.1389C6.93855 16.382 6.63878 16.5723 6.2985 16.7101C5.95822 16.8478 5.59364 16.9167 5.20475 16.9167C4.39457 16.9167 3.70591 16.6331 3.13878 16.066C2.57165 15.4988 2.28809 14.8102 2.28809 14C2.28809 13.1898 2.57165 12.5012 3.13878 11.934C3.70591 11.3669 4.39457 11.0833 5.20475 11.0833C5.59364 11.0833 5.95822 11.1522 6.2985 11.2899C6.63878 11.4277 6.93855 11.6181 7.19781 11.8611L14.0277 7.87501C13.9953 7.76158 13.975 7.65221 13.9669 7.54688C13.9588 7.44156 13.9548 7.32408 13.9548 7.19445C13.9548 6.38427 14.2383 5.69561 14.8054 5.12848C15.3726 4.56135 16.0612 4.27778 16.8714 4.27778C17.6816 4.27778 18.3703 4.56135 18.9374 5.12848C19.5045 5.69561 19.7881 6.38427 19.7881 7.19445C19.7881 8.00464 19.5045 8.69329 18.9374 9.26042C18.3703 9.82755 17.6816 10.1111 16.8714 10.1111C16.4825 10.1111 16.1179 10.0423 15.7777 9.90452C15.4374 9.76679 15.1376 9.5764 14.8784 9.33334L8.0485 13.3195C8.08091 13.4329 8.10116 13.5423 8.10927 13.6476C8.11737 13.7529 8.12142 13.8704 8.12142 14C8.12142 14.1296 8.11737 14.2471 8.10927 14.3524C8.10116 14.4578 8.08091 14.5671 8.0485 14.6806L14.8784 18.6667C15.1376 18.4236 15.4374 18.2332 15.7777 18.0955C16.1179 17.9578 16.4825 17.8889 16.8714 17.8889C17.6816 17.8889 18.3703 18.1725 18.9374 18.7396C19.5045 19.3067 19.7881 19.9954 19.7881 20.8056C19.7881 21.6157 19.5045 22.3044 18.9374 22.8715C18.3703 23.4387 17.6816 23.7222 16.8714 23.7222ZM16.8714 21.7778C17.1469 21.7778 17.3778 21.6846 17.5641 21.4983C17.7505 21.3119 17.8436 21.081 17.8436 20.8056C17.8436 20.5301 17.7505 20.2992 17.5641 20.1129C17.3778 19.9265 17.1469 19.8333 16.8714 19.8333C16.596 19.8333 16.3651 19.9265 16.1787 20.1129C15.9924 20.2992 15.8992 20.5301 15.8992 20.8056C15.8992 21.081 15.9924 21.3119 16.1787 21.4983C16.3651 21.6846 16.596 21.7778 16.8714 21.7778ZM5.20475 14.9722C5.48022 14.9722 5.71112 14.8791 5.89746 14.6927C6.0838 14.5064 6.17697 14.2755 6.17697 14C6.17697 13.7245 6.0838 13.4936 5.89746 13.3073C5.71112 13.121 5.48022 13.0278 5.20475 13.0278C4.92929 13.0278 4.69839 13.121 4.51204 13.3073C4.3257 13.4936 4.23253 13.7245 4.23253 14C4.23253 14.2755 4.3257 14.5064 4.51204 14.6927C4.69839 14.8791 4.92929 14.9722 5.20475 14.9722ZM16.8714 8.16667C16.8714 8.16667 16.9403 8.16667 17.078 8.16667C17.2157 8.16667 17.3778 8.0735 17.5641 7.88716C17.7505 7.70082 17.8436 7.46991 17.8436 7.19445C17.8436 6.91899 17.7505 6.68809 17.5641 6.50174C17.3778 6.3154 17.1469 6.22223 16.8714 6.22223C16.596 6.22223 16.3651 6.3154 16.1787 6.50174C15.9924 6.68809 15.8992 6.91899 15.8992 7.19445C15.8992 7.46991 15.9924 7.70082 16.1787 7.88716C16.3651 8.0735 16.596 8.16667 16.8714 8.16667Z"
        fill={color}
      />
    </Svg>
  );
}

const COMMENT_DRAG_DISMISS_PX = 16;

function DraggableCommentPreview({
  reelIdStr,
  onOpen,
  dismissed,
  onDismiss,
  children,
}: {
  reelIdStr: string;
  onOpen: () => void;
  dismissed: boolean;
  onDismiss: (id: string) => void;
  children: React.ReactNode;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(onOpen)();
  });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd((e) => {
      const dist = Math.hypot(e.translationX, e.translationY);
      tx.value = withSpring(0);
      ty.value = withSpring(0);
      if (dist >= COMMENT_DRAG_DISMISS_PX) {
        runOnJS(onDismiss)(reelIdStr);
      }
    });

  const gesture = Gesture.Exclusive(tap, pan);

  if (dismissed) return null;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.commentPreviewDragHost, animStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}

function reelKey(item: ReelEntity, index: number) {
  const id = item.id;
  if (typeof id === "number" || typeof id === "string") {
    return String(id);
  }
  return `reel-${index}`;
}

function commentAuthor(user: ReelCommentEntity["user"]): string {
  if (!user || typeof user !== "object") return "مستخدم";
  const u = user as UserAccountDto;
  return (u.gamer_name || u.full_name || "").trim() || "مستخدم";
}

function commentAvatarUri(user: ReelCommentEntity["user"]): string | null {
  if (!user || typeof user !== "object") return null;
  const u = user as UserAccountDto;
  const raw = u.avatarUrl;
  if (!raw) return null;
  return formatImageUrl(raw);
}

function formatPollCountdown(expiresAt: string | null): string {
  if (!expiresAt) return "ينتهي قريباً";
  const end = new Date(expiresAt).getTime();
  if (Number.isNaN(end)) return "ينتهي قريباً";
  const diff = end - Date.now();
  if (diff <= 0) return "انتهى التصويت";
  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours > 0) return `ينتهي خلال ${hours}س ${mins}د`;
  return `ينتهي خلال ${mins}د`;
}

function hasUserVoted(poll: PollResponse): boolean {
  if (poll.current_user_vote_option_id != null) return true;
  return Array.isArray(poll.options)
    ? poll.options.some((option) => option.selected === true)
    : false;
}

function isOptionSelected(poll: PollResponse, option: PollOptionResponse): boolean {
  return option.selected === true || option.id === poll.current_user_vote_option_id;
}

function pollOptionTitle(option: PollOptionResponse): string {
  return option.label || option.user?.gamer_name || `خيار #${option.id}`;
}

function PollCard({
  poll,
  isVotingPoll,
  onVote,
}: {
  poll: PollResponse;
  isVotingPoll: boolean;
  onVote: (pollId: number, optionId: number) => void;
}) {
  const options = Array.isArray(poll.options) ? poll.options : [];
  const voted = hasUserVoted(poll);
  const disabled = voted || poll.closed || isVotingPoll;

  return (
    <View style={styles.pollCard}>
      <View style={[styles.pollHeaderRow, flexRowRtl]}>
        <View style={styles.pollHeaderMain}>
          <Text style={styles.pollTitle}>{poll.title}</Text>
          {poll.description ? <Text style={styles.pollDescription}>{poll.description}</Text> : null}
        </View>
        <View style={styles.liveBadgeWrap}>
          <Text style={styles.liveBadgeText}>{poll.closed ? "منتهي" : "مباشر"}</Text>
        </View>
      </View>

      <View style={styles.pollOptionsList}>
        {options.map((option) => {
          const selected = isOptionSelected(poll, option);
          const inactiveAfterVote = voted && !selected;
          return (
            <Pressable
              key={option.id}
              disabled={disabled}
              onPress={() => {
                if (disabled) return;
                onVote(poll.id, option.id);
              }}
              style={[
                styles.pollOptionCard,
                voted && selected && styles.pollOptionCardSelected,
                inactiveAfterVote && styles.pollOptionCardInactive,
              ]}
            >
              <View style={[styles.pollOptionRow, flexRowRtl]}>
                <View style={styles.pollOptionLabelWrap}>
                  <Text
                    style={[
                      styles.pollOptionLabel,
                      voted && selected && styles.pollOptionLabelSelected,
                      inactiveAfterVote && styles.pollOptionLabelInactive,
                    ]}
                  >
                    {pollOptionTitle(option)}
                  </Text>
                </View>
                <View style={styles.pollOptionRight}>
                  {selected ? (
                    <View style={styles.selectedDot} />
                  ) : (
                    <View
                      style={[styles.unselectedDot, inactiveAfterVote && styles.pollOptionDotInactive]}
                    />
                  )}
                  <Text
                    style={[
                      styles.pollOptionPercent,
                      voted && selected && styles.pollOptionPercentSelected,
                      inactiveAfterVote && styles.pollOptionPercentInactive,
                    ]}
                  >
                    {Math.round(option.percentage)}%
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
        {options.length === 0 ? (
          <View style={styles.pollOptionCard}>
            <Text style={styles.pollEmptyText}>لا توجد خيارات متاحة لهذا التصويت حالياً.</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.pollFooterRow, flexRowRtl]}>
        <Text style={styles.pollFooterText}>{formatPollCountdown(poll.expires_at)}</Text>
        {voted ? <Text style={styles.pollFooterLocked}>تم تسجيل صوتك</Text> : null}
      </View>
    </View>
  );
}

function VotingTab({
  polls,
  isLoading,
  isRefreshing,
  isError,
  isVotingPoll,
  refresh,
  voteOnPoll,
}: {
  polls: PollResponse[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  isVotingPoll: boolean;
  refresh: () => Promise<void>;
  voteOnPoll: (pollId: number, optionId: number) => Promise<unknown>;
}) {
  if (isLoading) {
    return (
      <View style={styles.votingStateWrap}>
        <ActivityIndicator color={colors_V2.purple} size="large" />
        <Text style={styles.votingStateText}>جاري تحميل التصويتات…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.votingStateWrap}>
        <Text style={styles.votingStateText}>تعذّر تحميل التصويتات.</Text>
        <Pressable onPress={() => void refresh()}>
          <Text style={styles.retryText}>إعادة المحاولة</Text>
        </Pressable>
      </View>
    );
  }

  if (polls.length === 0) {
    return (
      <View style={styles.votingStateWrap}>
        <Text style={styles.votingStateText}>لا توجد تصويتات عامة حالياً.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={polls}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.votingListContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => void refresh()}
          tintColor={colors_V2.purple}
          colors={[colors_V2.purple]}
        />
      }
      renderItem={({ item }) => (
        <PollCard
          poll={item}
          isVotingPoll={isVotingPoll}
          onVote={(pollId, optionId) => {
            void voteOnPoll(pollId, optionId);
          }}
        />
      )}
    />
  );
}

function ArenaHeader({
  activeTab,
  setActiveTab,
}: {
  activeTab: "reels" | "voting";
  setActiveTab: (tab: "reels" | "voting") => void;
}) {
  const router = useRouter();
  const header = useHeaderUser();

  return (
    <View style={styles.headerWrap}>
      <View style={[styles.headerRow, flexRowRtl]}>
        <Pressable
          style={styles.headerIconWrap}
          accessibilityRole="button"
          accessibilityLabel="الملف الشخصي"
          onPress={() => router.push("/(tabs)/profile" as never)}
        >
          {header.avatarUri ? (
            <Image source={{ uri: header.avatarUri }} style={styles.headerAvatar} contentFit="cover" />
          ) : (
            <View style={styles.headerAvatarPlaceholder} />
          )}
        </Pressable>

        <Text style={styles.headerTitle}>KINETIC ARENA</Text>

        <Pressable
          style={styles.headerNotifButton}
          accessibilityRole="button"
          accessibilityLabel="الإشعارات"
          onPress={() => router.push("/(tabs)/notifications" as never)}
        >
          <NotificationsIcon width={16} height={20} color={colors_V2.lavenderLight} />
        </Pressable>
      </View>

      <View style={[styles.tabsWrap, flexRowRtl]}>
        <Pressable
          onPress={() => setActiveTab("reels")}
          style={[styles.tabButton, activeTab === "reels" && styles.tabButtonActive]}
        >
          <Text style={[styles.tabLabel, activeTab === "reels" && styles.tabLabelActive]}>الريلز</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("voting")}
          style={[styles.tabButton, activeTab === "voting" && styles.tabButtonActive]}
        >
          <Text style={[styles.tabLabel, activeTab === "voting" && styles.tabLabelActive]}>التصويت</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ReelDescriptionBlock({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const [clampedToMaxLines, setClampedToMaxLines] = useState(false);
  const trimmed = description.trim();
  if (!trimmed) return null;

  const longByChars = trimmed.length > DESCRIPTION_CHAR_THRESHOLD;
  const canExpand =
    !expanded && (longByChars || (clampedToMaxLines && trimmed.length > 48));
  const showLess =
    expanded && (longByChars || (clampedToMaxLines && trimmed.length > 48));

  return (
    <View style={styles.descriptionBlock}>
      <View pointerEvents="none">
        <Text
          style={styles.reelDescription}
          numberOfLines={expanded ? undefined : DESCRIPTION_MAX_LINES}
          onTextLayout={(e) => {
            if (expanded) return;
            if (e.nativeEvent.lines.length >= DESCRIPTION_MAX_LINES) {
              setClampedToMaxLines(true);
            }
          }}
        >
          {trimmed}
        </Text>
      </View>
      {canExpand ? (
        <Pressable
          onPress={() => setExpanded(true)}
          hitSlop={8}
          style={styles.moreLessPressable}
          accessibilityRole="button"
          accessibilityLabel="توسيع الوصف"
        >
          <Text style={styles.moreText}>المزيد</Text>
        </Pressable>
      ) : null}
      {showLess ? (
        <Pressable
          onPress={() => setExpanded(false)}
          hitSlop={8}
          style={styles.moreLessPressable}
          accessibilityRole="button"
          accessibilityLabel="طي الوصف"
        >
          <Text style={styles.moreText}>أقل</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

type ReelFeedVideoProps = {
  uri: string;
  isActive: boolean;
  screenFocused: boolean;
  onPlaybackTick: (isActiveRow: boolean, status: AVPlaybackStatus) => void;
};

function ReelFeedVideo({
  uri,
  isActive,
  screenFocused,
  onPlaybackTick,
}: ReelFeedVideoProps) {
  const ref = useRef<InstanceType<typeof Video> | null>(null);
  const prevActiveRef = useRef(false);
  const pendingSeekFromEnterRef = useRef(false);
  const [userPaused, setUserPaused] = useState(false);
  const isActiveRef = useRef(isActive);
  const screenFocusedRef = useRef(screenFocused);
  isActiveRef.current = isActive;
  screenFocusedRef.current = screenFocused;

  const wantsPlay = isActive && screenFocused && !userPaused;

  const applyEnterPlayback = useCallback(async () => {
    const v = ref.current;
    if (!v) return;
    try {
      await v.setPositionAsync(0);
      await v.setIsMutedAsync(false);
      await v.playAsync();
    } catch {
      /* race */
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const v = ref.current;
      if (!v) return;
      try {
        if (!screenFocused || !isActive) {
          pendingSeekFromEnterRef.current = false;
          await v.pauseAsync();
          await v.setIsMutedAsync(true);
          if (!isActive) prevActiveRef.current = false;
          return;
        }

        if (!prevActiveRef.current) {
          setUserPaused(false);
          prevActiveRef.current = true;
          const st = await v.getStatusAsync();
          if (st.isLoaded) {
            await applyEnterPlayback();
          } else {
            pendingSeekFromEnterRef.current = true;
          }
          return;
        }

        if (userPaused) {
          await v.pauseAsync();
          return;
        }

        await v.setIsMutedAsync(false);
        await v.playAsync();
      } catch {
        /* unload / swap race */
      }
    })();
  }, [applyEnterPlayback, isActive, screenFocused, uri, userPaused]);

  const onVideoPress = useCallback(() => {
    if (!isActiveRef.current || !screenFocusedRef.current) return;
    setUserPaused((p) => !p);
  }, []);

  const onVideoLoad = useCallback(
    (st: AVPlaybackStatus) => {
      if (!pendingSeekFromEnterRef.current || !st.isLoaded) return;
      pendingSeekFromEnterRef.current = false;
      if (!isActiveRef.current || !screenFocusedRef.current) return;
      void applyEnterPlayback();
    },
    [applyEnterPlayback]
  );

  return (
    <View style={styles.videoPlayerStack}>
      <Video
        ref={ref}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={wantsPlay}
        isMuted={!wantsPlay}
        volume={1}
        useNativeControls={false}
        progressUpdateIntervalMillis={100}
        onLoad={onVideoLoad}
        onPlaybackStatusUpdate={(s) => onPlaybackTick(isActive, s)}
      />
      <Pressable
        style={styles.videoTapLayer}
        onPress={onVideoPress}
        accessibilityRole="button"
        accessibilityLabel="تشغيل أو إيقاف الفيديو"
      />
    </View>
  );
}

export function Ui() {
  const params = useLocalSearchParams<{
    tab?: string;
    reelId?: string;
    commentId?: string;
    pollId?: string;
  }>();
  const activeTab = useMirror("activeTab");
  const setActiveTab = useMirror("setActiveTab");
  const reels = useMirror("reels");
  const globalPolls = useMirror("globalPolls");
  const isLoadingGlobalPolls = useMirror("isLoadingGlobalPolls");
  const isFetchingGlobalPolls = useMirror("isFetchingGlobalPolls");
  const isGlobalPollsError = useMirror("isGlobalPollsError");
  const refreshGlobalPolls = useMirror("refreshGlobalPolls");
  const voteOnPoll = useMirror("voteOnPoll");
  const isVotingPoll = useMirror("isVotingPoll");
  const isLoadingReels = useMirror("isLoadingReels");
  const isFetchingReels = useMirror("isFetchingReels");
  const isReelsError = useMirror("isReelsError");
  const refreshReels = useMirror("refreshReels");
  const currentIndex = useMirror("currentIndex");
  const viewportHeight = useMirror("viewportHeight");
  const flatListRef = useMirror("flatListRef");
  const onScrollBeginDrag = useMirror("onScrollBeginDrag");
  const onScrollEndDrag = useMirror("onScrollEndDrag");
  const onMomentumScrollEnd = useMirror("onMomentumScrollEnd");
  const onViewableItemsChanged = useMirror("onViewableItemsChanged");
  const setViewportHeight = useMirror("setViewportHeight");
  const viewabilityConfig = useMirror("viewabilityConfig");
  const likeReel = useMirror("likeReel");
  const removeReelLike = useMirror("removeReelLike");
  const isReelLikeBusy = useMirror("isReelLikeBusy");
  const setCommentReelId = useMirror("setCommentReelId");
  const commentReelId = useMirror("commentReelId");
  const addReelComment = useMirror("addReelComment");
  const isAddingComment = useMirror("isAddingComment");

  const { width: windowWidth } = useWindowDimensions();
  const screenFocused = useIsFocused() && activeTab === "reels";
  const [playbackRatio, setPlaybackRatio] = useState(0);
  const progressThrottleRef = useRef(0);
  const [commentDraft, setCommentDraft] = useState("");
  const [mentionedUserIds, setMentionedUserIds] = useState<number[]>([]);
  const [mentionHits, setMentionHits] = useState<MentionableUser[]>([]);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [dismissedCommentPreviews, setDismissedCommentPreviews] = useState<Record<string, true>>({});
  const modalCommentsRef = useRef<FlatList<ReelCommentEntity> | null>(null);
  const dismissCommentPreview = useCallback((reelId: string) => {
    setDismissedCommentPreviews((s) => ({ ...s, [reelId]: true }));
  }, []);

  useEffect(() => {
    void Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setPlaybackRatio(0);
  }, [activeTab, currentIndex]);

  useEffect(() => {
    const tab = (params.tab || "").toLowerCase();
    if (tab === "voting" && activeTab !== "voting") {
      setActiveTab("voting");
      return;
    }
    if (tab === "reels" && activeTab !== "reels") {
      setActiveTab("reels");
    }
  }, [activeTab, params.tab, setActiveTab]);

  useEffect(() => {
    const reelId = (params.reelId || "").trim();
    if (!reelId || reels.length === 0 || !flatListRef.current || activeTab !== "reels") return;
    const index = reels.findIndex((item) => String(item.id) === reelId);
    if (index < 0) return;
    flatListRef.current.scrollToIndex({ index, animated: true });
    const commentId = (params.commentId || "").trim();
    if (commentId) {
      setCommentReelId(reelId);
    }
  }, [activeTab, flatListRef, params.commentId, params.reelId, reels, setCommentReelId]);

  useEffect(() => {
    if (!screenFocused) setPlaybackRatio(0);
  }, [screenFocused]);

  const fullBleedStyle = useMemo(
    () => ({
      width: windowWidth,
      marginHorizontal: -LAYOUT_PAD_X,
    }),
    [windowWidth]
  );

  const H =
    viewportHeight > 0 ? viewportHeight : Dimensions.get("window").height;

  const getItemLayout = useMemo(
    () => (_: unknown, index: number) => ({
      length: H,
      offset: H * index,
      index,
    }),
    [H]
  );

  const onPlaybackStatusUpdate = useCallback(
    (isActive: boolean, status: AVPlaybackStatus) => {
      if (!isActive || !status.isLoaded || !screenFocused) return;
      if (!status.isPlaying) return;
      const dur = status.durationMillis ?? 0;
      if (dur <= 0) return;
      const now = Date.now();
      if (now - progressThrottleRef.current < 120) return;
      progressThrottleRef.current = now;
      setPlaybackRatio((status.positionMillis ?? 0) / dur);
    },
    [screenFocused]
  );

  const modalReel = useMemo(
    () =>
      commentReelId == null
        ? undefined
        : reels.find((r) => String(r.id) === commentReelId),
    [commentReelId, reels]
  );

  const modalComments = modalReel?.comments ?? [];
  const focusedCommentId = Number(params.commentId ?? 0);
  const modalCommentCount =
    modalReel?.comments_count ?? modalComments.length ?? 0;

  useEffect(() => {
    const commentId = (params.commentId || "").trim();
    if (!commentId || !modalCommentsRef.current || modalComments.length === 0) return;
    const index = modalComments.findIndex((comment) => String(comment.id) === commentId);
    if (index < 0) return;
    modalCommentsRef.current.scrollToIndex({ index, animated: true });
  }, [modalComments, params.commentId]);

  const closeCommentsModal = useCallback(() => {
    setCommentReelId(null);
    setCommentDraft("");
    setMentionedUserIds([]);
    setMentionHits([]);
  }, [setCommentReelId]);

  const sendComment = useCallback(async () => {
    const text = commentDraft.trim();
    if (!commentReelId || !text) return;
    await addReelComment(commentReelId, text, mentionedUserIds);
    setCommentDraft("");
    setMentionedUserIds([]);
    setMentionHits([]);
  }, [addReelComment, commentDraft, commentReelId, mentionedUserIds]);

  const activeMentionQuery = useMemo(() => {
    const match = commentDraft.match(/@([A-Za-z0-9_\.]{2,32})$/);
    return match?.[1]?.trim() ?? "";
  }, [commentDraft]);

  useEffect(() => {
    let cancelled = false;
    if (!activeMentionQuery) {
      setMentionHits([]);
      setMentionLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setMentionLoading(true);
      void searchTagUsers(activeMentionQuery, 8)
        .then((rows) => {
          if (cancelled) return;
          setMentionHits(rows.filter((user) => !mentionedUserIds.includes(Number(user.id))));
        })
        .catch(() => {
          if (cancelled) return;
          setMentionHits([]);
        })
        .finally(() => {
          if (!cancelled) setMentionLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeMentionQuery, mentionedUserIds]);

  const attachMention = useCallback((user: MentionableUser) => {
    setMentionedUserIds((current) =>
      current.includes(user.id) ? current : [...current, user.id],
    );
    setCommentDraft((draft) => {
      const next = draft.replace(/@([A-Za-z0-9_\.]{2,32})$/, `@${user.gamer_name} `);
      return next;
    });
    setMentionHits([]);
  }, []);

  const shareReel = useCallback(async (item: ReelEntity) => {
    const text = [item.title?.trim(), item.description?.trim()]
      .filter(Boolean)
      .join("\n");
    await Share.share({
      title: item.title || "KINETIC ARENA",
      message: text || "شاهد هذا الريل في KINETIC ARENA",
    });
  }, []);

  return (
    <View style={styles.screen}>
      <ArenaHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <View style={styles.contentArea}>
        {activeTab === "reels" ? (
          <View style={styles.root}>
            <View
              style={styles.listWrap}
              onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
            >
              {isLoadingReels ? (
                <View style={styles.centered}>
                  <ActivityIndicator size="large" color={colors_V2.purple} />
                  <Text style={styles.muted}>جاري تحميل الريلز…</Text>
                </View>
              ) : isReelsError ? (
                <View style={styles.centered}>
                  <Text style={styles.text}>تعذّر تحميل الريلز.</Text>
                  <Pressable onPress={() => void refreshReels()}>
                    <Text style={styles.retryText}>اضغط لإعادة المحاولة</Text>
                  </Pressable>
                </View>
              ) : (
                <FlatList
                  ref={flatListRef}
                  style={{ flex: 1 }}
                  data={reels}
                  keyExtractor={(item, index) => reelKey(item, index)}
                  extraData={{ activeTab, currentIndex, playbackRatio }}
                  renderItem={({ item, index }) => {
                    const videoUri = formatReelVideoUrl(item.video_url);
                    const isActive = index === currentIndex;
                    const liked = Boolean(item.liked_by_current_user);
                    const likesCount = item.likes_count ?? 0;
                    const commentsCount =
                      item.comments_count ?? item.comments?.length ?? 0;
                    const barRatio = isActive ? playbackRatio : 0;
                    const previewComment = item.comments?.[0];
                    const previewAvatarUri = previewComment
                      ? commentAvatarUri(previewComment.user)
                      : null;

                    return (
                      <View
                        style={[
                          styles.reelPageFull,
                          fullBleedStyle,
                          { height: H },
                        ]}
                      >
                        <View style={styles.videoShell}>
                          {videoUri ? (
                            <ReelFeedVideo
                              key={`${String(item.id ?? index)}-${videoUri}`}
                              uri={videoUri}
                              isActive={isActive}
                              screenFocused={screenFocused}
                              onPlaybackTick={onPlaybackStatusUpdate}
                            />
                          ) : (
                            <View style={styles.videoPlaceholder}>
                              <Text style={styles.videoPlaceholderText}>
                                لا يوجد فيديو لهذا الريل
                              </Text>
                            </View>
                          )}

                          <LinearGradient
                            colors={["rgba(18,10,28,0.2)", "rgba(18,10,28,0.88)"]}
                            style={styles.videoOverlay}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                          />

                          <View style={styles.overlayRight} pointerEvents="box-none">
                            <View style={styles.overlayAction}>
                              <Pressable
                                disabled={isReelLikeBusy}
                                onPress={() => {
                                  const id = String(item.id ?? "");
                                  if (liked) void removeReelLike(id);
                                  else void likeReel(id);
                                }}
                                style={styles.overlayCircle}
                              >
                                <FavActionIcon
                                  color={
                                    liked
                                      ? colors_V2.gradientEnd
                                      : colors_V2.lavenderLight
                                  }
                                />
                              </Pressable>
                              <Text style={styles.overlayCount}>
                                {formatCompactCount(likesCount)}
                              </Text>
                            </View>

                            <View style={styles.overlayAction}>
                              <Pressable
                                onPress={() => setCommentReelId(String(item.id ?? ""))}
                                style={styles.overlayCircle}
                              >
                                <CommentRailIcon color={colors_V2.skyBlue} />
                              </Pressable>
                              <Text style={styles.overlayCount}>
                                {formatCompactCount(commentsCount)}
                              </Text>
                            </View>

                            <View style={styles.overlayAction}>
                              <Pressable
                                onPress={() => void shareReel(item)}
                                style={styles.overlayCircle}
                              >
                                <ShareRailIcon color={colors_V2.lavenderLight} />
                              </Pressable>
                              <Text style={styles.overlayCount}>مشاركة</Text>
                            </View>
                          </View>

                          <View style={styles.overlayBottomLeft} pointerEvents="box-none">
                            {previewComment ? (
                              <DraggableCommentPreview
                                reelIdStr={String(item.id ?? "")}
                                dismissed={Boolean(dismissedCommentPreviews[String(item.id ?? "")])}
                                onDismiss={dismissCommentPreview}
                                onOpen={() => setCommentReelId(String(item.id ?? ""))}
                              >
                                <View
                                  style={styles.commentPreview}
                                  accessibilityRole="button"
                                  accessibilityLabel="فتح التعليقات أو اسحب لإخفاء المعاينة"
                                >
                                  <View style={styles.commentPreviewIdentity}>
                                    {previewAvatarUri ? (
                                      <Image
                                        source={{ uri: previewAvatarUri }}
                                        style={styles.commentPreviewAvatar}
                                        contentFit="cover"
                                      />
                                    ) : (
                                      <View style={styles.commentPreviewAvatarPlaceholder} />
                                    )}
                                    <Text
                                      style={styles.commentPreviewUser}
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                    >
                                      {commentAuthor(previewComment.user)}
                                    </Text>
                                  </View>
                                  <View style={styles.commentPreviewBodyWrap}>
                                    <Text
                                      style={styles.commentPreviewBody}
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                    >
                                      <Text style={styles.commentPreviewBodyPrefix}>: </Text>
                                      {previewComment.comment}
                                    </Text>
                                  </View>
                                </View>
                              </DraggableCommentPreview>
                            ) : null}

                            {Boolean(item.title?.trim()) && (
                              <Text style={styles.reelTitle} numberOfLines={2}>
                                {item.title.trim()}
                              </Text>
                            )}
                            <ReelDescriptionBlock
                              key={`desc-${String(item.id ?? index)}`}
                              description={item.description ?? ""}
                            />
                          </View>

                          <View style={styles.bottomChrome}>
                            <View style={styles.progressTrack}>
                              <View
                                style={[
                                  styles.progressFill,
                                  {
                                    width: `${
                                      Math.min(1, Math.max(0, barRatio)) * 100
                                    }%`,
                                  },
                                ]}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                  pagingEnabled
                  snapToInterval={H}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  showsVerticalScrollIndicator={false}
                  scrollEventThrottle={16}
                  getItemLayout={getItemLayout}
                  onScrollBeginDrag={onScrollBeginDrag}
                  onScrollEndDrag={onScrollEndDrag}
                  onMomentumScrollEnd={onMomentumScrollEnd}
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={viewabilityConfig}
                  removeClippedSubviews={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={isFetchingReels && !isLoadingReels}
                      onRefresh={() => void refreshReels()}
                      tintColor={colors_V2.purple}
                      colors={[colors_V2.purple]}
                    />
                  }
                  ListEmptyComponent={
                    <View style={styles.centered}>
                      <Text style={styles.text}>لا ريلز بعد.</Text>
                      <Text style={styles.muted}>اسحب للتحديث أو عد لاحقاً.</Text>
                    </View>
                  }
                />
              )}
            </View>
          </View>
        ) : (
          <VotingTab
            polls={globalPolls}
            isLoading={isLoadingGlobalPolls}
            isRefreshing={isFetchingGlobalPolls && !isLoadingGlobalPolls}
            isError={isGlobalPollsError}
            isVotingPoll={isVotingPoll}
            refresh={refreshGlobalPolls}
            voteOnPoll={voteOnPoll}
          />
        )}
      </View>

      <AnimatedBottomSheet
        visible={commentReelId != null}
        onRequestClose={closeCommentsModal}
      >
        <View style={styles.modalBackdropHost}>
          <SheetDimmedBackdrop onPress={closeCommentsModal} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalKeyboardHost}
            pointerEvents="box-none"
          >
            <SheetSlidePanel style={styles.modalSheet}>
              <View style={styles.modalGrab} />
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Text style={styles.modalTitle}>التعليقات</Text>
                  <View style={styles.modalCountBadge}>
                    <Text style={styles.modalCountText}>
                      {formatCompactCount(modalCommentCount)}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={closeCommentsModal}
                  style={styles.modalClose}
                  hitSlop={12}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </Pressable>
              </View>

              <FlatList
                ref={modalCommentsRef}
                style={styles.modalList}
                data={modalComments}
                keyExtractor={(c) => String(c.id)}
                onScrollToIndexFailed={() => undefined}
                ListEmptyComponent={
                  <Text style={[styles.muted, { marginVertical: 16 }]}>
                    لا تعليقات بعد.
                  </Text>
                }
                renderItem={({ item: c }) => {
                  const avatarUri = commentAvatarUri(c.user);
                  const isFocusedComment =
                    Number.isFinite(focusedCommentId) &&
                    focusedCommentId > 0 &&
                    Number(c.id) === focusedCommentId;
                  return (
                    <View style={[styles.commentRow, isFocusedComment && styles.commentRowFocused]}>
                      <View style={[styles.commentRowInner, flexRowRtl]}>
                        {avatarUri ? (
                          <Image
                            source={{ uri: avatarUri }}
                            style={styles.commentAvatar}
                            contentFit="cover"
                          />
                        ) : (
                          <View style={styles.commentAvatar} />
                        )}
                        <View style={{ flex: 1 }}>
                          <View style={[styles.commentMeta, flexRowRtl]}>
                            <Text style={styles.commentUser}>
                              {commentAuthor(c.user)}
                            </Text>
                            <Text style={styles.commentTime}>
                              {formatCommentTimeAgo(c.created_at)}
                            </Text>
                          </View>
                          <Text style={styles.commentBody}>{c.comment}</Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />

              <View style={[styles.modalInputRow, flexRowRtl]}>
                <View style={styles.modalInputAvatar} />
                <View style={[styles.modalInputWrap, flexRowRtl]}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="أضف تعليقاً…"
                    placeholderTextColor={colors_V2.slate}
                    value={commentDraft}
                    onChangeText={setCommentDraft}
                    editable={!isAddingComment}
                  />
                  <Pressable
                    onPress={() => void sendComment()}
                    disabled={
                      isAddingComment || commentDraft.trim().length === 0
                    }
                    style={styles.modalSend}
                  >
                    <Text style={styles.modalSendText}>إرسال</Text>
                  </Pressable>
                </View>
              </View>
              {mentionLoading ? (
                <Text style={styles.muted}>جاري البحث عن المستخدم…</Text>
              ) : null}
              {mentionHits.length > 0 ? (
                <View style={styles.mentionHitsWrap}>
                  {mentionHits.map((user) => (
                    <Pressable
                      key={user.id}
                      onPress={() => attachMention(user)}
                      style={styles.mentionHitItem}
                    >
                      <Text style={styles.mentionHitLabel}>@{user.gamer_name}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </SheetSlidePanel>
          </KeyboardAvoidingView>
        </View>
      </AnimatedBottomSheet>
    </View>
  );
}
