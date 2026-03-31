import { ScreenEnterTransition } from "@/src/components/motion";
import { Channels } from "@/src/features/channels";

export default function ChannelsScreen() {
  return (
    <ScreenEnterTransition from="left" style={{ flex: 1 }}>
      <Channels />
    </ScreenEnterTransition>
  );
}
