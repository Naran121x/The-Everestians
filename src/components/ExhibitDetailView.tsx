import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Film,
  GitCompare,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { EXHIBITS, type Exhibit } from '../data/exhibits';
import { EXHIBIT_MEDIA } from '../data/exhibitMedia';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { MissionAnimation } from './MissionAnimation';
import { WatchMissionSection } from './WatchMissionSection';

const LazyExhibit3DViewport = lazy(() =>
  import('../three/Exhibit3DViewport').then((m) => ({ default: m.Exhibit3DViewport }))
);

interface ExhibitDetailViewProps {
  exhibit: Exhibit;
  onBackToGallery: () => void;
  onOpenExhibit: (id: string) => void;
  onCompareWith: (id: string) => void;
}

const CHAPTER_LINKS = [
  { id: 'chapter-discovery', num: '01', label: 'Discovery' },
  { id: 'chapter-mission', num: '02', label: 'Mission' },
  { id: 'chapter-journey', num: '03', label: 'Journey' },
  { id: 'chapter-ending', num: '04', label: 'The Ending' },
  { id: 'chapter-science', num: '05', label: 'Scientific Exploration' },
  { id: 'chapter-legacy', num: '06', label: 'Legacy' },
  { id: 'chapter-evidence', num: '07', label: 'Evidence & Video' },
] as const;

function ChapterSection({
  id,
  className,
  children,
}: {
  id: string;
  className: string;
  children: ReactNode;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function ExhibitDetailView({
  exhibit,
  onBackToGallery,
  onOpenExhibit,
  onCompareWith,
}: ExhibitDetailViewProps) {
  const prefersReduced = useReducedMotion();
  const [specsExpanded, setSpecsExpanded] = useState(false);
  const [photoFallback, setPhotoFallback] = useState(false);
  const [activeEventIdx, setActiveEventIdx] = useState(0);

  useEffect(() => {
    setSpecsExpanded(false);
    setPhotoFallback(false);
    setActiveEventIdx(0);
  }, [exhibit.id]);

  const media = EXHIBIT_MEDIA[exhibit.id];
  const nasaPhoto = media?.nasaPhoto;
  const usingAuthenticPhoto = Boolean(nasaPhoto?.imageUrl && !photoFallback);
  const heroImageSrc = usingAuthenticPhoto && nasaPhoto ? nasaPhoto.imageUrl : exhibit.visualImage;

  const timelineEvents = exhibit.timeline;
  const safeEventIdx = Math.min(activeEventIdx, Math.max(timelineEvents.length - 1, 0));
  const selectedEvent = timelineEvents[safeEventIdx];
  const progressPercent =
    timelineEvents.length > 1 ? Math.round((safeEventIdx / (timelineEvents.length - 1)) * 100) : 100;

  const currentIndex = EXHIBITS.findIndex((e) => e.id === exhibit.id);
  const prevExhibit = EXHIBITS[(currentIndex - 1 + EXHIBITS.length) % EXHIBITS.length];
  const nextExhibit = EXHIBITS[(currentIndex + 1) % EXHIBITS.length];

  const scrollToChapter = (chapterId: string) => {
    const el = document.getElementById(chapterId);
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <article className="mx-auto max-w-[1380px] px-5 py-8 lg:px-8 lg:py-12">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <button
          type="button"
          onClick={onBackToGallery}
          className="inline-flex min-h-[44px] items-center gap-2 text-xs font-medium text-[#A1AAB8] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Exhibit Gallery</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => scrollToChapter('watch-mission')}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-[#141923] px-4 py-2 text-xs font-medium text-[#F9E7C4] hover:border-[#D4A359]/60 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Film className="h-3.5 w-3.5 text-[#D4A359]" />
            <span>Watch the Mission</span>
          </button>

          <button
            type="button"
            onClick={() => onCompareWith(exhibit.id)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-[#141923] px-4 py-2 text-xs font-medium text-[#F3F4F6] hover:border-[#D4A359]/60 transition-colors whitespace-nowrap cursor-pointer"
          >
            <GitCompare className="h-3.5 w-3.5 text-[#D4A359]" />
            <span>Compare This Artifact</span>
          </button>
        </div>
      </div>

      {/* 7-Chapter Jump Rail */}
      <nav
        aria-label="Exhibit Story Chapters"
        className="mt-5 flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-4"
      >
        {CHAPTER_LINKS.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => scrollToChapter(ch.id)}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-[#141923] px-3.5 py-2 text-xs font-medium text-[#CBD5E1] hover:border-[#D4A359]/60 hover:text-[#F9E7C4] transition-colors whitespace-nowrap cursor-pointer"
          >
            <span className="font-mono-tech text-[11px] text-[#D4A359]">{ch.num}</span>
            <span>{ch.label}</span>
          </button>
        ))}
      </nav>

      {/* =================================================================== */}
      {/* CHAPTER 01: DISCOVERY                                               */}
      {/* =================================================================== */}
      <section
        id="chapter-discovery"
        className="scroll-mt-24 border-b border-white/10 py-10 lg:py-12"
      >
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div className="font-mono-tech text-xs uppercase tracking-[0.16em] text-[#D4A359]">
              Chapter 01 · Discovery
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#A1AAB8]">
              <span className="font-mono-tech text-[#F9E7C4]">{exhibit.accessionNumber}</span>
              <span aria-hidden="true">·</span>
              <span>{exhibit.targetBodyLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tech">{exhibit.operationalPeriod}</span>
              <span aria-hidden="true">·</span>
              <span>{exhibit.dispositionShort}</span>
            </div>

            <h1 className="font-display headline-balance mt-3 text-3xl font-semibold leading-[1.1] text-white sm:text-5xl">
              {exhibit.officialName}
            </h1>
            <p className="mt-2.5 text-sm font-medium text-[#CBD5E1] sm:text-base">
              {exhibit.mission}
            </p>

            <p className="mt-6 max-w-[62ch] text-base leading-[1.75] text-[#F3F4F6] sm:text-[17px]">
              {exhibit.discoveryHook}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#A1AAB8]">
              <span>
                <strong className="font-medium text-white">Resting Location:</strong>{' '}
                {exhibit.locations[0]?.siteName} ({exhibit.locations[0]?.region})
              </span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => scrollToChapter('chapter-science')}
                className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-[#D4A359] hover:text-[#F9E7C4] cursor-pointer"
              >
                <span>Jump to 3D Hardware Inspector</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <figure className="overflow-hidden rounded-xl border border-white/15 bg-[#141923]">
              <div className="relative h-[290px] sm:h-[360px] w-full overflow-hidden bg-[#090B10]">
                <img
                  src={heroImageSrc}
                  alt={
                    usingAuthenticPhoto && nasaPhoto
                      ? `${nasaPhoto.title} (${nasaPhoto.nasaId})`
                      : `${exhibit.shortTitle} — ${exhibit.visualStudyLabel}`
                  }
                  referrerPolicy="no-referrer"
                  onError={() => setPhotoFallback(true)}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090B10]/90 via-transparent to-transparent" />
              </div>

              <figcaption className="border-t border-white/10 p-4 sm:p-5">
                {usingAuthenticPhoto && nasaPhoto ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
                      <span>
                        Original NASA Archival Photograph · {nasaPhoto.nasaId}
                      </span>
                      <span className="text-[#CBD5E1]">{nasaPhoto.credit}</span>
                    </div>
                    <div className="mt-1 text-sm font-medium text-white">{nasaPhoto.title}</div>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#A1AAB8]">
                      {nasaPhoto.caption}{' '}
                      <a
                        href={nasaPhoto.detailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#F9E7C4] underline hover:text-[#D4A359]"
                      >
                        <span>NASA Photo Record</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
                      {exhibit.visualStudyLabel}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#A1AAB8]">
                      Displayed visual is an AI-generated curatorial reconstruction created for
                      exhibition framing. Original NASA catalog references ({exhibit.nasaImage.assetId}
                      ) and official footage are documented in{' '}
                      <button
                        type="button"
                        onClick={() => scrollToChapter('chapter-evidence')}
                        className="text-[#F9E7C4] underline hover:text-[#D4A359] cursor-pointer"
                      >
                        Chapter 07 (Evidence)
                      </button>
                      .
                    </p>
                  </>
                )}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* CHAPTER 02: MISSION                                                 */}
      {/* =================================================================== */}
      <ChapterSection
        id="chapter-mission"
        className="scroll-mt-24 border-b border-white/10 py-10 lg:py-12"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="font-mono-tech text-xs uppercase tracking-[0.16em] text-[#D4A359]">
              Chapter 02 · Mission
            </div>
            <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Why It Was Sent &amp; Scientific Purpose
            </h2>

            <div className="mt-5 max-w-[66ch] space-y-4 text-[15px] leading-[1.78] text-[#CBD5E1]">
              <p>{exhibit.historicalBackground}</p>
              <p className="text-[#E5E7EB]">
                <strong className="font-semibold text-white">Core Mission Objective: </strong>
                {exhibit.originalPurpose}
              </p>
            </div>

            {/* Plain-Language Glossary */}
            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#A1AAB8]">
                Key Concepts Explained in Plain Language
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                {exhibit.glossaryTerms.map((item) => (
                  <div
                    key={item.term}
                    className="rounded-xl border border-white/10 bg-[#141923] p-4"
                  >
                    <h3 className="text-sm font-semibold text-[#F9E7C4]">{item.term}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#CBD5E1]">
                      {item.plainExplanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-xl border border-white/10 bg-[#141923] p-6">
              <h3 className="font-display text-2xl font-semibold text-white">
                Landing &amp; Deployment Sites
              </h3>
              <div className="mt-4 divide-y divide-white/10">
                {exhibit.locations.map((loc) => (
                  <div key={loc.siteName} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 text-[#D4A359] shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-white">{loc.siteName}</div>
                        <div className="text-xs text-[#A1AAB8]">{loc.region}</div>
                        <div className="font-mono-tech mt-1 text-xs text-[#F9E7C4]">
                          {loc.coordinateText}
                        </div>
                        {loc.statusNote && (
                          <div className="mt-1 text-xs text-[#9CA3AF]">{loc.statusNote}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#141923] p-6">
              <h3 className="font-display text-2xl font-semibold text-white">Key Mission Dates</h3>
              <dl className="mt-4 divide-y divide-white/10 text-sm">
                {exhibit.keyDates.map((d) => (
                  <div key={d.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-xs text-[#A1AAB8]">{d.label}</dt>
                    <dd className="font-mono-tech text-xs font-medium text-[#F9E7C4] text-right">
                      {d.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </ChapterSection>

      {/* =================================================================== */}
      {/* CHAPTER 03: JOURNEY (INTERACTIVE EVENT SEQUENCE + FULL TIMELINE)    */}
      {/* =================================================================== */}
      <ChapterSection
        id="chapter-journey"
        className="scroll-mt-24 border-b border-white/10 py-10 lg:py-12"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="font-mono-tech text-xs uppercase tracking-[0.16em] text-[#D4A359]">
              Chapter 03 · Journey
            </div>
            <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Chronicle of Operations
            </h2>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.78] text-[#CBD5E1]">
              {exhibit.journeyNarrative}
            </p>

            {/* Interactive Active Milestone Focus Deck */}
            {selectedEvent && (
              <div className="mt-6 rounded-xl border border-[#D4A359]/40 bg-[#141923] p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
                    Milestone 0{safeEventIdx + 1} / 0{timelineEvents.length}
                  </span>
                  <span className="font-mono-tech text-xs text-[#F9E7C4]">
                    {selectedEvent.date}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-[#D4A359] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">{selectedEvent.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                  {selectedEvent.detail}
                </p>

                <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    disabled={safeEventIdx === 0}
                    onClick={() => setActiveEventIdx((i) => Math.max(0, i - 1))}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#0F131C] px-3 py-1.5 text-xs font-medium text-[#E5E7EB] hover:border-[#D4A359] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous Event</span>
                  </button>

                  <button
                    type="button"
                    disabled={safeEventIdx >= timelineEvents.length - 1}
                    onClick={() =>
                      setActiveEventIdx((i) => Math.min(timelineEvents.length - 1, i + 1))
                    }
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#D4A359]/45 bg-[#0F131C] px-3 py-1.5 text-xs font-medium text-[#F9E7C4] hover:border-[#D4A359] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Next Event</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-4 border-l border-white/15 pl-6">
              {timelineEvents.map((ev, idx) => {
                const isSelected = idx === safeEventIdx;
                return (
                  <button
                    key={`${ev.date}-${ev.title}`}
                    type="button"
                    onClick={() => setActiveEventIdx(idx)}
                    aria-current={isSelected ? 'step' : undefined}
                    className={`relative block w-full rounded-xl border p-5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#D4A359] bg-[#19202D]'
                        : 'border-white/10 bg-[#141923] hover:border-white/25'
                    }`}
                  >
                    <span
                      className={`absolute -left-[31px] top-6 h-3 w-3 rounded-full border-2 transition-colors ${
                        isSelected
                          ? 'border-[#F9E7C4] bg-[#D4A359]'
                          : 'border-[#D4A359] bg-[#090B10]'
                      }`}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-tech text-xs text-[#D4A359]">{ev.date}</span>
                      <span className="font-mono-tech text-[11px] text-[#9CA3AF]">
                        Step 0{idx + 1}
                      </span>
                    </div>
                    <h3 className="mt-1 text-base font-semibold text-white">{ev.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#CBD5E1]">{ev.detail}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* =================================================================== */}
      {/* CHAPTER 04: THE ENDING + SCHEMATIC ANIMATED RECONSTRUCTION          */}
      {/* =================================================================== */}
      <ChapterSection
        id="chapter-ending"
        className="scroll-mt-24 border-b border-white/10 py-10 lg:py-12"
      >
        <div className="font-mono-tech text-xs uppercase tracking-[0.16em] text-[#D4A359]">
          Chapter 04 · The Ending
        </div>
        <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
          How the Mission Ended &amp; Why It Remains Behind
        </h2>

        {/* Interactive Schematic Mission Animation */}
        <div className="mt-7">
          <MissionAnimation exhibit={exhibit} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-xl border border-white/10 bg-[#141923] p-6 lg:col-span-7">
            <div className="text-xs font-mono-tech uppercase tracking-wider text-[#F9E7C4]">
              Verified Mission Decommissioning Facts · {exhibit.dispositionLabel}
            </div>
            <p className="mt-3 text-[15px] leading-[1.78] text-[#E5E7EB]">
              {exhibit.endingDetails.verifiedFacts}
            </p>
            <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-[#A1AAB8]">
              <strong className="text-white">Disposition Record: </strong>
              {exhibit.abandonmentReason}
            </p>
          </div>

          <div className="rounded-xl border border-[#D4A359]/30 bg-[#0F131C] p-6 lg:col-span-5">
            <div className="font-mono-tech text-xs uppercase tracking-wider text-[#D4A359]">
              Facts vs. Interpretations &amp; Source Caveats
            </div>
            <p className="mt-3 text-sm leading-[1.7] text-[#CBD5E1]">
              {exhibit.endingDetails.distinctionNote ||
                'Every chronological event and failure mode recorded here comes from NASA mission logs and technical post-mortems, with no invented crew messages or speculative drama.'}
            </p>
            {exhibit.verificationNote && (
              <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-[#A1AAB8]">
                {exhibit.verificationNote}
              </p>
            )}
          </div>
        </div>
      </ChapterSection>

      {/* =================================================================== */}
      {/* CHAPTER 05: SCIENTIFIC EXPLORATION                                  */}
      {/* =================================================================== */}
      <ChapterSection
        id="chapter-science"
        className="scroll-mt-24 border-b border-white/10 py-10 lg:py-12"
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="font-mono-tech text-xs uppercase tracking-[0.16em] text-[#D4A359]">
              Chapter 05 · Scientific Exploration
            </div>
            <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Interactive 3D Hardware, Engineering &amp; Discoveries
            </h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-[#A1AAB8]">
            Rotate, zoom, and click numbered callouts to inspect spacecraft subsystems, or load a
            downloaded official NASA <span className="font-mono-tech text-[#CBD5E1]">.glb/.stl</span>{' '}
            file directly into the viewport.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* 3D Viewport + Annotated Subsystems */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            <CanvasErrorBoundary
              fallbackTitle="Interactive 3D Viewer Unavailable"
              fallbackDetail="Your browser or device paused WebGL rendering. You can still inspect all annotated component callouts, achievements, and technical specifications below."
            >
              <Suspense
                fallback={
                  <div className="flex h-[480px] lg:h-[540px] w-full items-center justify-center rounded-xl border border-white/10 bg-[#07090e] p-6 text-center">
                    <div>
                      <div className="font-mono-tech text-xs uppercase tracking-wider text-[#D4A359]">
                        Initializing Hardware Reconstruction
                      </div>
                      <p className="mt-2 text-sm text-[#A1AAB8]">
                        Loading interactive 3D spacecraft model and hotspot markers…
                      </p>
                    </div>
                  </div>
                }
              >
                <LazyExhibit3DViewport exhibit={exhibit} />
              </Suspense>
            </CanvasErrorBoundary>

            {/* Annotated Components Directory */}
            <div className="rounded-xl border border-white/10 bg-[#141923] p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
                Annotated Components ({exhibit.hotspots.length})
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {exhibit.hotspots.map((h, i) => (
                  <div
                    key={h.id}
                    className="rounded-lg border border-white/10 bg-[#0F131C] p-3.5 text-xs"
                  >
                    <div className="font-semibold text-[#F9E7C4]">
                      0{i + 1}. {h.label}
                    </div>
                    <p className="mt-1.5 leading-relaxed text-[#A1AAB8]">{h.annotation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Scientific Achievements + Expandable Technical Specs */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-xl border border-white/10 bg-[#141923] p-6">
              <h3 className="font-display text-2xl font-semibold text-white">
                Key Scientific Achievements
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#CBD5E1]">
                {exhibit.achievements.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4A359] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expandable Technical Specifications Drawer */}
            <div className="rounded-xl border border-white/10 bg-[#141923] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    Technical Specifications
                  </h3>
                  <p className="mt-1 text-xs text-[#A1AAB8]">
                    Summary shown below; expand for full engineering &amp; phase-specific mass data.
                  </p>
                </div>
              </div>

              {/* Compact 2-metric preview always accessible */}
              <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-[#0F131C] p-3">
                  <dt className="text-[11px] uppercase tracking-wider text-[#9CA3AF]">
                    Mass (Phase-Specified)
                  </dt>
                  <dd className="font-mono-tech mt-1 text-xs text-white">
                    {exhibit.comparison.massSummary}
                  </dd>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#0F131C] p-3">
                  <dt className="text-[11px] uppercase tracking-wider text-[#9CA3AF]">
                    Power Architecture
                  </dt>
                  <dd className="mt-1 text-xs text-white">{exhibit.comparison.powerSource}</dd>
                </div>
              </dl>

              <button
                type="button"
                aria-expanded={specsExpanded}
                aria-controls={`specs-panel-${exhibit.id}`}
                onClick={() => setSpecsExpanded((prev) => !prev)}
                className="mt-4 flex min-h-[44px] w-full items-center justify-between rounded-lg border border-[#D4A359]/40 bg-[#0F131C] px-4 py-2.5 text-xs font-semibold text-[#F9E7C4] hover:border-[#D4A359] transition-colors cursor-pointer"
              >
                <span>
                  {specsExpanded
                    ? 'Hide Full Engineering Specifications'
                    : `Show Full Engineering Specifications (${exhibit.specifications.length} items)`}
                </span>
                {specsExpanded ? (
                  <ChevronUp className="h-4 w-4 text-[#D4A359]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#D4A359]" />
                )}
              </button>

              {specsExpanded && (
                <div id={`specs-panel-${exhibit.id}`} className="mt-4 border-t border-white/10 pt-4">
                  <dl className="divide-y divide-white/10 text-sm">
                    {exhibit.specifications.map((spec) => (
                      <div key={spec.label} className="py-3 first:pt-0 last:pb-0">
                        <dt className="text-xs uppercase tracking-wider text-[#9CA3AF]">
                          {spec.label}
                        </dt>
                        <dd className="font-mono-tech mt-1 text-sm text-white">{spec.value}</dd>
                        {spec.phaseNote && (
                          <dd className="mt-0.5 text-[11px] text-[#6F7888]">{spec.phaseNote}</dd>
                        )}
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </ChapterSection>

      {/* =================================================================== */}
      {/* CHAPTER 06: LEGACY                                                  */}
      {/* =================================================================== */}
      <ChapterSection
        id="chapter-legacy"
        className="scroll-mt-24 border-b border-white/10 py-10 lg:py-12"
      >
        <div className="font-mono-tech text-xs uppercase tracking-[0.16em] text-[#D4A359]">
          Chapter 06 · Legacy
        </div>
        <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
          Current Status &amp; Lessons for Future Exploration
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-xl border border-white/10 bg-[#141923] p-6 lg:col-span-6">
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#F9E7C4]">
              Current Status Today
            </h3>
            <p className="mt-3 text-[15px] leading-[1.75] text-white">{exhibit.currentStatus}</p>

            <h3 className="mt-6 border-t border-white/10 pt-5 text-xs font-mono-tech uppercase tracking-wider text-[#D4A359]">
              Historical &amp; Scientific Significance
            </h3>
            <p className="mt-2 text-sm leading-[1.75] text-[#CBD5E1]">
              {exhibit.legacyImpact.significance}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#141923] p-6 lg:col-span-6">
            <h3 className="text-xs font-mono-tech uppercase tracking-wider text-[#D4A359]">
              Engineering Lessons for Upcoming Missions
            </h3>
            <ul className="mt-4 space-y-4 text-sm leading-relaxed text-[#E5E7EB]">
              {exhibit.legacyImpact.futureLessons.map((lesson, idx) => (
                <li key={lesson} className="flex items-start gap-3">
                  <span className="font-mono-tech mt-0.5 text-xs font-semibold text-[#D4A359]">
                    0{idx + 1}
                  </span>
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ChapterSection>

      {/* =================================================================== */}
      {/* CHAPTER 07: EVIDENCE & WATCH THE MISSION                            */}
      {/* =================================================================== */}
      <ChapterSection id="chapter-evidence" className="scroll-mt-24 py-10 lg:py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="font-mono-tech text-xs uppercase tracking-[0.16em] text-[#D4A359]">
              Chapter 07 · Evidence
            </div>
            <h2 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Watch the Mission, Direct Sources &amp; Provenance
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-[#A1AAB8]">
            <ShieldCheck className="h-4 w-4 text-[#D4A359] shrink-0" />
            <span>Official NASA streams, direct reports &amp; archive lookup separation</span>
          </div>
        </div>

        {/* Watch the Mission: Official NASA / Partner Video Player */}
        <div id="watch-mission" className="scroll-mt-24 mt-7">
          <WatchMissionSection exhibit={exhibit} />
        </div>

        {/* Per-Claim / Per-Asset Verified Sources */}
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          {exhibit.evidenceSources.map((src) => (
            <div
              key={`${src.label}-${src.claimOrAsset}`}
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#141923] p-5"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tech">
                  <span
                    className={
                      src.linkType === 'direct-record' ? 'text-[#D4A359]' : 'text-[#67B7D1]'
                    }
                  >
                    {src.linkType === 'direct-record'
                      ? 'Direct Official Record'
                      : 'Archive Portal · Search Lookup'}
                  </span>
                  {src.lookupTerm && <span className="text-[#9CA3AF]">{src.lookupTerm}</span>}
                </div>

                <h3 className="mt-2 text-sm font-semibold text-white">{src.label}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#CBD5E1]">
                  <strong className="text-[#A1AAB8]">Supports: </strong>
                  {src.claimOrAsset}
                </p>

                {src.correctionNote && (
                  <p className="mt-3 rounded-lg border border-[#D4A359]/35 bg-[#0F131C] p-3 text-xs leading-relaxed text-[#F9E7C4]">
                    {src.correctionNote}
                  </p>
                )}
              </div>

              <div className="mt-4 border-t border-white/10 pt-3">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-1.5 text-xs font-semibold text-[#D4A359] hover:text-[#F9E7C4] hover:underline"
                >
                  <span>Open Official Source</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Original Photography vs AI Reconstruction + Official 3D Mesh vs Procedural Model */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#0F131C] p-5">
            <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
              Photographic Attribution &amp; Visual Disclosure
            </div>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-[#9CA3AF]">NASA Catalog Reference</dt>
                <dd className="font-mono-tech text-right text-white">
                  {nasaPhoto?.nasaId ?? exhibit.nasaImage.assetId}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#9CA3AF]">Original Credit</dt>
                <dd className="text-right text-[#E5E7EB]">
                  {nasaPhoto?.credit ?? exhibit.nasaImage.attribution}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#9CA3AF]">Chapter 01 Display</dt>
                <dd className="text-right text-[#F9E7C4]">
                  {usingAuthenticPhoto
                    ? 'Verified NASA Archival Photograph'
                    : 'AI-Generated Curatorial Reconstruction'}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-[#A1AAB8]">
              {nasaPhoto?.caption ?? exhibit.nasaImage.description}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0F131C] p-5">
            <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
              3D Model Provenance (Official NASA File vs. Procedural Model)
            </div>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-[#9CA3AF]">In-Browser Default</dt>
                <dd className="text-right text-[#F9E7C4]">
                  Procedural Three.js Hardware Reconstruction
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#9CA3AF]">Official NASA 3D Asset</dt>
                <dd className="font-mono-tech text-right text-white">
                  {exhibit.nasa3dAsset.assetName}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#9CA3AF]">Format &amp; Size</dt>
                <dd className="font-mono-tech text-right text-[#E5E7EB]">
                  {exhibit.nasa3dAsset.format} · {exhibit.nasa3dAsset.fileSize}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-[#A1AAB8]">
              {exhibit.nasa3dAsset.technicalNotes} Download from {exhibit.nasa3dAsset.downloadLocation}{' '}
              and load into Chapter 05 via &ldquo;Load Local .GLB / .STL&rdquo; to inspect the raw
              NASA mesh.
            </p>
          </div>
        </div>
      </ChapterSection>

      {/* Sequential Museum Tour Footer */}
      <nav
        aria-label="Previous and Next Exhibits"
        className="mt-8 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={() => onOpenExhibit(prevExhibit.id)}
          className="flex min-h-[64px] items-center justify-between rounded-xl border border-white/10 bg-[#141923] p-5 text-left hover:border-[#D4A359]/60 transition-colors cursor-pointer"
        >
          <div>
            <div className="text-xs text-[#9CA3AF]">Previous Exhibit</div>
            <div className="font-display mt-1 text-xl font-semibold text-white">
              {prevExhibit.shortTitle}
            </div>
          </div>
          <ArrowLeft className="h-5 w-5 text-[#D4A359] shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => onOpenExhibit(nextExhibit.id)}
          className="flex min-h-[64px] items-center justify-between rounded-xl border border-white/10 bg-[#141923] p-5 text-left hover:border-[#D4A359]/60 transition-colors cursor-pointer"
        >
          <div>
            <div className="text-xs text-[#9CA3AF]">Next Exhibit</div>
            <div className="font-display mt-1 text-xl font-semibold text-white">
              {nextExhibit.shortTitle}
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-[#D4A359] shrink-0" />
        </button>
      </nav>
    </article>
  );
}
