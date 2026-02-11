import { NextRequest } from "next/server";
import { deleteTableRow, jsonError, parseBody, patchTableRow } from "../../_lib";
import { optionalString, requireDateIso, requireString } from "@/lib/admin/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await parseBody<Record<string, unknown>>(req);
    return await patchTableRow("releases", id, {
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

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    return await deleteTableRow("releases", id);
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}
