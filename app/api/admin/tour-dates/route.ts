import { NextRequest } from "next/server";
import { createTableRow, jsonError, listTable, parseBody } from "../_lib";
import {
  optionalBoolean,
  optionalUrl,
  requireDateIso,
  requireString,
} from "@/lib/admin/validation";

export async function GET() {
  try {
    return await listTable("tour_dates");
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody<Record<string, unknown>>(req);
    return await createTableRow("tour_dates", {
      event_date: requireDateIso(body.event_date, "event_date"),
      city: requireString(body.city, "city", { max: 120 }),
      venue: requireString(body.venue, "venue", { max: 160 }),
      ticket_url: optionalUrl(body.ticket_url, "ticket_url"),
      is_free: optionalBoolean(body.is_free, "is_free", false),
      is_sold_out: optionalBoolean(body.is_sold_out, "is_sold_out", false),
      order_index: Number(body.order_index ?? 0),
    });
  } catch (error) {
    return jsonError((error as Error).message);
  }
}
