import type { RefObject } from "react";
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewToken,
} from "react-native";
import type { ReelEntity } from "@/src/api/types/reel.types";

type ReelsScrollState = {
  currentIndex: number;
  viewportHeight: number;
  flatListRef: RefObject<FlatList<ReelEntity> | null>;
  onScrollBeginDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollEndDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onViewableItemsChanged: (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => void;
  setViewportHeight: (h: number) => void;
  viewabilityConfig: { itemVisiblePercentThreshold: number };
};

const nullRef = null as unknown as RefObject<FlatList<ReelEntity> | null>;

const store = (): ReelsScrollState => ({
  currentIndex: 0,
  viewportHeight: 0,
  flatListRef: nullRef,
  onScrollBeginDrag: () => {},
  onScrollEndDrag: () => {},
  onMomentumScrollEnd: () => {},
  onViewableItemsChanged: () => {},
  setViewportHeight: () => {},
  viewabilityConfig: { itemVisiblePercentThreshold: 70 },
});

export { store as ReelsScrollState };
export type { ReelsScrollState as ReelsScrollStateType };
