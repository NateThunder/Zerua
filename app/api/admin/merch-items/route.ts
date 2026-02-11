import { NextRequest } from "next/server";
import { createTableRow, jsonError, listTable, parseBody } from "../_lib";
import { requireString, requireUrl } from "@/lib/admin/validation";

export async function GET() {
  try {
    return await listTable("merch_items");
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody<Record<string, unknown>>(req);
    return await createTableRow("merch_items", {
      title: requireString(body.title, "title", { max: 180 }),
      image_path: requireString(body.image_path, "image_path", { max: 500 }),
      url: requireUrl(body.url, "url"),
      order_index: Number(body.order_index ?? 0),
    });
  } catch (error) {
    return jsonError((error as Error).message);
  }
}
