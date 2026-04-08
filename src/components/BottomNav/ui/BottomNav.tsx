import { ChannelNavIcon } from "@/src/components/icons/nav/ChannelNavIcon";
import { FriendsNavIcon } from "@/src/components/icons/nav/FriendsNavIcon";
import { HomeNavIcon } from "@/src/components/icons/nav/HomeNavIcon";
import { ReelsNavIcon } from "@/src/components/icons/nav/ReelsNavIcon";
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
            label="الرئيسية"
            Icon={HomeNavIcon}
            inactiveIconColor={colors.grey}
            active={activeTab === "Home"}
            onPress={() => onTabPress("Home")}
          />
          <BottomTabItem
            label="الريلز"
            Icon={ReelsNavIcon}
            inactiveIconColor={colors.neonBlue}
            active={activeTab === "Reels"}
            onPress={() => onTabPress("Reels")}
          />
          <BottomTabItem
            label="القنوات"
            Icon={ChannelNavIcon}
            inactiveIconColor={colors.grey}
            active={activeTab === "Channels"}
            onPress={() => onTabPress("Channels")}
          />
          <BottomTabItem
            label="الأصدقاء"
            Icon={FriendsNavIcon}
            inactiveIconColor={colors.grey}
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
    width: "100%",
    backgroundColor: colors.darkBackground1,
  },
  bar: {
    width: "100%",
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
    justifyContent: "space-between",
    minHeight: 52,
    paddingHorizontal: 4,
    width: "100%",
  },
});

export default BottomNav;
