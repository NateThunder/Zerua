import { NextRequest, NextResponse } from "next/server";
import { deleteRow, fetchRows, insertRow, updateRow, upsertSiteContent } from "@/lib/supabase/server";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function parseBody<T>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

export async function listTable<T>(table: string) {
  const rows = await fetchRows<T>(table, { orderBy: "order_index" });
  return NextResponse.json({ data: rows });
}

export async function createTableRow<T>(table: string, payload: Record<string, unknown>) {
  const row = await insertRow<T>(table, payload);
  return NextResponse.json({ data: row });
}

export async function patchTableRow<T>(
  table: string,
  id: string,
  payload: Record<string, unknown>
) {
  const row = await updateRow<T>(table, id, payload);
  return NextResponse.json({ data: row });
}

export async function deleteTableRow(table: string, id: string) {
  await deleteRow(table, id);
  return NextResponse.json({ ok: true });
}

export async function reorderTable(table: string, ids: string[]) {
  await Promise.all(
    ids.map((id, index) => updateRow(table, id, { order_index: index }))
  );
  return NextResponse.json({ ok: true });
}

export async function getSiteContent(key: string) {
  const rows = await fetchRows<{ key: string; value: unknown }>("site_content", {
    filters: { key },
    limit: 1,
  });
  return NextResponse.json({ data: rows[0] ?? null });
}

export async function patchSiteContent(key: string, value: unknown) {
  const row = await upsertSiteContent(key, value);
  return NextResponse.json({ data: row });
}
