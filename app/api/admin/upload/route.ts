import { NextRequest, NextResponse } from "next/server";
import { uploadFileToBucket } from "@/lib/supabase/server";
import { jsonError } from "../_lib";

const ACCEPTED_BUCKETS = new Set(["release-covers", "charts", "merch"]);
const ACCEPTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const bucket = req.nextUrl.searchParams.get("bucket");
    if (!bucket || !ACCEPTED_BUCKETS.has(bucket)) {
      return jsonError("Invalid bucket");
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return jsonError("file is required");
    }
    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
      return jsonError("Unsupported file type");
    }
    if (file.size > MAX_SIZE_BYTES) {
      return jsonError("File too large (max 5MB)");
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${safeName}`;
    const data = await uploadFileToBucket(
      bucket as "release-covers" | "charts" | "merch",
      path,
      file
    );
    return NextResponse.json({ data });
  } catch (error) {
    return jsonError((error as Error).message, 500);
  }
}
