import { flexRowRtl, progressFillRtl, textRtl } from "@/src/lib/rtl";
import { colors } from "@/src/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useMirror } from "../state";

export default function SuperSubCard() {
  const title = useMirror("title");
  const description = useMirror("description");
  const progress = useMirror("progress");
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <LinearGradient
      colors={["#22D3EE", "#A855F7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBorder}
    >
      <View style={[styles.inner, flexRowRtl]}>
        <View style={styles.iconCircle} />
        <View style={styles.content}>
          <Text style={[styles.title, textRtl]}>{title}</Text>
          <Text style={[styles.description, textRtl]}>{description}</Text>
        </View>
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                progressFillRtl,
                { width: `${clampedProgress * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 14,
    padding: 1,
  },
  inner: {
    alignItems: "center",
    backgroundColor: colors.darkBackground2,
    borderRadius: 13,
    padding: 14,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkBackground1,
    borderWidth: 1,
    borderColor: colors.primaryPurple,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.grey,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  description: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
    marginTop: 4,
  },
  progressWrap: {
    width: 56,
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
