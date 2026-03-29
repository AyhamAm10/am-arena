import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { computeLevelAndProgress } from "@/src/lib/utils/level-from-xp";
import { colors } from "@/src/theme/colors";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type ProfileAvatarSectionProps = {
  gamerName: string;
  fullName: string;
  profilePictureUrl: string | null | undefined;
  xpPoints: number;
  rankLabel: string;
};

export function ProfileAvatarSection({
  gamerName,
  fullName,
  profilePictureUrl,
  xpPoints,
  rankLabel,
}: ProfileAvatarSectionProps) {
  const { level, progress } = useMemo(
    () => computeLevelAndProgress(xpPoints),
    [xpPoints]
  );

  const uri = profilePictureUrl ? formatImageUrl(profilePictureUrl) : "";

  return (
    <View style={styles.wrap}>
      <View style={styles.avatarRing}>
        <View style={styles.avatarCircle}>
          {uri ? (
            <Image source={{ uri }} style={styles.avatarImg} contentFit="cover" />
          ) : (
            <Icon name="person" size={56} color={colors.grey} />
          )}
        </View>
        <View style={styles.levelPill}>
          <Text style={styles.levelPillText}>LVL {level}</Text>
        </View>
      </View>

      <Text style={styles.gamerName}>{gamerName}</Text>
      <Text style={styles.fullName}>{fullName}</Text>

      <View style={styles.rankRow}>
        <Icon name="shield" size={18} color={colors.primaryPurple} />
        <Text style={styles.rankText}>{rankLabel}</Text>
      </View>

      <View style={styles.xpBarTrack}>
        <View
          style={[styles.xpBarFill, { width: `${Math.round(progress * 100)}%` }]}
        />
      </View>
    </View>
  );
}

const AVATAR = 112;

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarRing: {
    width: AVATAR + 16,
    height: AVATAR + 16,
    borderRadius: (AVATAR + 16) / 2,
    borderWidth: 6,
    borderColor: colors.primaryPurple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarCircle: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: colors.darkBackground2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  levelPill: {
    position: "absolute",
    bottom: -10,
    alignSelf: "center",
    backgroundColor: colors.primaryPurple,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  levelPillText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  gamerName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  fullName: {
    color: colors.grey,
    fontSize: 15,
    marginBottom: 10,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rankText: {
    marginLeft: 6,
    color: colors.primaryPurple,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  xpBarTrack: {
    width: "100%",
    maxWidth: 200,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.darkBackground2,
    overflow: "hidden",
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: colors.primaryPurple,
    borderRadius: 2,
  },
});
