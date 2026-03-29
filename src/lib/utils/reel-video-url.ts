import { formatImageUrl } from "@/src/lib/utils/image-url-factory";

/**
 * Resolves reel `video_url` for playback: absolute URLs pass through;
 * relative / upload paths use the same `/image/...` static base as images.
 */
export function formatReelVideoUrl(raw: string | undefined | null): string {
  const s = raw?.trim() ?? "";
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return formatImageUrl(s);
}
