import { colors, colors_V2 } from "@/src/theme/colors";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { flexRowRtl, textRtl } from "@/src/lib/rtl";
import Icon from "react-native-vector-icons/MaterialIcons";

export type FriendAction = "add" | "cancel" | "remove";

type AddFriendButtonProps = {
  action?: FriendAction;
  onPress: () => void;
  loading: boolean;
};

const ACTION_CONFIG: Record<FriendAction, { icon: string; label: string }> = {
  add: { icon: "person-add", label: "إضافة صديق" },
  cancel: { icon: "close", label: "إلغاء الطلب" },
  remove: { icon: "person-remove", label: "إزالة الصديق" },
};

export function AddFriendButton({
  action = "add",
  onPress,
  loading,
}: AddFriendButtonProps) {
  const { icon, label } = ACTION_CONFIG[action];
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
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
    backgroundColor: colors_V2.purple,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
    width: "100%",
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
    color: colors_V2.lavenderLight,
    fontSize: 16,
    fontWeight: "700",
    ...textRtl,
  },
});
