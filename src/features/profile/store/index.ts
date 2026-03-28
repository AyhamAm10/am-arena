import { mirrorFactory } from "@/src/hooks/use-mirror-factory";
import { ApiState } from "./api";
import { ProfileEmptyState } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
  ...ProfileEmptyState(),
});

export { useMirror, useMirrorRegistry };
