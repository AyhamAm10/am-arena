import type {
  RegisterForTournamentBody,
  TournamentRegistrationField,
} from "@/src/api/types/pubg-tournament-registration.types";
import { useHeaderUser } from "@/src/hooks/auth/useHeaderUser";
import { computeLevelAndProgress } from "@/src/lib/utils/level-from-xp";
import {
  requiredLevelForTournament,
  xpThresholdFromTournament,
} from "@/src/lib/utils/tournament-xp-gate";
import { type PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";

export function getDefaultFieldValue(field: TournamentRegistrationField): string {
  if (field.type === "select" && field.options) {
    const firstOption = field.options
      .split(",")
      .map((option) => option.trim())
      .find(Boolean);
    if (firstOption) {
      return firstOption;
    }
  }
  if (field.type === "boolean") {
    return "false";
  }
  return "";
}

export function resolvedFieldValue(
  field: TournamentRegistrationField,
  fieldValues: Record<number, string>
): string {
  const raw = fieldValues[field.id];
  if (raw !== undefined && raw !== "") {
    return raw;
  }
  return getDefaultFieldValue(field);
}

function fieldSatisfied(
  field: TournamentRegistrationField,
  value: string
): boolean {
  if (!field.required) {
    return true;
  }
  if (field.type === "boolean") {
    return value === "true";
  }
  if (field.type === "number") {
    const t = String(value).trim();
    if (!t) return false;
    return !Number.isNaN(Number(t));
  }
  return Boolean(String(value).trim());
}

function Utils({ children }: PropsWithChildren) {
  const header = useHeaderUser();
  const userXp = Number(header.user?.xp_points ?? 0);
  const { level: userLevel } = computeLevelAndProgress(userXp);

  const tournamentId = useMirror("tournamentId");
  const tournament = useMirror("tournament");
  const selectedFriendIds = useMirror("selectedFriendIds");
  const fieldValues = useMirror("fieldValues");
  const termsAccepted = useMirror("termsAccepted");
  const friendSearch = useMirror("friendSearch");
  const registrationFields = useMirror("registrationFields");
  const friends = useMirror("friends");
  const submitRegistration = useMirror("submitRegistration");
  const fetchMoreFriends = useMirror("fetchMoreFriends");
  const hasNextFriendsPage = useMirror("hasNextFriendsPage");
  const isFetchingMoreFriends = useMirror("isFetchingMoreFriends");
  const isSubmitting = useMirror("isSubmitting");

  const showSquadFriends = tournament?.game?.type === "squad";
  const maxSelectableFriends = showSquadFriends ? 3 : 0;

  const xpThreshold = tournament ? xpThresholdFromTournament(tournament) : 0;
  const levelRequired = tournament ? requiredLevelForTournament(tournament) : 0;
  const hasXpGate = xpThreshold > 0;
  const xpGateResolved =
    !hasXpGate || (!header.isUserLoading && header.isLoggedIn);
  const meetsXpGate =
    !hasXpGate || (header.isLoggedIn && userXp >= xpThreshold);
  const canJoinByLevel = meetsXpGate && xpGateResolved;

  const levelGateMessage = useMemo(() => {
    if (!tournament || !hasXpGate) return null;
    if (header.isUserLoading) return "جاري التحقق من المستوى المطلوب…";
    if (!header.isLoggedIn) {
      return `المستوى المطلوب: ${levelRequired}. سجّل الدخول للانضمام — يُشترط الوصول إلى هذا المستوى على الأقل.`;
    }
    if (!meetsXpGate) {
      return `المستوى المطلوب: ${levelRequired}. مستواك الحالي: ${userLevel}. ارفع مستواك للانضمام.`;
    }
    return null;
  }, [
    tournament,
    hasXpGate,
    header.isUserLoading,
    header.isLoggedIn,
    meetsXpGate,
    levelRequired,
    userLevel,
  ]);

  const filteredFriends = useMemo(() => {
    const q = friendSearch.trim().toLowerCase();
    if (!q) {
      return friends;
    }
    return friends.filter((f) => f.name.toLowerCase().includes(q));
  }, [friends, friendSearch]);

  const payload = useMemo<RegisterForTournamentBody>(() => {
    const field_values = registrationFields.map((field) => ({
      field_id: field.id,
      value: resolvedFieldValue(field, fieldValues),
    }));
    return {
      field_values,
      friends: showSquadFriends ? selectedFriendIds : [],
    };
  }, [
    fieldValues,
    registrationFields,
    selectedFriendIds,
    showSquadFriends,
  ]);

  const canSubmit = useMemo(() => {
    if (!tournamentId || isSubmitting) {
      return false;
    }
    if (!canJoinByLevel) {
      return false;
    }
    if (!termsAccepted) {
      return false;
    }
    return registrationFields.every((field) =>
      fieldSatisfied(field, resolvedFieldValue(field, fieldValues))
    );
  }, [
    canJoinByLevel,
    fieldValues,
    isSubmitting,
    registrationFields,
    termsAccepted,
    tournamentId,
  ]);

  const selectedCountLabel = useMemo(
    () => `${selectedFriendIds.length} مُحدد`,
    [selectedFriendIds.length]
  );

  const onFriendsListEndReached = () => {
    if (!showSquadFriends || !hasNextFriendsPage || isFetchingMoreFriends) {
      return;
    }
    void fetchMoreFriends();
  };

  const onConfirmJoin = async () => {
    if (!canSubmit) {
      return;
    }
    await submitRegistration({
      tournamentId,
      body: payload,
    });
  };

  useMirrorRegistry("selectedCountLabel", selectedCountLabel, selectedCountLabel);
  useMirrorRegistry("levelGateMessage", levelGateMessage, levelGateMessage);
  useMirrorRegistry("canSubmit", canSubmit, canSubmit);
  useMirrorRegistry("onFriendsListEndReached", onFriendsListEndReached, onFriendsListEndReached);
  useMirrorRegistry("onConfirmJoin", onConfirmJoin, onConfirmJoin);
  useMirrorRegistry("showSquadFriends", showSquadFriends, showSquadFriends);
  useMirrorRegistry(
    "maxSelectableFriends",
    maxSelectableFriends,
    maxSelectableFriends
  );
  useMirrorRegistry("filteredFriends", filteredFriends, filteredFriends);

  return children;
}

export { Utils };
