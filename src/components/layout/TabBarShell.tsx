import BottomNav from "@/src/components/BottomNav/ui/BottomNav";
import { useRouter, useSegments } from "expo-router";
import { StyleSheet, View } from "react-native";

/** Maps visible tab ids to Expo Router paths inside (tabs). */
const TAB_ROUTES: Record<string, string> = {
  Home: "/",
  ArenaSpace: "/arena-space",
  Tournaments: "/tournaments",
  Achievements: "/achievements",
  Friends: "/friends",
};

/**
 * Derives which main tab is highlighted. Profile stack routes have no tab selected.
 */
export function getMainTabFromSegments(segments: string[]): string | null {
  if (segments.some((s) => s === "profile")) {
    return null;
  }

  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    switch (s) {
      case "arena-space":
        return "ArenaSpace";
      case "tournaments":
        return "Tournaments";
      case "achievements":
        return "Achievements";
      case "friends":
        return "Friends";
      case "index":
      case "(tabs)":
        return "Home";
      default:
        break;
    }
  }

  return "Home";
}

/**
 * Shared bottom tab bar for all authenticated tab routes (single instance in (tabs)/_layout).
 */
export function TabBarShell() {
  const router = useRouter();
  const segments = useSegments();
  const activeTab = getMainTabFromSegments(segments as string[]);

  const onTabPress = (tab: string) => {
    const path = TAB_ROUTES[tab] ?? "/";
    router.navigate(path as never);
  };

  return (
    <View style={styles.tabBar}>
      <BottomNav activeTab={activeTab} onTabPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    width: "100%",
    alignSelf: "stretch",
    flexShrink: 0,
  },
});
