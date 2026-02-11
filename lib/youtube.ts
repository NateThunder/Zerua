import "server-only";

export type YouTubeVideoItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  videoUrl: string;
  embedUrl: string;
};

export type YouTubeVideosResponse = {
  videos: YouTubeVideoItem[];
  nextPageToken: string | null;
};

export type FetchChannelVideosOptions = {
  pageToken?: string;
  maxResults?: number;
};

export type YouTubeErrorCode =
  | "MISSING_YOUTUBE_CONFIG"
  | "YOUTUBE_REQUEST_FAILED"
  | "YOUTUBE_INVALID_RESPONSE";

export class YouTubeApiError extends Error {
  code: YouTubeErrorCode;
  status: number;

  constructor(code: YouTubeErrorCode, message: string, status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

type RawYouTubeSearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: {
      maxres?: { url?: string };
      standard?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
};

type RawYouTubeSearchResponse = {
  nextPageToken?: string;
  items?: RawYouTubeSearchItem[];
};

function getYouTubeConfig() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!apiKey || !channelId) {
    throw new YouTubeApiError(
      "MISSING_YOUTUBE_CONFIG",
      "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID",
      500
    );
  }
  return { apiKey, channelId };
}

function pickThumbnail(item: RawYouTubeSearchItem): string {
  const thumbs = item.snippet?.thumbnails;
  return (
    thumbs?.maxres?.url ||
    thumbs?.standard?.url ||
    thumbs?.high?.url ||
    thumbs?.medium?.url ||
    thumbs?.default?.url ||
    ""
  );
}

export async function fetchChannelVideos(
  options: FetchChannelVideosOptions = {}
): Promise<YouTubeVideosResponse> {
  const { apiKey, channelId } = getYouTubeConfig();
  const maxResults = options.maxResults ?? 12;
  const params = new URLSearchParams({
    part: "snippet",
    channelId,
    type: "video",
    order: "date",
    maxResults: String(maxResults),
    key: apiKey,
  });
  if (options.pageToken) {
    params.set("pageToken", options.pageToken);
  }

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    let message = "Failed to fetch YouTube videos";
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      message = body.error?.message || message;
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new YouTubeApiError("YOUTUBE_REQUEST_FAILED", message, 502);
  }

  const payload = (await res.json()) as RawYouTubeSearchResponse;
  if (!payload || !Array.isArray(payload.items)) {
    throw new YouTubeApiError(
      "YOUTUBE_INVALID_RESPONSE",
      "YouTube response did not include a valid items array",
      502
    );
  }

  const videos: YouTubeVideoItem[] = payload.items
    .map((item) => {
      const id = item.id?.videoId;
      if (!id) return null;
      return {
        id,
        title: item.snippet?.title || "Untitled",
        description: item.snippet?.description || "",
        thumbnailUrl: pickThumbnail(item),
        publishedAt: item.snippet?.publishedAt || "",
        videoUrl: `https://www.youtube.com/watch?v=${id}`,
        embedUrl: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`,
      };
    })
    .filter((video): video is YouTubeVideoItem => Boolean(video));

  return {
    videos,
    nextPageToken: payload.nextPageToken || null,
  };
}
