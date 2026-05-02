import { writingRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import React, { type ComponentType } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TabIconProps = { size: number; color: string };

type Props = {
  label: string;
  Icon: ComponentType<TabIconProps>;
  iconColor?: string;
  isCenterItem?: boolean;
  active?: boolean;
  onPress: () => void;
};

const ICON_SIZE = 26;
const CENTER_ICON_SIZE = 32;

const BottomTabItem: React.FC<Props> = ({
  label,
  Icon,
  iconColor = colors_V2.textPrimary,
  isCenterItem = false,
  active,
  onPress,
}) => {
  const isActive = Boolean(active);
  const handlePress = () => {
    if (isActive) return;
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCenterItem && styles.centerContainer,
        isActive && styles.containerActive,
      ]}
      onPress={handlePress}
      disabled={isActive}
      activeOpacity={0.88}
    >
      <View
        style={[
          styles.iconSlot,
          isCenterItem && styles.centerIconSlot,
          isActive && styles.iconSlotActive,
        ]}
      >
        {isCenterItem ? (
          <View style={styles.centerBadge}>
            <View style={styles.centerBadgeInner}>
              <Icon size={CENTER_ICON_SIZE} color={colors_V2.textPrimary} />
            </View>
          </View>
        ) : (
          <Icon size={ICON_SIZE} color={isActive ? colors_V2.primaryLight : iconColor} />
        )}
      </View>
      <Text
        style={[
          styles.label,
          isCenterItem && styles.centerLabel,
          isActive && styles.labelActive,
          writingRtl,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
    paddingTop: 4,
  },
  containerActive: {
    transform: [{ translateY: -1 }],
  },
  centerContainer: {
    paddingTop: 0,
  },
  iconSlot: {
    height: 34,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iconSlotActive: {
    transform: [{ scale: 1.04 }],
  },
  centerIconSlot: {
    height: 62,
    marginTop: -26,
  },
  centerBadge: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 14,
    elevation: 16,
  },
  centerBadgeInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#A78BFA",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 8,
    marginTop: 6,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: "rgba(255,255,255,0.72)",
  },
  labelActive: {
    color: colors_V2.primaryLight,
    textShadowColor: "rgba(167,139,250,0.5)",
    textShadowRadius: 8,
  },
  centerLabel: {
    marginTop: 2,
  },
});

export default BottomTabItem;
