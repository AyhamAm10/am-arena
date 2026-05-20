import { styles } from "../styles";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import React from "react";

const COMMENT_DRAG_DISMISS_PX = 16;

type DraggableCommentPreviewProps = {
  reelIdStr: string;
  onOpen: () => void;
  dismissed: boolean;
  onDismiss: (id: string) => void;
  children: React.ReactNode;
};

export function DraggableCommentPreview({
  reelIdStr,
  onOpen,
  dismissed,
  onDismiss,
  children,
}: DraggableCommentPreviewProps) {
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