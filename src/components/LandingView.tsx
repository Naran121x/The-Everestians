import { useState } from 'react';
import { ArrowRight, Compass, Globe2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  DISPOSITION_TAXONOMY,
  EXHIBITS,
  HERO_COPY,
  MUSEUM_IMAGES,
  REALM_INTRODUCTIONS,
  type TargetBody,
} from '../data/exhibits';
import { EXHIBIT_MEDIA } from '../data/exhibitMedia';
import type { RouteView } from './Header';

interface LandingViewProps {
  onNavigate: (view: RouteView, exhibitId?: string) => void;
  onSelectRealmGallery: (realm: TargetBody) => void;
  onSelectRealmAtlas: (realm: TargetBody) => void;
}

const SELECTED_MONUMENT_IDS = [
  'apollo-lm',
  'opportunity-rover',
  'insight-lander',
  'ingenuity-helicopter',
] as const;

export function LandingView({
  onNavigate,
  onSelectRealmGallery,
  onSelectRealmAtlas,
}: LandingViewProps) {
  const prefersReduced = useReducedMotion();
  const [heroMoonFallback, setHeroMoonFallback] = useState(false);
  const [heroHardError, setHeroHardError] = useState(false);
  const [spotlightMarsFallback, setSpotlightMarsFallback] = useState(false);
  const [spotlightHardError, setSpotlightHardError] = useState(false);

  const primaryRealms = [REALM_INTRODUCTIONS.moon, REALM_INTRODUCTIONS.mars];
  const deepSpaceRealm = REALM_INTRODUCTIONS['deep-space'];
  const featured = EXHIBITS.filter((e) =>
    (SELECTED_MONUMENT_IDS as readonly string[]).includes(e.id)
  );

  const insightExhibit = EXHIBITS.find((e) => e.id === 'insight-lander');
  const insightMedia = EXHIBIT_MEDIA['insight-lander'];
  const apolloPhoto = EXHIBIT_MEDIA['apollo-lm']?.nasaPhoto;

  const moonHeroSrc =
    !heroMoonFallback && apolloPhoto?.imageUrl ? apolloPhoto.imageUrl : MUSEUM_IMAGES.hero;
  const marsSpotlightSrc =
    !spotlightMarsFallback && insightMedia?.nasaPhoto?.imageUrl
      ? insightMedia.nasaPhoto.imageUrl
      : MUSEUM_IMAGES.mars;

  const enterMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
      };

  const plateMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] as const },
      };

  const sectionReveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.12 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="bg-[#090B10] text-[#F4EFE6]">
      {/* =================================================================== */}
      {/* I. CINEMATIC EXHIBITION ENTRANCE                                    */}
      {/* =================================================================== */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#090B10]">
        <div className="relative mx-auto max-w-[1380px] px-5 pt-3 pb-12 sm:pt-4 sm:pb-14 lg:px-8 lg:pt-4 lg:pb-16">
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Curatorial Introduction */}
            <motion.div
              {...enterMotion}
              className="flex flex-col justify-between lg:col-span-6"
            >
              <div>
                <p className="font-mono-tech text-[11px] uppercase tracking-[0.22em] text-[#D4A359]">
                  Digital Exhibition · Moon, Mars &amp; Deep Space
                </p>

                <h1 className="font-display headline-balance mt-4 text-[2.75rem] font-semibold leading-[1.03] tracking-[-0.01em] text-[#F7F3EB] sm:text-[3.5rem] lg:text-[4.25rem]">
                  {HERO_COPY.title}
                </h1>

                <p className="font-display mt-5 max-w-[29ch] text-2xl italic leading-[1.28] text-[#E6D6B8] sm:text-[1.75rem]">
                  &ldquo;When a mission ends, what happens to the machine that made it
                  possible?&rdquo;
                </p>

                <div className="mt-6 h-px w-16 bg-[#D4A359]/60" />

                <p className="mt-6 max-w-[56ch] text-[15px] leading-[1.8] text-[#B8C0CC] sm:text-base">
                  Across the airless plains of the Moon, the rust-red basins of Mars, and the quiet
                  drift of deep space stand the enduring remains of humanity&rsquo;s boldest
                  expeditions—gold-wrapped descent stages, dust-covered observatories, and silent
                  rovers resting where their missions concluded.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('exhibit', 'insight-lander')}
                  className="inline-flex min-h-[46px] items-center gap-2.5 bg-[#D4A359] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#090B10] transition-colors duration-200 hover:bg-[#DFB574] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Enter Flagship Exhibition</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('gallery')}
                  className="inline-flex min-h-[46px] items-center gap-2 border border-white/20 bg-transparent px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#F4EFE6] transition-colors duration-200 hover:border-[#D4A359]/70 hover:text-[#F9E7C4] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Browse 16 Exhibits</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('atlas')}
                  className="inline-flex min-h-[44px] items-center gap-2 px-2 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#A1AAB8] transition-colors duration-200 hover:text-[#D4A359] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Globe2 className="h-3.5 w-3.5 text-[#D4A359]" />
                  <span>3D Atlas</span>
                </button>
              </div>
            </motion.div>

            {/* Primary Archival Plate */}
            <motion.div {...plateMotion} className="lg:col-span-6">
              <figure className="flex h-full flex-col border border-white/15 bg-[#0E121A]">
                <div className="relative aspect-[4/3] w-full flex-1 overflow-hidden bg-[#0E121A] sm:min-h-[360px] lg:aspect-auto">
                  {heroHardError ? (
                    <div className="flex h-full min-h-[340px] flex-col items-center justify-center bg-[#0E121A] p-8 text-center">
                      <span className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-[#D4A359]">
                        Plate I · Statio Tranquillitatis
                      </span>
                      <p className="font-display mt-2 text-2xl text-[#F4EFE6]">
                        Apollo 11 Eagle Descent Stage
                      </p>
                    </div>
                  ) : (
                    <img
                      src={moonHeroSrc}
                      alt={
                        !heroMoonFallback && apolloPhoto
                          ? `${apolloPhoto.title} (${apolloPhoto.nasaId})`
                          : 'Curatorial visual reconstruction of the Apollo Lunar Module Descent Stage standing on the Moon'
                      }
                      referrerPolicy="no-referrer"
                      onError={() => {
                        if (!heroMoonFallback) setHeroMoonFallback(true);
                        else setHeroHardError(true);
                      }}
                      className="absolute inset-0 h-full w-full object-cover object-[center_28%]"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090B10]/85 via-transparent to-transparent" />
                </div>

                <figcaption className="flex flex-col justify-between gap-4 border-t border-white/10 bg-[#0D1017] px-5 py-4 sm:flex-row sm:items-end">
                  <div>
                    <div className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#D4A359]">
                      {!heroMoonFallback && apolloPhoto
                        ? `Plate I · NASA ${apolloPhoto.nasaId}`
                        : 'Plate I · Statio Tranquillitatis'}
                    </div>
                    <div className="font-display mt-1 text-xl font-medium text-[#F7F3EB]">
                      Apollo 11 Eagle Descent Stage · Sea of Tranquility
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#9CA3AF]">
                      Standing undisturbed since July 1969 in airless lunar vacuum.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('exhibit', 'apollo-lm')}
                    className="inline-flex min-h-[40px] items-center gap-1.5 border-b border-[#D4A359]/50 pb-1 text-xs font-medium tracking-wide text-[#F4EFE6] transition-colors hover:border-[#D4A359] hover:text-[#D4A359] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Inspect Exhibit</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </figcaption>
              </figure>
            </motion.div>
          </div>
        </div>

        {/* Full-Width Archive Ledger Strip */}
        <div className="border-t border-white/10 bg-[#0C0F16]">
          <div className="mx-auto grid max-w-[1380px] grid-cols-2 divide-y divide-white/10 px-5 sm:grid-cols-4 sm:divide-x sm:divide-y-0 lg:px-8">
            <div className="py-5 pr-4 sm:py-6 sm:pr-6">
              <div className="font-mono-tech text-2xl font-medium text-[#F7F3EB] tabular-nums">
                16
              </div>
              <div className="mt-1 text-xs text-[#9CA3AF]">
                Cataloged Off-World Artifacts
              </div>
            </div>
            <div className="py-5 pl-4 sm:px-6 sm:py-6">
              <div className="font-mono-tech text-2xl font-medium text-[#D4A359] tabular-nums">
                1966 – 2024
              </div>
              <div className="mt-1 text-xs text-[#9CA3AF]">
                Archive Span (Laser Ranging Ongoing)
              </div>
            </div>
            <div className="py-5 pr-4 sm:px-6 sm:py-6">
              <div className="font-mono-tech text-2xl font-medium text-[#F7F3EB] tabular-nums">
                45.16 km
              </div>
              <div className="mt-1 text-xs text-[#9CA3AF]">
                Longest Surface Traverse (Opportunity)
              </div>
            </div>
            <div className="py-5 pl-4 sm:py-6 sm:pl-6">
              <div className="font-mono-tech text-2xl font-medium text-[#F7F3EB] tabular-nums">
                72 Flights
              </div>
              <div className="mt-1 text-xs text-[#9CA3AF]">
                Extraterrestrial Aviation (Ingenuity)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* II. FEATURED MONOGRAPH: NASA INSIGHT LANDER                         */}
      {/* =================================================================== */}
      <motion.section {...sectionReveal} className="border-b border-white/10 bg-[#0B0E14]">
        <div className="mx-auto max-w-[1380px] px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Editorial Photographic Plate */}
            <div className="lg:col-span-7">
              <figure className="border border-white/12 bg-[#0F131C]">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#090B10]">
                  {spotlightHardError ? (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                      <span className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-[#D4A359]">
                        Plate II · Elysium Planitia
                      </span>
                      <p className="font-display mt-2 text-2xl text-[#F4EFE6]">
                        InSight Geophysical Lander
                      </p>
                    </div>
                  ) : (
                    <img
                      src={marsSpotlightSrc}
                      alt={
                        !spotlightMarsFallback && insightMedia?.nasaPhoto
                          ? insightMedia.nasaPhoto.title
                          : 'Martian surface curatorial reconstruction'
                      }
                      referrerPolicy="no-referrer"
                      onError={() => {
                        if (!spotlightMarsFallback) setSpotlightMarsFallback(true);
                        else setSpotlightHardError(true);
                      }}
                      className="h-full w-full object-cover object-center"
                    />
                  )}
                </div>
                <figcaption className="flex flex-col justify-between gap-2 border-t border-white/10 px-5 py-3.5 text-xs text-[#9CA3AF] sm:flex-row sm:items-center">
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#D4A359]">
                    {!spotlightMarsFallback && insightMedia?.nasaPhoto
                      ? `Plate II · ${insightMedia.nasaPhoto.nasaId} (${insightMedia.nasaPhoto.credit})`
                      : 'Plate II · Curatorial Study · Elysium Planitia'}
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#7C8594]">
                    4.5024° N, 135.6234° E
                  </span>
                </figcaption>
              </figure>
            </div>

            {/* Curatorial Wall Text */}
            <div className="lg:col-span-5">
              <p className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-[#D4A359]">
                Featured Monograph · Acc. Mars.06
              </p>

              <h2 className="font-display headline-balance mt-3 text-3xl font-semibold leading-[1.12] text-[#F7F3EB] sm:text-4xl lg:text-[2.65rem]">
                The Last Quiet Beacon: NASA&rsquo;s InSight Lander
              </h2>

              <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.8] text-[#B8C0CC]">
                {insightExhibit?.discoveryHook ??
                  'For four years, InSight pressed an ultra-sensitive seismometer into the red soil of Mars—listening to over 1,300 marsquakes reveal the planet’s liquid core, even as fine iron-oxide dust slowly darkened its 6-meter solar wings.'}
              </p>

              <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-5">
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-[#7C8594]">Seismic Log</dt>
                  <dd className="font-mono-tech mt-1 text-lg font-medium text-[#F4EFE6] tabular-nums">
                    1,300+
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-[#7C8594]">Surface Sols</dt>
                  <dd className="font-mono-tech mt-1 text-lg font-medium text-[#F4EFE6] tabular-nums">
                    1,440
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-[#7C8594]">Final Signal</dt>
                  <dd className="font-mono-tech mt-1 text-lg font-medium text-[#D4A359] tabular-nums">
                    Dec 2022
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => onNavigate('exhibit', 'insight-lander')}
                  className="inline-flex min-h-[44px] items-center gap-2.5 border border-[#D4A359] bg-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F4EFE6] transition-colors duration-200 hover:bg-[#D4A359] hover:text-[#090B10] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Read 7-Chapter Story</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('exhibit', 'opportunity-rover')}
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium tracking-wide text-[#A1AAB8] transition-colors hover:text-[#F4EFE6] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Explore Opportunity (45.16 km)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =================================================================== */}
      {/* III. PLANETARY WINGS (MOON, MARS & DEEP SPACE)                      */}
      {/* =================================================================== */}
      <motion.section {...sectionReveal} className="border-b border-white/10 bg-[#090B10]">
        <div className="mx-auto max-w-[1380px] px-5 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
            <div>
              <p className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-[#D4A359]">
                01 · Planetary Wings
              </p>
              <h2 className="font-display headline-balance mt-2.5 text-3xl font-semibold text-[#F7F3EB] sm:text-4xl">
                Three Realms of Preservation
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-[1.75] text-[#9CA3AF]">
              On the airless Moon, gold foil and bootprints remain crisp for geologic ages. On
              Mars, iron-oxide dust and polar frost slowly reclaim static machines. Beyond them,
              unpowered probes drift into deep space.
            </p>
          </div>

          {/* Primary Surface Galleries: Moon & Mars */}
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            {primaryRealms.map((realm, idx) => (
              <article key={realm.id} className="group flex flex-col">
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/12 bg-[#0E121A]">
                  <img
                    src={realm.image}
                    alt={realm.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090B10]/70 via-transparent to-transparent" />
                </div>

                <div className="mt-5 flex flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-2 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#9CA3AF]">
                    <span className="text-[#D4A359]">Wing 0{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span>{realm.exhibitCount} Exhibits</span>
                  </div>

                  <h3 className="font-display mt-2 text-3xl font-semibold text-[#F7F3EB]">
                    {realm.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#7C8594]">{realm.subtitle}</p>

                  <p className="mt-4 flex-1 max-w-[58ch] text-sm leading-[1.75] text-[#B8C0CC]">
                    {realm.intro}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-white/10 pt-5">
                    <button
                      type="button"
                      onClick={() => onSelectRealmGallery(realm.id)}
                      className="inline-flex min-h-[44px] items-center gap-2 border border-white/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#F4EFE6] transition-colors duration-200 hover:border-[#D4A359] hover:text-[#D4A359] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Enter Collection ({realm.exhibitCount})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectRealmAtlas(realm.id)}
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-[#9CA3AF] transition-colors hover:text-[#F4EFE6] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Compass className="h-3.5 w-3.5 text-[#D4A359]" />
                      <span>3D Landing Coordinates</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Secondary Wing: Deep Space & Small Bodies */}
          <article className="mt-14 grid grid-cols-1 items-center gap-8 border-t border-white/10 pt-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/12 bg-[#0E121A]">
                <img
                  src={deepSpaceRealm.image}
                  alt={deepSpaceRealm.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#9CA3AF]">
                <span className="text-[#D4A359]">Wing 03</span>
                <span aria-hidden="true">·</span>
                <span>{deepSpaceRealm.exhibitCount} Exhibits</span>
                <span aria-hidden="true">·</span>
                <span>{deepSpaceRealm.subtitle}</span>
              </div>

              <h3 className="font-display mt-2.5 text-3xl font-semibold text-[#F7F3EB]">
                {deepSpaceRealm.title}
              </h3>

              <p className="mt-3 max-w-[60ch] text-sm leading-[1.78] text-[#B8C0CC]">
                {deepSpaceRealm.intro}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => onSelectRealmGallery('deep-space')}
                  className="inline-flex min-h-[44px] items-center gap-2 border border-white/20 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#F4EFE6] transition-colors duration-200 hover:border-[#D4A359] hover:text-[#D4A359] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Browse Deep Space Wing</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectRealmAtlas('deep-space')}
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-[#9CA3AF] transition-colors hover:text-[#F4EFE6] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Compass className="h-3.5 w-3.5 text-[#D4A359]" />
                  <span>3D Orbital Vectors</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </motion.section>

      {/* =================================================================== */}
      {/* IV. SELECTED ARTIFACTS & DISPOSITION LEDGER                         */}
      {/* =================================================================== */}
      <motion.section {...sectionReveal} className="border-b border-white/10 bg-[#0C0F16]">
        <div className="mx-auto max-w-[1380px] px-5 py-16 lg:px-8 lg:py-24">
          {/* Selected Monuments Catalog */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-7">
            <div>
              <p className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-[#D4A359]">
                02 · Selected Monuments
              </p>
              <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-[#F7F3EB] sm:text-4xl">
                Key Artifacts &amp; 3D Studies
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#D4A359] transition-colors hover:text-[#F4EFE6] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Full Catalog (16)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featured.map((exhibit) => (
              <button
                key={exhibit.id}
                type="button"
                onClick={() => onNavigate('exhibit', exhibit.id)}
                className="group flex flex-col text-left cursor-pointer"
              >
                <div className="aspect-[4/3] w-full overflow-hidden border border-white/12 bg-[#090B10]">
                  <img
                    src={exhibit.visualImage}
                    alt={exhibit.shortTitle}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                <div className="mt-4 flex flex-1 flex-col">
                  <div className="flex items-center justify-between gap-2 font-mono-tech text-[11px] text-[#9CA3AF]">
                    <span className="text-[#D4A359]">{exhibit.accessionNumber}</span>
                    <span className="tabular-nums">{exhibit.operationalPeriod}</span>
                  </div>

                  <h3 className="font-display mt-2 text-2xl font-semibold leading-snug text-[#F7F3EB] transition-colors group-hover:text-[#D4A359]">
                    {exhibit.shortTitle}
                  </h3>

                  <p className="mt-2 flex-1 text-xs leading-[1.7] text-[#9CA3AF]">
                    {exhibit.cardSnippet}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#E5DEC9] transition-colors group-hover:text-[#D4A359]">
                    <span>Inspect Artifact</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Four-Tier Operational Disposition Ledger */}
          <div className="mt-20 border-t border-white/10 pt-14">
            <div className="max-w-2xl">
              <p className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-[#D4A359]">
                03 · Archival Taxonomy
              </p>
              <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-[#F7F3EB] sm:text-4xl">
                Why Spacecraft Remain Behind
              </h2>
              <p className="mt-3 text-sm leading-[1.75] text-[#9CA3AF]">
                Every monument in the collection is indexed under four operational dispositions
                documenting the engineering and environmental causes of its final state.
              </p>
            </div>

            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {DISPOSITION_TAXONOMY.map((tier, index) => (
                <div
                  key={tier.id}
                  className="grid grid-cols-1 gap-4 py-6 lg:grid-cols-12 lg:items-baseline lg:gap-8"
                >
                  <div className="font-mono-tech text-xs text-[#D4A359] lg:col-span-1">
                    0{index + 1}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#F7F3EB] lg:col-span-4">
                    {tier.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#B8C0CC] lg:col-span-4">
                    {tier.description}
                  </p>
                  <div className="text-xs leading-relaxed text-[#7C8594] lg:col-span-3">
                    <span className="text-[#A1AAB8]">Records: </span>
                    {tier.examples}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* =================================================================== */}
      {/* V. MUSEUM WING DIRECTORY (CLOSING PATHWAYS)                         */}
      {/* =================================================================== */}
      <section className="bg-[#090B10]">
        <div className="mx-auto max-w-[1380px] px-5 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-[#D4A359]">
                04 · Museum Directory
              </p>
              <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-[#F7F3EB]">
                Continue Your Visit
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#9CA3AF]">
              Navigate directly to interactive 3D coordinates, side-by-side hardware telemetry, the
              1966–2024 mission chronology, or primary NASA archive citations.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              onClick={() => onNavigate('atlas')}
              className="group flex flex-col justify-between bg-[#090B10] p-6 text-left transition-colors duration-200 hover:bg-[#0E121A] cursor-pointer"
            >
              <div>
                <div className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#D4A359]">
                  Wing A
                </div>
                <div className="font-display mt-2 text-2xl font-semibold text-[#F7F3EB] group-hover:text-[#D4A359] transition-colors">
                  3D Planetary Atlas
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  Inspect exact surface landing sites and orbital trajectories across interactive
                  3D globes.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-[#E5DEC9]">
                <span>Open Atlas</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('compare')}
              className="group flex flex-col justify-between bg-[#090B10] p-6 text-left transition-colors duration-200 hover:bg-[#0E121A] cursor-pointer"
            >
              <div>
                <div className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#D4A359]">
                  Wing B
                </div>
                <div className="font-display mt-2 text-2xl font-semibold text-[#F7F3EB] group-hover:text-[#D4A359] transition-colors">
                  Artifact Comparator
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  Place any two spacecraft side by side to contrast mass, power systems, and range.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-[#E5DEC9]">
                <span>Compare Hardware</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('timeline')}
              className="group flex flex-col justify-between bg-[#090B10] p-6 text-left transition-colors duration-200 hover:bg-[#0E121A] cursor-pointer"
            >
              <div>
                <div className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#D4A359]">
                  Wing C
                </div>
                <div className="font-display mt-2 text-2xl font-semibold text-[#F7F3EB] group-hover:text-[#D4A359] transition-colors">
                  Mission Chronology
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  Trace nearly six decades of off-world exploration from Surveyor 1 to Ingenuity.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-[#E5DEC9]">
                <span>View Timeline</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('sources')}
              className="group flex flex-col justify-between bg-[#090B10] p-6 text-left transition-colors duration-200 hover:bg-[#0E121A] cursor-pointer"
            >
              <div>
                <div className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#D4A359]">
                  Wing D
                </div>
                <div className="font-display mt-2 text-2xl font-semibold text-[#F7F3EB] group-hover:text-[#D4A359] transition-colors">
                  NASA Sources &amp; Audits
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#9CA3AF]">
                  Review PDS, LROC, and Photojournal records alongside curatorial verification notes.
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-[#E5DEC9]">
                <span>Inspect Sources</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
