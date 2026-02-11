import Header from "../components/Header";
import LatestReleaseSection from "@/components/LatestReleaseSection";
import FeaturedVideoSection from "@/components/FeaturedVideoSection";
import {
  getFeaturedReleaseData,
  getHomeHeroCopy,
  getMerchItems,
  getShowcaseVideoContent,
  getTourDates,
} from "@/lib/content";

export default async function Home() {
  const [featuredRelease, showcaseVideo, heroCopy, tourDates, merchItems] =
    await Promise.all([
      getFeaturedReleaseData(),
      getShowcaseVideoContent(),
      getHomeHeroCopy(),
      getTourDates(),
      getMerchItems(),
    ]);

  return (
    <main className="relative bg-transparent">
      <Header />

      <section className="relative flex min-h-screen items-center justify-center px-4 pb-28 pt-36 sm:px-8 lg:px-16">
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <video
            className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover object-[50%_40%] scale-125"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/media/zerua-overlay.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
          <img
            src="/media/zerua-icon-white.png"
            alt="Zerua Music icon"
            className="reveal h-16 w-24 object-contain"
          />
          <h1
            data-text={heroCopy.headline}
            className="reveal delay-1 noise-text mt-8 max-w-4xl font-anton text-4xl font-bold uppercase leading-tight text-[#FF6F61] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {heroCopy.headline}
          </h1>
          <p className="reveal delay-2 mt-8 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            {heroCopy.body}
          </p>
        </div>
      </section>

      {!!tourDates.length && (
        <section className="bg-black py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-anton text-3xl uppercase text-[#FF6F61] sm:text-4xl">
              Tour Dates
            </h2>
            <div className="mt-8 space-y-3">
              {tourDates.map((date) => (
                <a
                  key={date.id}
                  href={date.ticket_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white transition hover:bg-white/10"
                >
                  <span className="font-semibold">{date.event_date}</span>
                  <span className="text-white/80">
                    {date.city} - {date.venue}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#FF6F61]">
                    Tickets
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <LatestReleaseSection
        title={featuredRelease?.title}
        coverImagePath={featuredRelease?.cover_image_path}
        platformLinks={featuredRelease?.links}
      />
      <FeaturedVideoSection
        youtubeUrl={showcaseVideo.youtube_url}
        title={showcaseVideo.title ?? "Featured video"}
      />

      <section className="bg-white py-48 sm:py-60">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="font-anton text-4xl font-bold uppercase tracking-wide text-[#FF6F61] sm:text-5xl">
            Book Us
          </h2>
          <p className="max-w-2xl text-sm text-black/70 sm:text-base">
            Request a show, event, or tour date with Zerua Music.
          </p>
          <button className="rounded-full border border-[#FF6F61] px-8 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#FF6F61] transition-colors hover:bg-[#FF6F61] hover:text-black">
            Request a Show
          </button>
        </div>
      </section>

      <section className="bg-black py-48 sm:py-60">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="font-anton text-4xl font-bold uppercase tracking-wide text-[#FF6F61] sm:text-5xl">
            Zerua Music
          </h2>
          {!!merchItems.length ? (
            <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {merchItems.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:bg-white/10"
                >
                  <img src={item.image_path} alt={item.title} className="h-40 w-full object-cover" />
                  <p className="px-4 py-3 text-sm font-semibold text-white">{item.title}</p>
                </a>
              ))}
            </div>
          ) : (
            <>
              <p className="max-w-2xl text-sm text-white/80 sm:text-base">
                Discover the latest Zerua Music merch and exclusives.
              </p>
              <button className="rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-black transition-colors hover:bg-white/90">
                Shop Now
              </button>
            </>
          )}
        </div>
      </section>

      <section className="bg-[#FF6F61] py-48 sm:py-60">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="font-anton text-4xl font-bold uppercase tracking-wide text-black sm:text-5xl">
            Subscribe To Our Newsletter
          </h2>
          <p className="max-w-2xl text-sm text-black/80 sm:text-base">
            Sign up with your email address to receive news and updates.
          </p>
          <form className="flex w-full max-w-xl flex-col items-center gap-4 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Email Address"
              className="w-full rounded-full border border-black/20 bg-white px-6 py-3 text-sm text-black outline-none placeholder:text-black/50 focus:border-black"
            />
            <button
              type="submit"
              className="rounded-full bg-black px-8 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition-colors hover:bg-black/90"
            >
              Sign Up
            </button>
          </form>
        </div>
      </section>

      <section className="bg-black py-20 sm:py-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
          <img
            src="/media/zerua-icon-white.png"
            alt="Zerua Music icon"
            className="h-12 w-20 object-contain"
          />
          <a
            href="https://www.instagram.com/zeruamusic/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
          >
            Instagram
          </a>
          <p className="max-w-2xl text-xs font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-sm">
            Unorthodox, free spirit, rule breaker, one that breaks away from the
            herd.
          </p>
          <p className="text-xs text-white/60">Zerua Music</p>
        </div>
      </section>

      <section className="bg-black py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-center px-6 text-center">
          <p className="text-xs text-white/50">Made by Nathan Somevi</p>
        </div>
      </section>
    </main>
  );
}
