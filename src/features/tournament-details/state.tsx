import { type PropsWithChildren, useState } from "react";
import type { TournamentDetailsTab } from "./store/state";
import { useMirrorRegistry } from "./store";

function State({ children }: PropsWithChildren) {
  const [activeTab, setActiveTab] = useState<TournamentDetailsTab>("tournament");

  useMirrorRegistry("activeTab", activeTab, activeTab);
  useMirrorRegistry("setActiveTab", setActiveTab, setActiveTab);

  return children;
}

export { State };
