import { colors, colors_V2 } from "@/src/theme/colors";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { flexRowRtl, textRtl } from "@/src/lib/rtl";
import Icon from "react-native-vector-icons/MaterialIcons";

export type FriendAction = "add" | "cancel" | "remove" | "accept" | "reject";

type AddFriendButtonProps = {
  action?: FriendAction;
  onPress: () => void;
  loading: boolean;
  style?: StyleProp<ViewStyle>;
};

const ACTION_CONFIG: Record<FriendAction, { icon: string; label: string }> = {
  add: { icon: "person-add", label: "إضافة صديق" },
  cancel: { icon: "close", label: "إلغاء الطلب" },
  remove: { icon: "person-remove", label: "إزالة الصديق" },
  accept: { icon: "check", label: "قبول الطلب" },
  reject: { icon: "close", label: "رفض الطلب" },
};

function getActionButtonStyle(action: FriendAction) {
  switch (action) {
    case "cancel":
      return styles.cancelButton;
    case "remove":
      return styles.removeButton;
    case "accept":
      return styles.acceptButton;
    case "reject":
      return styles.rejectButton;
    case "add":
    default:
      return styles.addButton;
  }
}

export function AddFriendButton({
  action = "add",
  onPress,
  loading,
  style,
}: AddFriendButtonProps) {
  const { icon, label } = ACTION_CONFIG[action];
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        getActionButtonStyle(action),
        pressed && styles.btnPressed,
        style,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View style={styles.row}>
          <Icon name={icon} size={22} color={colors.white} />
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
    width: "100%",
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: colors_V2.primary,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.12)",
  },
  removeButton: {
    backgroundColor: "rgba(244,63,94,0.20)",
    borderColor: "rgba(244,63,94,0.34)",
  },
  acceptButton: {
    backgroundColor: colors_V2.success,
    borderColor: "rgba(255,255,255,0.12)",
  },
  rejectButton: {
    backgroundColor: "rgba(139,92,246,0.22)",
    borderColor: "rgba(167,139,250,0.32)",
  },
  btnPressed: {
    opacity: 0.88,
  },
  row: {
    ...flexRowRtl,
    alignItems: "center",
  },
  label: {
    marginStart: 10,
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    ...textRtl,
  },
});
