import { resolveMediaUrl } from "@/src/lib/utils/resolve-media-url";

/** @deprecated Prefer {@link resolveMediaUrl} with kind `"video"`. */
export function formatReelVideoUrl(raw: string | undefined | null): string {
  return resolveMediaUrl(raw, "video");
}
