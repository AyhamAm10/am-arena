// Simple color blending helper — linearly interpolate two hex colors.
export function blendHexColors(hexA: string, hexB: string, ratio = 0.5): string {
  const a = normalize(hexA);
  const b = normalize(hexB);
  const r = Math.round(a.r * (1 - ratio) + b.r * ratio);
  const g = Math.round(a.g * (1 - ratio) + b.g * ratio);
  const bl = Math.round(a.b * (1 - ratio) + b.b * ratio);
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

function normalize(hex: string) {
  let s = String(hex || "").trim();
  if (s.startsWith("#")) s = s.slice(1);
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  if (s.length !== 6) return { r: 0, g: 0, b: 0 };
  const r = parseInt(s.slice(0, 2), 16);
  const g = parseInt(s.slice(2, 4), 16);
  const b = parseInt(s.slice(4, 6), 16);
  return { r, g, b };
}

function toHex(v: number) {
  const s = Math.max(0, Math.min(255, v));
  return s.toString(16).padStart(2, "0");
}
