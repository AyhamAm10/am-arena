import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import React, { useState } from "react";

const DESCRIPTION_CHAR_THRESHOLD = 96;
const DESCRIPTION_MAX_LINES = 2;

export function ReelDescriptionBlock({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const [clampedToMaxLines, setClampedToMaxLines] = useState(false);
  const trimmed = description.trim();
  if (!trimmed) return null;

  const longByChars = trimmed.length > DESCRIPTION_CHAR_THRESHOLD;
  const canExpand = !expanded && (longByChars || clampedToMaxLines);

  return (
    <View style={styles.descriptionBlock}>
      <View pointerEvents="none">
        <Text
          style={styles.reelDescription}
          numberOfLines={expanded ? undefined : DESCRIPTION_MAX_LINES}
          onTextLayout={(e) => {
            if (expanded) return;
            if (e.nativeEvent.lines.length >= DESCRIPTION_MAX_LINES) {
              setClampedToMaxLines(true);
            }
          }}
        >
          {trimmed}
        </Text>
      </View>
      {canExpand ? (
        <Pressable
          onPress={() => setExpanded(true)}
          hitSlop={8}
          style={styles.moreLessPressable}
          accessibilityRole="button"
          accessibilityLabel="Read More"
        >
          <Text style={styles.moreText}>Read More</Text>
        </Pressable>
      ) : null}
      {expanded ? (
        <Pressable
          onPress={() => setExpanded(false)}
          hitSlop={8}
          style={styles.moreLessPressable}
          accessibilityRole="button"
          accessibilityLabel="Read Less"
        >
          <Text style={styles.moreText}>Read Less</Text>
        </Pressable>
      ) : null}
    </View>
  );
}