import { NextRequest, NextResponse } from "next/server";
import { createTableRow, jsonError, parseBody } from "../_lib";
import { fetchRows } from "@/lib/supabase/server";
import { requireString, requireUrl } from "@/lib/admin/validation";

export async function GET(req: NextRequest) {
  try {
    const releaseId = req.nextUrl.searchParams.get("release_id");
    const rows = await fetchRows("release_platform_links", {
      orderBy: "order_index",
      filters: releaseId ? { release_id: releaseId } : undefined,
    });
    return NextResponse.json({ data: rows });
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody<Record<string, unknown>>(req);
    return await createTableRow("release_platform_links", {
      release_id: requireString(body.release_id, "release_id", { max: 100 }),
      platform: requireString(body.platform, "platform", { max: 80 }),
      url: requireUrl(body.url, "url"),
      order_index: Number(body.order_index ?? 0),
    });
  } catch (error) {
    return jsonError((error as Error).message);
  }
}
