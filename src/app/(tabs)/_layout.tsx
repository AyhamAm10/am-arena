import { Tabs, useRouter, useSegments } from "expo-router";
import { StyleSheet, View } from "react-native";
import BottomNav from "../../components/BottomNav/ui/BottomNav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const TAB_ROUTES: Record<string, string> = {
  Home: "/",
  Tournaments: "/tournaments",
  Reels: "/reels",
  Channels: "/channels",
  Profile: "/profile",
};

function TabBarWithRouter() {
  const router = useRouter();
  const segments = useSegments();
  const segment = (segments[segments.length - 1] ?? "index") as string;
  const activeTab =
    segment === "index"
      ? "Home"
      : segment === "tournaments"
        ? "Tournaments"
        : segment === "reels"
          ? "Reels"
          : segment === "channels"
            ? "Channels"
            : segment === "profile"
              ? "Profile"
              : "Home";

  const onTabPress = (tab: string) => {
    const path = TAB_ROUTES[tab] ?? "/";
    router.navigate(path as any);
  };

  return (
    <View style={styles.tabBar}>
      <BottomNav activeTab={activeTab} onTabPress={onTabPress} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <QueryClientProvider client={queryClient}>
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="tournaments" />
        <Tabs.Screen name="reels" />
        <Tabs.Screen name="channels" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <TabBarWithRouter />
    </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabBar: {},
});
