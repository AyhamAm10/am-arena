import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from "react-native";
import type { ReelEntity } from "@/src/api/types/reel.types";
import { useMirror, useMirrorRegistry } from "./store";

const THRESHOLD_RATIO = 0.2;

function State({ children }: PropsWithChildren) {
  const reels = useMirror("reels");
  const flatListRef = useRef<FlatList<ReelEntity>>(null);
  const dragStartOffsetRef = useRef(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewportHeight, setViewportHeightState] = useState(
    () => Dimensions.get("window").height
  );

  const maxIndex = Math.max(0, reels.length - 1);

  useEffect(() => {
    setCurrentIndex((idx) => Math.min(idx, maxIndex));
  }, [maxIndex]);

  const H = viewportHeight > 0 ? viewportHeight : Dimensions.get("window").height;

  const onScrollBeginDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      dragStartOffsetRef.current = e.nativeEvent.contentOffset.y;
    },
    []
  );

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (reels.length === 0 || H <= 0) {
        return;
      }
      const y = e.nativeEvent.contentOffset.y;
      const delta = y - dragStartOffsetRef.current;
      const threshold = THRESHOLD_RATIO * H;

      if (delta > threshold && currentIndex < maxIndex) {
        const next = currentIndex + 1;
        setCurrentIndex(next);
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToOffset({
            offset: next * H,
            animated: true,
          });
        });
      } else if (delta < -threshold && currentIndex > 0) {
        const prev = currentIndex - 1;
        setCurrentIndex(prev);
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToOffset({
            offset: prev * H,
            animated: true,
          });
        });
      } else {
        flatListRef.current?.scrollToOffset({
          offset: currentIndex * H,
          animated: true,
        });
      }
    },
    [H, currentIndex, maxIndex, reels.length]
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (reels.length === 0 || H <= 0) {
        return;
      }
      const y = e.nativeEvent.contentOffset.y;
      const nearest = Math.round(y / H);
      const clamped = Math.max(0, Math.min(nearest, maxIndex));
      setCurrentIndex(clamped);
      const target = clamped * H;
      if (Math.abs(y - target) > 2) {
        flatListRef.current?.scrollToOffset({
          offset: target,
          animated: true,
        });
      }
    },
    [H, maxIndex, reels.length]
  );

  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const idx = info.viewableItems[0]?.index;
      if (typeof idx === "number") {
        setCurrentIndex(idx);
      }
    },
    []
  );

  const setViewportHeight = useCallback((h: number) => {
    if (h > 0) {
      setViewportHeightState(h);
    }
  }, []);

  const viewabilityConfig = useMemo(
    () => ({ itemVisiblePercentThreshold: 70 }),
    []
  );

  useMirrorRegistry("currentIndex", currentIndex, currentIndex);
  useMirrorRegistry("viewportHeight", viewportHeight, viewportHeight);
  useMirrorRegistry("flatListRef", flatListRef, flatListRef);
  useMirrorRegistry("onScrollBeginDrag", onScrollBeginDrag, onScrollBeginDrag);
  useMirrorRegistry("onScrollEndDrag", onScrollEndDrag, onScrollEndDrag);
  useMirrorRegistry(
    "onMomentumScrollEnd",
    onMomentumScrollEnd,
    onMomentumScrollEnd
  );
  useMirrorRegistry(
    "onViewableItemsChanged",
    onViewableItemsChanged,
    onViewableItemsChanged
  );
  useMirrorRegistry("setViewportHeight", setViewportHeight, setViewportHeight);
  useMirrorRegistry("viewabilityConfig", viewabilityConfig, viewabilityConfig);

  return children;
}

export { State };
