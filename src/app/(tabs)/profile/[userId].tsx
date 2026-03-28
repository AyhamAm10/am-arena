import { Profile } from "@/src/features/profile";
import { useLocalSearchParams } from "expo-router";

export default function OtherUserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string | string[] }>();
  const id = Array.isArray(userId) ? userId[0] ?? "" : userId ?? "";

  return <Profile variant="other" userId={id} />;
}
