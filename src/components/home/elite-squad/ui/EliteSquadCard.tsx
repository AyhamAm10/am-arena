import { useHeaderUser } from "@/src/hooks/auth/useHeaderUser";
import { flexRowRtl, progressFillRtl, textRtl } from "@/src/lib/rtl";
import { computeLevelAndProgress } from "@/src/lib/utils/level-from-xp";
import {
  requiredLevelForTournament,
  xpThresholdFromTournament,
} from "@/src/lib/utils/tournament-xp-gate";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
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
    ? formatImageUrl(tournament.game.image)
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
            colors={["transparent", "rgba(26, 14, 37, 0.88)", colors_V2.background]}
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

        <View style={[styles.detailsRow, flexRowRtl]}>
          <View style={styles.detailItem}>
            <Text style={[styles.prizeValue, textRtl]}>{prizePool}</Text>
            <Text style={[styles.detailLabel, textRtl]}>مجموع الجوائز</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.levelValue, textRtl]}>المستوى {levelRequired}</Text>
            <Text style={[styles.detailLabel, textRtl]}>مطلوب</Text>
          </View>
        </View>

        <View style={[styles.bottomRow, flexRowRtl]}>
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
                    ? [colors_V2.purple, colors_V2.lavender]
                    : [colors_V2.slate, colors_V2.slate]
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
    height: 232,
    width: "100%",
    justifyContent: "flex-end",
  },
  imageRadius: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    borderRadius: 16,
  },
  content: {
    gap: 10,
  },
  pillRow: {
    alignItems: "flex-start",
  },
  superPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors_V2.skyBlue,
    backgroundColor: "rgba(147, 204, 255, 0.18)",
  },
  superPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors_V2.lilac,
    letterSpacing: 0.3,
  },
  detailsRow: {
    gap: 28,
    marginTop: 2,
    alignItems: "flex-start",
  },
  detailItem: {
    gap: 4,
  },
  prizeValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors_V2.gold,
  },
  levelValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors_V2.errorLight,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors_V2.slate,
    letterSpacing: 0.4,
  },
  bottomRow: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 12,
  },
  registrationCol: {
    flex: 1,
    minWidth: 0,
    gap: 6,
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
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(26, 14, 37, 0.85)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors_V2.skyBlue,
  },
  joinColumn: {
    maxWidth: 172,
    gap: 8,
    alignItems: "stretch",
  },
  joinTouchable: {
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  joinTouchableDisabled: {
    opacity: 0.85,
  },
  joinGradient: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  joinButtonTextDisabled: {
    color: colors_V2.dustyLavender,
  },
  joinHint: {
    fontSize: 11,
    fontWeight: "600",
    color: colors_V2.errorLight,
    lineHeight: 16,
  },
});
