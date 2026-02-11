import { extractYouTubeId } from "@/lib/admin/validation";

type FeaturedVideoSectionProps = {
  youtubeUrl?: string;
  title?: string;
};

export default function FeaturedVideoSection({
  youtubeUrl = "https://www.youtube.com/watch?v=3zGhq1ZKbjg",
  title = "Featured video",
}: FeaturedVideoSectionProps) {
  const videoId = extractYouTubeId(youtubeUrl) ?? "3zGhq1ZKbjg";

  return (
    <section className="bg-black py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <h2 className="sr-only">Featured video</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="relative aspect-video">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title="Featured video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-sm">
          {title}
        </p>
      </div>
    </section>
  );
}
