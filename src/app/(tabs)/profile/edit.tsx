import { ScreenEnterTransition } from "@/src/components/motion";
import { UpdateProfile } from "@/src/features/update-profile";

export default function EditProfileScreen() {
  return (
    <ScreenEnterTransition from="top" style={{ flex: 1 }}>
      <UpdateProfile />
    </ScreenEnterTransition>
  );
}
