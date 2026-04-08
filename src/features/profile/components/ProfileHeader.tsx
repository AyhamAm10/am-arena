import { colors } from "@/src/theme/colors";
import {
  AnimatedPopoverModal,
  PopoverContent,
  PopoverScrim,
} from "@/src/components/motion";
import React, { useState } from "react";
import {
  ActivityIndicator,
  I18nManager,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { rtlMirrorIconStyle } from "@/src/lib/rtl";
import Icon from "react-native-vector-icons/MaterialIcons";

type ProfileHeaderProps = {
  title: string;
  showBack: boolean;
  onBack?: () => void;
  /** Own profile: overflow menu — navigate to edit screen. */
  onEditPress?: () => void;
  /** Own profile: POST /auth/logout (wired via profile Api layer). */
  onLogoutPress?: () => void | Promise<void>;
  isLoggingOut?: boolean;
};

export function ProfileHeader({
  title,
  showBack,
  onBack,
  onEditPress,
  onLogoutPress,
  isLoggingOut,
}: ProfileHeaderProps) {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const menuEnabled = Boolean(onEditPress || onLogoutPress);

  const handleEdit = () => {
    closeMenu();
    onEditPress?.();
  };

  const handleLogout = () => {
    closeMenu();
    void onLogoutPress?.();
  };

  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            onPress={onBack}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <Icon
              name="arrow-back"
              size={22}
              color={colors.white}
              style={rtlMirrorIconStyle}
            />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side}>
        <Pressable
          onPress={menuEnabled ? openMenu : undefined}
          style={styles.iconBtn}
          hitSlop={8}
          accessibilityLabel="فتح القائمة"
          disabled={!menuEnabled}
        >
          <Icon name="more-vert" size={22} color={colors.white} />
        </Pressable>
      </View>

      <AnimatedPopoverModal
        visible={menuOpen}
        onRequestClose={closeMenu}
      >
        <View style={styles.modalRoot} pointerEvents="box-none">
          <PopoverScrim onPress={closeMenu} />
          <PopoverContent
            style={[
              styles.dropdown,
              {
                top: insets.top + 52,
                ...(I18nManager.isRTL
                  ? { left: Math.max(insets.left, 12) + 4 }
                  : { right: Math.max(insets.right, 12) + 4 }),
              },
            ]}
          >
            {onEditPress ? (
              <Pressable
                style={({ pressed }) => [
                  styles.menuRow,
                  pressed && styles.menuRowPressed,
                ]}
                onPress={handleEdit}
                disabled={isLoggingOut}
              >
                <Icon name="edit" size={20} color={colors.white} />
                <Text style={styles.menuLabel}>Edit</Text>
              </Pressable>
            ) : null}
            {onEditPress && onLogoutPress ? (
              <View style={styles.menuDivider} />
            ) : null}
            {onLogoutPress ? (
              <Pressable
                style={({ pressed }) => [
                  styles.menuRow,
                  pressed && styles.menuRowPressed,
                ]}
                onPress={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <ActivityIndicator size="small" color={colors.error} />
                ) : (
                  <Icon name="exit-to-app" size={20} color={colors.error} />
                )}
                <Text style={[styles.menuLabel, styles.menuLabelDanger]}>
                  تسجيل الخروج
                </Text>
              </Pressable>
            ) : null}
          </PopoverContent>
        </View>
      </AnimatedPopoverModal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  side: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: colors.white,
    fontSize: 17,
    fontWeight: "600",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkBackground2,
    alignItems: "center",
    justifyContent: "center",
  },
  modalRoot: {
    flex: 1,
  },
  dropdown: {
    position: "absolute",
    minWidth: 168,
    backgroundColor: colors.darkBackground2,
    borderRadius: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.darkBackground1,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuRowPressed: {
    backgroundColor: colors.darkBackground1,
  },
  menuLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  menuLabelDanger: {
    color: colors.error,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.darkBackground1,
    marginHorizontal: 12,
  },
});
