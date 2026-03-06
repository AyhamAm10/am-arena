// src/components/BottomNav/ui/BottomNav.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import BottomTabItem from "./BottomTabItem";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from "@/src/theme/colors";

type Props = {
  activeTab: string;
  onTabPress: (tab: string) => void;
};

const BottomNav: React.FC<Props> = ({ activeTab, onTabPress }) => {
  const iconColor = (tab: string) =>
    activeTab === tab ? colors.primaryPurple : colors.white;

  return (
    <View style={styles.container}>
      <BottomTabItem
        label="Home"
        icon={<Icon name="home" size={24} color={iconColor("Home")} />}
        active={activeTab === "Home"}
        onPress={() => onTabPress("Home")}
      />
      <BottomTabItem
        label="Tournaments"
        icon={
          <Icon
            name="emoji-events"
            size={24}
            color={iconColor("Tournaments")}
          />
        }
        active={activeTab === "Tournaments"}
        onPress={() => onTabPress("Tournaments")}
      />
      <BottomTabItem
        label="Reels"
        icon={<Icon name="movie" size={24} color={iconColor("Reels")} />}
        active={activeTab === "Reels"}
        onPress={() => onTabPress("Reels")}
      />
      <BottomTabItem
        label="Channels"
        icon={
          <Icon
            name="video-library"
            size={24}
            color={iconColor("Channels")}
          />
        }
        active={activeTab === "Channels"}
        onPress={() => onTabPress("Channels")}
      />
      <BottomTabItem
        label="Profile"
        icon={<Icon name="person" size={24} color={iconColor("Profile")} />}
        active={activeTab === "Profile"}
        onPress={() => onTabPress("Profile")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: colors.darkBackground1,
    borderTopWidth: 1,
    borderTopColor: colors.darkBackground2,
  },
});

export default BottomNav;