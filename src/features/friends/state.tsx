import { type PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useMirrorRegistry } from "./store";
import type { FriendsScreenTab } from "./store/api";

const DEBOUNCE_MS = 300;

function State({ children }: PropsWithChildren) {
  const [activeTab, setActiveTab] = useState<FriendsScreenTab>("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const toggleSort = useCallback(() => {
    setSortAscending((v) => !v);
  }, []);

  useMirrorRegistry("activeTab", activeTab, activeTab);
  useMirrorRegistry("setActiveTab", setActiveTab);
  useMirrorRegistry("searchQuery", searchQuery, searchQuery);
  useMirrorRegistry("setSearchQuery", setSearchQuery);
  useMirrorRegistry("debouncedSearch", debouncedSearch, debouncedSearch);
  useMirrorRegistry("sortAscending", sortAscending, sortAscending);
  useMirrorRegistry("toggleSort", toggleSort, toggleSort);

  return children;
}

export { State };
