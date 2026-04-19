import type { PubgTournamentDetail } from "@/src/api/types/pubg-tournament.types";
import { requiredLevelFromXpThreshold } from "./level-from-xp";

/** Minimum total XP required by the tournament (super / XP-gated). */
export function xpThresholdFromTournament(tournament: PubgTournamentDetail): number {
  const v = tournament.Xp_condition ?? tournament.min_xp_required ?? 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;
}

/** Display level derived from that XP threshold (500 XP per level). */
export function requiredLevelForTournament(tournament: PubgTournamentDetail): number {
  return requiredLevelFromXpThreshold(xpThresholdFromTournament(tournament));
}
