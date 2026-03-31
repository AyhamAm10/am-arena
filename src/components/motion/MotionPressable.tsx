import React, { useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { motionPressSpring } from "@/src/lib/motion/presets";

type MotionPressableProps = {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** Container style — layout only; transform/opacity come from animation. */
  style?: StyleProp<ViewStyle>;
  hitSlop?: { top?: number; bottom?: number; left?: number; right?: number };
};

/**
 * Press feedback on UI thread — scales wrapper without changing child layout styles.
 */
export function MotionPressable({
  children,
  onPress,
  disabled = false,
  style,
  hitSlop,
}: MotionPressableProps) {
  const pressed = useSharedValue(0);

  const gesture = useMemo(() => {
    const g = Gesture.Tap()
      .enabled(!disabled && Boolean(onPress))
      .maxDistance(12)
      .onBegin(() => {
        pressed.value = withSpring(1, motionPressSpring);
      })
      .onFinalize(() => {
        pressed.value = withSpring(0, motionPressSpring);
      })
      .onEnd((_e, success) => {
        if (success && onPress) {
          runOnJS(onPress)();
        }
      });
    if (hitSlop) {
      g.hitSlop(hitSlop);
    }
    return g;
  }, [disabled, onPress, hitSlop, pressed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(pressed.value, [0, 1], [1, 0.97]),
      },
    ],
    opacity: interpolate(pressed.value, [0, 1], [1, 0.92]),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}
