"use client";

import { useEffect, useState } from "react";
import type { YouTubeVideoItem } from "@/lib/youtube";

type ApiResponse = {
  data?: {
    videos: YouTubeVideoItem[];
    nextPageToken: string | null;
  };
  error?: string;
  code?: string;
};

function formatDate(value: string): string {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}...`;
}

export default function VideosGridSection() {
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);

  async function loadVideos({
    pageToken,
    append = false,
  }: {
    pageToken?: string;
    append?: boolean;
  }) {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setStatus("loading");
      setErrorMessage("");
    }

    const params = new URLSearchParams({ maxResults: "12" });
    if (pageToken) params.set("pageToken", pageToken);

    try {
      const res = await fetch(`/api/youtube/videos?${params.toString()}`);
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || !json.data) {
        const message =
          json.code === "MISSING_YOUTUBE_CONFIG"
            ? "Missing YouTube configuration. Add YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID to your .env.local file."
            : json.error || "Could not load videos right now.";
        throw new Error(message);
      }

      setVideos((prev) => (append ? [...prev, ...json.data!.videos] : json.data!.videos));
      setNextPageToken(json.data.nextPageToken ?? null);
      setStatus("idle");
    } catch (error) {
      setErrorMessage((error as Error).message);
      setStatus("error");
    } finally {
      setIsLoadingMore(false);
    }
  }

  useEffect(() => {
    void loadVideos({});
  }, []);

  useEffect(() => {
    if (!selectedVideo) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedVideo(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedVideo]);

  return (
    <section className="bg-black pb-24 pt-8 sm:pb-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        {status === "loading" ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-white/80">
            Loading videos...
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-6 py-8 text-red-100">
            {errorMessage}
          </div>
        ) : null}

        {status === "idle" && videos.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-white/80">
            No videos found.
          </div>
        ) : null}

        {status === "idle" && videos.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setSelectedVideo(video)}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-[#FF6F61]/45 hover:bg-white/10"
                >
                  <div
                    className="aspect-video w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${video.thumbnailUrl})` }}
                    role="img"
                    aria-label={video.title}
                  />
                  <div className="space-y-3 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6F61]">
                      {formatDate(video.publishedAt)}
                    </p>
                    <h3 className="font-anton text-2xl uppercase leading-tight text-white transition group-hover:text-[#FF6F61]">
                      {video.title}
                    </h3>
                    <p className="text-sm text-white/75">{truncate(video.description, 120)}</p>
                  </div>
                </button>
              ))}
            </div>

            {nextPageToken ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => void loadVideos({ pageToken: nextPageToken, append: true })}
                  disabled={isLoadingMore}
                  className="rounded-full border border-[#FF6F61]/70 px-8 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#FF6F61] transition hover:bg-[#FF6F61] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingMore ? "Loading..." : "Show More"}
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {selectedVideo ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setSelectedVideo(null)}
            aria-label="Close video player"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
              <h3 className="truncate pr-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/90 sm:text-base">
                {selectedVideo.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`${selectedVideo.embedUrl}&autoplay=1`}
                title={selectedVideo.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
              <p className="text-xs text-white/70">{formatDate(selectedVideo.publishedAt)}</p>
              <a
                href={selectedVideo.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF6F61] transition hover:text-[#ff8f86]"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
