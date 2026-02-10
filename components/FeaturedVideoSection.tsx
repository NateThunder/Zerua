const videoId = "3zGhq1ZKbjg";
const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
  videoUrl
)}&format=json`;

async function getVideoTitle() {
  try {
    const res = await fetch(oembedUrl, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return "Featured video";
    const data = (await res.json()) as { title?: string };
    return data.title ?? "Featured video";
  } catch {
    return "Featured video";
  }
}

export default async function FeaturedVideoSection() {
  const title = await getVideoTitle();

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
