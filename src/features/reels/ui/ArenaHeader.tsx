import { NotificationsIcon } from "@/src/components/icons/figma/NotificationsIcon";
import { flexRowRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

type ArenaHeaderProps = {
  activeTab: "reels" | "voting";
  setActiveTab: (tab: "reels" | "voting") => void;
  avatarUri?: string | null;
  onProfilePress: () => void;
  onNotificationsPress: () => void;
};

export function ArenaHeader({
  activeTab,
  setActiveTab,
  avatarUri,
  onProfilePress,
  onNotificationsPress,
}: ArenaHeaderProps) {
  return (
    <View style={styles.headerWrap}>
      <View style={[styles.headerRow, flexRowRtl]}>
        <Pressable
          style={styles.headerIconWrap}
          accessibilityRole="button"
          accessibilityLabel="الملف الشخصي"
          onPress={onProfilePress}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.headerAvatar} contentFit="cover" />
          ) : (
            <View style={styles.headerAvatarPlaceholder} />
          )}
        </Pressable>

        <Text style={styles.headerTitle}>KINETIC ARENA</Text>

        <Pressable
          style={styles.headerNotifButton}
          accessibilityRole="button"
          accessibilityLabel="الإشعارات"
          onPress={onNotificationsPress}
        >
          <NotificationsIcon width={16} height={20} color={colors_V2.primaryLight} />
        </Pressable>
      </View>

      <View style={[styles.tabsWrap, flexRowRtl]}>
        <Pressable
          onPress={() => setActiveTab("reels")}
          style={[styles.tabButton, activeTab === "reels" && styles.tabButtonActive]}
        >
          <Text style={[styles.tabLabel, activeTab === "reels" && styles.tabLabelActive]}>الريلز</Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("voting")}
          style={[styles.tabButton, activeTab === "voting" && styles.tabButtonActive]}
        >
          <Text style={[styles.tabLabel, activeTab === "voting" && styles.tabLabelActive]}>التصويت</Text>
        </Pressable>
      </View>
    </View>
  );
}