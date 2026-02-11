import { NextRequest } from "next/server";
import { deleteTableRow, jsonError, parseBody, patchTableRow } from "../../_lib";
import { requireDateIso, requireUrl, requireString } from "@/lib/admin/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await parseBody<Record<string, unknown>>(req);
    return await patchTableRow("tour_dates", id, {
      event_date: requireDateIso(body.event_date, "event_date"),
      city: requireString(body.city, "city", { max: 120 }),
      venue: requireString(body.venue, "venue", { max: 160 }),
      ticket_url: requireUrl(body.ticket_url, "ticket_url"),
      order_index: Number(body.order_index ?? 0),
    });
  } catch (error) {
    return jsonError((error as Error).message);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    return await deleteTableRow("tour_dates", id);
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}
