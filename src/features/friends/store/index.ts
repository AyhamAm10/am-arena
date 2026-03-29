import { mirrorFactory } from "@/src/hooks/use-mirror-factory";
import { ApiState } from "./api";
import { emptyFriendsUiState } from "./state";

const { useMirror, useMirrorRegistry } = mirrorFactory({
  ...ApiState(),
  ...emptyFriendsUiState(),
});

export { useMirror, useMirrorRegistry };
