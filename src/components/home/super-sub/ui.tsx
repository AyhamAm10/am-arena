import { colors } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type Props = {
  title: string;
  description: string;
  progress: number;
};

const DailyChallengeCard: React.FC<Props> = ({
  title,
  description,
  progress,
}) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  return (
    <View style={styles.container}>
      <Icon name="bolt" size={28} color={colors.primaryPurple} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${clampedProgress * 100}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkBackground2,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 2,
  },
  progressWrap: {
    width: 60,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.darkBackground1,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primaryPurple,
    borderRadius: 3,
  },
});

export default DailyChallengeCard;
