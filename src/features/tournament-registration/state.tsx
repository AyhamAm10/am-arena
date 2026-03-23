import { type PropsWithChildren, useEffect, useState } from "react";
import { useMirror, useMirrorRegistry } from "./store";

function State({ children }: PropsWithChildren) {
  const friends = useMirror("friends");
  const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<number, string>>({});

  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriendIds((prev) => {
      if (prev.includes(friendId)) {
        return prev.filter((id) => id !== friendId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, friendId];
    });
  };

  const setFieldValue = (fieldId: number, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  useEffect(() => {
    if (!friends.length || selectedFriendIds.length > 0) {
      return;
    }
    setSelectedFriendIds(friends.slice(0, 3).map((friend) => friend.id));
  }, [friends, selectedFriendIds.length]);

  useMirrorRegistry("selectedFriendIds", selectedFriendIds, selectedFriendIds);
  useMirrorRegistry("fieldValues", fieldValues, fieldValues);
  useMirrorRegistry("setSelectedFriendIds", setSelectedFriendIds, setSelectedFriendIds);
  useMirrorRegistry("toggleFriendSelection", toggleFriendSelection, toggleFriendSelection);
  useMirrorRegistry("setFieldValue", setFieldValue, setFieldValue);

  return children;
}

export { State };
