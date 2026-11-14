import { useState } from 'react';
import { ArrowRight, Compass, Film, Globe2, Sparkles } from 'lucide-react';
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

export function LandingView({
  onNavigate,
  onSelectRealmGallery,
  onSelectRealmAtlas,
}: LandingViewProps) {
  const prefersReduced = useReducedMotion();
  const [heroMoonFallback, setHeroMoonFallback] = useState(false);
  const [spotlightMarsFallback, setSpotlightMarsFallback] = useState(false);

  const primaryRealms = [REALM_INTRODUCTIONS.moon, REALM_INTRODUCTIONS.mars];
  const deepSpaceRealm = REALM_INTRODUCTIONS['deep-space'];

  const featuredIds = ['apollo-lm', 'opportunity-rover', 'insight-lander', 'ingenuity-helicopter'];
  const featured = EXHIBITS.filter((e) => featuredIds.includes(e.id));

  const insightExhibit = EXHIBITS.find((e) => e.id === 'insight-lander');
  const insightMedia = EXHIBIT_MEDIA['insight-lander'];
  const apolloPhoto = EXHIBIT_MEDIA['apollo-lm']?.nasaPhoto;

  const moonHeroSrc =
    !heroMoonFallback && apolloPhoto?.imageUrl ? apolloPhoto.imageUrl : MUSEUM_IMAGES.hero;
  const marsSpotlightSrc =
    !spotlightMarsFallback && insightMedia?.nasaPhoto?.imageUrl
      ? insightMedia.nasaPhoto.imageUrl
      : MUSEUM_IMAGES.mars;

  const fadeUp = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
      };

  const scrollReveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div>
      {/* =================================================================== */}
      {/* CINEMATIC DOCUMENTARY PROLOGUE                                      */}
      {/* =================================================================== */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Atmospheric NASA Photography Backdrop */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <img
            src={moonHeroSrc}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            onError={() => setHeroMoonFallback(true)}
            className="h-full w-full object-cover object-center scale-105 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090B10]/85 via-[#090B10]/88 to-[#090B10]" />
        </div>

        <div className="relative mx-auto grid max-w-[1380px] grid-cols-1 items-stretch gap-8 px-5 py-12 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
          <motion.div {...fadeUp} className="flex flex-col justify-center lg:col-span-6">
            <div className="font-mono-tech text-xs uppercase tracking-[0.18em] text-[#D4A359]">
              NASA Space Apps Challenge · Interactive Documentary Museum
            </div>

            <h1 className="font-display headline-balance mt-4 text-4xl font-semibold leading-[1.06] text-white sm:text-5xl lg:text-[3.85rem]">
              {HERO_COPY.title}
            </h1>

            <p className="font-display mt-5 max-w-[30ch] text-2xl italic leading-snug text-[#F9E7C4] sm:text-[1.75rem]">
              &ldquo;When a mission ends, what happens to the machine that made it possible?&rdquo;
            </p>

            <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.75] text-[#CBD5E1] sm:text-base">
              Across the airless plains of the Moon and the rust-red deserts of Mars stand the
              silent remains of humanity’s boldest journeys—gold-wrapped descent stages, dusty
              solar landers, fractured helicopter blades, and rovers frozen in ancient riverbeds.
              They are not junk; they are off-world monuments.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate('exhibit', 'insight-lander')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg bg-[#D4A359] px-6 py-3 text-sm font-semibold text-[#090B10] hover:bg-[#e0b46f] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Film className="h-4 w-4" />
                <span>Start Flagship Story: InSight</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('gallery')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-white/20 bg-[#141923]/90 px-5 py-3 text-sm font-medium text-[#F3F4F6] hover:border-[#D4A359]/60 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Browse All 16 Artifacts</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('atlas')}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-white/15 bg-[#0F131C]/90 px-4 py-3 text-sm font-medium text-[#CBD5E1] hover:border-[#67B7D1]/60 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <Globe2 className="h-4 w-4 text-[#D4A359]" />
                <span>3D Atlas</span>
              </button>
            </div>
          </motion.div>

          <motion.div
            {...(prefersReduced
              ? {}
              : {
                  initial: { opacity: 0, y: 22 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const },
                })}
            className="lg:col-span-6"
          >
            <figure className="relative h-[340px] sm:h-[420px] lg:h-full min-h-[400px] overflow-hidden rounded-xl border border-white/15 bg-[#141923] shadow-2xl">
              <img
                src={moonHeroSrc}
                alt={
                  !heroMoonFallback && apolloPhoto
                    ? `${apolloPhoto.title} (${apolloPhoto.nasaId})`
                    : 'Curatorial visual reconstruction of the Apollo Lunar Module Descent Stage standing on the Moon'
                }
                referrerPolicy="no-referrer"
                onError={() => setHeroMoonFallback(true)}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-[#090B10]/30 to-transparent" />
              <figcaption className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
                <div className="max-w-lg">
                  <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#D4A359]">
                    {!heroMoonFallback && apolloPhoto
                      ? `Original NASA Photograph · ${apolloPhoto.nasaId}`
                      : 'AI-Generated Curatorial Reconstruction · Statio Tranquillitatis'}
                  </div>
                  <div className="mt-1 text-base font-medium text-white">
                    Apollo 11 Eagle Descent Stage · Sea of Tranquility
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#CBD5E1]">
                    Still standing since July 1969 in airless lunar vacuum—humanity’s first
                    stationary off-world architectural relic.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('exhibit', 'apollo-lm')}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/20 bg-[#090B10]/85 px-3.5 py-1.5 text-xs font-medium text-[#F9E7C4] hover:border-[#D4A359] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Open Apollo Story</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </figcaption>
            </figure>
          </motion.div>
        </div>

        {/* Full-width Museum Summary Metrics Strip */}
        <div className="relative border-t border-white/10 bg-[#0F131C]/95">
          <div className="mx-auto grid max-w-[1380px] grid-cols-2 divide-y divide-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0 px-5 lg:px-8">
            <div className="py-5 sm:pr-6">
              <div className="font-mono-tech text-2xl font-semibold text-white">16</div>
              <div className="mt-1 text-xs text-[#A1AAB8]">
                Cataloged Off-World Exhibits (Moon, Mars &amp; Deep Space)
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

      {/* =================================================================== */}
      {/* NARRATIVE ACT I: TWO WORLDS & FLAGSHIP INSIGHT DOCUMENTARY          */}
      {/* =================================================================== */}
      <motion.section {...scrollReveal} className="border-b border-white/10 bg-[#0C0F17]">
        <div className="mx-auto max-w-[1380px] px-5 py-14 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 font-mono-tech text-xs uppercase tracking-[0.16em] text-[#C86446]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Featured Documentary · Elysium Planitia, Mars</span>
              </div>
              <h2 className="font-display headline-balance mt-3 text-3xl font-semibold text-white sm:text-4xl">
                The Last Quiet Beacon: NASA’s InSight Lander
              </h2>
              <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.78] text-[#CBD5E1]">
                {insightExhibit?.discoveryHook ??
                  'For four years, InSight pressed an ultra-sensitive seismometer into the red soil of Mars—listening to over 1,300 marsquakes reveal the planet’s liquid core, even as fine iron-oxide dust slowly darkened its 6-meter solar wings.'}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 border-y border-white/10 py-4 sm:grid-cols-3">
                <div>
                  <div className="font-mono-tech text-lg font-semibold text-[#F9E7C4]">1,300+</div>
                  <div className="text-xs text-[#A1AAB8]">Marsquakes Detected by SEIS</div>
                </div>
                <div>
                  <div className="font-mono-tech text-lg font-semibold text-white">1,440 sols</div>
                  <div className="text-xs text-[#A1AAB8]">Active Surface Science</div>
                </div>
                <div>
                  <div className="font-mono-tech text-lg font-semibold text-[#C86446]">Dec 2022</div>
                  <div className="text-xs text-[#A1AAB8]">Solar Dust Shutdown</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('exhibit', 'insight-lander')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#C86446] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#d87354] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Experience InSight’s 7-Chapter Story</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('exhibit', 'opportunity-rover')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-[#141923] px-4 py-2.5 text-xs font-medium text-[#E5E7EB] hover:border-[#D4A359]/60 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Or Read Opportunity’s 45.16 km Trek</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <figure className="overflow-hidden rounded-xl border border-white/15 bg-[#141923]">
                <div className="relative h-[280px] sm:h-[340px] w-full overflow-hidden bg-[#090B10]">
                  <img
                    src={marsSpotlightSrc}
                    alt={
                      !spotlightMarsFallback && insightMedia?.nasaPhoto
                        ? insightMedia.nasaPhoto.title
                        : 'Martian surface curatorial reconstruction'
                    }
                    referrerPolicy="no-referrer"
                    onError={() => setSpotlightMarsFallback(true)}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090B10]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-tech text-[11px] uppercase tracking-wider text-[#F9E7C4]">
                      {!spotlightMarsFallback && insightMedia?.nasaPhoto
                        ? `Original NASA Photograph · ${insightMedia.nasaPhoto.nasaId} (${insightMedia.nasaPhoto.credit})`
                        : 'AI-Generated Curatorial Reconstruction'}
                    </span>
                  </div>
                </div>
                <figcaption className="border-t border-white/10 p-4 text-xs leading-relaxed text-[#A1AAB8]">
                  {!spotlightMarsFallback && insightMedia?.nasaPhoto
                    ? insightMedia.nasaPhoto.caption
                    : 'Documentary visual showing Martian dust blanketing solar arrays on Elysium Planitia.'}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =================================================================== */}
      {/* PLANET & REALM COLLECTIONS (MOON & MARS PRIMARY, DEEP SPACE WING)   */}
      {/* =================================================================== */}
      <motion.section {...scrollReveal} className="mx-auto max-w-[1380px] px-5 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D4A359]">
              01. Curated Collections · Primary Surface Realms
            </div>
            <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
              The Moon &amp; Mars Galleries
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[#A1AAB8]">
            Two worlds, two fates: on the airless Moon, gold foil and bootprints remain crisp for
            geologic ages; on Mars, global winds and seasonal frost slowly bury machines in red
            soil. Begin with either surface gallery or inspect our secondary deep-space wing below.
          </p>
        </div>

        {/* Guided 3-Step Documentary Flow */}
        <div className="mt-7 grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-[#0F131C] p-4 sm:grid-cols-3 sm:gap-6">
          <div className="flex items-baseline gap-2.5 text-xs">
            <span className="font-mono-tech font-semibold text-[#D4A359]">Act 01</span>
            <span className="text-[#CBD5E1]">
              Choose a planetary realm or pinpoint coordinates on the 3D globe.
            </span>
          </div>
          <div className="flex items-baseline gap-2.5 text-xs">
            <span className="font-mono-tech font-semibold text-[#D4A359]">Act 02</span>
            <span className="text-[#CBD5E1]">
              Follow any artifact’s 7-chapter story with animated ending reconstructions.
            </span>
          </div>
          <div className="flex items-baseline gap-2.5 text-xs">
            <span className="font-mono-tech font-semibold text-[#D4A359]">Act 03</span>
            <span className="text-[#CBD5E1]">
              Inspect 3D hardware callouts and watch verified NASA mission footage.
            </span>
          </div>
        </div>

        {/* Primary 2-Column Collections: Moon & Mars */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {primaryRealms.map((realm) => (
            <article
              key={realm.id}
              className="flex flex-col overflow-hidden rounded-xl border border-white/15 bg-[#141923]"
            >
              <div className="relative h-60 overflow-hidden bg-[#090B10]">
                <img
                  src={realm.image}
                  alt={realm.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141923] via-[#141923]/30 to-transparent" />
                <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-xs text-[#CBD5E1]">
                  <span className="font-mono-tech font-medium" style={{ color: realm.accentHex }}>
                    Primary Collection · {realm.exhibitCount} Exhibits
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="text-xs text-[#A1AAB8]">{realm.subtitle}</div>
                <h3 className="font-display mt-1.5 text-3xl font-semibold text-white">
                  {realm.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#CBD5E1]">{realm.intro}</p>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => onSelectRealmGallery(realm.id)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold text-[#090B10] transition-colors whitespace-nowrap cursor-pointer"
                    style={{ backgroundColor: realm.accentHex }}
                  >
                    <span>Browse {realm.exhibitCount} Exhibits</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectRealmAtlas(realm.id)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#0F131C] px-4 py-2.5 text-xs font-medium text-[#E5E7EB] hover:border-white/35 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>3D Landing Coordinates</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Secondary Collection Wing: Deep Space & Small Bodies */}
        <article className="mt-6 grid grid-cols-1 overflow-hidden rounded-xl border border-white/10 bg-[#0F131C] lg:grid-cols-12">
          <div className="relative h-52 overflow-hidden bg-[#090B10] lg:col-span-4 lg:h-auto">
            <img
              src={deepSpaceRealm.image}
              alt={deepSpaceRealm.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F131C] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0F131C]/80" />
          </div>

          <div className="flex flex-col justify-between p-6 lg:col-span-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className="font-mono-tech font-medium"
                  style={{ color: deepSpaceRealm.accentHex }}
                >
                  Secondary Collection · {deepSpaceRealm.exhibitCount} Exhibits
                </span>
                <span aria-hidden="true" className="text-[#6F7888]">
                  ·
                </span>
                <span className="text-[#A1AAB8]">{deepSpaceRealm.subtitle}</span>
              </div>
              <h3 className="font-display mt-1.5 text-2xl font-semibold text-white">
                {deepSpaceRealm.title}
              </h3>
              <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[#CBD5E1]">
                {deepSpaceRealm.intro}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => onSelectRealmGallery('deep-space')}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-[#090B10] transition-colors whitespace-nowrap cursor-pointer"
                style={{ backgroundColor: deepSpaceRealm.accentHex }}
              >
                <span>Browse Deep Space Wing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSelectRealmAtlas('deep-space')}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#141923] px-4 py-2 text-xs font-medium text-[#E5E7EB] hover:border-white/35 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>3D Orbital Vectors</span>
              </button>
            </div>
          </div>
        </article>
      </motion.section>

      {/* Four-Tier Operational Disposition Taxonomy */}
      <motion.section {...scrollReveal} className="border-y border-white/10 bg-[#0F131C]">
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
      </motion.section>

      {/* Highlighted Monuments Preview */}
      <motion.section {...scrollReveal} className="mx-auto max-w-[1380px] px-5 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D4A359]">
              03. Featured Monuments
            </div>
            <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Selected Stories &amp; 3D Artifacts
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-[#D4A359] hover:text-[#F9E7C4] transition-colors whitespace-nowrap cursor-pointer"
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
                  <span>Read Documentary &amp; Inspect 3D</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
