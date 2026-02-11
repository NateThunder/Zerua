const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function ensureConfig() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
}

type QueryOptions = {
  select?: string;
  orderBy?: string;
  ascending?: boolean;
  filters?: Record<string, string | number | boolean>;
  limit?: number;
};

function buildTableUrl(table: string, opts: QueryOptions = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  if (opts.select) url.searchParams.set("select", opts.select);
  if (opts.orderBy) {
    url.searchParams.set(
      "order",
      `${opts.orderBy}.${opts.ascending === false ? "desc" : "asc"}`
    );
  }
  if (opts.limit) url.searchParams.set("limit", String(opts.limit));
  if (opts.filters) {
    Object.entries(opts.filters).forEach(([key, value]) => {
      const encoded = `${value}`;
      url.searchParams.set(key, `eq.${encoded}`);
    });
  }
  return url.toString();
}

function headers(extra?: Record<string, string>) {
  ensureConfig();
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY as string,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    ...extra,
  };
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Supabase request failed");
  }
  return (await res.json()) as T;
}

export async function fetchRows<T>(table: string, opts?: QueryOptions): Promise<T[]> {
  ensureConfig();
  const res = await fetch(buildTableUrl(table, opts), {
    headers: headers(),
    cache: "no-store",
  });
  return parseResponse<T[]>(res);
}

export async function insertRow<T>(table: string, payload: Record<string, unknown>) {
  ensureConfig();
  const res = await fetch(buildTableUrl(table, { select: "*" }), {
    method: "POST",
    headers: headers({
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }),
    body: JSON.stringify(payload),
  });
  const data = await parseResponse<T[]>(res);
  return data[0];
}

export async function updateRow<T>(
  table: string,
  id: string,
  payload: Record<string, unknown>
) {
  ensureConfig();
  const url = new URL(buildTableUrl(table, { select: "*" }));
  url.searchParams.set("id", `eq.${id}`);
  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: headers({
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }),
    body: JSON.stringify(payload),
  });
  const data = await parseResponse<T[]>(res);
  return data[0];
}

export async function deleteRow(table: string, id: string): Promise<void> {
  ensureConfig();
  const url = new URL(buildTableUrl(table));
  url.searchParams.set("id", `eq.${id}`);
  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function upsertSiteContent(key: string, value: unknown) {
  ensureConfig();
  const res = await fetch(buildTableUrl("site_content", { select: "*" }), {
    method: "POST",
    headers: headers({
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    }),
    body: JSON.stringify({ key, value }),
  });
  const data = await parseResponse<{ key: string; value: unknown }[]>(res);
  return data[0];
}

export function storagePublicUrl(bucket: string, path: string): string {
  ensureConfig();
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function uploadFileToBucket(
  bucket: "release-covers" | "charts" | "merch",
  filePath: string,
  file: File
) {
  ensureConfig();
  const arrayBuffer = await file.arrayBuffer();
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${bucket}/${encodeURIComponent(filePath)}`,
    {
      method: "POST",
      headers: headers({
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      }),
      body: Buffer.from(arrayBuffer),
    }
  );
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return {
    path: filePath,
    publicUrl: storagePublicUrl(bucket, filePath),
  };
}
