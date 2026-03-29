import type { TournamentHistoryItem } from "@/src/api/types/user.types";
import { TourIcon } from "@/src/components/icons/figma/TourIcon";
import { colors } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  items: TournamentHistoryItem[];
};

const ACCENT_COLORS: Record<TournamentHistoryItem["result"], string> = {
  won: "#22C55E",
  lost: "#F59E0B",
  free: "#7F0DF2",
};

const AMOUNT_COLORS: Record<TournamentHistoryItem["result"], string> = {
  won: "#22C55E",
  lost: "#22C55E",
  free: "#9CA3AF",
};

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatAmount(item: TournamentHistoryItem): string {
  if (item.result === "free") return "$0.00";
  if (item.result === "won") return `+$${item.amount.toFixed(2)}`;
  return `-$${item.amount.toFixed(2)}`;
}

const ARC_BOX = 58;
const ARC_STROKE = 3;
const ARC_RADIUS = (ARC_BOX - ARC_STROKE) / 2;
const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;
const ARC_DEGREES = 280;
const ARC_DASH = ARC_CIRCUMFERENCE * (ARC_DEGREES / 360);
const ARC_GAP = ARC_CIRCUMFERENCE - ARC_DASH;
const ARC_ROTATION = 90 + (360 - ARC_DEGREES) / 2;

const ICON_SIZE = 42;

function ArcRing({ color }: { color: string }) {
  const center = ARC_BOX / 2;
  return (
    <Svg
      width={ARC_BOX}
      height={ARC_BOX}
      style={StyleSheet.absoluteFill}
    >
      <Circle
        cx={center}
        cy={center}
        r={ARC_RADIUS}
        stroke={color}
        strokeWidth={ARC_STROKE}
        strokeLinecap="round"
        strokeDasharray={`${ARC_DASH} ${ARC_GAP}`}
        rotation={ARC_ROTATION}
        origin={`${center}, ${center}`}
        fill="none"
      />
    </Svg>
  );
}

export function RecentTournamentHistory({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Tournament History</Text>
      {items.map((item) => {
        const accent = ACCENT_COLORS[item.result];
        const amountColor = AMOUNT_COLORS[item.result];
        return (
          <View
            key={item.tournament_id}
            style={[styles.card, { borderLeftColor: accent }]}
          >
            <View style={styles.arcOuter}>
              <ArcRing color={accent} />
              <View style={styles.iconCircle}>
                <TourIcon size={20} color={accent} />
              </View>
            </View>

            <View style={styles.textCol}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.subtitle}>
                {formatRelativeTime(item.registered_at)}
              </Text>
            </View>

            <View style={styles.rightCol}>
              <Text style={[styles.amount, { color: amountColor }]}>
                {formatAmount(item)}
              </Text>
              {item.xp_reward > 0 ? (
                <Text style={styles.xp}>+{item.xp_reward} XP</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkBackground2,
    borderRadius: 50,
    paddingVertical: 10,
    paddingRight: 18,
    paddingLeft: 6,
    marginBottom: 12,
    borderLeftWidth: 3.5,
  },
  arcOuter: {
    width: ARC_BOX,
    height: ARC_BOX,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.grey,
    fontSize: 12,
    marginTop: 3,
  },
  rightCol: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
  xp: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
});
