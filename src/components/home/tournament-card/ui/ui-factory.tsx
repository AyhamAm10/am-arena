import React from "react";
import { useMirror } from "../state";
import TournamentCardView from "./TournamentCardView";

type Props = {
  instanceId: string;
};

export default function UiFactory({ instanceId }: Props) {
  const byId = useMirror("byId");
  const card = byId[instanceId];

  return <TournamentCardView card={card} />;
}
