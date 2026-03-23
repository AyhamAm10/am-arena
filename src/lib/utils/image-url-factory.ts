import { apiUrl } from "@/src/api/axios/api-url";

export function formatImageUrl(path: string): string {
  console.log("path", path);
  if (!path) return '';

  const normalized = path.replace(/\\/g, '/');

  const fileName = normalized.replace(/^public\/uploads\//, '');

  if (!fileName) return '';

  return `${apiUrl}/image/${fileName}`;
}