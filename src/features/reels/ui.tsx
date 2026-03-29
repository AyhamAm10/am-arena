import { AppLayout } from "@/src/components/layout";
import { ReelCommentIcon } from "@/src/components/icons/reels/ReelCommentIcon";
import { ReelLikeIcon } from "@/src/components/icons/reels/ReelLikeIcon";
import { formatCompactCount } from "@/src/lib/utils/format-compact-count";
import { formatCommentTimeAgo } from "@/src/lib/utils/comment-time-ago";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { formatReelVideoUrl } from "@/src/lib/utils/reel-video-url";
import { colors } from "@/src/theme/colors";
import type { AVPlaybackStatus } from "expo-av";
import { Audio, ResizeMode, Video } from "expo-av";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import type { ReelCommentEntity, ReelEntity } from "@/src/api/types/reel.types";
import type { UserAccountDto } from "@/src/api/types/user.types";
import { Image } from "expo-image";
import { useIsFocused } from "@react-navigation/native";
import { useMirror } from "./store";
import { styles } from "./styles";

function reelKey(item: ReelEntity, index: number) {
  const id = item.id;
  if (typeof id === "number" || typeof id === "string") {
    return String(id);
  }
  return `reel-${index}`;
}

function commentAuthor(user: ReelCommentEntity["user"]): string {
  if (!user || typeof user !== "object") return "User";
  const u = user as UserAccountDto;
  return (u.gamer_name || u.full_name || "").trim() || "User";
}

function commentAvatarUri(user: ReelCommentEntity["user"]): string | null {
  if (!user || typeof user !== "object") return null;
  const u = user as UserAccountDto;
  const raw = u.profile_picture_url;
  if (!raw) return null;
  return formatImageUrl(raw);
}

const DESCRIPTION_CHAR_THRESHOLD = 96;
const DESCRIPTION_MAX_LINES = 2;

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
          accessibilityLabel="Expand description"
        >
          <Text style={styles.moreText}>more</Text>
        </Pressable>
      ) : null}
      {showLess ? (
        <Pressable
          onPress={() => setExpanded(false)}
          hitSlop={8}
          style={styles.moreLessPressable}
          accessibilityRole="button"
          accessibilityLabel="Collapse description"
        >
          <Text style={styles.moreText}>less</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const LAYOUT_PAD_X = 16;

type ReelFeedVideoProps = {
  uri: string;
  isActive: boolean;
  /** When false (tab unfocused), playback stops immediately. */
  screenFocused: boolean;
  onPlaybackTick: (isActiveRow: boolean, status: AVPlaybackStatus) => void;
};

/**
 * Playback rules:
 * - Inactive row or unfocused screen: pause + mute.
 * - Becoming active: seek to 0, clear user pause, play.
 * - User tap toggles pause while active and screen focused.
 */
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
  }, [applyEnterPlayback, isActive, screenFocused, userPaused, uri]);

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
        resizeMode={ResizeMode.CONTAIN}
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
        accessibilityLabel="Play or pause video"
      />
    </View>
  );
}

export function Ui() {
  const reels = useMirror("reels");
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
  const screenFocused = useIsFocused();
  const [playbackRatio, setPlaybackRatio] = useState(0);
  const progressThrottleRef = useRef(0);
  const [commentDraft, setCommentDraft] = useState("");

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
  }, [currentIndex]);

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
  const modalCommentCount =
    modalReel?.comments_count ?? modalComments.length ?? 0;

  const closeCommentsModal = useCallback(() => {
    setCommentReelId(null);
    setCommentDraft("");
  }, [setCommentReelId]);

  const sendComment = useCallback(async () => {
    const text = commentDraft.trim();
    if (!commentReelId || !text) return;
    await addReelComment(commentReelId, text);
    setCommentDraft("");
  }, [addReelComment, commentDraft, commentReelId]);

  return (
    <AppLayout scrollable={false}>
      <View style={styles.root}>
        <View
          style={styles.listWrap}
          onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
        >
          {isLoadingReels ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primaryPurple} />
              <Text style={styles.muted}>Loading reels…</Text>
            </View>
          ) : isReelsError ? (
            <View style={styles.centered}>
              <Text style={styles.text}>Could not load reels.</Text>
              <Pressable onPress={() => void refreshReels()}>
                <Text style={[styles.muted, { color: colors.primaryPurple }]}>
                  Tap to retry
                </Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              style={{ flex: 1 }}
              data={reels}
              keyExtractor={(item, index) => reelKey(item, index)}
              extraData={{ currentIndex, playbackRatio }}
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
                            No video for this reel
                          </Text>
                        </View>
                      )}

                      <View
                        style={styles.overlayBottomLeft}
                        pointerEvents="box-none"
                      >
                        {Boolean(item.title?.trim()) && (
                          <Text style={styles.reelTitle} numberOfLines={3}>
                            {item.title.trim()}
                          </Text>
                        )}
                        <ReelDescriptionBlock
                          key={`desc-${String(item.id ?? index)}`}
                          description={item.description ?? ""}
                        />
                        {previewComment ? (
                          <Pressable
                            style={styles.commentPreview}
                            onPress={() =>
                              setCommentReelId(String(item.id ?? ""))
                            }
                            accessibilityRole="button"
                            accessibilityLabel="Open comments"
                          >
                            {previewAvatarUri ? (
                              <Image
                                source={{ uri: previewAvatarUri }}
                                style={styles.commentPreviewAvatar}
                                contentFit="cover"
                              />
                            ) : (
                              <View style={styles.commentPreviewAvatar} />
                            )}
                            <View style={styles.commentPreviewMeta}>
                              <Text
                                style={styles.commentPreviewUser}
                                numberOfLines={1}
                              >
                                {commentAuthor(previewComment.user)}
                              </Text>
                              <Text
                                style={styles.commentPreviewBody}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {previewComment.comment}
                              </Text>
                            </View>
                          </Pressable>
                        ) : null}
                      </View>

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
                            <ReelLikeIcon
                              color={
                                liked ? colors.primaryPurple : colors.white
                              }
                            />
                          </Pressable>
                          <Text style={styles.overlayCount}>
                            {formatCompactCount(likesCount)}
                          </Text>
                        </View>
                        <View style={styles.overlayAction}>
                          <Pressable
                            onPress={() =>
                              setCommentReelId(String(item.id ?? ""))
                            }
                            style={styles.overlayCircle}
                          >
                            <ReelCommentIcon />
                          </Pressable>
                          <Text style={styles.overlayCount}>
                            {formatCompactCount(commentsCount)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.bottomChrome}>
                        <View style={styles.progressTrack}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${Math.min(1, Math.max(0, barRatio)) * 100}%` },
                            ]}
                          />
                        </View>
                        <View style={styles.footerStrip} />
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
                  tintColor={colors.primaryPurple}
                  colors={[colors.primaryPurple]}
                />
              }
              ListEmptyComponent={
                <View style={styles.centered}>
                  <Text style={styles.text}>No reels yet.</Text>
                  <Text style={styles.muted}>
                    Pull down to refresh or check back later.
                  </Text>
                </View>
              }
            />
          )}
        </View>

        <Modal
          visible={commentReelId != null}
          animationType="slide"
          transparent
          onRequestClose={closeCommentsModal}
        >
          <View style={styles.modalBackdrop}>
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={closeCommentsModal}
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ flex: 1, justifyContent: "flex-end" }}
              pointerEvents="box-none"
            >
              <View style={styles.modalSheet}>
                <View style={styles.modalGrab} />
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleRow}>
                    <Text style={styles.modalTitle}>Comments</Text>
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
                  style={styles.modalList}
                  data={modalComments}
                  keyExtractor={(c) => String(c.id)}
                  ListEmptyComponent={
                    <Text style={[styles.muted, { marginVertical: 16 }]}>
                      No comments yet.
                    </Text>
                  }
                  renderItem={({ item: c }) => (
                    <View style={styles.commentRow}>
                      <View style={styles.commentRowInner}>
                        <View style={styles.commentAvatar} />
                        <View style={{ flex: 1 }}>
                          <View style={styles.commentMeta}>
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
                  )}
                />

                <View style={styles.modalInputRow}>
                  <View style={styles.modalInputAvatar} />
                  <View style={styles.modalInputWrap}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Add a comment..."
                      placeholderTextColor="#6a5f7a"
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
                      <Text style={styles.modalSendText}>SEND</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    </AppLayout>
  );
}
