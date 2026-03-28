import { useUpdateProfile } from "@/src/hooks/api/profile/useUpdateProfile";
import { type PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";

function Api({ children }: PropsWithChildren) {
  const { mutateAsync, isPending, error } = useUpdateProfile();

  const submit = async (body: FormData) => {
    await mutateAsync(body);
  };

  useMirrorRegistry("submit", submit, mutateAsync);
  useMirrorRegistry("isLoading", isPending, isPending);
  useMirrorRegistry("error", error?.message ?? null, error?.message);

  return children;
}

export { Api };
