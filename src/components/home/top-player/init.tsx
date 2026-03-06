import React, { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./state";
import type { InitTopPlayerState } from "./state/init";

type InitProps = PropsWithChildren<InitTopPlayerState>;

export function Init(props: InitProps) {
  const { byId, children } = props;
  useMirrorRegistry("byId", byId, "reference");

  return <>{children}</>;
}
