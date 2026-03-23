import { mirrorFactory } from "@/src/hooks/use-mirror-factory";
import { ApiState } from "./api";
import { TournamentRegistrationState } from "./state";
import { TournamentRegistrationUtils } from "./utils";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
  ...TournamentRegistrationState(),
  ...TournamentRegistrationUtils(),
});

export { useMirror, useMirrorRegistry };
