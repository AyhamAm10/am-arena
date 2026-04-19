import type { AchievementPublic, UserAchievementEntry } from "@/src/api/types/user.types";
import { FadeInListRow, ScreenEnterTransition } from "@/src/components/motion";
import { ProfileHeader } from "@/src/features/profile/components/ProfileHeader";
import { useFetchAchievementCatalog } from "@/src/hooks/api/achievement/useFetchAchievementCatalog";
import { useFetchMyAchievements } from "@/src/hooks/api/achievement/useFetchMyAchievements";
import { useSetActiveAchievement } from "@/src/hooks/api/achievement/useSetActiveAchievement";
import { useToggleAchievementDisplay } from "@/src/hooks/api/achievement/useToggleAchievementDisplay";
import { flexRowRtl, progressFillRtl, textRtl, writingRtl } from "@/src/lib/rtl";
import { formatAchievementIconUrl } from "@/src/lib/utils/image-url-factory";
import { colors_V2 } from "@/src/theme/colors";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "all" | "mine";

export type AchievementsListVariant = "tab" | "stack";

function achievementAccent(item: AchievementPublic) {
  return item.color_theme?.trim() || colors_V2.gold;
}

function achievementProgress(item: AchievementPublic) {
  const value = Number(item.percentage ?? 0);
  return Math.max(0, Math.min(100, value));
}

function AchievementCard({
  achievement,
  userAchievementId,
  displayed,
  isCurrentActive,
  canToggleDisplay,
  busy,
  onToggleDisplay,
  onSetActive,
}: {
  achievement: AchievementPublic;
  userAchievementId?: number;
  displayed?: boolean;
  isCurrentActive: boolean;
  canToggleDisplay: boolean;
  busy: boolean;
  onToggleDisplay?: () => void;
  onSetActive?: () => void;
}) {
  const accent = achievementAccent(achievement);
  const uri = achievement.icon_url ? formatAchievementIconUrl(achievement.icon_url) : null;
  const isObtained = achievement.is_obtained === true || userAchievementId != null;
  const percentage = achievementProgress(achievement);
  const current = Number(achievement.current ?? 0);
  const target = achievement.target ?? null;
  const progressLabel =
    target != null ? `${current.toLocaleString("ar")} / ${target.toLocaleString("ar")}` : `${current.toLocaleString("ar")}`;

  return (
    <View style={[styles.card, { borderColor: `${accent}55` }]}>
      <View style={[styles.cardHeader, flexRowRtl]}>
        <View style={styles.headerMain}>
          <View style={[styles.headerRow, flexRowRtl]}>
            <View style={[styles.iconShell, { borderColor: `${accent}55` }]}>
              {uri ? (
                <Image source={{ uri }} style={styles.icon} contentFit="contain" />
              ) : (
                <View style={[styles.icon, { backgroundColor: `${accent}44` }]} />
              )}
            </View>
            <View style={styles.titleBlock}>
              <Text style={[styles.name, textRtl]} numberOfLines={2}>
                {achievement.name}
              </Text>
              <Text style={[styles.typeLabel, { color: accent }, writingRtl]}>
                {achievement.logic_type === "progress"
                  ? "إنجاز تقدمي"
                  : achievement.logic_type === "event"
                    ? "إنجاز حدث"
                    : "إنجاز يدوي"}
              </Text>
            </View>
          </View>
          <Text style={[styles.description, textRtl]}>{achievement.description}</Text>
        </View>

        <View style={styles.headerSide}>
          <Text style={[styles.xpText, { color: accent }]}>
            {achievement.xp_reward.toLocaleString("ar")} XP
          </Text>
          {isCurrentActive ? (
            <View style={[styles.activeBadge, { borderColor: accent, backgroundColor: `${accent}22` }]}>
              <Text style={[styles.activeBadgeText, { color: accent }, writingRtl]}>اللقب النشط</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.progressWrap}>
        <View style={[styles.progressRow, flexRowRtl]}>
          <Text style={[styles.progressLabel, writingRtl]}>التقدم</Text>
          <Text style={styles.progressValue}>{progressLabel}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              progressFillRtl,
              { width: `${percentage}%`, backgroundColor: accent },
            ]}
          />
        </View>
        <Text style={[styles.progressPercent, writingRtl]}>
          {`${Math.round(percentage).toLocaleString("ar")}%`}
        </Text>
      </View>

      {isObtained && canToggleDisplay ? (
        <View style={[styles.actionsRow, flexRowRtl]}>
          <View style={styles.switchWrap}>
            <Text style={[styles.switchLabel, writingRtl]}>إظهار في الملف</Text>
            <Switch
              value={Boolean(displayed)}
              onValueChange={onToggleDisplay}
              disabled={busy || !onToggleDisplay}
              trackColor={{ false: colors_V2.card, true: accent }}
              thumbColor={colors_V2.lilac}
            />
          </View>
          <Pressable
            disabled={busy || !onSetActive || isCurrentActive}
            onPress={onSetActive}
            style={[
              styles.actionButton,
              {
                borderColor: `${accent}66`,
                backgroundColor: isCurrentActive ? `${accent}22` : colors_V2.background,
                opacity: busy || !onSetActive ? 0.6 : 1,
              },
            ]}
          >
            <Text style={[styles.actionButtonText, { color: accent }, writingRtl]}>
              {isCurrentActive ? "مفعّل الآن" : "تعيين كلقب"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

type AchievementsListScreenProps = {
  /** `tab`: bottom-tab root (no back). `stack`: opened from profile (back to profile). */
  variant?: AchievementsListVariant;
};

export function AchievementsListScreen({ variant = "stack" }: AchievementsListScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ achievementId?: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const { data: myRows, isLoading: loadingMine, isError: mineError } = useFetchMyAchievements();
  const { data: catalog, isLoading: loadingCatalog, isError: catalogError } = useFetchAchievementCatalog();
  const toggleMutation = useToggleAchievementDisplay();
  const setActiveMutation = useSetActiveAchievement();

  const mine = myRows ?? [];
  const mineByAchievementId = useMemo(
    () =>
      new Map(
        mine
          .filter((entry) => entry.achievement)
          .map((entry) => [entry.achievement!.id, entry]),
      ),
    [mine],
  );

  const selectedEntry = useMemo(
    () => mine.find((entry) => entry.displayed && entry.achievement?.is_obtained),
    [mine],
  );

  const mergedCatalog = useMemo(() => {
    const rows = catalog ?? [];
    return rows.map((item) => {
      const mineRow = mineByAchievementId.get(item.id);
      if (!mineRow?.achievement) return item;
      return {
        ...item,
        ...mineRow.achievement,
        displayed: mineRow.displayed,
        is_obtained: true,
      };
    });
  }, [catalog, mineByAchievementId]);

  const visibleRows =
    activeTab === "mine"
      ? mine
          .filter((entry): entry is UserAchievementEntry & { achievement: AchievementPublic } => Boolean(entry.achievement))
          .map((entry) => ({
            achievement: entry.achievement,
            userAchievementId: entry.id,
            displayed: entry.displayed,
          }))
      : mergedCatalog.map((achievement) => {
          const mineRow = mineByAchievementId.get(achievement.id);
          return {
            achievement,
            userAchievementId: mineRow?.id,
            displayed: mineRow?.displayed ?? achievement.displayed ?? false,
          };
        });
  const focusedAchievementId = Number(params.achievementId ?? 0);
  const orderedRows =
    Number.isFinite(focusedAchievementId) && focusedAchievementId > 0
      ? [...visibleRows].sort((a, b) => {
          if (a.achievement.id === focusedAchievementId) return -1;
          if (b.achievement.id === focusedAchievementId) return 1;
          return 0;
        })
      : visibleRows;

  const isLoading = loadingMine || loadingCatalog;
  const isError = mineError || catalogError;
  const showBack = variant === "stack";

  const handleToggle = useCallback(
    (userAchievementId: number) => {
      toggleMutation.mutate(userAchievementId, {
        onError: (err) => {
          Alert.alert("تم بلوغ الحد", err.message || "يمكن عرض 4 إنجازات كحد أقصى.");
        },
      });
    },
    [toggleMutation],
  );

  const handleSetActive = useCallback(
    (userAchievementId: number) => {
      setActiveMutation.mutate(userAchievementId, {
        onError: (err) => {
          Alert.alert("تعذّر تحديث اللقب", err.message || "حدث خطأ أثناء تعيين اللقب.");
        },
      });
    },
    [setActiveMutation],
  );

  const body = (
        <View style={[styles.inner, variant === "tab" && styles.innerInAppLayout]}>
          <ProfileHeader
            title="الإنجازات"
            showBack={showBack}
            onBack={showBack ? () => router.back() : undefined}
          />

          <View style={[styles.tabsRow, flexRowRtl]}>
            <Pressable
              onPress={() => setActiveTab("all")}
              style={[styles.tabButton, activeTab === "all" && styles.tabButtonActive]}
            >
              <Text style={[styles.tabLabel, activeTab === "all" && styles.tabLabelActive, writingRtl]}>
                الكل
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab("mine")}
              style={[styles.tabButton, activeTab === "mine" && styles.tabButtonActive]}
            >
              <Text style={[styles.tabLabel, activeTab === "mine" && styles.tabLabelActive, writingRtl]}>
                ألقابي
              </Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors_V2.purple} />
            </View>
          ) : isError ? (
            <View style={styles.centered}>
              <Text style={[styles.muted, writingRtl]}>تعذّر تحميل الإنجازات.</Text>
            </View>
          ) : (
            <FlatList
              data={orderedRows}
              keyExtractor={(item) => `${activeTab}-${item.achievement.id}`}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={[styles.muted, writingRtl]}>
                  {activeTab === "mine" ? "لم تكسب ألقاباً بعد." : "لا توجد إنجازات حالياً."}
                </Text>
              }
              renderItem={({ item, index }) => (
                <FadeInListRow index={index}>
                  <AchievementCard
                    achievement={item.achievement}
                    userAchievementId={item.userAchievementId}
                    displayed={item.displayed}
                    isCurrentActive={
                      Boolean(selectedEntry?.achievement?.id) &&
                      selectedEntry?.achievement?.id === item.achievement.id
                    }
                    canToggleDisplay={item.userAchievementId != null}
                    busy={toggleMutation.isPending || setActiveMutation.isPending}
                    onToggleDisplay={
                      item.userAchievementId != null
                        ? () => handleToggle(item.userAchievementId!)
                        : undefined
                    }
                    onSetActive={
                      item.userAchievementId != null
                        ? () => handleSetActive(item.userAchievementId!)
                        : undefined
                    }
                  />
                </FadeInListRow>
              )}
            />
          )}
        </View>
  );

  return (
    <ScreenEnterTransition from="top" style={{ flex: 1 }}>
      {variant === "tab" ? (
        <View style={styles.safe}>{body}</View>
      ) : (
        <SafeAreaView style={styles.safe} edges={["top"]}>
          {body}
        </SafeAreaView>
      )}
    </ScreenEnterTransition>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors_V2.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 16,
  },
  innerInAppLayout: {
    paddingHorizontal: 0,
  },
  tabsRow: {
    backgroundColor: colors_V2.card,
    borderRadius: 12,
    padding: 6,
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: colors_V2.purple,
  },
  tabLabel: {
    color: colors_V2.slate,
    fontSize: 15,
    fontWeight: "700",
  },
  tabLabelActive: {
    color: colors_V2.lilac,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  muted: {
    color: colors_V2.slate,
    fontSize: 15,
    textAlign: "center",
  },
  list: {
    paddingBottom: 32,
    gap: 14,
  },
  card: {
    backgroundColor: colors_V2.card,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  cardHeader: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerMain: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  headerSide: {
    alignItems: "flex-start",
    gap: 8,
  },
  iconShell: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: colors_V2.background,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors_V2.lilac,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  description: {
    color: colors_V2.dustyLavender,
    fontSize: 14,
    lineHeight: 21,
  },
  xpText: {
    fontSize: 14,
    fontWeight: "800",
  },
  activeBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  progressWrap: {
    marginTop: 16,
  },
  progressRow: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    color: colors_V2.lilac,
    fontSize: 13,
    fontWeight: "700",
  },
  progressValue: {
    color: colors_V2.slate,
    fontSize: 12,
    fontWeight: "700",
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(216,185,255,0.14)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressPercent: {
    marginTop: 6,
    color: colors_V2.slate,
    fontSize: 12,
    fontWeight: "700",
  },
  actionsRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  switchWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
  },
  switchLabel: {
    color: colors_V2.lilac,
    fontSize: 14,
    fontWeight: "600",
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "800",
  },
});
