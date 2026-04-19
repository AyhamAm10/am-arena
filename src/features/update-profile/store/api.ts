import type { UpdateProfileBody } from "@/src/api/types/user.types";

type ApiState = {
  submit: (body: UpdateProfileBody) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const store = (): ApiState => ({
  submit: async () => {},
  isLoading: false,
  error: null,
});

export { store as ApiState };
export type { ApiState as UpdateProfileApiState };
