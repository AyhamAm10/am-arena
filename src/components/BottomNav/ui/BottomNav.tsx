import { colors } from "@/src/theme/colors";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomTabItem from "./BottomTabItem";

type Props = {
  activeTab: string | null;
  onTabPress: (tab: string) => void;
};

const BottomNav: React.FC<Props> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      <View style={styles.bar}>
        <View style={styles.row}>
          <BottomTabItem
            label="Home"
            iconName="home"
            active={activeTab === "Home"}
            onPress={() => onTabPress("Home")}
          />
          <BottomTabItem
            label="Reels"
            iconName="movie"
            active={activeTab === "Reels"}
            onPress={() => onTabPress("Reels")}
          />
          <BottomTabItem
            label="Channels"
            iconName="forum"
            active={activeTab === "Channels"}
            onPress={() => onTabPress("Channels")}
          />
          <BottomTabItem
            label="Friends"
            iconName="people"
            active={activeTab === "Friends"}
            onPress={() => onTabPress("Friends")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    backgroundColor: colors.darkBackground1,
  },
  bar: {
    backgroundColor: colors.darkBackground1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: colors.darkBackground2,
    paddingTop: 10,
    overflow: "visible",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: { elevation: 12 },
    }),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    minHeight: 52,
    paddingHorizontal: 4,
  },
});

export default BottomNav;
