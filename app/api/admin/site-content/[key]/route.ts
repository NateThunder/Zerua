import { NextRequest } from "next/server";
import { getSiteContent, jsonError, parseBody, patchSiteContent } from "../../_lib";

type Params = { params: Promise<{ key: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { key } = await params;
    return await getSiteContent(key);
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { key } = await params;
    const body = await parseBody<{ value: unknown }>(req);
    return await patchSiteContent(key, body.value);
  } catch (error) {
    return jsonError((error as Error).message);
  }
}
