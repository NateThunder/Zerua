"use client";

import { extractYouTubeId } from "@/lib/admin/validation";
import { Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FeaturedVideoSectionProps = {
  videoUrl: string;
  title?: string;
};

export default function FeaturedVideoSection({
  videoUrl,
  title,
}: FeaturedVideoSectionProps) {
  const normalizedUrl = videoUrl.trim();
  const videoId = extractYouTubeId(normalizedUrl);
  const providedTitle = title?.trim() || "";
  const [youtubeTitles, setYoutubeTitles] = useState<Record<string, string>>({});
  const cachedTitle = videoId ? youtubeTitles[videoId] : "";
  const resolvedTitle = providedTitle || cachedTitle || "Featured video";

  useEffect(() => {
    if (!videoId || providedTitle || cachedTitle) return;

    const controller = new AbortController();
    const sourceUrl = `https://www.youtube.com/watch?v=${videoId}`;

    void (async () => {
      try {
        const res = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(sourceUrl)}&format=json`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const json = (await res.json()) as { title?: string };
        const fetchedTitle = json.title?.trim();
        if (!fetchedTitle) return;
        setYoutubeTitles((prev) => (prev[videoId] ? prev : { ...prev, [videoId]: fetchedTitle }));
      } catch {
        // Ignore lookup failures and keep fallback title.
      }
    })();

    return () => controller.abort();
  }, [providedTitle, videoId, cachedTitle]);

  if (!normalizedUrl) return null;

  return (
    <section className="bg-black py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <h2 className="sr-only">Featured video</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          {videoId ? (
            <InlineYouTubePlayer key={videoId} videoId={videoId} title={resolvedTitle} />
          ) : (
            <div className="relative aspect-video">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={normalizedUrl}
                title={resolvedTitle}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>
        <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-sm">
          {resolvedTitle}
        </p>
      </div>
    </section>
  );
}

function InlineYouTubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [useFallbackThumb, setUseFallbackThumb] = useState(false);
  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
    [videoId]
  );
  const thumbnailUrl = useFallbackThumb
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative aspect-video">
      {isPlaying ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title={title || "Featured video"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Play ${title || "featured video"}`}
          className="group absolute inset-0 block h-full w-full"
        >
          <img
            src={thumbnailUrl}
            alt={title || "Featured video thumbnail"}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            onError={() => {
              if (!useFallbackThumb) setUseFallbackThumb(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 transition-colors duration-300 group-hover:from-black/50" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/55 text-white transition-all duration-300 group-hover:scale-105 group-hover:border-white/70 group-hover:bg-black/70">
            <Play size={26} fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}
