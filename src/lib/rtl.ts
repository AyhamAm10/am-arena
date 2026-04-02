import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { I18nManager } from "react-native";

/** Force RTL for the whole app. Import this module once from the root layout. */
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export function isRtl(): boolean {
  return I18nManager.isRTL;
}

/** Mirror directional icons (back arrows, chevrons) in RTL layouts. */
export const rtlMirrorIconStyle: StyleProp<TextStyle> = I18nManager.isRTL
  ? { transform: [{ scaleX: -1 }] }
  : undefined;

/** Same transform for wrapping vector icons that do not accept a `style` prop. */
export const rtlMirrorViewStyle: ViewStyle | undefined = I18nManager.isRTL
  ? { transform: [{ scaleX: -1 }] }
  : undefined;

/**
 * Horizontal rows: use instead of `flexDirection: "row"` so leading content sits on the
 * right under RTL when the host does not mirror flex rows (common on RN Web).
 */
export const flexRowRtl: ViewStyle = {
  flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
};

/** Default Arabic text alignment when RTL is active. */
export const textRtl: TextStyle = I18nManager.isRTL
  ? { textAlign: "right", writingDirection: "rtl" }
  : {};

/** Text direction only (e.g. centered labels that should still resolve bidi correctly). */
export const writingRtl: TextStyle = I18nManager.isRTL
  ? { writingDirection: "rtl" }
  : {};

/** Progress fill grows from the visual end edge in RTL. */
export const progressFillRtl: ViewStyle = I18nManager.isRTL
  ? { marginStart: "auto" }
  : {};

/** Overlay pill pinned to the top visual trailing corner (e.g. winner badge). */
export const overlayPillAlignRtl: ViewStyle = I18nManager.isRTL
  ? { alignSelf: "flex-start" }
  : { alignSelf: "flex-end" };
