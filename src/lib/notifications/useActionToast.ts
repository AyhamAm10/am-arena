import { useCallback, useMemo } from "react";
import {
  getErrorToastFallback,
  getSuccessToastFallback,
  notify,
  type ToastType,
} from "./toast";

type ToastOptions = {
  durationMs?: number;
};

export function useActionToast() {
  const success = useCallback(
    (message?: string, method?: string, options?: ToastOptions) => {
      notify(
        "success",
        message?.trim() || getSuccessToastFallback(method),
        options
      );
    },
    []
  );

  const error = useCallback(
    (
      message?: string,
      method?: string,
      status?: number,
      options?: ToastOptions
    ) => {
      notify(
        "error",
        message?.trim() || getErrorToastFallback(method, status),
        options
      );
    },
    []
  );

  const action = useCallback(
    (
      type: ToastType,
      message?: string,
      method?: string,
      status?: number,
      options?: ToastOptions
    ) => {
      if (type === "success") {
        success(message, method, options);
        return;
      }
      error(message, method, status, options);
    },
    [error, success]
  );

  return useMemo(
    () => ({ success, error, action }),
    [action, error, success]
  );
}