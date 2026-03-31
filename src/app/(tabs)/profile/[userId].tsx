import { ScreenEnterTransition } from "@/src/components/motion";
import { Profile } from "@/src/features/profile";
import { useLocalSearchParams } from "expo-router";

export default function OtherUserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string | string[] }>();
  const id = Array.isArray(userId) ? userId[0] ?? "" : userId ?? "";

  return (
    <ScreenEnterTransition from="top" style={{ flex: 1 }}>
      <Profile variant="other" userId={id} />
    </ScreenEnterTransition>
  );
}
