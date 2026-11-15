import { ExternalLink } from 'lucide-react';
import {
  EXHIBITS,
  IMAGE_ATTRIBUTION_DIRECTORY,
  MODEL_3D_DIRECTORY,
  OFFICIAL_NASA_SOURCES,
  VERIFICATION_NOTES,
} from '../data/exhibits';

interface SourcesViewProps {
  onOpenExhibit: (id: string) => void;
}

export function SourcesView({ onOpenExhibit }: SourcesViewProps) {
  const findExhibitTitle = (id: string) =>
    EXHIBITS.find((e) => e.id === id)?.shortTitle ?? id;

  return (
    <section className="mx-auto max-w-[1380px] px-5 py-10 lg:px-8 lg:py-12">
      <div className="border-b border-white/10 pb-8">
        <div className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D4A359]">
          Provenance & Attribution Archive
        </div>
        <h1 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-5xl">
          Sources, Credits & 3D Asset Directory
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#A1AAB8]">
          All factual records, coordinates, mission dates, and NASA asset identifiers are drawn
          directly from the NASA Space Apps Challenge 2026 Development Reference Document prepared
          by Project Team The Everestians.
        </p>
      </div>

      {/* 6 Official NASA/JPL Portals */}
      <div className="mt-10">
        <h2 className="font-display text-3xl font-semibold text-white">
          01. Official NASA & JPL Source Directory
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {OFFICIAL_NASA_SOURCES.map((src) => (
            <a
              key={src.name}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#141923] p-5 hover:border-[#D4A359]/60 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-white group-hover:text-[#F9E7C4]">
                    {src.name}
                  </h3>
                  <ExternalLink className="h-4 w-4 text-[#D4A359] shrink-0" />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#A1AAB8]">{src.description}</p>
              </div>
              <div className="font-mono-tech mt-4 truncate text-[11px] text-[#6F7888]">
                {src.url}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* NASA Image & Attribution Table */}
      <div className="mt-14">
        <h2 className="font-display text-3xl font-semibold text-white">
          02. NASA Image &amp; Attribution Audit Directory
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#A1AAB8]">
          Every exhibit card and detail view displays a dedicated, verified NASA Image and Video
          Library or JPL Photojournal record depicting that specific spacecraft or artifact, with
          offline fallback to curatorial visual studies if external media cannot be reached. Official
          NASA catalog identifiers and attribution credits for all 16 exhibits are documented below.
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-[#141923]">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-white/10 bg-[#0F131C] text-xs uppercase tracking-wider text-[#9CA3AF]">
              <tr>
                <th className="px-5 py-3.5">Exhibit</th>
                <th className="px-5 py-3.5">Image Description &amp; Audit Status</th>
                <th className="px-5 py-3.5">NASA Asset ID / Source</th>
                <th className="px-5 py-3.5">Attribution Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {IMAGE_ATTRIBUTION_DIRECTORY.map((row) => (
                <tr key={row.exhibitId} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => onOpenExhibit(row.exhibitId)}
                      className="min-h-[36px] font-medium text-[#F9E7C4] hover:text-[#D4A359] hover:underline text-left cursor-pointer"
                    >
                      {findExhibitTitle(row.exhibitId)}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-xs leading-relaxed text-[#CBD5E1]">
                    {row.description}
                  </td>
                  <td className="font-mono-tech px-5 py-3.5 text-xs text-[#D4A359]">
                    {row.assetId}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#A1AAB8]">{row.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Downloadable 3D Model Directory */}
      <div className="mt-14">
        <h2 className="font-display text-3xl font-semibold text-white">
          03. NASA Downloadable 3D Model Directory
        </h2>
        <p className="mt-2 text-sm text-[#A1AAB8]">
          Official NASA GLB/STL assets documented for local loading inside the 3D Hardware Inspector
          (via the &ldquo;Load Local .GLB / .STL&rdquo; button or by placing files in{' '}
          <span className="font-mono-tech text-[#CBD5E1]">public/models/</span>).
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-[#141923]">
          <table className="w-full min-w-[740px] text-left text-sm">
            <thead className="border-b border-white/10 bg-[#0F131C] text-xs uppercase tracking-wider text-[#9CA3AF]">
              <tr>
                <th className="px-5 py-3.5">Exhibit</th>
                <th className="px-5 py-3.5">3D Asset Name</th>
                <th className="px-5 py-3.5">Format</th>
                <th className="px-5 py-3.5">File Size</th>
                <th className="px-5 py-3.5">Download Location</th>
                <th className="px-5 py-3.5">Technical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {MODEL_3D_DIRECTORY.map((m) => (
                <tr key={m.exhibitId} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => onOpenExhibit(m.exhibitId)}
                      className="font-medium text-[#F9E7C4] hover:text-[#D4A359] hover:underline text-left cursor-pointer"
                    >
                      {findExhibitTitle(m.exhibitId)}
                    </button>
                  </td>
                  <td className="font-mono-tech px-5 py-3.5 text-xs text-[#D4A359]">
                    {m.assetName}
                  </td>
                  <td className="font-mono-tech px-5 py-3.5 text-xs text-[#CBD5E1]">{m.format}</td>
                  <td className="font-mono-tech px-5 py-3.5 text-xs text-[#CBD5E1]">
                    {m.fileSize}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#A1AAB8]">{m.location}</td>
                  <td className="px-5 py-3.5 text-xs text-[#A1AAB8]">{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification & Transparency Notes */}
      <div className="mt-14 rounded-xl border border-white/10 bg-[#0F131C] p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-white">
          04. Missing Information, Planetary Maps &amp; Verification Notes
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VERIFICATION_NOTES.map((note) => (
            <div key={note.title}>
              <h3 className="text-sm font-semibold text-[#F9E7C4]">{note.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#A1AAB8]">{note.detail}</p>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold text-[#F9E7C4]">3D Planetary Atlas Map Sources</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#A1AAB8]">
              Lunar globe imagery and topography use NASA&rsquo;s{' '}
              <a
                href="https://svs.gsfc.nasa.gov/4720"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4A359] underline"
              >
                CGI Moon Kit (SVS #4720)
              </a>{' '}
              LROC color and LOLA elevation datasets (Public Domain). Mars globe imagery uses
              NASA Viking / USGS derived global mosaic via{' '}
              <a
                href="https://www.solarsystemscope.com/textures/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4A359] underline"
              >
                Solar System Scope
              </a>{' '}
              (CC BY 4.0).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
