import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import { AuthBootstrap } from "@/src/components/auth/AuthBootstrap";
import { ToastHost } from "@/src/components/notifications/ToastHost";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { isRtl } from "@/src/lib/rtl";
import { RegisterNotifications } from "@/src/lib/notifications/registerNotifications";
import { colors } from "@/src/theme/colors";
import { Platform } from "react-native";
import { Linking } from "react-native";
import { resolveDeepLink } from "@/src/lib/deeplink";
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

  useEffect(() => {
    let mounted = true;

    async function handleUrl(raw: string | null) {
      if (!mounted || !raw) return;
      const href = resolveDeepLink(raw);
      if (!href) return;
      try {
        // push resolved internal href
        await router.push(href as any);
      } catch (e) {
        // ignore navigation errors
      }
    }

    // initial
    (async () => {
      try {
        const initial = await Linking.getInitialURL();
        await handleUrl(initial);
      } catch (e) {
        // ignore
      }
    })();

    const sub = Linking.addEventListener("url", (ev) => {
      void handleUrl(ev.url);
    });

    return () => {
      mounted = false;
      try {
        sub.remove();
      } catch (e) {
        /* noop */
      }
    };
  }, []);

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.screenBackground }}
    >
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <AuthBootstrap>
            <>
              <RegisterNotifications />
              <ToastHost />
                  {/* App update modal sits at root so it can block interaction when required */}
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  {typeof window !== 'undefined' ? null : null}
                  {/* Importing dynamically to avoid SSR/type issues in stack file */}
                  {/* AppUpdateModal */}
                  {/* We render lazily to avoid import cycles in native modules during startup. */}
                  <React.Suspense fallback={null}>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    {require("@/src/components/update/AppUpdateModal").AppUpdateModal ? require("@/src/components/update/AppUpdateModal").AppUpdateModal() : null}
                  </React.Suspense>
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
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
