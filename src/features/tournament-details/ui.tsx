import type { PollOptionResponse, PollResponse } from "@/src/api/types/poll.types";
import type { PubgGameType, PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";
import { ScreenEnterTransition } from "@/src/components/motion";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
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
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
      iconColor: colors_V2.lavenderLight,
    },
    {
      key: "map",
      icon: "map",
      label: "الخريطة",
      value: tournament.game?.map ?? "—",
      iconColor: colors_V2.lavenderLight,
    },
    {
      key: "platform",
      icon: "games",
      label: "المنصة",
      value: "جوال / كمبيوتر",
      iconColor: colors_V2.lavenderLight,
    },
    {
      key: "prize",
      icon: "emoji-events",
      label: "مجموع الجوائز",
      value: prizeText,
      valueGold: true,
      iconColor: colors_V2.gold,
    },
  ];

  return (
    <View style={styles.rulesGrid}>
      <View style={styles.rulesRow}>
        <View style={styles.ruleCell}>
          <RuleStatCard {...cells[0]} />
        </View>
        <View style={styles.ruleCell}>
          <RuleStatCard {...cells[1]} />
        </View>
      </View>
      <View style={styles.rulesRow}>
        <View style={styles.ruleCell}>
          <RuleStatCard {...cells[2]} />
        </View>
        <View style={styles.ruleCell}>
          <RuleStatCard {...cells[3]} />
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
  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionEyebrow}>الوصف</Text>
      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionBody}>{tournament.description || "لا يوجد وصف."}</Text>
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
  voteOnPoll: (pollId: number, optionId: number) => Promise<unknown>;
}) {
  const { polls, isTournamentActive, isVoting, voteOnPoll } = props;

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
                ? formatImageUrl(option.user.avatarUrl)
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
                    pressed && canSubmitVote && !poll.closed && styles.nomineeCardPressed,
                  ]}
                >
                  <View style={styles.nomineeRow}>
                    <View style={styles.nomineeAvatarWrap}>
                      {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.nomineeAvatar} />
                      ) : (
                        <View style={styles.nomineeAvatarPlaceholder}>
                          <Icon name="person" size={28} color={colors_V2.slate} />
                        </View>
                      )}
                      {selected ? (
                        <View style={styles.nomineeCheckBadge}>
                          <Icon name="check-circle" size={18} color={colors_V2.skyBlue} />
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
                      <Text style={[styles.nomineeVoteNum, selected && styles.nomineeVoteNumSelected]}>
                        {formatCompactVotes(option.votes_count)}
                      </Text>
                      <Text style={styles.nomineeVotesLabel}>أصوات</Text>
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
  const voteOnPoll = useMirror("voteOnPoll");

  const headerImage = tournament?.game?.image
    ? { uri: formatImageUrl(tournament.game.image) }
    : undefined;
  const totalVotes = polls.reduce((sum, poll) => sum + Number(poll.total_votes ?? 0), 0);
  const isTournamentActive = Boolean(tournament?.is_active);

  const tabsInOrder = useMemo(() => tabButtonOrder(), []);

  if (isLoadingTournament && !tournament) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors_V2.purple} />
        </View>
      </SafeAreaView>
    );
  }

  if (!tournament) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>تعذر تحميل البطولة.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
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
              color={colors_V2.lilac}
              style={rtlMirrorIconStyle}
            />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>تفاصيل البطولة</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="share" size={20} color={colors_V2.lilac} />
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
                    {tournament.registered_count ?? 0}/{tournament.max_players ?? 0}
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
            <ActivityIndicator color={colors_V2.purple} />
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
    color: colors_V2.lilac,
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
    color: colors_V2.skyBlue,
    fontSize: 11,
    fontWeight: "800",
  },
  endsText: {
    color: colors_V2.gold,
    fontSize: 12,
    fontWeight: "700",
    ...textRtl,
  },
  heroTitle: {
    color: colors_V2.lilac,
    fontSize: 32,
    fontWeight: "900",
    ...textRtl,
  },
  heroDescription: {
    color: colors_V2.dustyLavender,
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
    color: colors_V2.slate,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
    ...textRtl,
  },
  heroStatValue: {
    color: colors_V2.lilac,
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
    backgroundColor: colors_V2.purple,
  },
  tabText: {
    color: colors_V2.dustyLavender,
    fontSize: 11,
    fontWeight: "700",
    ...textRtl,
  },
  tabTextActive: {
    color: colors_V2.lilac,
  },
  tabContent: {
    gap: 10,
  },
  sectionEyebrow: {
    color: colors_V2.slate,
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
    color: colors_V2.lilac,
    fontSize: 15,
    lineHeight: 24,
    ...writingRtl,
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
    color: colors_V2.slate,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    ...textRtl,
  },
  ruleCardValue: {
    color: colors_V2.lilac,
    fontSize: 16,
    fontWeight: "800",
    ...textRtl,
  },
  ruleCardValueGold: {
    color: colors_V2.gold,
  },
  emptyCard: {
    backgroundColor: colors_V2.card,
    borderRadius: 16,
    padding: 20,
  },
  emptyText: {
    color: colors_V2.dustyLavender,
    fontSize: 14,
    lineHeight: 22,
    ...writingRtl,
  },
  pollSection: {
    marginBottom: 8,
    gap: 10,
  },
  pollSectionTitle: {
    color: colors_V2.lilac,
    fontSize: 17,
    fontWeight: "800",
    ...textRtl,
  },
  pollSectionSub: {
    color: colors_V2.dustyLavender,
    fontSize: 13,
    lineHeight: 20,
    ...writingRtl,
  },
  nomineesEyebrow: {
    color: colors_V2.slate,
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
  nomineeCardSelected: {
    borderColor: colors_V2.skyBlue,
    shadowColor: colors_V2.skyBlue,
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
    color: colors_V2.lilac,
    fontSize: 16,
    fontWeight: "800",
    ...textRtl,
  },
  nomineeNameSelected: {
    color: colors_V2.skyBlue,
  },
  nomineeTeam: {
    color: colors_V2.slate,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    ...textRtl,
  },
  nomineeVotesCol: {
    alignItems: "flex-end",
  },
  nomineeVoteNum: {
    color: colors_V2.lilac,
    fontSize: 18,
    fontWeight: "800",
  },
  nomineeVoteNumSelected: {
    color: colors_V2.skyBlue,
  },
  nomineeVotesLabel: {
    marginTop: 2,
    color: colors_V2.slate,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  pollClosedHint: {
    color: colors_V2.slate,
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
    color: colors_V2.gold,
  },
  resultRankMuted: {
    color: colors_V2.slate,
  },
  resultInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
    justifyContent: "center",
  },
  resultName: {
    color: colors_V2.lilac,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
    ...textRtl,
    ...androidTextTrim,
  },
  resultSub: {
    color: colors_V2.slate,
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
    color: colors_V2.lilac,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22,
    ...androidTextTrim,
  },
  resultVotesLabel: {
    marginTop: 2,
    color: colors_V2.slate,
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
    backgroundColor: colors_V2.lilac,
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
    backgroundColor: colors_V2.slate,
    opacity: 0.35,
  },
  officialFooterText: {
    color: colors_V2.slate,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
