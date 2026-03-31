import { ScreenEnterTransition } from "@/src/components/motion";
import { Friends } from "@/src/features/friends";

export default function FriendsScreen() {
  return (
    <ScreenEnterTransition from="left" style={{ flex: 1 }}>
      <Friends />
    </ScreenEnterTransition>
  );
}
