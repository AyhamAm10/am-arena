import { TabBarShell } from "@/src/components/layout/TabBarShell";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
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
        <Tabs.Screen name="friends" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <TabBarShell />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
