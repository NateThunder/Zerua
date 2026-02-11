export type TourDate = {
  id: string;
  event_date: string;
  city: string;
  venue: string;
  ticket_url: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
};

export type Release = {
  id: string;
  title: string;
  subtitle: string | null;
  cover_image_path: string;
  release_date: string | null;
  is_featured: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
};

export type ReleasePlatformLink = {
  id: string;
  release_id: string;
  platform: string;
  url: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
};

export type ChartItem = {
  id: string;
  title: string;
  image_path: string;
  url: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
};

export type MerchItem = {
  id: string;
  title: string;
  image_path: string;
  url: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
};

export type AboutContent = {
  paragraphs: string[];
};

export type ShowcaseVideoContent = {
  youtube_url: string;
  title?: string;
};

export type HomeHeroCopyContent = {
  headline: string;
  body: string;
};

export type SiteContentValue =
  | AboutContent
  | ShowcaseVideoContent
  | HomeHeroCopyContent
  | Record<string, unknown>;
