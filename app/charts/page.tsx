import Header from "@/components/Header";
import ChartsListSection from "@/components/ChartsListSection";

export default function ChartsPage() {
  return (
    <main className="relative bg-black">
      <Header />

      <section className="relative z-10 px-6 pb-8 pt-32 sm:px-10 sm:pt-36 lg:px-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
            Discover
          </p>
          <h1 className="font-anton text-4xl uppercase leading-tight text-[#FF6F61] sm:text-5xl lg:text-6xl">
            Charts
          </h1>
          <p className="max-w-3xl text-sm text-white/80 sm:text-base">
            Browse top songs in a live-updated style list. Search by song title above.
          </p>
        </div>
      </section>

      <ChartsListSection />
    </main>
  );
}
