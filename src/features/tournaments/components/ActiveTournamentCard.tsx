import type { PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";
import { formatActiveTournamentCountdownAr } from "@/src/features/tournaments/format-countdown-ar";
import type { TournamentJoinGate } from "@/src/features/tournaments/store/api";
import { tournamentsAr } from "@/src/features/tournaments/strings";
import { tournamentsTheme } from "@/src/features/tournaments/theme";
import {
  arDirection,
  arProgressFill,
  arText,
  arWriting,
} from "@/src/features/tournaments/tournaments-rtl";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import { flexRowRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const IMAGE_HEADER_HEIGHT = 168;

type Props = {
  tournament: PubgTournamentDetail;
  joinGate: TournamentJoinGate | undefined;
  onJoinPress: (id: number) => void;
};

export function ActiveTournamentCard({
  tournament,
  joinGate,
  onJoinPress,
}: Props) {
  const imageUri = tournament.game?.image
    ? formatImageUrl(tournament.game.image)
    : undefined;
  const registeredCount = tournament.registered_count ?? 0;
  const maxPlayers = tournament.max_players ?? 0;
  const progressPct =
    maxPlayers > 0 ? Math.min(1, registeredCount / maxPlayers) : 0;
  const countdown = formatActiveTournamentCountdownAr(tournament.start_date);

  const gate = joinGate ?? {
    canJoin: false,
    message: tournamentsAr.loadingGate,
  };
  const canJoin = gate.canJoin;
  const joinHint = gate.message;

  const headerInner = (
    <>
      <View style={[styles.headerTopRow, flexRowRtl]}>
        <View style={styles.openEntryBadge}>
          <Text style={[styles.openEntryBadgeText, arText]} numberOfLines={1}>
            {tournamentsAr.openEntry}
          </Text>
        </View>
        <View style={styles.modePill}>
          <Text style={[styles.modePillText, arText]}>
            {(tournament.game?.type ?? "solo").toUpperCase()}
          </Text>
        </View>
      </View>
      <Text style={[styles.heroTitle, arText]} numberOfLines={2}>
        {tournament.title}
      </Text>
    </>
  );

  return (
    <TouchableOpacity
      style={[styles.card, arDirection]}
      activeOpacity={0.9}
      onPress={() => onJoinPress(tournament.id)}
      accessibilityRole="button"
      accessibilityLabel={tournamentsAr.joinA11y}
    >
      {imageUri ? (
        <ImageBackground
          source={{ uri: imageUri }}
          style={styles.imageHeader}
          imageStyle={styles.imageHeaderRadius}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(26,14,37,0.15)", "rgba(26,14,37,0.88)"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <View style={styles.headerContent}>{headerInner}</View>
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={[colors_V2.card, colors_V2.background]}
          style={styles.imageHeader}
        >
          <View style={styles.headerContent}>{headerInner}</View>
        </LinearGradient>
      )}

      <View style={[styles.statsPanel, arDirection]}>
        <View style={[styles.statsRow, flexRowRtl]}>
          <View style={styles.statCol}>
            <Text style={[styles.statLabel, arText]}>{tournamentsAr.countdown}</Text>
            <Text style={[styles.statValueCountdown, arText]} numberOfLines={2}>
              {countdown}
            </Text>
          </View>
          <View style={styles.statCol}>
            <Text style={[styles.statLabel, arText]}>{tournamentsAr.participants}</Text>
            <Text style={[styles.statValueParticipants, arText]}>
              {registeredCount}/{maxPlayers}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(8, progressPct * 100)}%` },
                  arProgressFill,
                ]}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={canJoin ? 0.88 : 1}
          disabled={!canJoin}
          onPress={() => canJoin && onJoinPress(tournament.id)}
          accessibilityRole="button"
          accessibilityLabel={tournamentsAr.joinA11y}
          accessibilityState={{ disabled: !canJoin }}
          style={styles.joinTouchable}
        >
          <LinearGradient
            colors={
              canJoin
                ? [colors_V2.gradientStart, colors_V2.gradientEnd]
                : [colors_V2.slate, colors_V2.dustyLavender]
            }
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.joinGradient}
          >
            <Text style={[styles.joinText, arText]}>{tournamentsAr.join}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {joinHint ? (
          <Text style={[styles.joinHint, arWriting]}>{joinHint}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors_V2.card,
    marginBottom: 16,
  },
  imageHeader: {
    width: "100%",
    height: IMAGE_HEADER_HEIGHT,
    backgroundColor: colors_V2.card,
  },
  imageHeaderRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    justifyContent: "space-between",
  },
  headerTopRow: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  openEntryBadge: {
    backgroundColor: tournamentsTheme.openEntryBadgeBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    maxWidth: "58%",
  },
  openEntryBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: tournamentsTheme.openEntryBadgeText,
    letterSpacing: 0.3,
  },
  modePill: {
    backgroundColor: colors_V2.skyBlue,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modePillText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors_V2.background,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors_V2.lilac,
    letterSpacing: 0.2,
    lineHeight: 28,
  },
  statsPanel: {
    backgroundColor: colors_V2.card,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 14,
  },
  statsRow: {
    alignItems: "stretch",
    gap: 14,
  },
  statCol: {
    flex: 1,
    minWidth: 0,
    gap: 6,
    justifyContent: "flex-start",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: tournamentsTheme.statLabelMuted,
    letterSpacing: 0.8,
    lineHeight: 14,
  },
  statValueCountdown: {
    fontSize: 15,
    fontWeight: "800",
    color: tournamentsTheme.countdownBright,
    lineHeight: 20,
    minHeight: 36,
  },
  statValueParticipants: {
    fontSize: 15,
    fontWeight: "800",
    color: colors_V2.lilac,
    lineHeight: 20,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors_V2.background,
    overflow: "hidden",
    marginTop: 2,
    alignSelf: "stretch",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors_V2.skyBlue,
  },
  joinTouchable: {
    borderRadius: 14,
    overflow: "hidden",
  },
  joinGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  joinText: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.6,
    color: colors_V2.background,
  },
  joinHint: {
    fontSize: 11,
    fontWeight: "600",
    color: colors_V2.errorLight,
    lineHeight: 17,
    textAlign: "center",
  },
});
