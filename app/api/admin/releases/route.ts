import { NextRequest } from "next/server";
import { createTableRow, jsonError, listTable, parseBody } from "../_lib";
import {
  optionalString,
  requireDateIso,
  requireString,
} from "@/lib/admin/validation";

export async function GET() {
  try {
    return await listTable("releases");
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody<Record<string, unknown>>(req);
    return await createTableRow("releases", {
      title: requireString(body.title, "title", { max: 180 }),
      subtitle: optionalString(body.subtitle, 240),
      cover_image_path: requireString(body.cover_image_path, "cover_image_path", {
        max: 500,
      }),
      release_date:
        body.release_date == null || body.release_date === ""
          ? null
          : requireDateIso(body.release_date, "release_date"),
      is_featured: Boolean(body.is_featured),
      order_index: Number(body.order_index ?? 0),
    });
  } catch (error) {
    return jsonError((error as Error).message);
  }
}
