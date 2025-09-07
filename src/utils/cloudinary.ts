// Cloudinary URL helpers

export type CloudinaryTransformOptions = {
  w?: number; // width
  q?: number | "auto";
  f?: "auto" | string;
  c?: string; // crop mode, e.g. "limit"
};

export function buildCloudinaryUrl(
  originalUrl: string,
  { w, q = "auto", f = "auto", c = "limit" }: CloudinaryTransformOptions = {}
): string {
  const marker = "/upload/";
  const idx = originalUrl.indexOf(marker);
  if (idx === -1) return originalUrl;

  const prefix = originalUrl.slice(0, idx + marker.length);
  const rest = originalUrl.slice(idx + marker.length);

  const parts: string[] = [];
  if (f) parts.push(`f_${f}`);
  if (q) parts.push(`q_${q}`);
  if (w) parts.push(`c_${c}`, `w_${w}`);

  const transform = parts.join(",");
  return transform ? `${prefix}${transform}/${rest}` : originalUrl;
}

export function buildSrcSet(
  originalUrl: string,
  widths: number[] = [360, 640, 768, 1024, 1280]
): string {
  return widths
    .map((w) => `${buildCloudinaryUrl(originalUrl, { w })} ${w}w`)
    .join(", ");
}

