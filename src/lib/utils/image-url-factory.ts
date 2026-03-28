import { apiUrl } from "@/src/api/axios/api-url";

/**
 * Builds a full URL for static files under `GET /image/:file` (Express serves `public/uploads`).
 * DB may store `image/<filename>`, `public/uploads/<filename>`, or just `<filename>`.
 */
export function formatImageUrl(path: string): string {
  if (!path) return "";

  const normalized = path.replace(/\\/g, "/");

  let fileName = normalized.replace(/^public\/uploads\//, "");
  // Backend `imageUrl()` stores paths like `image/123-photo.png` — avoid `/image/image/...`
  fileName = fileName.replace(/^image\//, "");

  if (!fileName) return "";

  return `${apiUrl}/image/${encodeURIComponent(fileName)}`;
}
