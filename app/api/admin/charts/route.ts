import { NextRequest } from "next/server";
import { createTableRow, jsonError, listTable, parseBody } from "../_lib";
import { optionalString, requireString, requireUrl } from "@/lib/admin/validation";

export async function GET() {
  try {
    return await listTable("charts");
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody<Record<string, unknown>>(req);
    const payload: Record<string, unknown> = {
      title: requireString(body.title, "title", { max: 180 }),
      image_path: requireString(body.image_path, "image_path", { max: 500 }),
      url: requireUrl(body.url, "url"),
      order_index: Number(body.order_index ?? 0),
    };
    const thumbnailPath = optionalString(body.thumbnail_path, 500);
    if (thumbnailPath) payload.thumbnail_path = thumbnailPath;
    return await createTableRow("charts", payload);
  } catch (error) {
    return jsonError((error as Error).message);
  }
}
