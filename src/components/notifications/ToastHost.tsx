import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors_V2 } from "@/src/theme/colors";
import { useToastStore } from "@/src/lib/notifications/toast";

const MAX_TOAST_WIDTH = 440;

const variantTheme = {
  success: {
    border: "rgba(16, 185, 129, 0.42)",
    background: "rgba(15, 35, 27, 0.96)",
    accent: "#10B981",
    glow: "rgba(16, 185, 129, 0.18)",
    icon: "checkmark-circle",
  },
  error: {
    border: "rgba(244, 63, 94, 0.42)",
    background: "rgba(42, 17, 23, 0.96)",
    accent: "#F43F5E",
    glow: "rgba(244, 63, 94, 0.18)",
    icon: "alert-circle",
  },
} as const;

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const toasts = useToastStore((state) => state.toasts);

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        paddingTop: insets.top + 12,
        paddingHorizontal: 16,
      },
    ],
    [insets.top]
  );

  return (
    <View pointerEvents="box-none" style={styles.host}>
      <View pointerEvents="box-none" style={containerStyle}>
        {toasts.map((toast) => {
          const theme = variantTheme[toast.type];
          return (
            <Animated.View
              key={toast.id}
              entering={FadeInDown.duration(220).springify()}
              exiting={FadeOutUp.duration(180)}
              layout={Layout.springify().damping(18).stiffness(240)}
              style={[
                styles.toast,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  shadowColor: theme.accent,
                },
              ]}
            >
              <View
                style={[
                  styles.accent,
                  { backgroundColor: theme.accent, shadowColor: theme.glow },
                ]}
              />
              <View style={styles.iconWrap}>
                <Ionicons
                  name={theme.icon}
                  size={20}
                  color={toast.type === "success" ? colors_V2.success : colors_V2.error}
                />
              </View>
              <Animated.Text style={styles.message}>{toast.message}</Animated.Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  container: {
    alignItems: "center",
    gap: 10,
  },
  toast: {
    width: "100%",
    maxWidth: MAX_TOAST_WIDTH,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowOpacity: 0.32,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  message: {
    flex: 1,
    color: colors_V2.textPrimary,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});