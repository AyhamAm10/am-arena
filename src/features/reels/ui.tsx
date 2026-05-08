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
import { useCurrentUser } from "@/src/hooks/auth/useCurrentUser";
import { useHeaderUser } from "@/src/hooks/auth/useHeaderUser";
import { flexRowRtl } from "@/src/lib/rtl";
import { formatCommentTimeAgo } from "@/src/lib/utils/comment-time-ago";
import { formatCompactCount } from "@/src/lib/utils/format-compact-count";
import { resolveMediaUrl } from "@/src/lib/utils/resolve-media-url";
import { colors_V2 } from "@/src/theme/colors";
import { useIsFocused } from "@react-navigation/native";
import {
  Comment03Icon,
  FavouriteIcon,
  Navigation03Icon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import type { AVPlaybackStatus } from "expo-av";
import { Audio, ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { ReelLikeAnimationHost } from "./reel-like-animation";
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
import { usePullToRefresh } from "@/src/hooks/usePullToRefresh";

const COMMENT_DRAG_DISMISS_PX = 16;

const DESCRIPTION_CHAR_THRESHOLD = 96;
const DESCRIPTION_MAX_LINES = 2;
const LAYOUT_PAD_X = 16;

const INTERACTION_ICON_SIZE = 20;
const INTERACTION_ICON_STROKE_WIDTH = 1.9;

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
  return resolveMediaUrl(raw, "image");
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
  focusPollId,
  refresh,
  voteOnPoll,
}: {
  polls: PollResponse[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  isVotingPoll: boolean;
  focusPollId?: string;
  refresh: () => Promise<void>;
  voteOnPoll: (pollId: number, optionId: number) => Promise<unknown>;
}) {
  if (isLoading) {
    return (
      <View style={styles.votingStateWrap}>
        <ActivityIndicator color={colors_V2.primary} size="large" />
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

  const flatListRef = useRef<FlatList<PollResponse>>(null);
  const didJumpRef = useRef<string | null>(null);

  useEffect(() => {
    const trimmed = (focusPollId ?? "").trim();
    if (!trimmed) return;
    const idNum = Number(trimmed);
    if (!Number.isFinite(idNum) || idNum <= 0) return;
    if (didJumpRef.current === String(idNum)) return;
    if (polls.length === 0) return;

    const index = polls.findIndex((p) => p.id === idNum);
    if (index < 0) {
      // Target poll missing/deleted: preserve existing behavior (no forced scroll).
      didJumpRef.current = String(idNum);
      return;
    }

    didJumpRef.current = String(idNum);
    flatListRef.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0,
    });
  }, [focusPollId, polls]);

  return (
    <FlatList
      ref={flatListRef}
      data={polls}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.votingListContent}
      showsVerticalScrollIndicator={false}
      onScrollToIndexFailed={() => undefined}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => void refresh()}
          tintColor={colors_V2.primary}
          colors={[colors_V2.primary]}
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
          <NotificationsIcon width={16} height={20} color={colors_V2.primaryLight} />
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
  const router = useRouter();
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
  const { refreshing: reelsRefreshing, onRefresh: onReelsRefresh } = usePullToRefresh(
    () => refreshReels()
  );
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
  const currentUser = useCurrentUser();

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
  const currentUserLabel = currentUser.gamerName
    ? `${currentUser.fullName ? `${currentUser.fullName} · ` : ""}@${currentUser.gamerName}`
    : currentUser.fullName || "مستخدم";

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
    const text = [item.title?.trim(), item.description?.trim()].filter(Boolean).join("\n");
    try {
      await (await import("@/src/lib/share/deepShare")).shareDeepLink("reel", String(item.id ?? ""), text || item.title || "شاهد هذا الريل");
    } catch (e) {
      // fallback to share API if deepShare fails
      await Share.share({
        title: item.title || "AM ARENA",
        message: (text || "شاهد هذا الريل في AM ARENA") + "\n\namarena://",
      });
    }
  }, []);

  return (
    <View style={styles.screen}>
      <ArenaHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <ReelLikeAnimationHost />

      <View style={styles.contentArea}>
        {activeTab === "reels" ? (
          <View style={styles.root}>
            <View
              style={styles.listWrap}
              onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
            >
              {isLoadingReels ? (
                <View style={styles.centered}>
                  <ActivityIndicator size="large" color={colors_V2.primary} />
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
                  refreshControl={
                    <RefreshControl
                      refreshing={reelsRefreshing}
                      onRefresh={onReelsRefresh}
                      tintColor={colors_V2.primary}
                      colors={[colors_V2.primary]}
                    />
                  }
                  renderItem={({ item, index }) => {
                    const videoUri = resolveMediaUrl(item.video_url, "video");
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
                                    // optimistically update is handled in mutations; trigger animation locally
                                    void (async () => {
                                      // run floating heart animation (if available)
                                      try {
                                        // import lazy to avoid bundle cost when not used
                                        const mod = await import("./reel-like-animation");
                                        mod.spawnLikeAnimation(id);
                                      } catch (e) {
                                        /* ignore */
                                      }

                                      if (liked) void removeReelLike(id);
                                      else void likeReel(id);
                                    })();
                                  }}
                                  style={[
                                    styles.overlayCircle,
                                    liked && styles.overlayCircleActive,
                                  ]}
                                >
                                  {liked ? (
                                    <HugeiconsIcon
                                      icon={FavouriteIcon}
                                      size={INTERACTION_ICON_SIZE}
                                      color={"#FFFFFF"}
                                      strokeWidth={INTERACTION_ICON_STROKE_WIDTH}
                                      absoluteStrokeWidth
                                    />
                                  ) : (
                                    <HugeiconsIcon
                                      icon={FavouriteIcon}
                                      size={INTERACTION_ICON_SIZE}
                                      color={colors_V2.primaryLight}
                                      strokeWidth={INTERACTION_ICON_STROKE_WIDTH}
                                      absoluteStrokeWidth
                                    />
                                  )}
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
                                <HugeiconsIcon
                                  icon={Comment03Icon}
                                  size={INTERACTION_ICON_SIZE}
                                  color={colors_V2.primaryLight}
                                  strokeWidth={INTERACTION_ICON_STROKE_WIDTH}
                                  absoluteStrokeWidth
                                />
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
                                <HugeiconsIcon
                                  icon={Share01Icon}
                                  size={INTERACTION_ICON_SIZE}
                                  color={colors_V2.primaryLight}
                                  strokeWidth={INTERACTION_ICON_STROKE_WIDTH}
                                  absoluteStrokeWidth
                                />
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
                      tintColor={colors_V2.primary}
                      colors={[colors_V2.primary]}
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
            focusPollId={params.pollId}
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
                      <View style={[styles.commentCard, flexRowRtl]}>
                        <Text style={styles.commentTime}>
                          {formatCommentTimeAgo(c.created_at)}
                        </Text>
                        <View style={styles.commentTextGroup}>
                          <Text style={styles.commentUser}>
                            {commentAuthor(c.user)}
                          </Text>
                          <Text style={styles.commentBody}>{c.comment}</Text>
                        </View>
                        <Pressable
                          onPress={() => {
                            if (c.user?.id) {
                              router.push(`/profile/${c.user.id}`);
                            }
                          }}
                        >
                          {avatarUri ? (
                            <Image
                              source={{ uri: avatarUri }}
                              style={styles.commentAvatar}
                              contentFit="cover"
                            />
                          ) : (
                            <View style={styles.commentAvatar} />
                          )}
                        </Pressable>
                      </View>
                    </View>
                  );
                }}
              />

              {currentUser.fullName || currentUser.gamerName ? (
                <Text
                  style={[
                    styles.muted,
                    {
                      marginTop: 10,
                      marginBottom: 6,
                      marginHorizontal: 12,
                      textAlign: "right",
                      fontSize: 12,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {currentUserLabel}
                </Text>
              ) : null}

              <KeyboardStickyView offset={{ opened: 8, closed: 0 }}>
                <View style={[styles.modalInputRow, flexRowRtl]}>
                  {currentUser.profileImageUrl ? (
                    <Image
                      source={{ uri: currentUser.profileImageUrl }}
                      style={styles.modalInputAvatar}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.modalInputAvatar} />
                  )}
                  <View style={[styles.modalInputWrap, flexRowRtl]}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder={
                        currentUser.gamerName
                          ? `أضف تعليقاً يا @${currentUser.gamerName}…`
                          : "أضف تعليقاً…"
                      }
                      placeholderTextColor={colors_V2.textSecondary}
                      value={commentDraft}
                      onChangeText={setCommentDraft}
                      editable={!isAddingComment}
                    />
                    <Pressable
                      onPress={() => void sendComment()}
                      disabled={
                        isAddingComment || commentDraft.trim().length === 0
                      }
                      style={{ padding: 8 }}
                    >
                      <HugeiconsIcon
                        icon={Navigation03Icon}
                        size={INTERACTION_ICON_SIZE}
                        color={"#9047FF"}
                        strokeWidth={INTERACTION_ICON_STROKE_WIDTH}
                        absoluteStrokeWidth
                      />
                    </Pressable>
                  </View>
                </View>
              </KeyboardStickyView>
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
