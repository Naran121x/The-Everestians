import { useState } from 'react';
import { ArrowRight, Compass, Film, Globe2 } from 'lucide-react';
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
import { MissionDocumentaryPlayer } from './MissionDocumentaryPlayer';

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
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
      };

  const scrollReveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.1 },
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="bg-[#090B10]">
      {/* =================================================================== */}
      {/* CINEMATIC DOCUMENTARY PROLOGUE                                      */}
      {/* =================================================================== */}
      <section className="border-b border-white/[0.08]">
        <div className="mx-auto max-w-[1380px] px-5 pt-16 pb-20 sm:px-8 lg:pt-24 lg:pb-28">
          {/* Dedicated Title & Museum Label Area */}
          <motion.div {...fadeUp} className="max-w-5xl">
            <div className="font-mono-tech text-xs uppercase tracking-[0.22em] text-[#D4A359]">
              NASA Space Apps Challenge · Interactive Documentary Museum
            </div>

            <h1 className="font-display headline-balance mt-6 text-5xl font-semibold tracking-[-0.025em] leading-[1.03] text-white sm:text-6xl lg:text-[4.5rem]">
              {HERO_COPY.title}
            </h1>
          </motion.div>

          {/* Balanced Narrative & Uncropped Archival Photograph Split */}
          <div className="mt-12 grid grid-cols-1 items-start gap-12 border-t border-white/[0.08] pt-12 lg:mt-14 lg:grid-cols-12 lg:gap-16 lg:pt-14">
            <motion.div {...fadeUp} className="flex flex-col justify-start lg:col-span-6">
              <p className="font-display max-w-[30ch] text-2xl italic leading-[1.38] text-[#EFE1C3] sm:text-[1.9rem]">
                &ldquo;When a mission ends, what happens to the machine that made it possible?&rdquo;
              </p>

              <p className="mt-8 max-w-[50ch] text-base leading-[1.85] text-[#B8C1CE]">
                Across the airless plains of the Moon and the rust-red deserts of Mars stand the
                silent remains of humanity’s boldest journeys—gold-wrapped descent stages, dusty
                solar landers, fractured helicopter blades, and rovers frozen in ancient riverbeds.
                They are not junk; they are off-world monuments.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('exhibit', 'insight-lander')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#D4A359] px-5 py-2.5 text-sm font-medium text-[#090B10] hover:bg-[#DFB26D] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Film className="h-4 w-4" />
                  <span>Start Flagship Story: InSight</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('gallery')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md border border-white/15 bg-transparent px-5 py-2.5 text-sm font-medium text-[#E5E7EB] hover:border-white/35 hover:bg-white/[0.03] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Browse All 16 Artifacts</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('atlas')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md border border-white/10 px-4 py-2.5 text-sm font-medium text-[#B8C1CE] hover:border-white/25 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
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
                    initial: { opacity: 0, y: 14 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] as const },
                  })}
              className="lg:col-span-6"
            >
              <figure className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D1017]">
                <div className="flex items-center justify-center bg-[#05070B] p-4 sm:p-5">
                  <img
                    src={moonHeroSrc}
                    alt={
                      !heroMoonFallback && apolloPhoto
                        ? `${apolloPhoto.title} (${apolloPhoto.nasaId})`
                        : 'Curatorial visual reconstruction of the Apollo Lunar Module Descent Stage standing on the Moon'
                    }
                    referrerPolicy="no-referrer"
                    onError={() => setHeroMoonFallback(true)}
                    className="block h-auto max-h-[520px] w-full object-contain"
                  />
                </div>
                <figcaption className="flex flex-col justify-between gap-6 border-t border-white/[0.08] px-6 py-6 sm:flex-row sm:items-end sm:px-8 sm:py-7">
                  <div className="max-w-lg">
                    <div className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#D4A359]">
                      {!heroMoonFallback && apolloPhoto
                        ? `Original NASA Photograph · ${apolloPhoto.nasaId}`
                        : 'AI-Generated Curatorial Reconstruction · Statio Tranquillitatis'}
                    </div>
                    <div className="mt-2.5 text-base font-medium text-white">
                      Apollo 11 Eagle Descent Stage · Sea of Tranquility
                    </div>
                    <p className="mt-2 text-sm leading-[1.7] text-[#9AA4B4]">
                      Still standing since July 1969 in airless lunar vacuum—humanity’s first
                      stationary off-world architectural relic.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('exhibit', 'apollo-lm')}
                    className="inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-medium text-[#EFE1C3] hover:border-[#D4A359]/60 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Open Apollo Story</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </figcaption>
              </figure>
            </motion.div>
          </div>
        </div>

        {/* Full-width Museum Summary Metrics Strip */}
        <div className="border-t border-white/[0.08] bg-[#0B0E14]">
          <div className="mx-auto grid max-w-[1380px] grid-cols-1 divide-y divide-white/[0.08] px-5 sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0 sm:px-8 lg:grid-cols-4 lg:gap-x-0 lg:divide-x">
            <div className="py-8 lg:py-10 lg:pr-8">
              <div className="font-mono-tech text-2xl font-semibold tabular-nums text-white lg:text-[1.75rem]">
                16
              </div>
              <div className="mt-2.5 text-sm leading-relaxed text-[#9AA4B4]">
                Cataloged Off-World Exhibits (Moon, Mars &amp; Deep Space)
              </div>
            </div>
            <div className="py-8 lg:px-8 lg:py-10">
              <div className="font-mono-tech text-2xl font-semibold tabular-nums text-[#D4A359] lg:text-[1.75rem]">
                1966 – 2024
              </div>
              <div className="mt-2.5 text-sm leading-relaxed text-[#9AA4B4]">
                Archive Span (Passive Laser Ranging Ongoing)
              </div>
            </div>
            <div className="py-8 sm:border-t sm:border-white/[0.08] lg:border-t-0 lg:px-8 lg:py-10">
              <div className="font-mono-tech text-2xl font-semibold tabular-nums text-white lg:text-[1.75rem]">
                45.16 km
              </div>
              <div className="mt-2.5 text-sm leading-relaxed text-[#9AA4B4]">
                Record Surface Traverse (Opportunity MER-B)
              </div>
            </div>
            <div className="py-8 sm:border-t sm:border-white/[0.08] lg:border-t-0 lg:py-10 lg:pl-8">
              <div className="font-mono-tech text-2xl font-semibold tabular-nums text-white lg:text-[1.75rem]">
                72 Flights
              </div>
              <div className="mt-2.5 text-sm leading-relaxed text-[#9AA4B4]">
                Extraterrestrial Aviation Milestone (Ingenuity)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* NARRATIVE ACT I: TWO WORLDS & FLAGSHIP INSIGHT DOCUMENTARY          */}
      {/* =================================================================== */}
      <motion.section {...scrollReveal} className="border-b border-white/[0.08] bg-[#0B0E15]">
        <div className="mx-auto max-w-[1380px] px-5 py-24 sm:px-8 lg:py-32">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#C86446]">
                Featured Documentary · Elysium Planitia, Mars
              </div>
              <h2 className="font-display headline-balance mt-5 text-3xl font-semibold tracking-[-0.015em] text-white sm:text-4xl lg:text-[3rem] lg:leading-[1.1]">
                The Last Quiet Beacon: NASA’s InSight Lander
              </h2>
              <p className="mt-7 max-w-[56ch] text-base leading-[1.85] text-[#B8C1CE]">
                {insightExhibit?.discoveryHook ??
                  'For four years, InSight pressed an ultra-sensitive seismometer into the red soil of Mars—listening to over 1,300 marsquakes reveal the planet’s liquid core, even as fine iron-oxide dust slowly darkened its 6-meter solar wings.'}
              </p>

              <div className="mt-10 grid grid-cols-1 gap-6 border-y border-white/[0.08] py-7 sm:grid-cols-3 sm:gap-8">
                <div>
                  <div className="font-mono-tech text-2xl font-semibold tabular-nums text-[#EFE1C3]">
                    1,300+
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-[#9AA4B4]">
                    Marsquakes Detected by SEIS
                  </div>
                </div>
                <div>
                  <div className="font-mono-tech text-2xl font-semibold tabular-nums text-white">
                    1,440 sols
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-[#9AA4B4]">
                    Active Surface Science
                  </div>
                </div>
                <div>
                  <div className="font-mono-tech text-2xl font-semibold text-[#C86446]">
                    Dec 2022
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-[#9AA4B4]">
                    Solar Dust Shutdown
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('exhibit', 'insight-lander')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#C86446] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#D57456] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Experience InSight’s 7-Chapter Story</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('exhibit', 'opportunity-rover')}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md border border-white/15 bg-transparent px-5 py-2.5 text-sm font-medium text-[#E5E7EB] hover:border-white/35 hover:bg-white/[0.03] transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Or Read Opportunity’s 45.16 km Trek</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <figure className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D1017]">
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#06080D]">
                  <img
                    src={marsSpotlightSrc}
                    alt={
                      !spotlightMarsFallback && insightMedia?.nasaPhoto
                        ? insightMedia.nasaPhoto.title
                        : 'Martian surface curatorial reconstruction'
                    }
                    referrerPolicy="no-referrer"
                    onError={() => setSpotlightMarsFallback(true)}
                    className="h-full w-full object-contain"
                  />
                </div>
                <figcaption className="border-t border-white/[0.08] px-6 py-6 sm:px-8 sm:py-7">
                  <div className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#EFE1C3]">
                    {!spotlightMarsFallback && insightMedia?.nasaPhoto
                      ? `Original NASA Photograph · ${insightMedia.nasaPhoto.nasaId} (${insightMedia.nasaPhoto.credit})`
                      : 'AI-Generated Curatorial Reconstruction'}
                  </div>
                  <p className="mt-3 text-sm leading-[1.75] text-[#9AA4B4]">
                    {!spotlightMarsFallback && insightMedia?.nasaPhoto
                      ? insightMedia.nasaPhoto.caption
                      : 'Documentary visual showing Martian dust blanketing solar arrays on Elysium Planitia.'}
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>

          {insightExhibit && (
            <div className="mt-20 border-t border-white/[0.08] pt-16 lg:mt-24 lg:pt-20">
              <MissionDocumentaryPlayer
                exhibit={insightExhibit}
                onWatchOriginalFootage={() => onNavigate('exhibit', 'insight-lander')}
              />
            </div>
          )}
        </div>
      </motion.section>

      {/* =================================================================== */}
      {/* PLANET & REALM COLLECTIONS (MOON & MARS PRIMARY, DEEP SPACE WING)   */}
      {/* =================================================================== */}
      <motion.section
        {...scrollReveal}
        className="mx-auto max-w-[1380px] px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="max-w-3xl">
          <div className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#D4A359]">
            01. Curated Collections · Primary Surface Realms
          </div>
          <h2 className="font-display headline-balance mt-4 text-3xl font-semibold tracking-[-0.015em] text-white sm:text-4xl lg:text-[2.75rem]">
            The Moon &amp; Mars Galleries
          </h2>
          <p className="mt-6 max-w-[64ch] text-base leading-[1.85] text-[#9AA4B4]">
            Two worlds, two fates: on the airless Moon, gold foil and bootprints remain crisp for
            geologic ages; on Mars, global winds and seasonal frost slowly bury machines in red
            soil. Begin with either surface gallery or inspect our secondary deep-space wing below.
          </p>
        </div>

        {/* Guided 3-Step Documentary Flow */}
        <div className="mt-14 grid grid-cols-1 gap-8 border-y border-white/[0.08] py-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/[0.08] sm:py-10">
          <div className="sm:pr-8">
            <div className="font-mono-tech text-xs font-semibold uppercase tracking-[0.16em] text-[#D4A359]">
              Act 01
            </div>
            <p className="mt-2.5 text-[15px] leading-[1.75] text-[#B8C1CE]">
              Choose a planetary realm or pinpoint coordinates on the 3D globe.
            </p>
          </div>
          <div className="sm:px-8">
            <div className="font-mono-tech text-xs font-semibold uppercase tracking-[0.16em] text-[#D4A359]">
              Act 02
            </div>
            <p className="mt-2.5 text-[15px] leading-[1.75] text-[#B8C1CE]">
              Follow any artifact’s 7-chapter story with animated ending reconstructions.
            </p>
          </div>
          <div className="sm:pl-8">
            <div className="font-mono-tech text-xs font-semibold uppercase tracking-[0.16em] text-[#D4A359]">
              Act 03
            </div>
            <p className="mt-2.5 text-[15px] leading-[1.75] text-[#B8C1CE]">
              Inspect 3D hardware callouts and watch verified NASA mission footage.
            </p>
          </div>
        </div>

        {/* Primary 2-Column Collections: Moon & Mars */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          {primaryRealms.map((realm) => (
            <article
              key={realm.id}
              className="flex flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D1017]"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#06080D]">
                <img
                  src={realm.image}
                  alt={realm.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-8 sm:p-10 lg:p-11">
                <div
                  className="font-mono-tech text-xs font-medium uppercase tracking-[0.14em]"
                  style={{ color: realm.accentHex }}
                >
                  Primary Collection · {realm.exhibitCount} Exhibits
                </div>

                <h3 className="font-display mt-3.5 text-3xl font-semibold text-white">
                  {realm.title}
                </h3>

                <div className="mt-2 text-sm text-[#8E98A8]">{realm.subtitle}</div>

                <p className="mt-6 max-w-[52ch] flex-1 text-base leading-[1.85] text-[#B8C1CE]">
                  {realm.intro}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onSelectRealmGallery(realm.id)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-5 py-2.5 text-xs font-semibold text-[#090B10] hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                    style={{ backgroundColor: realm.accentHex }}
                  >
                    <span>Browse {realm.exhibitCount} Exhibits</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectRealmAtlas(realm.id)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-white/15 bg-transparent px-4 py-2.5 text-xs font-medium text-[#E5E7EB] hover:border-white/35 hover:bg-white/[0.03] transition-colors whitespace-nowrap cursor-pointer"
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
        <article className="mt-12 grid grid-cols-1 items-stretch overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B0E14] lg:grid-cols-12">
          <div className="aspect-[16/9] w-full overflow-hidden bg-[#06080D] lg:col-span-6 lg:aspect-auto lg:min-h-[360px]">
            <img
              src={deepSpaceRealm.image}
              alt={deepSpaceRealm.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-6 lg:p-12">
            <div>
              <div
                className="font-mono-tech text-xs font-medium uppercase tracking-[0.14em]"
                style={{ color: deepSpaceRealm.accentHex }}
              >
                Secondary Collection · {deepSpaceRealm.exhibitCount} Exhibits
              </div>
              <h3 className="font-display mt-3.5 text-2xl font-semibold text-white sm:text-3xl">
                {deepSpaceRealm.title}
              </h3>
              <div className="mt-2 text-sm text-[#8E98A8]">{deepSpaceRealm.subtitle}</div>
              <p className="mt-6 max-w-[54ch] text-base leading-[1.85] text-[#B8C1CE]">
                {deepSpaceRealm.intro}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onSelectRealmGallery('deep-space')}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md px-5 py-2.5 text-xs font-semibold text-[#090B10] hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                style={{ backgroundColor: deepSpaceRealm.accentHex }}
              >
                <span>Browse Deep Space Wing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSelectRealmAtlas('deep-space')}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-white/15 bg-transparent px-4 py-2.5 text-xs font-medium text-[#E5E7EB] hover:border-white/35 hover:bg-white/[0.03] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>3D Orbital Vectors</span>
              </button>
            </div>
          </div>
        </article>
      </motion.section>

      {/* Four-Tier Operational Disposition Taxonomy */}
      <motion.section {...scrollReveal} className="border-y border-white/[0.08] bg-[#0B0E15]">
        <div className="mx-auto max-w-[1380px] px-5 py-24 sm:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#D4A359]">
              02. Classification System
            </div>
            <h2 className="font-display headline-balance mt-4 text-3xl font-semibold tracking-[-0.015em] text-white sm:text-4xl lg:text-[2.75rem]">
              Why Spacecraft Remain Behind
            </h2>
            <p className="mt-5 max-w-[64ch] text-base leading-[1.85] text-[#9AA4B4]">
              To maintain scientific rigor, all 16 museum artifacts are classified under a four-tier
              operational disposition taxonomy documenting how and why each mission ended.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            {DISPOSITION_TAXONOMY.map((tier, index) => (
              <div
                key={tier.id}
                className="flex flex-col rounded-lg border border-white/[0.08] bg-[#0F131C]/60 p-8 sm:p-10 lg:p-11"
              >
                <div className="font-mono-tech text-xs uppercase tracking-[0.18em] text-[#D4A359]">
                  Tier 0{index + 1}
                </div>
                <h3 className="font-display mt-4 text-2xl font-semibold leading-snug text-white">
                  {tier.title}
                </h3>
                <p className="mt-5 max-w-[54ch] flex-1 text-base leading-[1.82] text-[#B8C1CE]">
                  {tier.description}
                </p>
                <div className="mt-8 border-t border-white/[0.06] pt-6">
                  <div className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#6F7888]">
                    Catalog Examples
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                    {tier.examples}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Highlighted Monuments Preview */}
      <motion.section
        {...scrollReveal}
        className="mx-auto max-w-[1380px] px-5 py-24 sm:px-8 lg:py-32"
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#D4A359]">
              03. Featured Monuments
            </div>
            <h2 className="font-display headline-balance mt-4 text-3xl font-semibold tracking-[-0.015em] text-white sm:text-4xl lg:text-[2.75rem]">
              Selected Stories &amp; 3D Artifacts
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#D4A359] hover:text-[#EFE1C3] transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>View all 16 exhibits</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-12">
          {featured.map((exhibit) => (
            <button
              key={exhibit.id}
              type="button"
              onClick={() => onNavigate('exhibit', exhibit.id)}
              className="group flex flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D1017] text-left hover:border-[#D4A359]/45 transition-colors duration-200 cursor-pointer"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#06080D] p-3">
                <img
                  src={exhibit.visualImage}
                  alt={exhibit.shortTitle}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src !== exhibit.fallbackVisualImage) {
                      e.currentTarget.src = exhibit.fallbackVisualImage;
                    }
                  }}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-1 flex-col p-8 sm:p-10 lg:p-11">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs tracking-[0.06em] text-[#8E98A8]">
                  <span className="uppercase">{exhibit.targetBodyLabel}</span>
                  <span className="font-mono-tech">{exhibit.operationalPeriod}</span>
                </div>
                <h3 className="font-display mt-4 text-2xl font-semibold leading-[1.22] text-white group-hover:text-[#EFE1C3] transition-colors sm:text-[1.85rem]">
                  {exhibit.shortTitle}
                </h3>
                <p className="mt-5 max-w-[52ch] flex-1 text-base leading-[1.82] text-[#B8C1CE]">
                  {exhibit.cardSnippet}
                </p>
                <div className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-[#D4A359] group-hover:text-[#EFE1C3] transition-colors">
                  <span>Read Documentary &amp; Inspect 3D</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
