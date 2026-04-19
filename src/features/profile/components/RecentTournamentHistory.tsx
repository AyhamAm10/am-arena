import type { TournamentHistoryItem } from "@/src/api/types/user.types";
import { TourIcon } from "@/src/components/icons/figma/TourIcon";
import { flexRowRtl, textRtl, writingRtl } from "@/src/lib/rtl";
import { colors_V2 } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  items: TournamentHistoryItem[];
  isOwnProfile: boolean;
};

const ACCENT_COLORS: Record<TournamentHistoryItem["result"], string> = {
  won: colors_V2.skyBlue,
  lost: colors_V2.gold,
  free: colors_V2.lavenderLight,
};

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} د`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "أمس";
  if (days < 7) return `منذ ${days} أيام`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `منذ ${weeks} أسابيع`;
  return new Date(iso).toLocaleDateString("ar", {
    month: "short",
    day: "numeric",
  });
}

function formatAmount(item: TournamentHistoryItem): string {
  if (item.result === "free") return "$0.00";
  if (item.result === "won") return `+$${item.amount.toFixed(2)}`;
  return `-$${item.amount.toFixed(2)}`;
}

export function RecentTournamentHistory({ items, isOwnProfile }: Props) {
  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, flexRowRtl]}>
        <Text style={[styles.sectionTitle, writingRtl]}>
          {isOwnProfile ? "إدارة بطولاتي" : "آخر البطولات المشاركة"}
        </Text>
        {isOwnProfile ? (
          <Text style={[styles.sectionCaption, writingRtl]}>إدارة الظهور</Text>
        ) : null}
      </View>
      {items.map((item) => {
        const accent = ACCENT_COLORS[item.result];
        return (
          <View
            key={item.tournament_id}
            style={[styles.card, { borderStartColor: accent }]}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${accent}18` }]}>
              <TourIcon size={18} color={accent} />
            </View>
            <View style={styles.textCol}>
              <Text style={[styles.title, textRtl]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.subtitle, writingRtl]}>
                {item.result === "won"
                  ? "فوز"
                  : item.result === "lost"
                    ? "مشاركة"
                    : "مجانية"}{" "}
                • {formatRelativeTime(item.registered_at)}
              </Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={[styles.metaTop, textRtl]}>
                {item.xp_reward > 0 ? `+${item.xp_reward} XP` : formatAmount(item)}
              </Text>
              <View style={styles.metaDot} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors_V2.lilac,
    fontSize: 18,
    fontWeight: "700",
  },
  sectionCaption: {
    color: colors_V2.slate,
    fontSize: 11,
    fontWeight: "600",
  },
  card: {
    ...flexRowRtl,
    alignItems: "center",
    backgroundColor: colors_V2.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderStartWidth: 3,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginStart: 10,
  },
  textCol: {
    flex: 1,
  },
  title: {
    color: colors_V2.lilac,
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    color: colors_V2.slate,
    fontSize: 12,
    marginTop: 3,
  },
  metaCol: {
    alignItems: "center",
    gap: 8,
    marginStart: 12,
  },
  metaTop: {
    color: colors_V2.dustyLavender,
    fontSize: 11,
    fontWeight: "600",
  },
  metaDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});
