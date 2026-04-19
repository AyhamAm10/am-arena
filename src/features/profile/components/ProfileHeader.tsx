import { colors_V2 } from "@/src/theme/colors";
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
import { flexRowRtl, rtlMirrorIconStyle, textRtl, writingRtl } from "@/src/lib/rtl";
import Icon from "react-native-vector-icons/MaterialIcons";
import Svg, { Path } from "react-native-svg";

function SettingsGlyph({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M7.09722 19.4444L6.70833 16.3333C6.49769 16.2523 6.29919 16.1551 6.11285 16.0417C5.92651 15.9282 5.74421 15.8067 5.56597 15.6771L2.67361 16.8924L0 12.2743L2.50347 10.3785C2.48727 10.265 2.47917 10.1557 2.47917 10.0503C2.47917 9.94502 2.47917 9.83565 2.47917 9.72222C2.47917 9.60879 2.47917 9.49942 2.47917 9.3941C2.47917 9.28877 2.48727 9.1794 2.50347 9.06597L0 7.17014L2.67361 2.55208L5.56597 3.76736C5.74421 3.63773 5.93056 3.5162 6.125 3.40278C6.31945 3.28935 6.51389 3.19213 6.70833 3.11111L7.09722 0H12.4444L12.8333 3.11111C13.044 3.19213 13.2425 3.28935 13.4288 3.40278C13.6152 3.5162 13.7975 3.63773 13.9757 3.76736L16.8681 2.55208L19.5417 7.17014L17.0382 9.06597C17.0544 9.1794 17.0625 9.28877 17.0625 9.3941C17.0625 9.49942 17.0625 9.60879 17.0625 9.72222C17.0625 9.83565 17.0625 9.94502 17.0625 10.0503C17.0625 10.1557 17.0463 10.265 17.0139 10.3785L19.5174 12.2743L16.8438 16.8924L13.9757 15.6771C13.7975 15.8067 13.6111 15.9282 13.4167 16.0417C13.2222 16.1551 13.0278 16.2523 12.8333 16.3333L12.4444 19.4444H7.09722ZM8.79861 17.5H10.7188L11.059 14.9236C11.5613 14.794 12.0272 14.6036 12.4566 14.3524C12.886 14.1013 13.2789 13.7975 13.6354 13.441L16.0417 14.4375L16.9896 12.7847L14.8993 11.2049C14.9803 10.978 15.037 10.739 15.0694 10.4878C15.1019 10.2367 15.1181 9.98148 15.1181 9.72222C15.1181 9.46296 15.1019 9.20775 15.0694 8.9566C15.037 8.70544 14.9803 8.46643 14.8993 8.23958L16.9896 6.65972L16.0417 5.00694L13.6354 6.02778C13.2789 5.65509 12.886 5.34317 12.4566 5.09201C12.0272 4.84085 11.5613 4.65046 11.059 4.52083L10.7431 1.94444H8.82292L8.48264 4.52083C7.98032 4.65046 7.51447 4.84085 7.08507 5.09201C6.65567 5.34317 6.26273 5.64699 5.90625 6.00347L3.5 5.00694L2.55208 6.65972L4.64236 8.21528C4.56134 8.45833 4.50463 8.70139 4.47222 8.94444C4.43982 9.1875 4.42361 9.44676 4.42361 9.72222C4.42361 9.98148 4.43982 10.2326 4.47222 10.4757C4.50463 10.7187 4.56134 10.9618 4.64236 11.2049L2.55208 12.7847L3.5 14.4375L5.90625 13.4167C6.26273 13.7894 6.65567 14.1013 7.08507 14.3524C7.51447 14.6036 7.98032 14.794 8.48264 14.9236L8.79861 17.5ZM9.81945 13.125C10.7593 13.125 11.5613 12.7928 12.2257 12.1285C12.89 11.4641 13.2222 10.662 13.2222 9.72222C13.2222 8.78241 12.89 7.98032 12.2257 7.31597C11.5613 6.65162 10.7593 6.31944 9.81945 6.31944C8.86343 6.31944 8.05729 6.65162 7.40104 7.31597C6.74479 7.98032 6.41667 8.78241 6.41667 9.72222C6.41667 10.662 6.74479 11.4641 7.40104 12.1285C8.05729 12.7928 8.86343 13.125 9.81945 13.125Z"
        fill={color}
      />
    </Svg>
  );
}

type ProfileHeaderProps = {
  title: string;
  showBack: boolean;
  onBack?: () => void;
  /** Own profile: overflow menu — navigate to edit screen. */
  onEditPress?: () => void;
  onViewAllAchievementsPress?: () => void;
  /** Own profile: POST /auth/logout (wired via profile Api layer). */
  onLogoutPress?: () => void | Promise<void>;
  isLoggingOut?: boolean;
};

export function ProfileHeader({
  title,
  showBack,
  onBack,
  onEditPress,
  onViewAllAchievementsPress,
  onLogoutPress,
  isLoggingOut,
}: ProfileHeaderProps) {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const menuEnabled = Boolean(onEditPress || onLogoutPress || onViewAllAchievementsPress);

  const handleEdit = () => {
    closeMenu();
    onEditPress?.();
  };

  const handleLogout = () => {
    closeMenu();
    void onLogoutPress?.();
  };

  const handleViewAllAchievements = () => {
    closeMenu();
    onViewAllAchievementsPress?.();
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
              color={colors_V2.lavender}
              style={rtlMirrorIconStyle}
            />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.side}>
        {menuEnabled ? (
          <Pressable
            onPress={openMenu}
            style={styles.iconBtn}
            hitSlop={8}
            accessibilityLabel="فتح القائمة"
          >
            <SettingsGlyph color={colors_V2.lavenderLight} />
          </Pressable>
        ) : null}
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
                <Icon name="edit" size={20} color={colors_V2.lilac} />
                <Text style={[styles.menuLabel, textRtl]}>تعديل</Text>
              </Pressable>
            ) : null}
            {onEditPress && (onViewAllAchievementsPress || onLogoutPress) ? (
              <View style={styles.menuDivider} />
            ) : null}
            {onViewAllAchievementsPress ? (
              <Pressable
                style={({ pressed }) => [
                  styles.menuRow,
                  pressed && styles.menuRowPressed,
                ]}
                onPress={handleViewAllAchievements}
                disabled={isLoggingOut}
              >
                <Icon name="emoji-events" size={20} color={colors_V2.skyBlue} />
                <Text style={[styles.menuLabel, textRtl]}>مشاهدة جميع الانجازات</Text>
              </Pressable>
            ) : null}
            {onViewAllAchievementsPress && onLogoutPress ? (
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
                  <ActivityIndicator size="small" color={colors_V2.errorLight} />
                ) : (
                  <Icon name="exit-to-app" size={20} color={colors_V2.errorLight} />
                )}
                <Text style={[styles.menuLabel, styles.menuLabelDanger, textRtl]}>
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
    ...flexRowRtl,
    alignItems: "center",
    marginBottom: 16,
  },
  side: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: colors_V2.lilac,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  modalRoot: {
    flex: 1,
  },
  dropdown: {
    position: "absolute",
    minWidth: 220,
    backgroundColor: colors_V2.card,
    borderRadius: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(216, 185, 255, 0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  menuRow: {
    ...flexRowRtl,
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuRowPressed: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  menuLabel: {
    color: colors_V2.lilac,
    fontSize: 15,
    fontWeight: "600",
    ...writingRtl,
  },
  menuLabelDanger: {
    color: colors_V2.errorLight,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(216, 185, 255, 0.12)",
    marginHorizontal: 12,
  },
});
