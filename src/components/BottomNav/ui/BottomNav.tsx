import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import {
  ChampionIcon,
  Home12Icon,
  MedalThirdPlaceIcon,
  SparklesIcon,
  UserMultiple03Icon,
} from "@hugeicons/core-free-icons";
import { colors_V2 } from "@/src/theme/colors";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomTabItem from "./BottomTabItem";

type TabIconProps = { size: number; color: string };

const TAB_ICON_STROKE_WIDTH = 1.9;

function makeHugeIcon(icon: IconSvgElement) {
  return function HugeTabIcon({ size, color }: TabIconProps) {
    return (
      <HugeiconsIcon
        icon={icon}
        size={size}
        color={color}
        strokeWidth={TAB_ICON_STROKE_WIDTH}
        absoluteStrokeWidth
      />
    );
  };
}

const HomeTabIcon = makeHugeIcon(Home12Icon);
const EventsTabIcon = makeHugeIcon(SparklesIcon);
const TournamentsTabIcon = makeHugeIcon(ChampionIcon);
const AchievementsTabIcon = makeHugeIcon(MedalThirdPlaceIcon);
const FriendsTabIcon = makeHugeIcon(UserMultiple03Icon);


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
            Icon={HomeTabIcon}
            iconColor={colors_V2.textPrimary}
            active={activeTab === "Home"}
            onPress={() => onTabPress("Home")}
          />
          <BottomTabItem
            label="الساحة"
            Icon={EventsTabIcon}
            iconColor={colors_V2.textPrimary}
            active={activeTab === "ArenaSpace"}
            onPress={() => onTabPress("ArenaSpace")}
          />
          <BottomTabItem
            label="البطولات"
            Icon={TournamentsTabIcon}
            iconColor={colors_V2.textPrimary}
            isCenterItem
            active={activeTab === "Tournaments"}
            onPress={() => onTabPress("Tournaments")}
          />
          <BottomTabItem
            label="الإنجازات"
            Icon={AchievementsTabIcon}
            iconColor={colors_V2.textPrimary}
            active={activeTab === "Achievements"}
            onPress={() => onTabPress("Achievements")}
          />
          <BottomTabItem
            label="الأصدقاء"
            Icon={FriendsTabIcon}
            iconColor={colors_V2.textPrimary}
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
    backgroundColor: "rgba(11, 8, 18, 0.94)",
  },
  bar: {
    width: "100%",
    backgroundColor: "rgba(15, 11, 24, 0.96)",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderTopColor: "rgba(216,185,255,0.12)",
    paddingTop: 10,
    paddingBottom: 4,
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
      },
      android: { elevation: 16 },
    }),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: 70,
    paddingHorizontal: 10,
    width: "100%",
  },
});

export default BottomNav;
