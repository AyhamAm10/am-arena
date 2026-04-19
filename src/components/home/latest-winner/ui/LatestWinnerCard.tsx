import { flexRowRtl, textRtl } from "@/src/lib/rtl";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { colors_V2 } from "@/src/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMirror } from "../state";

export default function LatestWinnerCard() {
  const teamName = useMirror("teamName");
  const tournamentName = useMirror("tournamentName");
  const imageSource = useMirror("imageSource");

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, textRtl]}>بطل الموسم</Text>
        <Text style={[styles.globalRanking, textRtl]}>التصنيف العالمي</Text>
      </View>

      <View style={styles.container}>
        {imageSource ? (
          <ImageBackground
            source={{ uri: formatImageUrl(imageSource as string) }}
            style={styles.imageBackground}
            imageStyle={styles.imageRadius}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["transparent", "rgba(26, 14, 37, 0.8)", colors_V2.background]}
              style={styles.overlay}
            >
              {renderContent()}
            </LinearGradient>
          </ImageBackground>
        ) : (
          <LinearGradient
            colors={[colors_V2.purple, colors_V2.background]}
            style={[styles.imageBackground, styles.imageRadius]}
          >
            <View style={styles.overlay}>
              {renderContent()}
            </View>
          </LinearGradient>
        )}
      </View>
    </View>
  );

  function renderContent() {
    return (
      <View style={styles.content}>
        <LinearGradient
          colors={[colors_V2.gold, "#B8960A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topPlayerPill}
        >
          <Text style={[styles.topPlayerText, textRtl]}>أفضل لاعب</Text>
        </LinearGradient>

        <Text style={[styles.playerName, textRtl]} numberOfLines={1}>
          {teamName}
        </Text>
        <Text style={[styles.statsText, textRtl]}>{tournamentName}</Text>

        <View style={styles.badgesRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.badge} />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  headerRow: {
    justifyContent: "space-between",
    alignItems: "center",
    ...flexRowRtl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  globalRanking: {
    fontSize: 12,
    fontWeight: "600",
    color: colors_V2.slate,
    letterSpacing: 0.5,
  },
  container: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors_V2.card,
  },
  imageBackground: {
    height: 240,
    justifyContent: "flex-end",
    width: "100%",
  },
  imageRadius: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  content: {
    gap: 6,
  },
  topPlayerPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  topPlayerText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors_V2.background,
    letterSpacing: 1,
  },
  playerName: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  statsText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors_V2.slate,
  },
  badgesRow: {
    gap: 6,
    marginTop: 8,
    ...flexRowRtl,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors_V2.card,
    borderWidth: 1,
    borderColor: colors_V2.purple,
  },
});
