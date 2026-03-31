import { ScreenEnterTransition } from "@/src/components/motion";
import { Tournaments } from "@/src/features/tournaments";

export default function TournamentsScreen() {
  return (
    <ScreenEnterTransition from="right" style={{ flex: 1 }}>
      <Tournaments />
    </ScreenEnterTransition>
  );
}
