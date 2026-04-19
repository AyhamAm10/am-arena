import { mirrorFactory } from "@/src/hooks/use-mirror-factory";
import { ApiState } from "./api";
import { TournamentDetailsState } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
  ...TournamentDetailsState(),
});

export { useMirror, useMirrorRegistry };
