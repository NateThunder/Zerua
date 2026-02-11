import { NextRequest } from "next/server";
import { jsonError, parseBody, reorderTable } from "../../_lib";

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody<{ ids: string[] }>(req);
    if (!Array.isArray(body.ids)) throw new Error("ids must be an array");
    return await reorderTable("merch_items", body.ids);
  } catch (error) {
    return jsonError((error as Error).message);
  }
}
