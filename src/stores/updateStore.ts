import * as zustandModule from "zustand";

// Robustly resolve the `create` function across different bundler/module shapes.
const _m = zustandModule as any;
let createFactory: any = undefined;
if (typeof _m === "function") {
  createFactory = _m;
} else if (_m && typeof _m.create === "function") {
  createFactory = _m.create;
} else if (_m && _m.default) {
  const d = _m.default;
  if (typeof d === "function") createFactory = d;
  else if (d && typeof d.create === "function") createFactory = d.create;
}

if (!createFactory) {
  // last-resort: attempt to use the module object as a factory (some bundlers expose it)
  createFactory = _m;
}

export type AppUpdateInfo =
  | {
      latest_build: number | string;
      min_supported_build: number | string;
      update_url: string;
      mandatory: boolean;
    }
  | null;

type State = {
  update: AppUpdateInfo;
  setUpdate: (u: AppUpdateInfo) => void;
  clearUpdate: () => void;
};

const useUpdateStore = (createFactory as any)((set: any) => ({
  update: null,
  setUpdate: (u: AppUpdateInfo) => set(() => ({ update: u })),
  clearUpdate: () => set(() => ({ update: null })),
})) as any;

export default useUpdateStore;

export const setAppUpdate = (u: AppUpdateInfo) => {
  useUpdateStore.setState({ update: u });
};

export const clearAppUpdate = () => {
  useUpdateStore.setState({ update: null });
};
