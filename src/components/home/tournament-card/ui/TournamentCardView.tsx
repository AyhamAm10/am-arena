import { HourIcon } from "@/src/components/icons/figma/HourIcon";
import { flexRowRtl, rtlMirrorViewStyle, textRtl } from "@/src/lib/rtl";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { colors } from "@/src/theme/colors";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import type { TournamentCardState } from "../state/init";

type Props = {
  card: TournamentCardState | undefined;
};

function formatPrize(prize: string): string {
  const n = Number(prize);
  if (Number.isFinite(n)) {
    return `${n.toLocaleString("ar")} $`;
  }
  return prize.startsWith("$") ? prize : `${prize} $`;
}

export default function TournamentCardView({ card }: Props) {
  if (!card) return null;

  const {
    title,
    prize,
    participantsCurrent,
    participantsMax,
    timeRemaining,
    imageSource,
    onJoinPress,
  } = card;

  return (
    <View style={styles.container}>
      <View style={styles.imageWrap}>
        {imageSource ? (
          <Image
            source={{ uri: formatImageUrl(imageSource) }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
      <View style={styles.body}>
        <View style={[styles.titleRow, flexRowRtl]}>
          <Text style={[styles.title, textRtl]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.prize, textRtl]}>{formatPrize(prize)}</Text>
        </View>
        <View style={[styles.meta, flexRowRtl]}>
          <Text style={[styles.metaText, textRtl]}>
            {participantsCurrent}/{participantsMax}
          </Text>
          <View style={[styles.metaItem, flexRowRtl]}>
            <View style={rtlMirrorViewStyle}>
              <HourIcon width={14} height={15} color={colors.grey} />
            </View>
            <Text style={[styles.metaText, textRtl]}>{timeRemaining}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={onJoinPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, textRtl]}>انضم الآن</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: colors.darkBackground2,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.darkBackground1,
  },
  imageWrap: {
    height: 100,
    backgroundColor: colors.darkBackground1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: colors.darkBackground1,
  },
  body: {
    padding: 12,
  },
  titleRow: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
  },
  prize: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.neonBlue,
  },
  meta: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metaItem: {
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.primaryPurple,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
});
