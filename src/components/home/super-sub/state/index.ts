// import { mirrorFactory } from "../../../hooks/use-mirror-factory";
import { mirrorFactory } from "@/src/hooks/use-mirror-factory";
import { InitState } from "./init";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...InitState(),
});

export { useMirror, useMirrorRegistry };
