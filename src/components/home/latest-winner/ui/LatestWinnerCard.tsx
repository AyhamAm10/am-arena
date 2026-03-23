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
          imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>LATEST WINNER</Text>
            </View>
            <Text style={styles.teamName}>{teamName}</Text>
            <Text style={styles.tournamentName}>{tournamentName}</Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.imageBackground, styles.overlay]}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>LATEST WINNER</Text>
          </View>
          <Text style={styles.teamName}>{teamName}</Text>
          <Text style={styles.tournamentName}>{tournamentName}</Text>
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
  },
  imageBackground: {
    height: 200,
    justifyContent: "flex-end",
    width: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryPurple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  teamName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 4,
  },
  tournamentName: {
    fontSize: 14,
    color: colors.grey,
  },
});
