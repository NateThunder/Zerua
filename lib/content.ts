import { defaultAboutContent, defaultFeaturedVideoUrl, defaultHeroCopy } from "./admin/defaults";
import type {
  AboutContent,
  ChartItem,
  FeaturedVideoUrlContent,
  HomeHeroCopyContent,
  MerchItem,
  Release,
  ReleasePlatformLink,
  TourDate,
} from "./admin/types";
import { getFeaturedVideoUrlSetting } from "./featured-video";
import { fetchRows, storagePublicUrl } from "./supabase/server";

type SiteContentRow = { key: string; value: unknown };

function withPublicUrl(
  path: string | null | undefined,
  bucket: "release-covers" | "charts" | "merch"
) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return storagePublicUrl(bucket, path);
}

export async function getTourDates() {
  try {
    return await fetchRows<TourDate>("tour_dates", { orderBy: "order_index" });
  } catch {
    return [];
  }
}

export async function getReleases() {
  try {
    return await fetchRows<Release>("releases", { orderBy: "order_index" });
  } catch {
    return [];
  }
}

export async function getReleasePlatformLinks(releaseId?: string) {
  try {
    return await fetchRows<ReleasePlatformLink>("release_platform_links", {
      orderBy: "order_index",
      filters: releaseId ? { release_id: releaseId } : undefined,
    });
  } catch {
    return [];
  }
}

export async function getCharts() {
  try {
    const rows = await fetchRows<ChartItem>("charts", { orderBy: "order_index" });
    return rows.map((row) => ({
      ...row,
      image_path: withPublicUrl(row.image_path, "charts"),
      thumbnail_path: withPublicUrl(row.thumbnail_path, "charts"),
    }));
  } catch {
    return [];
  }
}

export async function getMerchItems() {
  try {
    const rows = await fetchRows<MerchItem>("merch_items", { orderBy: "order_index" });
    return rows.map((row) => ({ ...row, image_path: withPublicUrl(row.image_path, "merch") }));
  } catch {
    return [];
  }
}

export async function getSiteContentValue<T>(key: string, fallback: T): Promise<T> {
  try {
    const rows = await fetchRows<SiteContentRow>("site_content", {
      filters: { key },
      limit: 1,
    });
    if (!rows.length) return fallback;
    return rows[0].value as T;
  } catch {
    return fallback;
  }
}

export async function getFeaturedReleaseData() {
  const releases = await getReleases();
  const featured = releases.find((r) => r.is_featured) ?? releases[0] ?? null;
  if (!featured) return null;
  const links = await getReleasePlatformLinks(featured.id);
  return {
    ...featured,
    cover_image_path: withPublicUrl(featured.cover_image_path, "release-covers"),
    links,
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  return getSiteContentValue<AboutContent>("about", defaultAboutContent);
}

export async function getFeaturedVideoUrl(): Promise<FeaturedVideoUrlContent> {
  try {
    const value = await getFeaturedVideoUrlSetting();
    return value || defaultFeaturedVideoUrl;
  } catch {
    return defaultFeaturedVideoUrl;
  }
}

export async function getHomeHeroCopy(): Promise<HomeHeroCopyContent> {
  return getSiteContentValue<HomeHeroCopyContent>("home_hero_copy", defaultHeroCopy);
}
