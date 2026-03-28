import { colors } from "@/src/theme/colors";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type AddFriendButtonProps = {
  onPress: () => void;
  loading: boolean;
};

export function AddFriendButton({ onPress, loading }: AddFriendButtonProps) {
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
          <Icon name="person-add" size={22} color={colors.white} />
          <Text style={styles.label}>Add Friend</Text>
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
