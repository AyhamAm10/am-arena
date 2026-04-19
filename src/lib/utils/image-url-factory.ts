import { apiUrl } from "@/src/api/axios/api-url";

/**
 * Achievement icons: DB stores `icons/<filename>`; backend serves `public/icons` at `GET /icons/<filename>`.
 * Do not use {@link formatImageUrl} for these — that maps to `/image/` (`public/uploads`).
 */
export function formatAchievementIconUrl(path: string): string {
  if (!path) return "";
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const normalized = trimmed.replace(/\\/g, "/").replace(/^\/+/, "");

  if (normalized.startsWith("icons/")) {
    const file = normalized.slice("icons/".length);
    return file ? `${apiUrl}/icons/${encodeURIComponent(file)}` : "";
  }
  if (normalized.startsWith("public/icons/")) {
    const file = normalized.slice("public/icons/".length);
    return file ? `${apiUrl}/icons/${encodeURIComponent(file)}` : "";
  }

  if (normalized && !normalized.includes("/")) {
    return `${apiUrl}/icons/${encodeURIComponent(normalized)}`;
  }

  return formatImageUrl(normalized);
}

/**
 * Builds a full URL for static files under `GET /image/:file` (Express serves `public/uploads`).
 * DB may store `image/<filename>`, `public/uploads/<filename>`, or just `<filename>`.
 */
export function formatImageUrl(path: string): string {
  if (!path) return "";

  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const normalized = trimmed.replace(/\\/g, "/");

  let fileName = normalized.replace(/^public\/uploads\//, "");
  // Backend `imageUrl()` stores paths like `image/123-photo.png` — avoid `/image/image/...`
  fileName = fileName.replace(/^image\//, "");

  if (!fileName) return "";

  return `${apiUrl}/image/${encodeURIComponent(fileName)}`;
}
