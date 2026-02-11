import { NextRequest } from "next/server";
import { deleteTableRow, jsonError, parseBody, patchTableRow } from "../../_lib";
import { requireString, requireUrl } from "@/lib/admin/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await parseBody<Record<string, unknown>>(req);
    return await patchTableRow("charts", id, {
      title: requireString(body.title, "title", { max: 180 }),
      image_path: requireString(body.image_path, "image_path", { max: 500 }),
      url: requireUrl(body.url, "url"),
      order_index: Number(body.order_index ?? 0),
    });
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
