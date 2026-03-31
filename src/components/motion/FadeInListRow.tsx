import React from "react";
import Animated from "react-native-reanimated";
import { listRowEntering } from "@/src/lib/motion/presets";

type FadeInListRowProps = {
  index: number;
  children: React.ReactNode;
};

/** FlatList row mount — capped stagger via presets. */
export function FadeInListRow({ index, children }: FadeInListRowProps) {
  return (
    <Animated.View entering={listRowEntering(index)}>{children}</Animated.View>
  );
}
