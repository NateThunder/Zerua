import Header from "@/components/Header";
import LiveEventsSection from "@/components/LiveEventsSection";
import { getTourDates } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function LiveEventsPage() {
  const tourDates = await getTourDates();

  return (
    <main className="relative bg-black">
      <Header />

      <section className="relative z-10 px-6 pb-8 pt-32 sm:px-10 sm:pt-36 lg:px-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
            Stay Connected
          </p>
          <h1 className="font-anton text-4xl uppercase leading-tight text-[#FF6F61] sm:text-5xl lg:text-6xl">
            Live Events
          </h1>
          <p className="max-w-3xl text-sm text-white/80 sm:text-base">
            Find upcoming gatherings, concerts, and moments to experience Zerua Music live.
          </p>
        </div>
      </section>

      <LiveEventsSection events={tourDates} />
    </main>
  );
}
