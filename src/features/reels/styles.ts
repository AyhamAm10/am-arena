import { colors } from "@/src/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  listWrap: {
    flex: 1,
    minHeight: 0,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 18,
    color: colors.white,
    textAlign: "center",
  },
  muted: {
    fontSize: 14,
    color: colors.grey,
    textAlign: "center",
    marginTop: 8,
  },
  reelPageFull: {
    alignSelf: "center",
    backgroundColor: colors.screenBackground,
    overflow: "hidden",
  },
  videoShell: {
    flex: 1,
    width: "100%",
    minHeight: 0,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  /** Wraps `Video` + invisible tap target; keeps hit-testing contained. */
  videoPlayerStack: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  /** Receives taps for play/pause; sits above the video, below overlays (zIndex in ui). */
  videoTapLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  /** Fills shell; scaling is handled by expo-av `resizeMode` (CONTAIN). */
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.darkBackground1,
  },
  videoPlaceholderText: {
    color: colors.grey,
    fontSize: 14,
  },
  /** Title, description, single comment preview — bottom-aligned with action column; does not cover the video center. */
  overlayBottomLeft: {
    position: "absolute",
    left: 12,
    right: 72,
    bottom: 52,
    zIndex: 2,
    justifyContent: "flex-end",
  },
  reelTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: -0.2,
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  reelDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.white,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  descriptionBlock: {
    marginTop: 0,
    maxWidth: "100%",
  },
  moreLessPressable: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
  moreText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: colors.primaryPurple,
  },
  commentPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-start",
    maxWidth: "100%",
    backgroundColor: "rgba(10, 6, 16, 0.78)",
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.1)",
  },
  commentPreviewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.darkBackground2,
    overflow: "hidden",
  },
  commentPreviewMeta: {
    flex: 1,
    minWidth: 0,
  },
  commentPreviewUser: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  commentPreviewBody: {
    fontSize: 13,
    color: colors.grey,
    marginTop: 2,
    lineHeight: 17,
  },
  overlayRight: {
    position: "absolute",
    right: 12,
    bottom: 52,
    alignItems: "center",
    gap: 20,
    zIndex: 2,
  },
  bottomChrome: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  overlayAction: {
    alignItems: "center",
    gap: 6,
  },
  overlayCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayCount: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  progressTrack: {
    height: 3,
    width: "100%",
    backgroundColor: colors.darkBackground2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primaryPurple,
  },
  footerStrip: {
    height: 12,
    width: "100%",
    backgroundColor: colors.screenBackground,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  /** Host for `AnimatedBottomSheet`: dimming comes from `SheetDimmedBackdrop`. */
  modalBackdropHost: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalKeyboardHost: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalSheet: {
    maxHeight: "72%",
    backgroundColor: colors.darkBackground1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 8,
  },
  modalGrab: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.grey,
    marginTop: 8,
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white,
  },
  modalCountBadge: {
    backgroundColor: colors.darkBackground2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  modalCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.grey,
  },
  modalClose: {
    padding: 8,
  },
  modalCloseText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  modalList: {
    flexGrow: 0,
    maxHeight: 320,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  commentRow: {
    marginBottom: 16,
  },
  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
  commentTime: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.grey,
  },
  commentBody: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 20,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.darkBackground2,
    marginRight: 10,
  },
  commentRowInner: {
    flexDirection: "row",
  },
  modalInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  modalInputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryPurple,
  },
  modalInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.darkBackground1,
    borderRadius: 22,
    paddingLeft: 14,
    paddingRight: 4,
    minHeight: 44,
  },
  modalInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    paddingVertical: 8,
  },
  modalSend: {
    backgroundColor: colors.primaryPurple,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modalSendText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 12,
  },
});
