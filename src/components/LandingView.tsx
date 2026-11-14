import { ArrowRight, Compass, Globe2 } from 'lucide-react';
import {
  DISPOSITION_TAXONOMY,
  EXHIBITS,
  HERO_COPY,
  MUSEUM_IMAGES,
  REALM_INTRODUCTIONS,
  type TargetBody,
} from '../data/exhibits';
import type { RouteView } from './Header';

interface LandingViewProps {
  onNavigate: (view: RouteView, exhibitId?: string) => void;
  onSelectRealmGallery: (realm: TargetBody) => void;
  onSelectRealmAtlas: (realm: TargetBody) => void;
}

export function LandingView({
  onNavigate,
  onSelectRealmGallery,
  onSelectRealmAtlas,
}: LandingViewProps) {
  const realms = [
    REALM_INTRODUCTIONS.moon,
    REALM_INTRODUCTIONS.mars,
    REALM_INTRODUCTIONS['deep-space'],
  ];

  const featuredIds = ['apollo-lm', 'opportunity-rover', 'insight-lander', 'ingenuity-helicopter'];
  const featured = EXHIBITS.filter((e) => featuredIds.includes(e.id));

  return (
    <div>
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto grid max-w-[1380px] grid-cols-1 items-stretch gap-8 px-5 py-12 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="text-xs font-mono-tech uppercase tracking-[0.18em] text-[#D4A359]">
              NASA Space Apps Challenge 2026 · Digital Archive
            </div>
            <h1 className="font-display headline-balance mt-4 text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-[3.75rem]">
              {HERO_COPY.title}
            </h1>
            <p className="font-display mt-3 text-xl italic text-[#D4A359] sm:text-2xl">
              {HERO_COPY.subtitle}
            </p>
            <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-[#CBD5E1] sm:text-base">
              {HERO_COPY.lead}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('gallery')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4A359] px-6 py-3 text-sm font-semibold text-[#090B10] hover:bg-[#e0b46f] transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Explore the Museum</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('atlas')}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-[#141923] px-5 py-3 text-sm font-medium text-[#F3F4F6] hover:border-[#D4A359]/60 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <Globe2 className="h-4 w-4 text-[#D4A359]" />
                <span>Open 3D Planetary Atlas</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <figure className="relative h-[320px] sm:h-[400px] lg:h-full min-h-[380px] overflow-hidden rounded-xl border border-white/10 bg-[#141923]">
              <img
                src={MUSEUM_IMAGES.hero}
                alt="Curatorial visual reconstruction of the Apollo Lunar Module Descent Stage standing on the Moon"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090B10]/90 via-[#090B10]/20 to-transparent" />
              <figcaption className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#D4A359]">
                    Curatorial Frontispiece · Statio Tranquillitatis
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-white">
                    Apollo Lunar Module Descent Stage (Eagle)
                  </div>
                </div>
                <div className="text-[11px] text-[#A1AAB8]">
                  Ref: AS11-40-5921 · NASA / Apollo 11 Crew
                </div>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Full-width Museum Summary Metrics Strip */}
        <div className="border-t border-white/10 bg-[#0F131C]">
          <div className="mx-auto grid max-w-[1380px] grid-cols-2 divide-y divide-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0 px-5 lg:px-8">
            <div className="py-5 sm:pr-6">
              <div className="font-mono-tech text-2xl font-semibold text-white">16</div>
              <div className="mt-1 text-xs text-[#A1AAB8]">
                Cataloged Off-World Exhibits (Moon, Mars & Deep Space)
              </div>
            </div>
            <div className="py-5 sm:px-6">
              <div className="font-mono-tech text-2xl font-semibold text-[#D4A359]">1966 – 2024</div>
              <div className="mt-1 text-xs text-[#A1AAB8]">
                Archive Span (Passive Laser Ranging Ongoing)
              </div>
            </div>
            <div className="py-5 sm:px-6">
              <div className="font-mono-tech text-2xl font-semibold text-white">45.16 km</div>
              <div className="mt-1 text-xs text-[#A1AAB8]">
                Record Surface Traverse (Opportunity MER-B)
              </div>
            </div>
            <div className="py-5 sm:pl-6">
              <div className="font-mono-tech text-2xl font-semibold text-white">72 Flights</div>
              <div className="mt-1 text-xs text-[#A1AAB8]">
                Extraterrestrial Aviation Milestone (Ingenuity)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planet & Realm Collections Section */}
      <section className="mx-auto max-w-[1380px] px-5 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D4A359]">
              01. Curated Collections
            </div>
            <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Explore by Planetary Realm
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[#A1AAB8]">
            Each celestial environment imposed distinct thermal, atmospheric, and mechanical limits on
            humanity’s explorers. Select a collection or launch its interactive 3D globe.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {realms.map((realm) => (
            <article
              key={realm.id}
              className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#141923]"
            >
              <div className="relative h-52 overflow-hidden bg-[#090B10]">
                <img
                  src={realm.image}
                  alt={realm.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141923] via-[#141923]/30 to-transparent" />
                <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-xs text-[#CBD5E1]">
                  <span className="font-mono-tech" style={{ color: realm.accentHex }}>
                    {realm.exhibitCount} Exhibits
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="text-xs text-[#A1AAB8]">{realm.subtitle}</div>
                <h3 className="font-display mt-1.5 text-2xl font-semibold text-white">
                  {realm.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#CBD5E1]">{realm.intro}</p>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => onSelectRealmGallery(realm.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-[#090B10] transition-colors whitespace-nowrap cursor-pointer"
                    style={{ backgroundColor: realm.accentHex }}
                  >
                    <span>Browse Collection</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectRealmAtlas(realm.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#0F131C] px-3.5 py-2 text-xs font-medium text-[#E5E7EB] hover:border-white/35 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>3D Coordinates</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Four-Tier Operational Disposition Taxonomy */}
      <section className="border-y border-white/10 bg-[#0F131C]">
        <div className="mx-auto max-w-[1380px] px-5 py-16 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D4A359]">
              02. Classification System
            </div>
            <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Why Spacecraft Remain Behind
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#A1AAB8]">
              To maintain scientific rigor, all 16 museum artifacts are classified under a four-tier
              operational disposition taxonomy documenting how and why each mission ended.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {DISPOSITION_TAXONOMY.map((tier, index) => (
              <div
                key={tier.id}
                className="flex flex-col rounded-xl border border-white/10 bg-[#141923] p-6"
              >
                <div className="font-mono-tech text-xs text-[#D4A359]">Tier 0{index + 1}</div>
                <h3 className="mt-2 text-base font-semibold leading-snug text-white">
                  {tier.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#A1AAB8]">
                  {tier.description}
                </p>
                <div className="mt-4 border-t border-white/10 pt-3 text-xs text-[#CBD5E1]">
                  <span className="text-[#6F7888]">Examples: </span>
                  {tier.examples}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted Monuments Preview */}
      <section className="mx-auto max-w-[1380px] px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D4A359]">
              03. Featured Monuments
            </div>
            <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Selected Artifacts in 3D
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#D4A359] hover:text-[#F9E7C4] transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>View all 16 exhibits</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((exhibit) => (
            <button
              key={exhibit.id}
              type="button"
              onClick={() => onNavigate('exhibit', exhibit.id)}
              className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#141923] text-left hover:border-[#D4A359]/60 transition-colors cursor-pointer"
            >
              <div className="h-44 w-full overflow-hidden bg-[#090B10]">
                <img
                  src={exhibit.visualImage}
                  alt={exhibit.shortTitle}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-[#A1AAB8]">
                  <span>{exhibit.targetBodyLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tech">{exhibit.operationalPeriod}</span>
                </div>
                <h3 className="font-display mt-2 text-xl font-semibold text-white group-hover:text-[#F9E7C4]">
                  {exhibit.shortTitle}
                </h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[#CBD5E1]">
                  {exhibit.cardSnippet}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#D4A359]">
                  <span>Inspect 3D Exhibit</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
