import { AppLayout } from "@/src/components/layout";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import type { ReelEntity } from "@/src/api/types/reel.types";
import { useMirror } from "./store";
import { styles } from "./styles";

function reelKey(item: ReelEntity, index: number) {
  const id = item.id;
  if (typeof id === "number" || typeof id === "string") {
    return String(id);
  }
  return `reel-${index}`;
}

export function Ui() {
  const reels = useMirror("reels");
  const isLoadingReels = useMirror("isLoadingReels");
  const isReelsError = useMirror("isReelsError");
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
  const comments = useMirror("comments");
  const isLoadingComments = useMirror("isLoadingComments");
  const addReelComment = useMirror("addReelComment");
  const isAddingComment = useMirror("isAddingComment");

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

  return (
    <AppLayout>
      <View
        style={styles.root}
        onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
      >
        {isLoadingReels ? (
          <View style={styles.centered}>
            <ActivityIndicator />
          </View>
        ) : isReelsError ? (
          <View style={styles.centered}>
            <Text style={styles.text}>Could not load reels.</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={reels}
            keyExtractor={(item, index) => reelKey(item, index)}
            renderItem={({ item }) => (
              <View style={[styles.reelPage, { height: H }]}>
                <Text style={styles.reelTitle}>
                  Reel {String(item.id ?? "?")}
                </Text>
                <Text style={styles.meta}>
                  index {currentIndex} · comments loaded:{" "}
                  {commentReelId ? comments.length : "—"}
                </Text>
                <View style={styles.actions}>
                  <Pressable
                    disabled={isReelLikeBusy}
                    onPress={() => likeReel(String(item.id ?? ""))}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionLabel}>Like</Text>
                  </Pressable>
                  <Pressable
                    disabled={isReelLikeBusy}
                    onPress={() => removeReelLike(String(item.id ?? ""))}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionLabel}>Unlike</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setCommentReelId(String(item.id ?? ""))}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionLabel}>Load comments</Text>
                  </Pressable>
                  <Pressable
                    disabled={isAddingComment}
                    onPress={() =>
                      void addReelComment(String(item.id ?? ""), "Nice reel!")
                    }
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionLabel}>Add comment</Text>
                  </Pressable>
                </View>
                {commentReelId === String(item.id ?? "") &&
                isLoadingComments ? (
                  <ActivityIndicator style={styles.commentSpinner} />
                ) : null}
              </View>
            )}
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
            removeClippedSubviews
          />
        )}
      </View>
    </AppLayout>
  );
}
