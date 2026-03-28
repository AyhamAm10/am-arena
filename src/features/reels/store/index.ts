import { mirrorFactory } from "@/src/hooks/use-mirror-factory";
import { ApiState } from "./api";
import { ReelsScrollState } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
  ...ReelsScrollState(),
});

export { useMirror, useMirrorRegistry };
