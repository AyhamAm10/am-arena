type InitState = {
  title: string;
  description: string;
  progress: number;
};

const store = (): InitState => ({
  title: "",
  description: "",
  progress: 0,
});

export { store as InitState };
export type { InitState as InitSuperSubState };
