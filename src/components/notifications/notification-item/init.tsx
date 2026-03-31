import React, { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import type { NotificationItemInitState } from "./store/init";

type InitProps = PropsWithChildren<
  Pick<NotificationItemInitState, "byId"> & { instanceId: string }
>;

export function Init(props: InitProps) {
  const { byId, instanceId, children } = props;
  const entry = byId[instanceId];
  useMirrorRegistry("byId", byId, `${instanceId}:${entry?.id ?? 0}`);

  return <>{children}</>;
}
