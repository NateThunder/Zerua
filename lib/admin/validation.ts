export function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function requireString(
  value: unknown,
  field: string,
  opts?: { min?: number; max?: number }
): string {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }
  const normalized = value.trim();
  const min = opts?.min ?? 1;
  const max = opts?.max ?? 5000;
  if (normalized.length < min) {
    throw new Error(`${field} is required`);
  }
  if (normalized.length > max) {
    throw new Error(`${field} is too long`);
  }
  return normalized;
}

export function requireUrl(value: unknown, field: string): string {
  const url = requireString(value, field);
  if (!isValidUrl(url)) {
    throw new Error(`${field} must be a valid URL`);
  }
  return url;
}

export function optionalUrl(value: unknown, field: string): string {
  if (value == null || value === "") {
    return "";
  }
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }
  const normalized = value.trim();
  if (!normalized) {
    return "";
  }
  if (!isValidUrl(normalized)) {
    throw new Error(`${field} must be a valid URL`);
  }
  return normalized;
}

export function optionalBoolean(value: unknown, field: string, fallback = false): boolean {
  if (value == null) {
    return fallback;
  }
  if (typeof value !== "boolean") {
    throw new Error(`${field} must be a boolean`);
  }
  return value;
}

export function requireDateIso(value: unknown, field: string): string {
  const date = requireString(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${field} must be in YYYY-MM-DD format`);
  }
  return date;
}

export function optionalString(value: unknown, max = 5000): string | null {
  if (value == null || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    throw new Error("Optional value must be a string");
  }
  const normalized = value.trim();
  if (normalized.length > max) {
    throw new Error("Optional value is too long");
  }
  return normalized;
}

export function extractYouTubeId(input: string): string | null {
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const vParam = url.searchParams.get("v");
      if (vParam && vParam.length > 0) return vParam;

      const parts = url.pathname.split("/").filter(Boolean);
      const markerIndex = parts.findIndex((part) =>
        ["shorts", "live", "embed", "v"].includes(part)
      );
      if (markerIndex >= 0 && parts[markerIndex + 1]) {
        return parts[markerIndex + 1];
      }
    }

    return null;
  } catch {
    const normalized = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(normalized)) return normalized;
    return null;
  }
}
