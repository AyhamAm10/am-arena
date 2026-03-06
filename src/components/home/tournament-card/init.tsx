import React, { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./state";
import type { InitTournamentCardState } from "./state/init";

type InitProps = PropsWithChildren<InitTournamentCardState>;

export function Init(props: InitProps) {
  const { byId, children } = props;
  useMirrorRegistry("byId", byId, "reference");

  return <>{children}</>;
}
