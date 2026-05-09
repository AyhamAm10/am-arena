import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Easing, Linking } from "react-native";
import useUpdateStore from "@/src/stores/updateStore";
import { colors_V2 } from "@/src/theme/colors";
import { styles as modalStyles } from "@/src/components/update/styles";
import * as Application from "expo-application";

function useAppBuildValue() {
  try {
    const b = (Application.nativeBuildVersion || Application.nativeApplicationVersion) as string | undefined;
    return b ? String(b) : "0";
  } catch {
    return "0";
  }
}

export function AppUpdateModal() {
  const update = useUpdateStore((s) => s.update);
  const clearUpdate = useUpdateStore((s) => s.clearUpdate);
  const buildValue = useAppBuildValue();
  const [visible, setVisible] = useState(false);
  const scale = useMemo(() => new Animated.Value(0.95), []);
  const opacity = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (update) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 160, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.95, duration: 160, useNativeDriver: true }),
      ]).start(() => setVisible(false));
    }
  }, [update, opacity, scale]);

  if (!update) return null;

  const current = Number(buildValue) || 0;
  const latest = Number(update.latest_build) || 0;
  const minSupported = Number(update.min_supported_build) || 0;
  const isMandatory = current < minSupported || update.mandatory === true;
  const isOptional = !isMandatory && current < latest;

  const title = isMandatory ? "التطبيق بحاجة إلى تحديث" : "يتوفر تحديث جديد";
  const desc = isMandatory
    ? "التطبيق بحاجة إلى تحديث للاستمرار. هذا الإصدار لم يعد مدعوماً."
    : "يتوفر إصدار جديد من التطبيق لتحسين الأداء والميزات.";

  const onUpdate = () => {
    try {
      Linking.openURL(update.update_url);
    } catch {
      // ignore
    }
  };

  const onLater = () => {
    clearUpdate();
  };

  const handleRequestClose = () => {
    if (isMandatory) return; // ignore back button
    onLater();
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={handleRequestClose}>
      <View style={modalStyles.backdrop} pointerEvents={"auto"}>
        <Animated.View style={[modalStyles.host, { opacity, transform: [{ scale }] }] }>
          <Text style={modalStyles.title}>{title}</Text>
          <Text style={modalStyles.description}>{desc}</Text>
          <View style={modalStyles.buttonsRow}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.primaryButton]}
              onPress={onUpdate}
              accessibilityRole="button"
            >
              <Text style={modalStyles.primaryLabel}>{isMandatory ? "تحديث التطبيق" : "تحديث الآن"}</Text>
            </TouchableOpacity>
            {!isMandatory ? (
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.secondaryButton]}
                onPress={onLater}
                accessibilityRole="button"
              >
                <Text style={modalStyles.secondaryLabel}>لاحقاً</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default AppUpdateModal;
