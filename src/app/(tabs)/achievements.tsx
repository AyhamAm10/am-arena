import { AppLayout } from "@/src/components/layout";
import { AchievementsListScreen } from "@/src/features/achievements/AchievementsListScreen";

export default function AchievementsTabScreen() {
  return (
    <AppLayout scrollable={false}>
      <AchievementsListScreen variant="tab" />
    </AppLayout>
  );
}
