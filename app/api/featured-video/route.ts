import { NextResponse } from "next/server";
import { getFeaturedVideoUrlSetting } from "@/lib/featured-video";

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
