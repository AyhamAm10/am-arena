# am-arena — animation guide

This document summarizes **where** motion was added, **which primitive** is used, and **why**, so future screens can stay consistent without rethinking timing from scratch.

## Shared primitives

| Module | Role |
|--------|------|
| [`src/lib/motion/presets.ts`](../src/lib/motion/presets.ts) | Durations, springs aligned with bottom tab items, capped list stagger (`listStaggerMaxMs` = 320 ms). |
| [`MotionPressable`](../src/components/motion/MotionPressable.tsx) | Tap gesture + UI-thread scale/opacity spring for tappable targets. |
| [`FadeInListRow`](../src/components/motion/FadeInListRow.tsx) | `FadeInDown` on list row mount with capped delay. |
| [`AnimatedBottomSheet` + `SheetDimmedBackdrop` + `SheetSlidePanel`](../src/components/motion/AnimatedBottomSheet.tsx) | Modal shell: timed open/close, dimmed scrim, sheet slide on Y. Pan-to-dismiss is supported via `enablePanDismiss` + `onDismiss` but defaults **off** so vertical lists (comments, pickers) are not fighting scroll. |
| [`AnimatedPopoverModal` + `PopoverScrim` + `PopoverContent`](../src/components/motion/AnimatedPopoverModal.tsx) | Anchored overflow menus: scrim fade + popover scale/slide. |
| [`ScreenEnterTransition`](../src/components/motion/ScreenEnterTransition.tsx) | On **focus**, UI-thread opacity + translate from **top / left / right** (native stack has no `slide_from_top`). |

## Surfaces

| Surface | Change | Rationale |
|---------|--------|-----------|
| **App root** | `GestureHandlerRootView` in [`src/app/_layout.tsx`](../src/app/_layout.tsx) | Required for reliable gesture-handler + Reanimated interplay. |
| **Root stack** | Explicit `Stack.Screen` options in [`src/app/_layout.tsx`](../src/app/_layout.tsx): `(tabs)` `animation: "none"`; `login` + `tournament/[id]` **`slide_from_right`**; `register` + `channel/[id]` **`slide_from_left`**; `contentStyle` uses `colors.screenBackground`. | Directional pushes; tab container does not flash a stack transition. |
| **Profile stack** | [`profile/_layout.tsx`](../src/app/(tabs)/profile/_layout.tsx): **`fade`** (`animationDuration` 220) so nested routes do not fight Reanimated “from top” on screen content. | Subtle native cross-fade between profile routes. |
| **Tab focus enters** | `ScreenEnterTransition` **`from="top"`**: [`notifications`](../src/app/(tabs)/notifications.tsx), profile [`index` / `edit` / `[userId]` / `achievements`](../src/app/(tabs)/profile/). **`from="left"`**: [`channels`](../src/app/(tabs)/channels.tsx), [`friends`](../src/app/(tabs)/friends.tsx). **`from="right"`**: [`reels`](../src/app/(tabs)/reels.tsx), [`tournaments`](../src/app/(tabs)/tournaments.tsx). | Mimics slide-from-top / sides when switching tabs (native tabs do not animate). |
| **Bottom tabs** | (unchanged) Existing Reanimated springs in `BottomNav/ui/BottomTabItem.tsx` | Already the motion reference; presets mirror its spring feel. |
| **Reels comments** | `AnimatedBottomSheet` around previous modal tree | Coordinated backdrop + sheet motion; structure and styles preserved. |
| **Tournament registration picker** | Same bottom-sheet stack | Matches reels; keeps picker sheet aligned with design. |
| **Profile overflow menu** | `AnimatedPopoverModal` | Dropdown stays subtle (fade + scale) and does not rely on system `Modal` fade only. |
| **Lists** | `FadeInListRow` in notifications, channels, channel chat, achievements | Orientation when data appears; stagger capped so long lists do not queue excessive delays. |
| **Auth CTAs** | `MotionPressable` on login / register primary buttons | Clear press feedback without changing button styles. |
| **Notification cards** | `MotionPressable` on pressable rows and friend-request actions | Consistent micro-interaction with other tap targets. |

## Performance notes

- Press and sheet updates use `useSharedValue` / `useAnimatedStyle` and `withTiming` / `withSpring` so work stays off the React JS render path where possible.
- List entering animations use a **fixed duration** and **capped** stagger; avoid raising `listStaggerMs` or removing the cap without profiling on low-end devices.
- When adding pan dismiss to a bottom sheet that contains a `ScrollView`/`FlatList`, prefer a **dedicated handle** or keep pan off (current default) to avoid gesture conflicts.

## Adding motion to a new screen

1. Reuse **presets** for timing/spring consistency.
2. For primary buttons, prefer **MotionPressable** over duplicating `Pressable` + `Animated`.
3. For full-screen overlays that slide from the bottom, compose **AnimatedBottomSheet** + backdrop + **SheetSlidePanel**.
4. For small anchored menus, use **AnimatedPopoverModal**.
5. For `FlatList` rows, wrap the row root in **FadeInListRow** with the row `index`.
6. For tab screens or profile routes that need a **top / horizontal** enter without changing the navigator, wrap the screen body in **ScreenEnterTransition** (`from` prop) and keep `style={{ flex: 1 }}` on the wrapper.
