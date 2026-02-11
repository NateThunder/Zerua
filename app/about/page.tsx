import Header from "../../components/Header";
import { getAboutContent } from "@/lib/content";

export default async function AboutPage() {
  const about = await getAboutContent();

  return (
    <main className="relative bg-black">
      <Header />
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-24 pt-32 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/60">
            About
          </p>
          <h1 className="font-anton text-4xl font-bold uppercase leading-tight text-[#FF6F61] sm:text-5xl lg:text-6xl">
            Zerua Music
          </h1>
          <div className="mx-auto flex max-w-3xl flex-col gap-6 text-sm leading-relaxed text-white/85 sm:text-base">
            {about.paragraphs.map((paragraph, idx) => (
              <p key={`${idx}-${paragraph.slice(0, 16)}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
