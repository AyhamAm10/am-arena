import React, { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./state";
import { InitSuperSubState } from "./state/init";

export function Init(props: PropsWithChildren<InitSuperSubState>) {
  const { title, description, progress, children } = props;
  useMirrorRegistry("title", title);
  useMirrorRegistry("description", description);
  useMirrorRegistry("progress", progress);

  return <>{children}</>;
}
