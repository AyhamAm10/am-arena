import type { PollOptionResponse, PollResponse } from "@/src/api/types/poll.types";
import type { PubgGameType, PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";
import { ScreenEnterTransition } from "@/src/components/motion";
import { resolveMediaUrl } from "@/src/lib/utils/resolve-media-url";
import { formatTournamentTimeRemaining } from "@/src/lib/utils/tournament-time-remaining";
import { flexRowRtl, isRtl, rtlMirrorIconStyle, textRtl, writingRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMirror } from "./store";
import type { TournamentDetailsTab } from "./store/state";

/** Tighter text metrics on Android so large rank numerals align with body copy. */
const androidTextTrim =
  Platform.OS === "android" ? ({ includeFontPadding: false } as const) : {};

function formatVotesTitle(totalVotes: number) {
  return `${totalVotes} صوت`;
}

function formatTournamentState(isActive: boolean | undefined) {
  return isActive ? "مباشر وقابل للتصويت" : "منتهية - عرض النتائج النهائية";
}

function formatPrizePoolDisplay(value: number | string | undefined): string {
  if (value === undefined || value === null) return "—";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return String(value);
  return n.toLocaleString("en-US");
}

function formatDateTimeAr(value: string | null | undefined) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getTimingCopy(tournament: PubgTournamentDetail) {
  const now = Date.now();
  const startAt = tournament.start_date ? new Date(tournament.start_date).getTime() : NaN;
  const endAt = tournament.end_date ? new Date(tournament.end_date).getTime() : NaN;
  const showStartPublicly = !tournament.is_active && Number.isFinite(startAt) && startAt > now;

  return {
    showStartPublicly,
    endCountdown: Number.isFinite(endAt) ? formatTournamentTimeRemaining(tournament.end_date) : "—",
    endDate: formatDateTimeAr(tournament.end_date),
    startCountdown: showStartPublicly ? formatTournamentTimeRemaining(tournament.start_date) : null,
    startDate: showStartPublicly ? formatDateTimeAr(tournament.start_date) : null,
  };
}

function formatGameTypeAr(type: PubgGameType | undefined): string {
  switch (type) {
    case "solo":
      return "فردي";
    case "duo":
      return "ثنائي";
    case "squad":
      return "فرق فقط";
    default:
      return "—";
  }
}

function formatCompactVotes(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    const s = k >= 10 ? k.toFixed(0) : k.toFixed(1);
    return `${s.replace(/\.0$/, "")}k`;
  }
  return String(n);
}

function hasUserVoted(poll: PollResponse): boolean {
  return poll.current_user_vote_option_id != null;
}

function isOptionSelected(poll: PollResponse, option: PollOptionResponse): boolean {
  return option.selected === true || option.id === poll.current_user_vote_option_id;
}

function sortedOptionsByVotes(poll: PollResponse): PollOptionResponse[] {
  return [...poll.options].sort((a, b) => b.votes_count - a.votes_count);
}

function tabButtonOrder(): TournamentDetailsTab[] {
  return isRtl()
    ? ["voting", "votingDetails", "tournament"]
    : ["tournament", "voting", "votingDetails"];
}

function tabLabel(tab: TournamentDetailsTab): string {
  switch (tab) {
    case "tournament":
      return "تفاصيل البطولة";
    case "voting":
      return "التصويت";
    case "votingDetails":
      return "تفاصيل التصويت";
    default:
      return "";
  }
}

function TournamentRulesGrid({ tournament }: { tournament: PubgTournamentDetail }) {
  const prizeText = `${formatPrizePoolDisplay(tournament.prize_pool)} KP`;
  const cells: Array<{
    key: string;
    icon: string;
    label: string;
    value: string;
    valueGold?: boolean;
    iconColor: string;
  }> = [
    {
      key: "format",
      icon: "groups",
      label: "الشكل",
      value: formatGameTypeAr(tournament.game?.type),
      iconColor: colors_V2.primaryLight,
    },
    {
      key: "map",
      icon: "map",
      label: "الخريطة",
      value: tournament.game?.map ?? "—",
      iconColor: colors_V2.primaryLight,
    },
    {
      key: "platform",
      icon: "games",
      label: "المنصة",
      value: "جوال / كمبيوتر",
      iconColor: colors_V2.primaryLight,
    },
    {
      key: "prize",
      icon: "emoji-events",
      label: "مجموع الجوائز",
      value: prizeText,
      valueGold: true,
      iconColor: colors_V2.accent,
    },
  ];

  return (
    <View style={styles.rulesGrid}>
      <View style={styles.rulesRow}>
        <View style={styles.ruleCell}>
          <RuleStatCard
            icon={cells[0].icon}
            label={cells[0].label}
            value={cells[0].value}
            iconColor={cells[0].iconColor}
          />
        </View>
        <View style={styles.ruleCell}>
          <RuleStatCard
            icon={cells[1].icon}
            label={cells[1].label}
            value={cells[1].value}
            iconColor={cells[1].iconColor}
          />
        </View>
      </View>
      <View style={styles.rulesRow}>
        <View style={styles.ruleCell}>
          <RuleStatCard
            icon={cells[2].icon}
            label={cells[2].label}
            value={cells[2].value}
            iconColor={cells[2].iconColor}
          />
        </View>
        <View style={styles.ruleCell}>
          <RuleStatCard
            icon={cells[3].icon}
            label={cells[3].label}
            value={cells[3].value}
            valueGold={cells[3].valueGold}
            iconColor={cells[3].iconColor}
          />
        </View>
      </View>
    </View>
  );
}

function RuleStatCard(props: {
  icon: string;
  label: string;
  value: string;
  valueGold?: boolean;
  iconColor: string;
}) {
  return (
    <View style={styles.ruleCard}>
      <View style={styles.ruleCardIconRow}>
        <Icon name={props.icon} size={22} color={props.iconColor} />
      </View>
      <Text style={styles.ruleCardLabel}>{props.label}</Text>
      <Text
        style={[styles.ruleCardValue, props.valueGold ? styles.ruleCardValueGold : undefined]}
        numberOfLines={2}
      >
        {props.value}
      </Text>
    </View>
  );
}

function TournamentDetailsTab({ tournament }: { tournament: PubgTournamentDetail }) {
  const timing = getTimingCopy(tournament);

  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionEyebrow}>الوصف</Text>
      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionBody}>{tournament.description || "لا يوجد وصف."}</Text>
      </View>

      <Text style={[styles.sectionEyebrow, styles.sectionEyebrowSpaced]}>الوقت</Text>
      <View style={styles.timingGrid}>
        <View style={styles.timingCardPrimary}>
          <Text style={styles.timingCardLabel}>ينتهي</Text>
          <Text style={styles.timingCardValue} numberOfLines={1}>
            {timing.endCountdown}
          </Text>
          <Text style={styles.timingCardMeta} numberOfLines={2}>
            {timing.endDate}
          </Text>
        </View>
        {timing.showStartPublicly ? (
          <View style={styles.timingCardSecondary}>
            <Text style={styles.timingCardLabel}>تبدأ</Text>
            <Text style={styles.timingCardValue} numberOfLines={1}>
              {timing.startCountdown}
            </Text>
            <Text style={styles.timingCardMeta} numberOfLines={2}>
              {timing.startDate}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={[styles.sectionEyebrow, styles.sectionEyebrowSpaced]}>قواعد البطولة</Text>
      <TournamentRulesGrid tournament={tournament} />
    </View>
  );
}

function VotingTabContent(props: {
  polls: PollResponse[];
  isTournamentActive: boolean;
  isVoting: boolean;
  votePendingPollId: number | null;
  votePendingOptionId: number | null;
  voteOnPoll: (pollId: number, optionId: number) => Promise<unknown>;
}) {
  const { polls, isTournamentActive, isVoting, votePendingPollId, votePendingOptionId, voteOnPoll } = props;

  if (polls.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>لا توجد استطلاعات مرتبطة بهذه البطولة حالياً.</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      {polls.map((poll) => {
        const pendingVote = isVoting && votePendingPollId === poll.id;
        const canSubmitVote = !poll.closed && isTournamentActive && !isVoting && !hasUserVoted(poll);
        return (
          <View key={poll.id} style={styles.pollSection}>
            <Text style={styles.pollSectionTitle}>{poll.title}</Text>
            {poll.description ? (
              <Text style={styles.pollSectionSub} numberOfLines={2}>
                {poll.description}
              </Text>
            ) : null}

            <Text style={styles.nomineesEyebrow}>المرشحون المؤهلون</Text>

            {poll.options.map((option) => {
              const selected = isOptionSelected(poll, option);
              const title = option.label || option.user?.gamer_name || `خيار #${option.id}`;
              const subline =
                option.user?.full_name?.trim() ||
                (option.user ? `مشارك #${option.user.id}` : null);
              const avatarUri = option.user?.avatarUrl
                ? resolveMediaUrl(option.user.avatarUrl, "image")
                : null;

              return (
                <Pressable
                  key={option.id}
                  disabled={!canSubmitVote || poll.closed}
                  onPress={() => {
                    if (!canSubmitVote || poll.closed) return;
                    void voteOnPoll(poll.id, option.id);
                  }}
                  style={({ pressed }) => [
                    styles.nomineeCard,
                    selected && styles.nomineeCardSelected,
                    pendingVote && votePendingOptionId === option.id && styles.nomineeCardPending,
                    pressed && canSubmitVote && !poll.closed && styles.nomineeCardPressed,
                  ]}
                >
                  <View style={styles.nomineeRow}>
                    <View style={styles.nomineeAvatarWrap}>
                      {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.nomineeAvatar} />
                      ) : (
                        <View style={styles.nomineeAvatarPlaceholder}>
                          <Icon name="person" size={28} color={colors_V2.textSecondary} />
                        </View>
                      )}
                      {selected ? (
                        <View style={styles.nomineeCheckBadge}>
                          <Icon name="check-circle" size={18} color={colors_V2.primaryLight} />
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.nomineeTextBlock}>
                      <Text style={[styles.nomineeName, selected && styles.nomineeNameSelected]} numberOfLines={1}>
                        {title}
                      </Text>
                      {subline ? (
                        <Text style={styles.nomineeTeam} numberOfLines={1}>
                          {subline.toUpperCase()}
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.nomineeVotesCol}>
                      {pendingVote && votePendingOptionId === option.id ? (
                        <ActivityIndicator size="small" color={colors_V2.primaryLight} />
                      ) : (
                        <>
                          <Text style={[styles.nomineeVoteNum, selected && styles.nomineeVoteNumSelected]}>
                            {formatCompactVotes(option.votes_count)}
                          </Text>
                          <Text style={styles.nomineeVotesLabel}>أصوات</Text>
                        </>
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}

            {poll.closed ? (
              <Text style={styles.pollClosedHint}>التصويت مغلق لهذا الاستطلاع.</Text>
            ) : null}
            {!isTournamentActive ? (
              <Text style={styles.pollClosedHint}>البطولة غير نشطة — عرض النتائج فقط.</Text>
            ) : null}
            {hasUserVoted(poll) ? (
              <Text style={styles.pollClosedHint}>تم تسجيل صوتك — لا يمكن التصويت مرة أخرى.</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function VotingDetailsTabContent({ polls }: { polls: PollResponse[] }) {
  if (polls.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>لا توجد نتائج تصويت لعرضها.</Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      {polls.map((poll) => {
        const ranked = sortedOptionsByVotes(poll);
        return (
          <View key={poll.id} style={styles.pollSection}>
            <Text style={styles.pollSectionTitle}>{poll.title}</Text>
            <View style={styles.resultsList}>
              {ranked.map((option, index) => {
                const rank = index + 1;
                const rankLabel = String(rank).padStart(2, "0");
                const title = option.label || option.user?.gamer_name || `خيار #${option.id}`;
                const subline =
                  option.user?.full_name?.trim()?.toUpperCase() ||
                  (option.user ? `مشارك #${option.user.id}` : null);
                const topRank = rank === 1;

                return (
                  <View key={option.id} style={styles.resultRow}>
                    <View style={styles.resultRankWrap}>
                      <Text
                        style={[
                          styles.resultRank,
                          topRank ? styles.resultRankGold : styles.resultRankMuted,
                          androidTextTrim,
                        ]}
                      >
                        {rankLabel}
                      </Text>
                    </View>
                    <View style={styles.resultInfo}>
                      <Text style={[styles.resultName, androidTextTrim]} numberOfLines={2}>
                        {title}
                      </Text>
                      {subline ? (
                        <Text style={[styles.resultSub, androidTextTrim]} numberOfLines={1}>
                          {subline}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.resultVotesCol}>
                      <Text style={[styles.resultVoteNum, androidTextTrim]}>
                        {formatCompactVotes(option.votes_count)}
                      </Text>
                      <Text style={[styles.resultVotesLabel, androidTextTrim]}>أصوات</Text>
                      <View style={styles.resultVoteRule} />
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.officialFooter}>
              <View style={styles.officialRule} />
              <Text style={styles.officialFooterText}>سجلات النتائج الرسمية</Text>
              <View style={styles.officialRule} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function Ui() {
  const router = useRouter();
  const tournament = useMirror("tournament");
  const polls = useMirror("polls");
  const activeTab = useMirror("activeTab");
  const setActiveTab = useMirror("setActiveTab");
  const isLoadingTournament = useMirror("isLoadingTournament");
  const isLoadingPolls = useMirror("isLoadingPolls");
  const isVoting = useMirror("isVoting");
  const votePendingPollId = useMirror("votePendingPollId");
  const votePendingOptionId = useMirror("votePendingOptionId");
  const voteOnPoll = useMirror("voteOnPoll");

  const headerImage = tournament?.game?.image
    ? { uri: resolveMediaUrl(tournament.game.image, "image") }
    : undefined;
  const totalVotes = polls.reduce((sum, poll) => sum + Number(poll.total_votes ?? 0), 0);
  const isTournamentActive = Boolean(tournament?.is_active);

  const tabsInOrder = useMemo(() => tabButtonOrder(), []);

  if (isLoadingTournament && !tournament) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors_V2.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!tournament) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>تعذر تحميل البطولة.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Icon
              name="arrow-back"
              size={22}
              color={colors_V2.textPrimary}
              style={rtlMirrorIconStyle}
            />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>تفاصيل البطولة</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="share" size={20} color={colors_V2.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <ImageBackground
            source={headerImage}
            resizeMode="cover"
            style={styles.heroBackground}
            imageStyle={styles.heroImage}
          >
            <LinearGradient
              colors={["rgba(26,14,37,0.2)", "rgba(26,14,37,0.9)"]}
              style={styles.heroOverlay}
            >
              <View style={styles.heroBadgeRow}>
                <View style={styles.smallBadge}>
                  <Text style={styles.smallBadgeText}>
                    {tournament.game?.type === "squad" ? "SQUAD" : "PUBG"}
                  </Text>
                </View>
                <Text style={styles.endsText}>{formatTournamentState(tournament.is_active)}</Text>
              </View>

              <Text style={styles.heroTitle}>{tournament.title}</Text>
              <Text style={styles.heroDescription} numberOfLines={3}>
                {tournament.description}
              </Text>

              <View style={styles.heroStatsRow}>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>المشاركون</Text>
                  <Text style={styles.heroStatValue}>
                      {tournament.participant_count ?? tournament.registered_count ?? 0}/{tournament.max_players ?? 0}
                  </Text>
                </View>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>إجمالي الجوائز</Text>
                  <Text style={styles.heroStatValue}>{tournament.prize_pool ?? 0}</Text>
                </View>
                <View style={styles.heroStat}>
                  <Text style={styles.heroStatLabel}>الأصوات</Text>
                  <Text style={styles.heroStatValue}>{formatVotesTitle(totalVotes)}</Text>
                </View>
              </View>

              <LinearGradient
                colors={[colors_V2.gradientStart, colors_V2.gradientEnd]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.heroAction}
              >
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => router.push(`/tournament/${tournament.id}/registration` as never)}
                  style={styles.heroActionInner}
                >
                  <Text style={styles.heroActionText}>
                    {isTournamentActive ? "الانضمام للبطولة" : "العودة إلى صفحة التسجيل"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View style={styles.tabsWrap}>
          {tabsInOrder.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]} numberOfLines={1}>
                {tabLabel(tab)}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoadingPolls && polls.length === 0 && (activeTab === "voting" || activeTab === "votingDetails") ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors_V2.primary} />
          </View>
        ) : (
          <ScreenEnterTransition from="right" style={{ flex: 1 }}>
            {activeTab === "tournament" ? (
              <TournamentDetailsTab tournament={tournament} />
            ) : activeTab === "voting" ? (
              <VotingTabContent
                polls={polls}
                isTournamentActive={isTournamentActive}
                isVoting={isVoting}
                votePendingPollId={votePendingPollId}
                votePendingOptionId={votePendingOptionId}
                voteOnPoll={voteOnPoll}
              />
            ) : (
              <VotingDetailsTabContent polls={polls} />
            )}
          </ScreenEnterTransition>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors_V2.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 28,
  },
  centered: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    ...flexRowRtl,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors_V2.card,
  },
  pageTitle: {
    color: colors_V2.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    ...textRtl,
  },
  heroCard: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: colors_V2.card,
  },
  heroBackground: {
    minHeight: 320,
    backgroundColor: colors_V2.card,
  },
  heroImage: {
    borderRadius: 22,
  },
  heroOverlay: {
    flex: 1,
    padding: 18,
    justifyContent: "flex-end",
    gap: 12,
  },
  heroBadgeRow: {
    ...flexRowRtl,
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallBadge: {
    backgroundColor: "rgba(147,204,255,0.22)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallBadgeText: {
    color: colors_V2.primaryLight,
    fontSize: 11,
    fontWeight: "800",
  },
  endsText: {
    color: colors_V2.accent,
    fontSize: 12,
    fontWeight: "700",
    ...textRtl,
  },
  heroTitle: {
    color: colors_V2.textPrimary,
    fontSize: 32,
    fontWeight: "900",
    ...textRtl,
  },
  heroDescription: {
    color: colors_V2.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    ...writingRtl,
  },
  heroStatsRow: {
    ...flexRowRtl,
    gap: 10,
  },
  heroStat: {
    flex: 1,
    backgroundColor: "rgba(61,47,72,0.82)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  heroStatLabel: {
    color: colors_V2.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
    ...textRtl,
  },
  heroStatValue: {
    color: colors_V2.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    ...textRtl,
  },
  heroAction: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 6,
  },
  heroActionInner: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  heroActionText: {
    color: colors_V2.background,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.6,
    ...textRtl,
  },
  tabsWrap: {
    ...flexRowRtl,
    backgroundColor: colors_V2.card,
    borderRadius: 14,
    padding: 6,
    marginBottom: 14,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: colors_V2.primary,
  },
  tabText: {
    color: colors_V2.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    ...textRtl,
  },
  tabTextActive: {
    color: colors_V2.textPrimary,
  },
  tabContent: {
    gap: 10,
  },
  sectionEyebrow: {
    color: colors_V2.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    ...textRtl,
  },
  sectionEyebrowSpaced: {
    marginTop: 8,
  },
  descriptionCard: {
    backgroundColor: colors_V2.card,
    borderRadius: 16,
    padding: 18,
  },
  descriptionBody: {
    color: colors_V2.textPrimary,
    fontSize: 15,
    lineHeight: 24,
    ...writingRtl,
  },
  timingGrid: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  timingCardPrimary: {
    flex: 1,
    minWidth: 160,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(147,204,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(147,204,255,0.2)",
    gap: 6,
  },
  timingCardSecondary: {
    flex: 1,
    minWidth: 160,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(216,185,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(216,185,255,0.16)",
    gap: 6,
  },
  timingCardLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: colors_V2.textSecondary,
    letterSpacing: 0.6,
  },
  timingCardValue: {
    fontSize: 15,
    fontWeight: "900",
    color: colors_V2.textPrimary,
    lineHeight: 20,
  },
  timingCardMeta: {
    fontSize: 11,
    fontWeight: "700",
    color: colors_V2.textSecondary,
    lineHeight: 16,
  },
  rulesGrid: {
    gap: 10,
  },
  rulesRow: {
    ...flexRowRtl,
    gap: 10,
  },
  ruleCell: {
    flex: 1,
    minWidth: 0,
  },
  ruleCard: {
    backgroundColor: colors_V2.card,
    borderRadius: 16,
    padding: 14,
    minHeight: 108,
    gap: 6,
  },
  ruleCardIconRow: {
    ...flexRowRtl,
    marginBottom: 2,
  },
  ruleCardLabel: {
    color: colors_V2.textSecondary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    ...textRtl,
  },
  ruleCardValue: {
    color: colors_V2.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    ...textRtl,
  },
  ruleCardValueGold: {
    color: colors_V2.accent,
  },
  emptyCard: {
    backgroundColor: colors_V2.card,
    borderRadius: 16,
    padding: 20,
  },
  emptyText: {
    color: colors_V2.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    ...writingRtl,
  },
  pollSection: {
    marginBottom: 8,
    gap: 10,
  },
  pollSectionTitle: {
    color: colors_V2.textPrimary,
    fontSize: 17,
    fontWeight: "800",
    ...textRtl,
  },
  pollSectionSub: {
    color: colors_V2.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    ...writingRtl,
  },
  nomineesEyebrow: {
    color: colors_V2.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 4,
    ...textRtl,
  },
  nomineeCard: {
    backgroundColor: colors_V2.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  nomineeCardPending: {
    opacity: 0.92,
    borderColor: "rgba(147,204,255,0.45)",
    shadowColor: colors_V2.primaryLight,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  nomineeCardSelected: {
    borderColor: colors_V2.primaryLight,
    shadowColor: colors_V2.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  nomineeCardPressed: {
    opacity: 0.92,
  },
  nomineeRow: {
    ...flexRowRtl,
    alignItems: "center",
    gap: 12,
  },
  nomineeAvatarWrap: {
    position: "relative",
  },
  nomineeAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors_V2.background,
  },
  nomineeAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(26,14,37,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  nomineeCheckBadge: {
    position: "absolute",
    bottom: -2,
    end: -2,
    backgroundColor: colors_V2.card,
    borderRadius: 12,
  },
  nomineeTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  nomineeName: {
    color: colors_V2.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    ...textRtl,
  },
  nomineeNameSelected: {
    color: colors_V2.primaryLight,
  },
  nomineeTeam: {
    color: colors_V2.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    ...textRtl,
  },
  nomineeVotesCol: {
    alignItems: "flex-end",
  },
  nomineeVoteNum: {
    color: colors_V2.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  nomineeVoteNumSelected: {
    color: colors_V2.primaryLight,
  },
  nomineeVotesLabel: {
    marginTop: 2,
    color: colors_V2.textSecondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  pollClosedHint: {
    color: colors_V2.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    ...textRtl,
  },
  resultsList: {
    gap: 10,
  },
  resultRow: {
    ...flexRowRtl,
    alignItems: "stretch",
    backgroundColor: colors_V2.card,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 12,
  },
  resultRankWrap: {
    justifyContent: "center",
  },
  resultRank: {
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 30,
    minWidth: 44,
    textAlignVertical: "center",
    ...textRtl,
  },
  resultRankGold: {
    color: colors_V2.accent,
  },
  resultRankMuted: {
    color: colors_V2.textSecondary,
  },
  resultInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
    justifyContent: "center",
  },
  resultName: {
    color: colors_V2.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
    ...textRtl,
    ...androidTextTrim,
  },
  resultSub: {
    color: colors_V2.textSecondary,
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 14,
    letterSpacing: 0.5,
    ...textRtl,
    ...androidTextTrim,
  },
  resultVotesCol: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 52,
  },
  resultVoteNum: {
    color: colors_V2.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22,
    ...androidTextTrim,
  },
  resultVotesLabel: {
    marginTop: 2,
    color: colors_V2.textSecondary,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
    lineHeight: 12,
    ...androidTextTrim,
  },
  resultVoteRule: {
    width: 28,
    height: 2,
    marginTop: 8,
    borderRadius: 1,
    backgroundColor: colors_V2.textPrimary,
    opacity: 0.45,
  },
  officialFooter: {
    ...flexRowRtl,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
    paddingVertical: 6,
  },
  officialRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors_V2.textSecondary,
    opacity: 0.35,
  },
  officialFooterText: {
    color: colors_V2.textSecondary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
