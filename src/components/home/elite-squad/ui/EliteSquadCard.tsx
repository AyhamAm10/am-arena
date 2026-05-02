import { useHeaderUser } from "@/src/hooks/auth/useHeaderUser";
import { flexRowRtl, progressFillRtl, textRtl } from "@/src/lib/rtl";
import { computeLevelAndProgress } from "@/src/lib/utils/level-from-xp";
import {
  requiredLevelForTournament,
  xpThresholdFromTournament,
} from "@/src/lib/utils/tournament-xp-gate";
import { resolveMediaUrl } from "@/src/lib/utils/resolve-media-url";
import { colors_V2 } from "@/src/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH - 32;

/** Always show US dollar prefix for prize (design). */
function formatPrizeWithDollar(prize_pool: string | number | undefined | null): string {
  if (prize_pool === undefined || prize_pool === null) return "$0";
  if (typeof prize_pool === "number") {
    return `$${Number(prize_pool).toLocaleString("ar")}`;
  }
  const s = String(prize_pool).trim();
  if (s.startsWith("$")) return s;
  const digits = s.replace(/[^0-9.,]/g, "").replace(/,/g, "");
  const n = parseFloat(digits);
  if (Number.isFinite(n)) return `$${n.toLocaleString("ar")}`;
  return `$${s}`;
}

type Props = {
  tournament: PubgTournamentDetail;
  onJoinPress?: (id: number) => void;
};

export default function EliteSquadCard({ tournament, onJoinPress }: Props) {
  const { isLoggedIn, user, isUserLoading } = useHeaderUser();
  const userXp = Number(user?.xp_points ?? 0);
  const { level: userLevel } = computeLevelAndProgress(userXp);

  const imageUri = tournament.game?.image
    ? resolveMediaUrl(tournament.game.image, "image")
    : undefined;
  const prizePool = formatPrizeWithDollar(tournament.prize_pool);
  const registeredCount = tournament.registered_count ?? 0;
  const maxPlayers = tournament.max_players ?? 0;
  const xpThreshold = xpThresholdFromTournament(tournament);
  const levelRequired = requiredLevelForTournament(tournament);
  const progressPct =
    maxPlayers > 0 ? Math.min(1, registeredCount / maxPlayers) : 0;

  const hasXpGate = xpThreshold > 0;
  const xpGateResolved = !hasXpGate || (!isUserLoading && isLoggedIn);
  const meetsXpGate = !hasXpGate || (isLoggedIn && userXp >= xpThreshold);
  const canJoin = meetsXpGate && xpGateResolved;

  const joinBlockedMessage = (() => {
    if (!hasXpGate) return null;
    if (isUserLoading) return "جاري التحقق من المستوى المطلوب…";
    if (!isLoggedIn) {
      return `المستوى المطلوب: ${levelRequired}. سجّل الدخول للانضمام — يُشترط الوصول إلى هذا المستوى على الأقل.`;
    }
    if (!meetsXpGate) {
      return `المستوى المطلوب: ${levelRequired}. مستواك الحالي: ${userLevel}. ارفع مستواك للانضمام.`;
    }
    return null;
  })();

  const joinAccessibilityHint =
    hasXpGate && !canJoin && joinBlockedMessage ? joinBlockedMessage : undefined;

  return (
    <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
      {imageUri ? (
        <ImageBackground
          source={{ uri: imageUri }}
          style={styles.imageBackground}
          imageStyle={styles.imageRadius}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["transparent", "rgba(13, 10, 20, 0.76)", "rgba(9, 7, 14, 0.96)"]}
            style={styles.overlay}
          >
            {renderContent()}
          </LinearGradient>
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={[colors_V2.primary, colors_V2.background]}
          style={[styles.imageBackground, styles.imageRadius]}
        >
          <View style={styles.overlay}>{renderContent()}</View>
        </LinearGradient>
      )}
    </View>
  );

  function renderContent() {
    return (
      <View style={styles.content}>
        <View style={[styles.pillRow, flexRowRtl]}>
          <View style={styles.superPill}>
            <Text style={[styles.superPillText, textRtl]}>بطولة خارقة</Text>
          </View>
        </View>

        <Text style={[styles.title, textRtl]} numberOfLines={2}>
          {tournament.title}
        </Text>

        <View style={styles.prizeSection}>
          <LinearGradient
            colors={[
              "rgba(255, 224, 102, 0.18)",
              "rgba(255, 186, 61, 0.24)",
              "rgba(138, 98, 22, 0.35)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.prizeBadge}
          >
            <Text style={styles.prizeBadgeIcon}>🏆</Text>
            <View style={styles.prizeBadgeTextWrap}>
              <Text style={[styles.prizeBadgeLabel, textRtl]}>الجائزة الكبرى</Text>
              <Text style={[styles.prizeValue, textRtl]}>{prizePool}</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.levelBadgeWrap}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeIcon}>🛡️</Text>
            <Text style={[styles.levelBadgeText, textRtl]}>مستوى {levelRequired}+ مطلوب</Text>
          </View>
        </View>

        <View style={styles.bottomStack}>
          <View style={styles.registrationCol}>
            <View style={[styles.registrationTop, flexRowRtl]}>
              <Text style={[styles.registrationLabel, textRtl]}>التسجيل</Text>
              <Text style={[styles.registrationCount, textRtl]}>
                {registeredCount}/{maxPlayers}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPct * 100}%` },
                  progressFillRtl,
                ]}
              />
            </View>
          </View>

          <View style={[styles.joinRow, flexRowRtl]}>
            <View style={styles.participantPill}>
              <Text style={styles.participantPillIcon}>👥</Text>
              <View>
                <Text style={[styles.participantPillCount, textRtl]}>
                  {registeredCount}/{maxPlayers}
                </Text>
                <Text style={[styles.participantPillLabel, textRtl]}>مقعد محجوز</Text>
              </View>
            </View>

            <View style={styles.joinColumn}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="انضم إلى البطولة"
                accessibilityState={{ disabled: !canJoin }}
                accessibilityHint={joinAccessibilityHint}
                onPress={() => canJoin && onJoinPress?.(tournament.id)}
                activeOpacity={canJoin ? 0.85 : 1}
                disabled={!canJoin}
                style={[styles.joinTouchable, !canJoin && styles.joinTouchableDisabled]}
              >
                <LinearGradient
                  colors={
                    canJoin
                      ? [colors_V2.primary, colors_V2.gradientEnd]
                      : [colors_V2.textSecondary, colors_V2.textSecondary]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.joinGradient}
                >
                  <Text
                    style={[
                      styles.joinButtonText,
                      textRtl,
                      !canJoin && styles.joinButtonTextDisabled,
                    ]}
                  >
                    انضم
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              {joinBlockedMessage ? (
                <Text style={[styles.joinHint, textRtl]}>{joinBlockedMessage}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors_V2.card,
  },
  imageBackground: {
    minHeight: 342,
    width: "100%",
    justifyContent: "flex-start",
  },
  imageRadius: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderRadius: 16,
  },
  content: {
    gap: 12,
  },
  pillRow: {
    alignItems: "flex-start",
  },
  superPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors_V2.primaryLight,
    backgroundColor: "rgba(147, 204, 255, 0.18)",
  },
  superPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 23,
    fontWeight: "900",
    color: colors_V2.textPrimary,
    letterSpacing: 0.3,
    textAlign: "center",
    alignSelf: "stretch",
  },
  prizeSection: {
    alignItems: "center",
    marginTop: 2,
  },
  prizeBadge: {
    width: "100%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 214, 102, 0.32)",
  },
  prizeBadgeIcon: {
    fontSize: 28,
    lineHeight: 30,
  },
  prizeBadgeTextWrap: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  prizeValue: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFD66B",
    letterSpacing: 0.4,
    textShadowColor: "rgba(255, 214, 107, 0.55)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  prizeBadgeLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255, 236, 184, 0.9)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  levelBadgeWrap: {
    alignItems: "center",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255, 214, 102, 0.13)",
    borderWidth: 1,
    borderColor: "rgba(255, 214, 102, 0.22)",
  },
  levelBadgeIcon: {
    fontSize: 14,
    lineHeight: 16,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFE2A3",
    letterSpacing: 0.2,
  },
  bottomStack: {
    marginTop: 2,
    gap: 10,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "rgba(10, 8, 16, 0.64)",
    borderWidth: 1,
    borderColor: "rgba(216,185,255,0.1)",
  },
  registrationCol: {
    gap: 8,
    width: "100%",
    alignSelf: "stretch",
    paddingHorizontal: 2,
  },
  joinRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  registrationTop: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  registrationLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  registrationCount: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  participantPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(216,185,255,0.12)",
    minWidth: 104,
  },
  participantPillIcon: {
    fontSize: 18,
  },
  participantPillCount: {
    fontSize: 15,
    fontWeight: "900",
    color: colors_V2.textPrimary,
  },
  participantPillLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors_V2.textSecondary,
    letterSpacing: 0.4,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(26, 14, 37, 0.85)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors_V2.primaryLight,
  },
  joinColumn: {
    flex: 1,
    gap: 8,
    alignItems: "stretch",
  },
  joinTouchable: {
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "stretch",
  },
  joinTouchableDisabled: {
    opacity: 0.85,
  },
  joinGradient: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 96,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  joinButtonTextDisabled: {
    color: colors_V2.textSecondary,
  },
  joinHint: {
    fontSize: 11,
    fontWeight: "600",
    color: colors_V2.error,
    lineHeight: 16,
  },
});
