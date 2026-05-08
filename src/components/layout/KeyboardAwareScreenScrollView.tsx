import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import type { ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type KeyboardAwareScreenScrollViewProps = ScrollViewProps & {
  bottomOffset?: number;
};

const DEFAULT_BOTTOM_OFFSET = 16;

export function KeyboardAwareScreenScrollView({
  bottomOffset,
  keyboardShouldPersistTaps = "handled",
  showsVerticalScrollIndicator = false,
  refreshControl,
  ...props
}: KeyboardAwareScreenScrollViewProps) {
  const insets = useSafeAreaInsets();
  const effectiveBottomOffset = bottomOffset ?? insets.bottom + DEFAULT_BOTTOM_OFFSET;

  return (
    <KeyboardAwareScrollView
      {...props}
      bottomOffset={effectiveBottomOffset}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      refreshControl={refreshControl}
    />
  );
}