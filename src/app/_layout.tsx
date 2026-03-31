import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { AuthBootstrap } from "@/src/components/auth/AuthBootstrap";
import { RegisterNotifications } from "@/src/lib/notifications/registerNotifications";
import { colors } from "@/src/theme/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

const stackChrome = {
  headerShown: false as const,
  contentStyle: { backgroundColor: colors.screenBackground },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.screenBackground }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>
          <>
            <RegisterNotifications />
            <Stack
              screenOptions={{
                ...stackChrome,
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  ...stackChrome,
                  animation: "none",
                }}
              />
              <Stack.Screen
                name="login"
                options={{ ...stackChrome, animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="register"
                options={{ ...stackChrome, animation: "slide_from_left" }}
              />
              <Stack.Screen
                name="tournament/[id]"
                options={{ ...stackChrome, animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="channel/[id]"
                options={{ ...stackChrome, animation: "slide_from_left" }}
              />
            </Stack>
          </>
        </AuthBootstrap>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
