import { fetchRows, upsertSiteContent } from "./supabase/server";

type SiteContentRow = {
  key: string;
  value: unknown;
};

const FEATURED_VIDEO_KEY = "featuredVideoUrl";
const LEGACY_SHOWCASE_KEY = "showcase_video";

function readVideoUrl(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (value && typeof value === "object") {
    const shaped = value as { youtube_url?: unknown; url?: unknown };
    if (typeof shaped.youtube_url === "string") {
      return shaped.youtube_url.trim();
    }
    if (typeof shaped.url === "string") {
      return shaped.url.trim();
    }
  }
  return "";
}

export async function getFeaturedVideoUrlSetting(): Promise<string> {
  const rows = await fetchRows<SiteContentRow>("site_content", {
    filters: { key: FEATURED_VIDEO_KEY },
    limit: 1,
  });
  const featuredValue = readVideoUrl(rows[0]?.value);
  if (featuredValue) return featuredValue;

  const legacyRows = await fetchRows<SiteContentRow>("site_content", {
    filters: { key: LEGACY_SHOWCASE_KEY },
    limit: 1,
  });
  const legacyValue = readVideoUrl(legacyRows[0]?.value);
  if (legacyValue) return legacyValue;

  return "";
}

export async function setFeaturedVideoUrlSetting(url: string): Promise<string> {
  const normalized = url.trim();
  await upsertSiteContent(FEATURED_VIDEO_KEY, normalized);
  await upsertSiteContent(LEGACY_SHOWCASE_KEY, {
    youtube_url: normalized,
    title: "Featured video",
  });
  return normalized;
}
