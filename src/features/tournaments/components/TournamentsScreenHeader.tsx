import { tournamentsAr } from "@/src/features/tournaments/strings";
import { tournamentsTheme } from "@/src/features/tournaments/theme";
import { isRtl, rtlMirrorIconStyle } from "@/src/lib/rtl";
import { useRouter } from "expo-router";
import React from "react";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

function backIconStyle() {
  if (isRtl()) return rtlMirrorIconStyle;
  return { transform: [{ scaleX: -1 }] };
}

export function TournamentsScreenHeader() {
  const router = useRouter();

  const onBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/" as never);
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: tournamentsAr.shareMessage,
        title: tournamentsAr.shareTitle,
      });
    } catch {
      /* user dismissed */
    }
  };

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={tournamentsAr.backA11y}
        style={styles.sideBtn}
      >
        <Icon
          name="arrow-back"
          size={24}
          color={tournamentsTheme.title}
          style={backIconStyle()}
        />
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>
        {tournamentsAr.screenTitle}
      </Text>
      <TouchableOpacity
        onPress={onShare}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={tournamentsAr.shareA11y}
        style={styles.sideBtn}
      >
        <Icon name="share" size={22} color={tournamentsTheme.title} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    direction: "rtl",
  },
  sideBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: tournamentsTheme.title,
    writingDirection: "rtl",
  },
});
