import { mirrorFactory } from "@/src/hooks/use-mirror-factory";
import { ApiState } from "./api";
import { emptyChannelsState } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
  ...emptyChannelsState(),
});

export { useMirror, useMirrorRegistry };
