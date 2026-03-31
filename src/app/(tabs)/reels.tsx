import { ScreenEnterTransition } from "@/src/components/motion";
import { Reels } from "@/src/features/reels";

export default function ReelsScreen() {
  return (
    <ScreenEnterTransition from="right" style={{ flex: 1 }}>
      <Reels />
    </ScreenEnterTransition>
  );
}
