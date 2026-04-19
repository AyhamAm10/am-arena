import { useHeaderUser } from "@/src/hooks/auth/useHeaderUser";
import { computeLevelAndProgress } from "@/src/lib/utils/level-from-xp";
import {
  requiredLevelForTournament,
  xpThresholdFromTournament,
} from "@/src/lib/utils/tournament-xp-gate";
import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";
import type { TournamentJoinGate } from "./store/api";

function Utils({ children }: PropsWithChildren) {
  const active = useMirror("activeTournaments");
  const { isLoggedIn, user, isUserLoading } = useHeaderUser();
  const userXp = Number(user?.xp_points ?? 0);
  const { level: userLevel } = computeLevelAndProgress(userXp);

  const joinGatesByTournamentId = useMemo(() => {
    const list = active ?? [];
    const out: Record<number, TournamentJoinGate> = {};
    for (const t of list) {
      const xpThreshold = xpThresholdFromTournament(t);
      const levelRequired = requiredLevelForTournament(t);
      const hasXpGate = xpThreshold > 0;
      const xpGateResolved = !hasXpGate || (!isUserLoading && isLoggedIn);
      const meetsXpGate = !hasXpGate || (isLoggedIn && userXp >= xpThreshold);
      const canJoin = meetsXpGate && xpGateResolved;
      let message: string | null = null;
      if (hasXpGate && !canJoin) {
        if (isUserLoading) {
          message = "جاري التحقق من المستوى المطلوب…";
        } else if (!isLoggedIn) {
          message = `المستوى المطلوب: ${levelRequired}. سجّل الدخول للانضمام.`;
        } else if (!meetsXpGate) {
          message = `المستوى المطلوب: ${levelRequired}. مستواك الحالي: ${userLevel}.`;
        }
      }
      out[t.id] = { canJoin, message };
    }
    return out;
  }, [active, isLoggedIn, isUserLoading, userLevel, userXp]);

  useMirrorRegistry(
    "joinGatesByTournamentId",
    joinGatesByTournamentId,
    joinGatesByTournamentId
  );

  return children;
}

export { Utils };
