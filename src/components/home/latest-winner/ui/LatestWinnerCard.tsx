import { overlayPillAlignRtl, textRtl } from "@/src/lib/rtl";
import { colors } from "@/src/theme/colors";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMirror } from "../state";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";

export default function LatestWinnerCard() {
  const teamName = useMirror("teamName");
  const tournamentName = useMirror("tournamentName");
  const imageSource = useMirror("imageSource");

  return (
    <View style={styles.container}>
      {imageSource ? (
        <ImageBackground
          source={{ uri: formatImageUrl(imageSource as string) }}
          style={styles.imageBackground}
          imageStyle={styles.imageRadius}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={[styles.pill, overlayPillAlignRtl]}>
              <Text style={[styles.pillText, textRtl]}>آخر فائز</Text>
            </View>
            <Text style={[styles.teamName, textRtl]}>{teamName}</Text>
            <Text style={[styles.tournamentName, textRtl]}>{tournamentName}</Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.imageBackground, styles.fallbackBg]}>
          <View style={styles.overlay}>
            <View style={[styles.pill, overlayPillAlignRtl]}>
              <Text style={[styles.pillText, textRtl]}>آخر فائز</Text>
            </View>
            <Text style={[styles.teamName, textRtl]}>{teamName}</Text>
            <Text style={[styles.tournamentName, textRtl]}>{tournamentName}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.darkBackground2,
    borderWidth: 1,
    borderColor: colors.darkBackground1,
  },
  imageBackground: {
    height: 200,
    justifyContent: "flex-end",
    width: "100%",
  },
  imageRadius: {
    borderRadius: 16,
  },
  fallbackBg: {
    backgroundColor: colors.darkBackground1,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  pill: {
    backgroundColor: colors.primaryPurple,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  pillText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 1,
  },
  teamName: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 6,
  },
  tournamentName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.grey,
    lineHeight: 20,
  },
});
