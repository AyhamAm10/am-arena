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
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { motionDurations } from "@/src/lib/motion/presets";

type PopoverCtx = {
  progress: SharedValue<number>;
};

const PopoverContext = createContext<PopoverCtx | null>(null);

export function usePopoverMotion(): PopoverCtx {
  const c = useContext(PopoverContext);
  if (!c) {
    throw new Error("Popover motion components must be inside AnimatedPopoverModal");
  }
  return c;
}

type AnimatedPopoverModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
};

/** Lightweight fade + scale for anchored menus (e.g. profile overflow). */
export function AnimatedPopoverModal({
  visible,
  onRequestClose,
  children,
}: AnimatedPopoverModalProps) {
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, { duration: motionDurations.fade });
    } else {
      progress.value = withTiming(
        0,
        { duration: motionDurations.press },
        (finished) => {
          if (finished) {
            runOnJS(setMounted)(false);
          }
        }
      );
    }
  }, [visible, progress]);

  const ctx = useMemo(() => ({ progress }), [progress]);

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onRequestClose}
    >
      <PopoverContext.Provider value={ctx}>
        {children}
      </PopoverContext.Provider>
    </Modal>
  );
}

export function PopoverScrim({ onPress }: { onPress: () => void }) {
  const { progress } = usePopoverMotion();
  const anim = useAnimatedStyle(() => ({
    opacity: progress.value * 0.35,
  }));
  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, styles.scrim, anim]}
      pointerEvents="box-none"
    >
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={onPress}
        accessibilityLabel="Close menu"
      />
    </Animated.View>
  );
}

type PopoverContentProps = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function PopoverContent({ style, children }: PopoverContentProps) {
  const { progress } = usePopoverMotion();
  const anim = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [-8, 0]) },
      {
        scale: interpolate(progress.value, [0, 1], [0.96, 1]),
      },
    ],
  }));
  return (
    <Animated.View style={[style, anim]} pointerEvents="box-none">
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    backgroundColor: "#000",
  },
});
