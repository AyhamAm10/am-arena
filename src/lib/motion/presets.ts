import { FadeInDown } from "react-native-reanimated";

/** Aligned with BottomNav `BottomTabItem` spring for cohesive motion. */
export const motionSpring = {
  damping: 20,
  stiffness: 260,
  mass: 0.85,
} as const;

export const motionPressSpring = {
  damping: 22,
  stiffness: 420,
  mass: 0.45,
} as const;

export const motionDurations = {
  sheetOpen: 280,
  sheetClose: 240,
  fade: 220,
  /** Tab / screen focus enter (ScreenEnterTransition). */
  screenEnter: 260,
  press: 140,
} as const;

export const listStaggerMs = 32;
export const listStaggerMaxMs = 320;

/** Capped stagger so long lists stay within budget. */
export function listRowEnterDelay(index: number): number {
  return Math.min(index * listStaggerMs, listStaggerMaxMs);
}

export function listRowEntering(index: number) {
  return FadeInDown.duration(260).delay(listRowEnterDelay(index));
}
