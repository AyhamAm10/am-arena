import { mirrorFactory } from "@/src/hooks/use-mirror-factory";
import { ApiState } from "./api";
import { UpdateProfileState } from "./state";
import { UpdateProfileUtils } from "./utils";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
  ...UpdateProfileState(),
  ...UpdateProfileUtils(),
});

export { useMirror, useMirrorRegistry };
