export function formatNotificationTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

/** Block obvious open redirects; app routes are internal paths only. */
export function isSafeInternalRoute(route: string): boolean {
  const r = route.trim();
  if (!r.startsWith("/") || r.includes("..") || r.startsWith("//")) {
    return false;
  }
  return true;
}

export function getNum(data: Record<string, unknown> | null, key: string): number | undefined {
  if (!data || !(key in data)) return undefined;
  const v = data[key];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export function getStr(data: Record<string, unknown> | null, key: string): string {
  if (!data || !(key in data)) return "";
  const v = data[key];
  return typeof v === "string" ? v : "";
}
