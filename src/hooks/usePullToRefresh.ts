import { useCallback, useEffect, useRef, useState } from "react";

type RefreshFn = () => Promise<any> | void;

export function usePullToRefresh(refreshFn: RefreshFn) {
  const [refreshing, setRefreshing] = useState(false);
  const runningRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const onRefresh = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    try {
      if (mountedRef.current) setRefreshing(true);
      const maybe = refreshFn();
      if (maybe && typeof (maybe as Promise<any>).then === "function") {
        await maybe;
      }
    } catch (err) {
      // swallow; callers may handle errors via their fetch hooks
      // console.warn(err);
    } finally {
      runningRef.current = false;
      if (mountedRef.current) setRefreshing(false);
    }
  }, [refreshFn]);

  return { refreshing, onRefresh, setRefreshing } as const;
}
