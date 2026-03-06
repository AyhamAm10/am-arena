import React, { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./state";
import { InitLatestWinnerState } from "./state/init";

export function Init(props: PropsWithChildren<InitLatestWinnerState>) {
  const { teamName, tournamentName, imageSource, children } = props;
  useMirrorRegistry("teamName", teamName);
  useMirrorRegistry("tournamentName", tournamentName);
  useMirrorRegistry("imageSource", imageSource, "reference");

  return <>{children}</>;
}
