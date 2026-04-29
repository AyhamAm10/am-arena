import { resolveMediaUrl } from "@/src/lib/utils/resolve-media-url";
import { colors_V2 } from "@/src/theme/colors";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type RankAvatarProps = {
  avatarSource?: string | ImageSourcePropType;
  achievementColor?: string | null;
  achievementIconUrl?: string | null;
  hasActiveRank: boolean;
  neutralBorderColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  frameStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  placeholderStyle?: StyleProp<ViewStyle>;
  badgeStyle?: StyleProp<ViewStyle>;
  badgeIconStyle?: StyleProp<ImageStyle>;
};

export default function RankAvatar({
  avatarSource,
  achievementColor,
  achievementIconUrl,
  hasActiveRank,
  neutralBorderColor = colors_V2.primary,
  containerStyle,
  frameStyle,
  imageStyle,
  placeholderStyle,
  badgeStyle,
  badgeIconStyle,
}: RankAvatarProps) {
  const borderColor =
    hasActiveRank && achievementColor?.trim()
      ? achievementColor.trim()
      : neutralBorderColor;
  const resolvedAchievementIcon = useMemo(
    () =>
      hasActiveRank && achievementIconUrl?.trim()
        ? resolveMediaUrl(achievementIconUrl, "achievementIcon")
        : "",
    [hasActiveRank, achievementIconUrl]
  );
  const [showAchievementIcon, setShowAchievementIcon] = useState(
    Boolean(resolvedAchievementIcon)
  );

  useEffect(() => {
    setShowAchievementIcon(Boolean(resolvedAchievementIcon));
  }, [resolvedAchievementIcon]);

  const source =
    typeof avatarSource === "string"
      ? { uri: resolveMediaUrl(avatarSource, "image") }
      : avatarSource;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.frame, { borderColor }, frameStyle]}>
        {source ? (
          <Image source={source} style={[styles.image, imageStyle]} />
        ) : (
          <View style={[styles.placeholder, placeholderStyle]} />
        )}
      </View>
      {showAchievementIcon ? (
        <View style={[styles.badge, badgeStyle]}>
          <Image
            source={{ uri: resolvedAchievementIcon }}
            style={[styles.badgeIcon, badgeIconStyle]}
            resizeMode="contain"
            onError={() => setShowAchievementIcon(false)}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  frame: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {},
  placeholder: {
    backgroundColor: colors_V2.card,
  },
  badge: {
    position: "absolute",
    backgroundColor: colors_V2.background,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIcon: {},
});
