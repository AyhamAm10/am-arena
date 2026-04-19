import React, { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./state";
import { InitEliteSquadState } from "./state/init";

export function Init(props: PropsWithChildren<InitEliteSquadState>) {
  const { superTournaments, onJoinPress, children } = props;
  useMirrorRegistry("superTournaments", superTournaments);
  useMirrorRegistry("onJoinPress", onJoinPress);

  return <>{children}</>;
}
