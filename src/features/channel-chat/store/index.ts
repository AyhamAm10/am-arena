import { mirrorFactory } from "@/src/hooks/use-mirror-factory";
import { ApiState } from "./api";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
});

export { useMirror, useMirrorRegistry };
