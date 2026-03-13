const SUPPORTED_MEDIA_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export function normalizeMediaType(fileType: string): string | null {
  if (fileType === "image/jpg") return "image/jpeg";
  if (SUPPORTED_MEDIA_TYPES.has(fileType)) return fileType;
  return null;
}
