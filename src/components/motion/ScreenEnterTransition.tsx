import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { motionDurations } from "@/src/lib/motion/presets";

export type ScreenEnterFrom = "top" | "left" | "right";

const OFFSET = 36;

type ScreenEnterTransitionProps = {
  children: React.ReactNode;
  from: ScreenEnterFrom;
  style?: StyleProp<ViewStyle>;
};

/**
 * Runs a subtle UI-thread enter animation when the screen gains focus (e.g. tab or stack focus).
 * Complements native-stack when `slide_from_top` is unavailable.
 */
export function ScreenEnterTransition({
  children,
  from,
  style,
}: ScreenEnterTransitionProps) {
  const progress = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: motionDurations.screenEnter,
        easing: Easing.out(Easing.cubic),
      });
      return () => {
        progress.value = 0;
      };
    }, [progress])
  );

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const inv = 1 - p;
    switch (from) {
      case "top":
        return {
          opacity: p,
          transform: [{ translateY: inv * -OFFSET }],
        };
      case "left":
        return {
          opacity: p,
          transform: [{ translateX: inv * -OFFSET }],
        };
      case "right":
        return {
          opacity: p,
          transform: [{ translateX: inv * OFFSET }],
        };
      default:
        return { opacity: p };
    }
  });

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
