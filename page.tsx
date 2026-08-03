import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Kainat Bano — a Pakistani luxury fashion house built on hand-craft and quiet detail.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1600&q=80&auto=format&fit=crop"
          alt="Kainat Bano atelier"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="relative container-lux pb-16">
          <div className="eyebrow mb-3">Est. Parachinar</div>
          <h1 className="font-display text-4xl md:text-6xl">Our Story</h1>
        </div>
      </section>

      <section className="container-lux py-20 max-w-3xl mx-auto text-center">
        <p className="text-bone/80 leading-relaxed text-lg">
          Kainat Bano began as a single atelier in Parachinar, Kurram District, built on the idea
          that modest fashion deserved the same craftsmanship as any couture
          house. Every abaya, gown and hijab that carries our name passes
          through the hands of artisans who have spent decades perfecting
          embroidery techniques like zardozi and dabka — work that cannot be
          rushed, and shouldn&apos;t be.
        </p>
      </section>

      <section className="container-lux pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Hand-Finished", copy: "Every hem, seam and embellishment is finished by hand in our Parachinar atelier." },
          { title: "Small Batches", copy: "We release in limited runs so quality is never sacrificed for volume." },
          { title: "Made to Last", copy: "Natural fibers and considered construction, built to be worn for years, not seasons." },
        ].map((v) => (
          <div key={v.title} className="card-hairline p-8 text-center">
            <div className="gold-line mx-auto mb-5" />
            <h3 className="font-display text-xl mb-3">{v.title}</h3>
            <p className="text-smoke text-sm leading-relaxed">{v.copy}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
