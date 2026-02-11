import { NextRequest, NextResponse } from "next/server";
import { requireUrl } from "@/lib/admin/validation";
import {
  getFeaturedVideoUrlSetting,
  setFeaturedVideoUrlSetting,
} from "@/lib/featured-video";

export async function GET() {
  try {
    const url = await getFeaturedVideoUrlSetting();
    return NextResponse.json(
      { data: { url } },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to load featured video URL" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as { url?: unknown };
    const url = requireUrl(body.url, "featuredVideoUrl");
    const updated = await setFeaturedVideoUrlSetting(url);
    return NextResponse.json(
      { data: { url: updated } },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
