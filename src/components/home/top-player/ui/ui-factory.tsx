import React from "react";
import { useMirror } from "../state";
import TopPlayerCardView from "./TopPlayerCardView";

type Props = {
  instanceId: string;
};

export default function UiFactory({ instanceId }: Props) {
  const byId = useMirror("byId");
  const card = byId[instanceId];

  return <TopPlayerCardView card={card} />;
}
