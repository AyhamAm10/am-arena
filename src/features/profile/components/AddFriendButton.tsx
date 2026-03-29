import { colors } from "@/src/theme/colors";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export type FriendAction = "add" | "cancel" | "remove";

type AddFriendButtonProps = {
  action?: FriendAction;
  onPress: () => void;
  loading: boolean;
};

const ACTION_CONFIG: Record<FriendAction, { icon: string; label: string }> = {
  add: { icon: "person-add", label: "Add Friend" },
  cancel: { icon: "close", label: "Cancel Request" },
  remove: { icon: "person-remove", label: "Remove Friend" },
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
    backgroundColor: colors.primaryPurple,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    width: "100%",
  },
  btnPressed: {
    opacity: 0.9,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: 10,
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
