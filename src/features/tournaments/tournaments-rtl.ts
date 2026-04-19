import type { TextStyle, ViewStyle } from "react-native";

/**
 * Tournaments tab is Arabic-first: RTL text and layout even when I18nManager
 * has not applied forceRTL yet (reload required on some platforms).
 */
export const arText: TextStyle = {
  textAlign: "right",
  writingDirection: "rtl",
};

export const arWriting: TextStyle = {
  writingDirection: "rtl",
};

/** Root / card layout direction for flex rows and horizontal flow. */
export const arDirection: ViewStyle = {
  direction: "rtl",
};

/** Progress fill anchored to the logical start (right in RTL card). */
export const arProgressFill: ViewStyle = {
  marginStart: "auto",
};
