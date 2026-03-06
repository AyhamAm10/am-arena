import { create } from "zustand";
import { useEffect, useRef } from "react";

/**
 * Custom hook for shallow or reference effect
 */
const useCompareEffect = (type: "value" | "reference") => {
  if (type === "value") {
    return (effect: () => void | (() => void), deps: any[]) => {
      const prevDeps = useRef<any[]>([]);
      const hasChanged = deps.some((dep, i) => dep !== prevDeps.current[i]);

      useEffect(() => {
        if (hasChanged) {
          effect();
        }
        prevDeps.current = deps;
      }, deps);
    };
  }

  return useEffect;
};

/**
 * Factory to create a mirror store with separated layers
 */
const mirrorFactory = <T extends object>(store: T) => {
  const internalStore = create<T>(() => ({ ...store }));

  /**
   * Register a value/function to the store
   */
  const useMirrorRegistry = <U extends keyof T>(
    state: U,
    params: T[U],
    type: "value" | "reference" = "reference"
  ) => {
    useCompareEffect(type)(() => {
      internalStore.setState((s) => ({ ...s, [state]: params }));
    }, [params]);

    return params;
  };

  /**
   * Hook to read a value/function from the store
   */
  const useMirror = <U extends keyof T>(state: U): T[U] => {
    const value = internalStore((s) => s[state]);
    return value;
  };

  return { useMirror, useMirrorRegistry };
};

export { mirrorFactory, useCompareEffect };
