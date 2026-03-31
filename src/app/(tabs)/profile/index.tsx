import { ScreenEnterTransition } from "@/src/components/motion";
import { Profile } from "@/src/features/profile";

export default function ProfileScreen() {
  return (
    <ScreenEnterTransition from="top" style={{ flex: 1 }}>
      <Profile variant="me" />
    </ScreenEnterTransition>
  );
}
