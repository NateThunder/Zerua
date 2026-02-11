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
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      return id && id.length > 0 ? id : null;
    }
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return id || null;
    }
    return null;
  } catch {
    return null;
  }
}
