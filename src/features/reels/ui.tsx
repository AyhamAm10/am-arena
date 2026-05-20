import type { MentionableUser, ReelCommentEntity, ReelEntity } from "@/src/api/types/reel.types";
import { searchTagUsers } from "@/src/api/services/reel.api";
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
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ReelLikeAnimationHost } from "./reel-like-animation";
import { ArenaHeader } from "./ui/ArenaHeader";
import { ReelDescriptionBlock } from "./ui/ReelDescriptionBlock";
import { ReelFeedVideo } from "./ui/ReelFeedVideo";
import { VotingTab } from "./ui/VotingTab";
import { commentAuthor, commentAvatarUri, reelAuthorLabel, reelKey } from "./helpers";
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

const DESCRIPTION_CHAR_THRESHOLD = 96;
const LAYOUT_PAD_X = 16;
const INTERACTION_ICON_SIZE = 22;
const INTERACTION_ICON_STROKE_WIDTH = 1.9;

export function Ui() {
  const params = useLocalSearchParams<{
    tab?: string;
    reelId?: string;
    commentId?: string;
    pollId?: string;
  }>();
  const activeTab = useMirror("activeTab");
  const router = useRouter();
  const segments = useSegments();
  const header = useHeaderUser();
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
  const fetchMoreReels = useMirror("fetchMoreReels");
  const isFetchingMoreReels = useMirror("isFetchingMoreReels");
  const hasNextReels = useMirror("hasNextReels");
  const { refreshing: reelsRefreshing, onRefresh: onReelsRefresh } = usePullToRefresh(
    () => refreshReels()
  );
  const currentIndex = useMirror("currentIndex");
  const viewportHeight = useMirror("viewportHeight");
  const onProfilePress = useCallback(() => {
    const isProfileRoute = segments.includes("profile");
    if (isProfileRoute) router.replace("/(tabs)/profile" as never);
    else router.push("/(tabs)/profile" as never);
  }, [router, segments]);

  const onNotificationsPress = useCallback(() => {
    router.push("/(tabs)/notifications" as never);
  }, [router]);

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
  const modalCommentsRef = useRef<FlatList<ReelCommentEntity> | null>(null);

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
      <ArenaHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        avatarUri={header.avatarUri}
        onProfilePress={onProfilePress}
        onNotificationsPress={onNotificationsPress}
      />
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
                  onEndReached={() => {
                    if (!hasNextReels || isFetchingMoreReels) return;
                    if (fetchMoreReels) void fetchMoreReels();
                  }}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    isFetchingMoreReels ? (
                      <View style={{ paddingVertical: 12 }}>
                        <ActivityIndicator color={colors_V2.primary} />
                      </View>
                    ) : null
                  }
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
                    const authorLabel = reelAuthorLabel(item.user);

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

                          <View style={styles.overlayRight} pointerEvents="box-none">
                            <View style={styles.overlayAction}>
                              <Pressable
                                disabled={isReelLikeBusy}
                                onPress={() => {
                                  const id = String(item.id ?? "");
                                  void (async () => {
                                    try {
                                      const mod = await import("./reel-like-animation");
                                      mod.spawnLikeAnimation(id);
                                    } catch (e) {
                                      /* ignore */
                                    }

                                    if (liked) void removeReelLike(id);
                                    else void likeReel(id);
                                  })();
                                }}
                                style={styles.overlayCircle}
                              >
                                <HugeiconsIcon
                                  icon={FavouriteIcon}
                                  size={INTERACTION_ICON_SIZE}
                                  color={liked ? "#9047FF" : "#FFFFFF"}
                                  strokeWidth={INTERACTION_ICON_STROKE_WIDTH}
                                  absoluteStrokeWidth
                                  fill={liked ? "#9047FF" : "transparent"}
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
                                <HugeiconsIcon
                                  icon={Comment03Icon}
                                  size={INTERACTION_ICON_SIZE}
                                  color={"#FFFFFF"}
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
                                  color={"#FFFFFF"}
                                  strokeWidth={INTERACTION_ICON_STROKE_WIDTH}
                                  absoluteStrokeWidth
                                />
                              </Pressable>
                              <Text style={styles.overlayCount}>مشاركة</Text>
                            </View>
                          </View>

                          <View style={styles.overlayBottomLeft} pointerEvents="box-none">
                            <View style={styles.overlayTextContent}>
                              <Text style={styles.reelAuthor} numberOfLines={1}>
                                {authorLabel}
                              </Text>

                              {Boolean(item.title?.trim()) && (
                                <Text style={styles.reelTitle} numberOfLines={1}>
                                  {item.title.trim()}
                                </Text>
                              )}
                              <ReelDescriptionBlock
                                key={`desc-${String(item.id ?? index)}`}
                                description={item.description ?? ""}
                              />
                            </View>
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
                            if (!c.user?.id) return;
                            const isProfileRoute = segments.includes("profile");
                            if (isProfileRoute) router.replace(`/profile/${c.user.id}`);
                            else router.push(`/profile/${c.user.id}`);
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
                {mentionLoading ? (
                  <Text style={[styles.muted, styles.mentionLoading]}>جاري البحث عن المستخدم…</Text>
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
              
            </SheetSlidePanel>
          </KeyboardAvoidingView>
        </View>
      </AnimatedBottomSheet>
    </View>
  );
}
