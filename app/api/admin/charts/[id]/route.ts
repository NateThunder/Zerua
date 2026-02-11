import { NextRequest } from "next/server";
import { deleteTableRow, jsonError, parseBody, patchTableRow } from "../../_lib";
import { optionalString, requireString, requireUrl } from "@/lib/admin/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await parseBody<Record<string, unknown>>(req);
    const payload: Record<string, unknown> = {
      title: requireString(body.title, "title", { max: 180 }),
      image_path: requireString(body.image_path, "image_path", { max: 500 }),
      url: requireUrl(body.url, "url"),
      order_index: Number(body.order_index ?? 0),
    };
    const thumbnailPath = optionalString(body.thumbnail_path, 500);
    payload.thumbnail_path = thumbnailPath ?? null;
    return await patchTableRow("charts", id, payload);
  } catch (error) {
    return jsonError((error as Error).message);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    return await deleteTableRow("charts", id);
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}
