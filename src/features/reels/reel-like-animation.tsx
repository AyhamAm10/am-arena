import React from "react";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { View, StyleSheet } from "react-native";
import { colors_V2 } from "@/src/theme/colors";
import Svg, { Path } from "react-native-svg";

// Simple global ephemeral animation spawner. We keep it minimal and lightweight.
// Usage: import and call spawnLikeAnimation(id)

let spawner: ((id: string) => void) | null = null;

export function registerSpawner(fn: (id: string) => void) {
  spawner = fn;
}

export function spawnLikeAnimation(id: string) {
  if (spawner) spawner(id);
}

// The actual component is mounted once in the Reels UI and renders active hearts.
export function ReelLikeAnimationHost({ children }: { children?: React.ReactNode }) {
  const [hearts, setHearts] = React.useState<Array<{ id: string; key: string }>>([]);

  React.useEffect(() => {
    registerSpawner((id: string) => {
      const key = `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setHearts((s) => [...s, { id, key }]);
      // remove after animation
      setTimeout(() => {
        setHearts((s) => s.filter((h) => h.key !== key));
      }, 1200);
    });
    return () => registerSpawner(() => {});
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {hearts.map((h, i) => (
        <FloatingHeart key={h.key} index={i} />
      ))}
    </View>
  );
}

function FloatingHeart({ index }: { index: number }) {
  const ty = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    // sequence: pop scale 0->1.15->1, float up -60, fade out
    scale.value = withSequence(
      withTiming(1.15, { duration: 160, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 120 }),
    );
    opacity.value = withTiming(1, { duration: 120 });
    ty.value = withSequence(withDelay(120, withTiming(-60, { duration: 900 })), withTiming(-80));
    // fade out after
    opacity.value = withDelay(600, withTiming(0, { duration: 400 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.heartWrap, style]}>
      <Svg width={46} height={46} viewBox="0 0 24 24" fill="none">
        <Path d="M12 21s-6.716-4.5-9.2-7.006C-0.466 10.616 2.8 6 6.5 6c2.03 0 3.5 1.248 5.5 3.07C13.998 7.248 15.47 6 17.5 6c3.7 0 6.967 4.616 3.7 7.994C18.716 16.5 12 21 12 21z" fill={colors_V2.primary} opacity={0.98} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heartWrap: {
    position: "absolute",
    right: 40,
    bottom: 160,
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    // small shadow/glow
    shadowColor: colors_V2.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
    elevation: 20,
  },
});
