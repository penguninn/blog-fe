// Match backend rules: images only, 5MB max, no empty files
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export function isImageFile(file: File) {
  return file && file.type && file.type.startsWith("image/");
}

export function validateImageFile(
  file: File,
  maxBytes: number = MAX_IMAGE_BYTES
): { ok: true } | { ok: false; reason: string } {
  if (!file || typeof file.size !== "number") {
    return { ok: false, reason: "Invalid file" };
  }
  if (file.size <= 0) {
    return { ok: false, reason: "File is empty" };
  }
  if (!isImageFile(file)) return { ok: false, reason: "Only image files are allowed" };
  if (file.size > maxBytes) return { ok: false, reason: "File exceeds 5MB limit" };
  return { ok: true };
}

export function createObjectUrl(file: File) {
  return URL.createObjectURL(file);
}

export function revokeObjectUrl(url?: string) {
  if (!url) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    // noop
    void 0;
  }
}
