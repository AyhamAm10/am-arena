import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { AuthBootstrap } from "@/src/components/auth/AuthBootstrap";
import { isRtl } from "@/src/lib/rtl";
import { RegisterNotifications } from "@/src/lib/notifications/registerNotifications";
import { colors } from "@/src/theme/colors";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

const stackChrome = {
  headerShown: false as const,
  contentStyle: { backgroundColor: colors.screenBackground },
};

const rtl = isRtl();
/** Push animation: in RTL, horizontal direction is mirrored. */
const pushFromRight = rtl ? "slide_from_left" : "slide_from_right";
const pushFromLeft = rtl ? "slide_from_right" : "slide_from_left";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", "rtl");
      document.body?.setAttribute("dir", "rtl");
    }
  }, []);

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
                animation: pushFromRight,
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
                options={{ ...stackChrome, animation: pushFromRight }}
              />
              <Stack.Screen
                name="register"
                options={{ ...stackChrome, animation: pushFromLeft }}
              />
              <Stack.Screen
                name="tournament/[id]"
                options={{ ...stackChrome, animation: pushFromRight }}
              />
              <Stack.Screen
                name="tournament/[id]/registration"
                options={{ ...stackChrome, animation: pushFromRight }}
              />
              <Stack.Screen
                name="tournament/[id]/details"
                options={{ ...stackChrome, animation: pushFromRight }}
              />
              <Stack.Screen
                name="channel/[id]"
                options={{ ...stackChrome, animation: pushFromLeft }}
              />
            </Stack>
          </>
        </AuthBootstrap>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
