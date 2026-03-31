import { colors } from "@/src/theme/colors";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 220,
        contentStyle: { backgroundColor: colors.screenBackground },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[userId]" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="achievements" />
    </Stack>
  );
}
