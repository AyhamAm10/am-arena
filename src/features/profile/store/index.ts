import { mirrorFactory } from "@/src/hooks/use-mirror-factory";
import { ApiState } from "./api";
import { ProfileEmptyState } from "./state";
import { ProfileUtilsState } from "./utils";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
  ...ProfileUtilsState(),
  ...ProfileEmptyState(),
});

export { useMirror, useMirrorRegistry };
