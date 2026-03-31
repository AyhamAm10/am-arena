import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { motionDurations, motionSpring } from "@/src/lib/motion/presets";

type SheetMotionCtx = {
  progress: SharedValue<number>;
  dragY: SharedValue<number>;
};

const SheetMotionContext = createContext<SheetMotionCtx | null>(null);

export function useSheetMotion(): SheetMotionCtx {
  const c = useContext(SheetMotionContext);
  if (!c) {
    throw new Error("Sheet motion components must be inside AnimatedBottomSheet");
  }
  return c;
}

const SLIDE_OFFSET = 56;

type AnimatedBottomSheetProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
};

/**
 * Modal shell with driven open/close progress. Compose with SheetDimmedBackdrop + SheetSlidePanel.
 */
export function AnimatedBottomSheet({
  visible,
  onRequestClose,
  children,
}: AnimatedBottomSheetProps) {
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);
  const dragY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      dragY.value = 0;
      setMounted(true);
      progress.value = withTiming(1, { duration: motionDurations.sheetOpen });
    } else {
      dragY.value = withSpring(0, motionSpring);
      progress.value = withTiming(
        0,
        { duration: motionDurations.sheetClose },
        (finished) => {
          if (finished) {
            runOnJS(setMounted)(false);
          }
        }
      );
    }
  }, [visible, progress, dragY]);

  const ctx = useMemo(
    () => ({ progress, dragY }),
    [progress, dragY]
  );

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      visible={mounted}
      animationType="none"
      transparent
      onRequestClose={onRequestClose}
    >
      <SheetMotionContext.Provider value={ctx}>
        {children}
      </SheetMotionContext.Provider>
    </Modal>
  );
}

export function SheetDimmedBackdrop({ onPress }: { onPress: () => void }) {
  const { progress } = useSheetMotion();
  const anim = useAnimatedStyle(() => ({
    opacity: progress.value * 0.55,
  }));
  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, styles.backdropTint, anim]}
      pointerEvents="box-none"
    >
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={onPress}
        accessibilityLabel="Close"
      />
    </Animated.View>
  );
}

type SheetSlidePanelProps = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  enablePanDismiss?: boolean;
  onDismiss?: () => void;
};

export function SheetSlidePanel({
  style,
  children,
  enablePanDismiss = false,
  onDismiss,
}: SheetSlidePanelProps) {
  const { progress, dragY } = useSheetMotion();

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(Boolean(enablePanDismiss && onDismiss))
        .activeOffsetY([10, 9999])
        .failOffsetX([-18, 18])
        .onUpdate((e) => {
          if (e.translationY > 0) {
            dragY.value = e.translationY;
          }
        })
        .onEnd((e) => {
          const shouldClose =
            dragY.value > 72 || (e.velocityY > 900 && e.translationY > 24);
          if (shouldClose && onDismiss) {
            dragY.value = 0;
            runOnJS(onDismiss)();
            return;
          }
          dragY.value = withSpring(0, motionSpring);
        }),
    [enablePanDismiss, onDismiss, dragY]
  );

  const anim = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: (1 - progress.value) * SLIDE_OFFSET + dragY.value,
      },
    ],
  }));

  if (enablePanDismiss && onDismiss) {
    return (
      <GestureDetector gesture={pan}>
        <Animated.View style={[style, anim]}>{children}</Animated.View>
      </GestureDetector>
    );
  }

  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  backdropTint: {
    backgroundColor: "#000",
  },
});
