import { type PropsWithChildren, useEffect, useState } from "react";
import { useMirror, useMirrorRegistry } from "./store";

function State({ children }: PropsWithChildren) {
  const tournamentId = useMirror("tournamentId");
  const registrationFields = useMirror("registrationFields");
  const tournament = useMirror("tournament");

  const maxSelectableFriends =
    tournament?.game?.type === "squad" ? 3 : 0;

  const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<number, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [friendSearch, setFriendSearch] = useState("");

  const fieldSignature = registrationFields.map((f) => f.id).join(",");

  useEffect(() => {
    setFieldValues({});
    setTermsAccepted(false);
    setSelectedFriendIds([]);
    setFriendSearch("");
  }, [tournamentId, fieldSignature]);

  useEffect(() => {
    if (tournament?.game?.type !== "squad") {
      setSelectedFriendIds([]);
    }
  }, [tournament?.game?.type]);

  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriendIds((prev) => {
      if (prev.includes(friendId)) {
        return prev.filter((id) => id !== friendId);
      }
      if (maxSelectableFriends === 0 || prev.length >= maxSelectableFriends) {
        return prev;
      }
      return [...prev, friendId];
    });
  };

  const setFieldValue = (fieldId: number, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  useMirrorRegistry("selectedFriendIds", selectedFriendIds, selectedFriendIds);
  useMirrorRegistry("fieldValues", fieldValues, fieldValues);
  useMirrorRegistry("termsAccepted", termsAccepted, termsAccepted);
  useMirrorRegistry("friendSearch", friendSearch, friendSearch);
  useMirrorRegistry("setSelectedFriendIds", setSelectedFriendIds);
  useMirrorRegistry("toggleFriendSelection", toggleFriendSelection, toggleFriendSelection);
  useMirrorRegistry("setFieldValue", setFieldValue, setFieldValue);
  useMirrorRegistry("setTermsAccepted", setTermsAccepted);
  useMirrorRegistry("setFriendSearch", setFriendSearch);

  return children;
}

export { State };
