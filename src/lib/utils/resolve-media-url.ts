import { formatAchievementIconUrl, formatImageUrl } from "@/src/lib/utils/image-url-factory";

export type RemoteMediaKind = "image" | "achievementIcon" | "video";

/**
 * Single entry point for remote media URLs shown in the app.
 * Today: delegates to existing URL rules (no transformation).
 */
export function resolveMediaUrl(
  raw: string | undefined | null,
  kind: RemoteMediaKind = "image",
): string {
  if (kind === "achievementIcon") {
    return formatAchievementIconUrl(raw ?? "");
  }
  if (kind === "video") {
    const s = raw?.trim() ?? "";
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    return formatImageUrl(s);
  }
  return formatImageUrl(raw ?? "");
}
