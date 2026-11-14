import { ArrowLeft, ArrowRight, ExternalLink, GitCompare, MapPin } from 'lucide-react';
import { EXHIBITS, type Exhibit } from '../data/exhibits';
import { Exhibit3DViewport } from '../three/Exhibit3DViewport';

interface ExhibitDetailViewProps {
  exhibit: Exhibit;
  onBackToGallery: () => void;
  onOpenExhibit: (id: string) => void;
  onCompareWith: (id: string) => void;
}

export function ExhibitDetailView({
  exhibit,
  onBackToGallery,
  onOpenExhibit,
  onCompareWith,
}: ExhibitDetailViewProps) {
  const currentIndex = EXHIBITS.findIndex((e) => e.id === exhibit.id);
  const prevExhibit = EXHIBITS[(currentIndex - 1 + EXHIBITS.length) % EXHIBITS.length];
  const nextExhibit = EXHIBITS[(currentIndex + 1) % EXHIBITS.length];

  return (
    <article className="mx-auto max-w-[1380px] px-5 py-8 lg:px-8 lg:py-12">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <button
          type="button"
          onClick={onBackToGallery}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#A1AAB8] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Exhibit Gallery</span>
        </button>

        <button
          type="button"
          onClick={() => onCompareWith(exhibit.id)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#141923] px-3.5 py-2 text-xs font-medium text-[#F3F4F6] hover:border-[#D4A359]/60 transition-colors whitespace-nowrap cursor-pointer"
        >
          <GitCompare className="h-3.5 w-3.5 text-[#D4A359]" />
          <span>Compare This Artifact</span>
        </button>
      </div>

      {/* Accession Header */}
      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#A1AAB8]">
          <span className="font-mono-tech text-[#D4A359]">{exhibit.accessionNumber}</span>
          <span aria-hidden="true">·</span>
          <span>{exhibit.targetBodyLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tech">{exhibit.operationalPeriod}</span>
          <span aria-hidden="true">·</span>
          <span>{exhibit.dispositionLabel}</span>
        </div>

        <h1 className="font-display headline-balance mt-3 text-3xl font-semibold text-white sm:text-5xl">
          {exhibit.officialName}
        </h1>
        <p className="mt-2 text-base font-medium text-[#CBD5E1]">{exhibit.mission}</p>
      </header>

      {/* Primary Split: 3D Hardware Viewport + Accession Specifications */}
      <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <Exhibit3DViewport exhibit={exhibit} />

          {/* Hotspot Directory & NASA 3D Model Provenance Bar */}
          <div className="rounded-xl border border-white/10 bg-[#141923] p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#D4A359]">
                  Official NASA 3D Asset Reference
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {exhibit.nasa3dAsset.assetName}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-[#A1AAB8]">
                  <span>{exhibit.nasa3dAsset.availabilityLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tech">{exhibit.nasa3dAsset.format}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tech">{exhibit.nasa3dAsset.fileSize}</span>
                </div>
                <p className="mt-2 text-xs text-[#9CA3AF]">{exhibit.nasa3dAsset.technicalNotes}</p>
              </div>

              <a
                href={exhibit.nasa3dAsset.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#0F131C] px-3 py-2 text-xs font-medium text-[#F9E7C4] hover:border-[#D4A359] transition-colors whitespace-nowrap shrink-0"
              >
                <span>NASA 3D Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Mobile-friendly hotspot list */}
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="text-xs font-semibold text-[#CBD5E1]">
                Annotated Components ({exhibit.hotspots.length})
              </div>
              <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {exhibit.hotspots.map((h, i) => (
                  <div
                    key={h.id}
                    className="rounded-lg border border-white/10 bg-[#0F131C] p-3 text-xs"
                  >
                    <div className="font-semibold text-[#F9E7C4]">
                      0{i + 1}. {h.label}
                    </div>
                    <p className="mt-1 leading-relaxed text-[#A1AAB8]">{h.annotation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Accession Metadata, Key Dates & Technical Specs */}
        <aside className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-xl border border-white/10 bg-[#141923] p-6">
            <h2 className="font-display text-2xl font-semibold text-white">
              Technical Specifications
            </h2>
            <p className="mt-1 text-xs text-[#A1AAB8]">
              Mass values explicitly distinguish operational phase per museum verification standards.
            </p>

            <dl className="mt-5 divide-y divide-white/10 text-sm">
              {exhibit.specifications.map((spec) => (
                <div key={spec.label} className="py-3">
                  <dt className="text-xs uppercase tracking-wider text-[#9CA3AF]">{spec.label}</dt>
                  <dd className="font-mono-tech mt-1 text-sm text-white">{spec.value}</dd>
                  {spec.phaseNote && (
                    <dd className="mt-0.5 text-[11px] text-[#6F7888]">{spec.phaseNote}</dd>
                  )}
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#141923] p-6">
            <h2 className="font-display text-2xl font-semibold text-white">Key Mission Dates</h2>
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
      </section>

      {/* Editorial Narrative & Coordinates */}
      <section className="mt-12 grid grid-cols-1 gap-10 border-t border-white/10 pt-10 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-7">
          <div className="max-w-[68ch]">
            <h2 className="font-display text-3xl font-semibold text-white">
              Historical Background & Original Purpose
            </h2>
            <p className="mt-4 text-[15px] leading-[1.75] text-[#CBD5E1]">
              {exhibit.historicalBackground}
            </p>
            <p className="mt-4 text-[15px] leading-[1.75] text-[#E5E7EB]">
              <strong className="font-semibold text-white">Original Purpose: </strong>
              {exhibit.originalPurpose}
            </p>
          </div>

          <div className="max-w-[68ch]">
            <h2 className="font-display text-3xl font-semibold text-white">
              Scientific Achievements
            </h2>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#CBD5E1]">
              {exhibit.achievements.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4A359] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-[68ch] rounded-xl border border-white/10 bg-[#141923] p-6">
            <h2 className="font-display text-2xl font-semibold text-white">
              Why It Was Left Behind & Current Status
            </h2>
            <p className="mt-3 text-sm leading-[1.75] text-[#CBD5E1]">
              <strong className="text-[#F9E7C4]">Cause of Decommissioning: </strong>
              {exhibit.abandonmentReason}
            </p>
            <p className="mt-3 text-sm leading-[1.75] text-[#CBD5E1]">
              <strong className="text-white">Current Status: </strong>
              {exhibit.currentStatus}
            </p>
          </div>

          {exhibit.verificationNote && (
            <div className="max-w-[68ch] rounded-xl border border-[#D4A359]/35 bg-[#141923] p-5">
              <div className="font-mono-tech text-xs uppercase tracking-wider text-[#D4A359]">
                Factual Verification Note
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#E5E7EB]">
                {exhibit.verificationNote}
              </p>
            </div>
          )}

          {/* Individual Exhibit Timeline */}
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">Mission Timeline</h2>
            <div className="mt-6 space-y-5 border-l border-white/15 pl-6">
              {exhibit.timeline.map((ev) => (
                <div key={`${ev.date}-${ev.title}`} className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border border-[#D4A359] bg-[#090B10]" />
                  <div className="font-mono-tech text-xs text-[#D4A359]">{ev.date}</div>
                  <h3 className="mt-1 text-base font-semibold text-white">{ev.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#A1AAB8]">{ev.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Margin Column: Coordinates + Curatorial Visual Study & NASA Attribution */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-xl border border-white/10 bg-[#141923] p-6">
            <h2 className="font-display text-2xl font-semibold text-white">
              Landing & Deployment Locations
            </h2>
            <div className="mt-4 divide-y divide-white/10">
              {exhibit.locations.map((loc) => (
                <div key={loc.siteName} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-2">
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

          <figure className="overflow-hidden rounded-xl border border-white/10 bg-[#141923]">
            <img
              src={exhibit.visualImage}
              alt={`${exhibit.shortTitle} — ${exhibit.visualStudyLabel}`}
              referrerPolicy="no-referrer"
              className="h-56 w-full object-cover"
            />
            <figcaption className="p-5">
              <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
                {exhibit.visualStudyLabel}
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                Official NASA Photographic Reference
              </div>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-[#9CA3AF]">Asset ID</dt>
                  <dd className="font-mono-tech text-[#E5E7EB] text-right">
                    {exhibit.nasaImage.assetId}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[#9CA3AF]">Credit</dt>
                  <dd className="text-[#E5E7EB] text-right">{exhibit.nasaImage.attribution}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-[#A1AAB8]">
                {exhibit.nasaImage.description}
              </p>
              <a
                href={exhibit.nasaImage.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#D4A359] hover:underline"
              >
                <span>Explore {exhibit.nasaImage.portalName}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Sequential Museum Tour Footer */}
      <nav
        aria-label="Previous and Next Exhibits"
        className="mt-14 grid grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={() => onOpenExhibit(prevExhibit.id)}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-[#141923] p-5 text-left hover:border-[#D4A359]/60 transition-colors cursor-pointer"
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
          className="flex items-center justify-between rounded-xl border border-white/10 bg-[#141923] p-5 text-left hover:border-[#D4A359]/60 transition-colors cursor-pointer"
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
