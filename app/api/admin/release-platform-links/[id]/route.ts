import { NextRequest } from "next/server";
import { deleteTableRow, jsonError, parseBody, patchTableRow } from "../../_lib";
import { requireString, requireUrl } from "@/lib/admin/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await parseBody<Record<string, unknown>>(req);
    return await patchTableRow("release_platform_links", id, {
      release_id: requireString(body.release_id, "release_id", { max: 100 }),
      platform: requireString(body.platform, "platform", { max: 80 }),
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
    return await deleteTableRow("release_platform_links", id);
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}
