import { TabBarShell } from "@/src/components/layout/TabBarShell";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
    <View style={styles.root}>
      <View style={styles.tabsArea}>
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
          <Tabs.Screen name="friends" />
          <Tabs.Screen name="notifications" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>
      <TabBarShell />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
  },
  tabsArea: {
    flex: 1,
    minHeight: 0,
  },
});
