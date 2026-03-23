import type {
  RegisterForTournamentBody,
  TournamentRegistrationField,
} from "@/src/api/types/pubg-tournament-registration.types";
import { type PropsWithChildren, useMemo } from "react";
import { useMirror, useMirrorRegistry } from "./store";

function getDefaultFieldValue(field: TournamentRegistrationField): string {
  if (field.type === "select" && field.options) {
    const firstOption = field.options
      .split(",")
      .map((option) => option.trim())
      .find(Boolean);
    if (firstOption) {
      return firstOption;
    }
  }
  return "";
}

function Utils({ children }: PropsWithChildren) {
  const tournamentId = useMirror("tournamentId");
  const selectedFriendIds = useMirror("selectedFriendIds");
  const fieldValues = useMirror("fieldValues");
  const registrationFields = useMirror("registrationFields");
  const submitRegistration = useMirror("submitRegistration");
  const fetchMoreFriends = useMirror("fetchMoreFriends");
  const hasNextFriendsPage = useMirror("hasNextFriendsPage");
  const isFetchingMoreFriends = useMirror("isFetchingMoreFriends");
  const isSubmitting = useMirror("isSubmitting");

  const selectedCountLabel = useMemo(
    () => `${selectedFriendIds.length + 1}/4 Selected`,
    [selectedFriendIds.length]
  );

  const payload = useMemo<RegisterForTournamentBody>(
    () => ({
      field_values: registrationFields.map((field) => ({
        field_id: field.id,
        value: fieldValues[field.id] ?? getDefaultFieldValue(field),
      })),
      friends: selectedFriendIds,
    }),
    [fieldValues, registrationFields, selectedFriendIds]
  );

  const canSubmit = useMemo(() => {
    if (!tournamentId || isSubmitting) return false;
    if (selectedFriendIds.length !== 3) return false;
    return registrationFields.every((field) => {
      if (!field.required) return true;
      const value = payload.field_values.find((item) => item.field_id === field.id)?.value ?? "";
      return Boolean(value.trim());
    });
  }, [isSubmitting, payload.field_values, registrationFields, selectedFriendIds.length, tournamentId]);

  const onFriendsListEndReached = () => {
    if (!hasNextFriendsPage || isFetchingMoreFriends) {
      return;
    }
    fetchMoreFriends();
  };

  const onConfirmJoin = async () => {
    if (!canSubmit) return;
    await submitRegistration({
      tournamentId,
      body: payload,
    });
  };

  useMirrorRegistry("selectedCountLabel", selectedCountLabel, selectedCountLabel);
  useMirrorRegistry("canSubmit", canSubmit, canSubmit);
  useMirrorRegistry("onFriendsListEndReached", onFriendsListEndReached, onFriendsListEndReached);
  useMirrorRegistry("onConfirmJoin", onConfirmJoin, onConfirmJoin);

  return children;
}

export { Utils };
