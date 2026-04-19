import { writingRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import React, { useEffect, type ComponentType } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type TabIconProps = { size: number; color: string };

type Props = {
  label: string;
  Icon: ComponentType<TabIconProps>;
  /** Inactive glyph color (from design assets). */
  inactiveIconColor?: string;
  active?: boolean;
  onPress: () => void;
};

const INACTIVE_ICON_SIZE = 26;
const ACTIVE_ICON_SIZE = 28;

const springConfig = {
  damping: 20,
  stiffness: 260,
  mass: 0.85,
};

const BottomTabItem: React.FC<Props> = ({
  label,
  Icon,
  inactiveIconColor = colors_V2.slate,
  active,
  onPress,
}) => {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(active ? 1 : 0, springConfig);
  }, [active]);

  const inactiveLayerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.35], [1, 0]),
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [1, 0.94]),
      },
    ],
  }));

  const fabLayerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.2, 0.65], [0, 1]),
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [0.86, 1]),
      },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveIconColor, "#FFFFFF"]
    ),
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [1.5, 0]),
      },
    ],
  }));

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <View style={styles.iconSlot}>
        <Animated.View
          style={[styles.inactiveLayer, inactiveLayerStyle]}
          pointerEvents="none"
        >
          <Icon size={INACTIVE_ICON_SIZE} color={inactiveIconColor} />
        </Animated.View>
        <Animated.View
          style={[styles.fabLayer, fabLayerStyle]}
          pointerEvents="none"
        >
          <View style={[styles.fab, styles.fabActive]}>
            <Icon size={ACTIVE_ICON_SIZE} color="#FFFFFF" />
          </View>
        </Animated.View>
      </View>
      <Animated.Text
        style={[styles.label, labelStyle, writingRtl]}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 6,
    paddingTop: 4,
  },
  iconSlot: {
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 0,
  },
  inactiveLayer: {
    position: "absolute",
    bottom: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  fabLayer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -32,
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors_V2.purple,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: colors_V2.purple,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.55,
        shadowRadius: 12,
      },
      android: {
        elevation: 14,
      },
    }),
  },
  fabActive: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.75,
        shadowRadius: 16,
      },
      android: {
        elevation: 18,
      },
    }),
  },
  label: {
    fontSize: 8,
    marginTop: 4,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default BottomTabItem;
