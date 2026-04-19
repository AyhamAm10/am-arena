import { AchievementsNavIcon } from "@/src/components/icons/nav/AchievementsNavIcon";
import { ArenaSpaceNavIcon } from "@/src/components/icons/nav/ArenaSpaceNavIcon";
import { FriendsNavIcon } from "@/src/components/icons/nav/FriendsNavIcon";
import { HomeNavIconV2 } from "@/src/components/icons/nav/HomeNavIconV2";
import { TournamentsNavIcon } from "@/src/components/icons/nav/TournamentsNavIcon";
import { colors_V2 } from "@/src/theme/colors";
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
            Icon={HomeNavIconV2}
            inactiveIconColor={colors_V2.skyBlue}
            active={activeTab === "Home"}
            onPress={() => onTabPress("Home")}
          />
          <BottomTabItem
            label="الساحة"
            Icon={ArenaSpaceNavIcon}
            inactiveIconColor={colors_V2.slate}
            active={activeTab === "ArenaSpace"}
            onPress={() => onTabPress("ArenaSpace")}
          />
          <BottomTabItem
            label="البطولات"
            Icon={TournamentsNavIcon}
            inactiveIconColor={colors_V2.slate}
            active={activeTab === "Tournaments"}
            onPress={() => onTabPress("Tournaments")}
          />
          <BottomTabItem
            label="الإنجازات"
            Icon={AchievementsNavIcon}
            inactiveIconColor={colors_V2.slate}
            active={activeTab === "Achievements"}
            onPress={() => onTabPress("Achievements")}
          />
          <BottomTabItem
            label="الأصدقاء"
            Icon={FriendsNavIcon}
            inactiveIconColor={colors_V2.slate}
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
    backgroundColor: colors_V2.background,
  },
  bar: {
    width: "100%",
    backgroundColor: colors_V2.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: colors_V2.card,
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
