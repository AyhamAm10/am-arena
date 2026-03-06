import { colors } from "@/src/theme/colors";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import type { TournamentCardState } from "../state/init";

type Props = {
  card: TournamentCardState | undefined;
};

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
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="sports-esports" size={40} color={colors.grey} />
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.prize}>{prize}</Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Icon name="people" size={16} color={colors.grey} />
            <Text style={styles.metaText}>
              {participantsCurrent}/{participantsMax}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="schedule" size={16} color={colors.grey} />
            <Text style={styles.metaText}>{timeRemaining}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={onJoinPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Join Now</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 4,
  },
  prize: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryPurple,
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.grey,
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
