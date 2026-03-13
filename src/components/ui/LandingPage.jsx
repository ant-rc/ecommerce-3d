import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useProductStore from "../../store/useProductStore";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const setPage = useProductStore((s) => s.setPage);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
      gsap.from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
      });

      // Features section
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
      });

      // Gallery section
      gsap.from(".gallery-item", {
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="flex min-h-screen flex-col bg-surface font-sans">
      {/* Navbar */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-white/90 px-6 py-4 backdrop-blur-sm lg:px-16">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl font-bold tracking-tight text-stone-900">
            Luxor
          </span>
          <span className="font-display text-xl font-light tracking-tight text-brand">
            Garden
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-stone-500 md:flex">
          <span className="cursor-pointer transition-colors hover:text-stone-900">Collections</span>
          <span className="cursor-pointer transition-colors hover:text-stone-900">Materiaux</span>
          <span className="cursor-pointer transition-colors hover:text-stone-900">Inspiration</span>
          <span className="cursor-pointer transition-colors hover:text-stone-900">Contact</span>
        </nav>
      </header>

      {/* Hero section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface to-panel" />
        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-8">
          <div className="rounded-full border border-brand/30 bg-brand/5 px-5 py-1.5">
            <span className="text-xs font-medium tracking-wider text-brand">
              NOUVELLE COLLECTION 2026
            </span>
          </div>
          <h1
            ref={titleRef}
            className="font-display text-5xl font-bold leading-tight tracking-tight text-stone-900 md:text-7xl"
          >
            Le patio qui
            <br />
            <span className="text-brand">vous ressemble</span>
          </h1>
          <p
            ref={subtitleRef}
            className="max-w-lg text-lg leading-relaxed text-stone-500"
          >
            Creez votre espace de vie exterieur sur mesure. Bois d&apos;ebene certifie,
            mobilier design et vegetation luxuriante.
          </p>
          <button
            ref={ctaRef}
            type="button"
            onClick={() => setPage("product")}
            className="group relative mt-4 overflow-hidden rounded-full bg-stone-900 px-10 py-5 text-sm font-semibold tracking-wider text-white transition-all hover:bg-stone-800 active:scale-[0.97]"
          >
            <span className="relative z-10">VOTRE PATIO</span>
            <span className="absolute inset-0 -translate-x-full bg-brand transition-transform duration-500 group-hover:translate-x-0" />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
            Decouvrir
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-stone-300 to-transparent" />
        </div>
      </section>

      {/* Features section */}
      <section ref={featuresRef} className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-16">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Savoir-faire
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 md:text-4xl">
            L&apos;excellence dans chaque detail
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Bois d'ebene FSC",
              desc: "Certifie et issu de forets gerees durablement. Resistant aux UV et a l'humidite.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              ),
            },
            {
              title: "Personnalisable",
              desc: "5 teintes de bois, mobilier modulable. Votre patio s'adapte a vos envies.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                  <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
              ),
            },
            {
              title: "Garantie 5 ans",
              desc: "Structure, mobilier et eclairage. Installation assistee et service apres-vente dedie.",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="feature-card flex flex-col gap-4 rounded-2xl border border-stone-100 bg-white p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                {feature.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery / highlights section */}
      <section ref={galleryRef} className="bg-panel py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-16">
          <div className="mb-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              Collection
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-900 md:text-4xl">
              Patio Ebony Collection
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: "Pergola", price: "899" },
              { name: "Coin repas", price: "725" },
              { name: "Canape", price: "549" },
              { name: "Eclairage", price: "199" },
              { name: "Tapis", price: "129" },
              { name: "Palmier royal", price: "45" },
              { name: "Fougere suspendue", price: "32" },
              { name: "Lierre grimpant", price: "15" },
            ].map((item) => (
              <div
                key={item.name}
                className="gallery-item flex flex-col items-center gap-3 rounded-2xl border border-stone-100 bg-white p-6 text-center transition-shadow hover:shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                  <span className="font-display text-lg font-bold text-brand">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-stone-800">{item.name}</h4>
                <p className="text-xs text-stone-400">
                  a partir de {item.price}&nbsp;&euro;
                </p>
              </div>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <button
              type="button"
              onClick={() => setPage("product")}
              className="rounded-full border-2 border-stone-900 px-10 py-4 text-sm font-semibold tracking-wider text-stone-900 transition-all hover:bg-stone-900 hover:text-white active:scale-[0.97]"
            >
              CONFIGURER VOTRE PATIO
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 bg-white px-6 py-12 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-bold tracking-tight text-stone-900">
              Luxor
            </span>
            <span className="font-display text-xl font-light tracking-tight text-brand">
              Garden
            </span>
          </div>
          <p className="text-sm text-stone-400">
            Mobilier d&apos;exception pour espaces de vie exterieurs.
          </p>
          <p className="text-xs text-stone-300">
            &copy; 2026 Luxor Garden. Tous droits reserves.
          </p>
        </div>
      </footer>
    </div>
  );
}
