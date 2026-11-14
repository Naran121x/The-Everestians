import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  EXHIBITS,
  VERIFICATION_NOTES,
  type TargetBody,
} from '../data/exhibits';

interface TimelineViewProps {
  onOpenExhibit: (id: string) => void;
}

export function TimelineView({ onOpenExhibit }: TimelineViewProps) {
  const [realmFilter, setRealmFilter] = useState<TargetBody | 'all'>('all');

  const events = useMemo(() => {
    const list = EXHIBITS.flatMap((ex) =>
      ex.timeline.map((item) => ({
        ...item,
        exhibitId: ex.id,
        exhibitName: ex.shortTitle,
        targetBody: ex.targetBody,
        targetBodyLabel: ex.targetBodyLabel,
      }))
    );
    return list
      .filter((ev) => realmFilter === 'all' || ev.targetBody === realmFilter)
      .sort((a, b) => a.sortYear - b.sortYear);
  }, [realmFilter]);

  return (
    <section className="mx-auto max-w-[1380px] px-5 py-10 lg:px-8 lg:py-12">
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
        <div>
          <div className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D4A359]">
            1966 – 2024 & Ongoing · Chronological Archive
          </div>
          <h1 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-5xl">
            Master Mission Timeline & Field Notes
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#A1AAB8]">
            Trace nearly six decades of planetary exploration—from Surveyor 1’s robotic lunar
            touchdown in 1966 to Ingenuity’s 72nd Martian flight in 2024 and ongoing Earth-to-Moon
            laser ranging.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#141923] p-1 shrink-0">
          {(
            [
              { id: 'all', label: 'All Realms' },
              { id: 'moon', label: 'The Moon' },
              { id: 'mars', label: 'Mars' },
              { id: 'deep-space', label: 'Deep Space' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRealmFilter(tab.id)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                realmFilter === tab.id
                  ? 'bg-[#D4A359] text-[#090B10] font-semibold'
                  : 'text-[#CBD5E1] hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Chronological Timeline Rail */}
        <div className="lg:col-span-8">
          <div className="space-y-6 border-l border-white/15 pl-6">
            {events.map((ev, i) => (
              <div
                key={`${ev.exhibitId}-${ev.date}-${i}`}
                className="relative rounded-xl border border-white/10 bg-[#141923] p-5"
              >
                <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full border-2 border-[#D4A359] bg-[#090B10]" />
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono-tech font-medium text-[#D4A359]">{ev.date}</span>
                    <span aria-hidden="true" className="text-[#6F7888]">
                      ·
                    </span>
                    <span className="text-[#A1AAB8]">{ev.targetBodyLabel}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenExhibit(ev.exhibitId)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#F9E7C4] hover:text-[#D4A359] cursor-pointer"
                  >
                    <span>{ev.exhibitName}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <h2 className="font-display mt-2 text-xl font-semibold text-white">{ev.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#CBD5E1]">{ev.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Scientific Context Sidebar */}
        <aside className="space-y-6 lg:col-span-4">
          <div className="rounded-xl border border-white/10 bg-[#141923] p-6">
            <div className="font-mono-tech text-xs uppercase tracking-wider text-[#D4A359]">
              Educational Context
            </div>
            <h2 className="font-display mt-2 text-2xl font-semibold text-white">
              Scientific & Engineering Lessons
            </h2>
            <div className="mt-5 space-y-5 text-sm leading-relaxed text-[#CBD5E1]">
              <div>
                <h3 className="font-semibold text-white">Passive Retroreflector Physics</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#A1AAB8]">
                  Apollo 11, 14, and 15 fused-silica corner-cube prisms—alongside Lunokhod 1’s
                  French array—reflect Earth-directed laser pulses straight back to their origin
                  with zero electrical power, revealing the Moon recedes by 3.8 cm/year.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <h3 className="font-semibold text-white">Solar Dust vs. Radioisotope Power</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#A1AAB8]">
                  Martian dust storms starved Opportunity and progressively choked InSight’s
                  UltraFlex arrays, whereas SNAP-19 and SNAP-27 Plutonium-238 RTGs powered Viking
                  and ALSEP stations continuously through dust and lunar nights.
                </p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <h3 className="font-semibold text-white">Polar Winter CO2 Ice Loading</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#A1AAB8]">
                  At 68.15° N, Phoenix Lander’s solar wings were designed for a brief summer window
                  before seasonal darkness condensed atmospheric carbon dioxide into heavy dry ice
                  that crushed its arrays.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0F131C] p-6">
            <div className="font-mono-tech text-xs uppercase tracking-wider text-[#D4A359]">
              Data Integrity & Verification
            </div>
            <div className="mt-4 space-y-4">
              {VERIFICATION_NOTES.map((note) => (
                <div key={note.title} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-white">{note.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#A1AAB8]">{note.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
