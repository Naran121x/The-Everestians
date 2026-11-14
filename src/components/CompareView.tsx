import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { EXHIBITS } from '../data/exhibits';

interface CompareViewProps {
  initialLeftId?: string;
  onOpenExhibit: (id: string) => void;
}

export function CompareView({ initialLeftId, onOpenExhibit }: CompareViewProps) {
  const [leftId, setLeftId] = useState(initialLeftId || 'apollo-lm');
  const [rightId, setRightId] = useState(
    initialLeftId === 'opportunity-rover' ? 'insight-lander' : 'opportunity-rover'
  );

  const left = EXHIBITS.find((e) => e.id === leftId) ?? EXHIBITS[0];
  const right = EXHIBITS.find((e) => e.id === rightId) ?? EXHIBITS[1];

  const rows: Array<{
    label: string;
    leftVal: string;
    rightVal: string;
    mono?: boolean;
  }> = [
    { label: 'Target Body / Realm', leftVal: left.targetBodyLabel, rightVal: right.targetBodyLabel },
    { label: 'Program / Mission', leftVal: left.mission, rightVal: right.mission },
    {
      label: 'Operational Period',
      leftVal: left.operationalPeriod,
      rightVal: right.operationalPeriod,
      mono: true,
    },
    {
      label: 'Disposition Tier',
      leftVal: left.dispositionLabel,
      rightVal: right.dispositionLabel,
    },
    {
      label: 'Mass (Phase-Specified)',
      leftVal: left.comparison.massSummary,
      rightVal: right.comparison.massSummary,
      mono: true,
    },
    {
      label: 'Dimensions / Span',
      leftVal: left.comparison.dimensionsSummary,
      rightVal: right.comparison.dimensionsSummary,
      mono: true,
    },
    {
      label: 'Power Architecture',
      leftVal: left.comparison.powerSource,
      rightVal: right.comparison.powerSource,
    },
    {
      label: 'Surface / Orbital Distance',
      leftVal: left.comparison.distanceTraveled,
      rightVal: right.comparison.distanceTraveled,
      mono: true,
    },
    {
      label: 'Lifespan vs. Plan',
      leftVal: left.comparison.lifespanSummary,
      rightVal: right.comparison.lifespanSummary,
      mono: true,
    },
    {
      label: 'Why Left Behind / Decommissioned',
      leftVal: left.abandonmentReason,
      rightVal: right.abandonmentReason,
    },
    {
      label: 'NASA 3D Resource',
      leftVal: `${left.nasa3dAsset.assetName} (${left.nasa3dAsset.availabilityLabel})`,
      rightVal: `${right.nasa3dAsset.assetName} (${right.nasa3dAsset.availabilityLabel})`,
    },
  ];

  return (
    <section className="mx-auto max-w-[1380px] px-5 py-10 lg:px-8 lg:py-12">
      <div className="border-b border-white/10 pb-8">
        <div className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D4A359]">
          Engineering & Mission Comparator
        </div>
        <h1 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-5xl">
          Side-by-Side Artifact Comparison
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#A1AAB8]">
          Select any two exhibits from the 16-artifact archive to compare mass phases, power
          systems, operational endurance, and the environmental or mechanical causes that ended
          their missions.
        </p>
      </div>

      {/* Selector Pair */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          { label: 'Artifact A', value: left.id, onChange: setLeftId, exhibit: left },
          { label: 'Artifact B', value: right.id, onChange: setRightId, exhibit: right },
        ].map((slot) => (
          <div
            key={slot.label}
            className="rounded-xl border border-white/10 bg-[#141923] p-5 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-4">
              <label className="text-xs font-mono-tech uppercase tracking-wider text-[#D4A359]">
                {slot.label}
              </label>
              <button
                type="button"
                onClick={() => onOpenExhibit(slot.exhibit.id)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#CBD5E1] hover:text-[#D4A359] cursor-pointer"
              >
                <span>Open Monograph</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <select
              value={slot.value}
              onChange={(e) => slot.onChange(e.target.value)}
              aria-label={`Select ${slot.label}`}
              className="w-full rounded-lg border border-white/15 bg-[#0F131C] px-3.5 py-2.5 text-sm font-medium text-white focus:border-[#D4A359] focus:outline-none"
            >
              {EXHIBITS.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.shortTitle} ({ex.targetBodyLabel})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-4">
              <img
                src={slot.exhibit.visualImage}
                alt={slot.exhibit.shortTitle}
                referrerPolicy="no-referrer"
                className="h-16 w-24 rounded-lg object-cover border border-white/10 shrink-0"
              />
              <div>
                <div className="font-display text-xl font-semibold text-white">
                  {slot.exhibit.shortTitle}
                </div>
                <div className="mt-0.5 text-xs text-[#A1AAB8]">{slot.exhibit.mission}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Matrix */}
      <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#141923]">
        <div className="divide-y divide-white/10">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-12 md:gap-6"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] md:col-span-3">
                {row.label}
              </div>
              <div
                className={`text-sm leading-relaxed text-white md:col-span-4 ${
                  row.mono ? 'font-mono-tech text-[13px]' : ''
                }`}
              >
                {row.leftVal}
              </div>
              <div
                className={`text-sm leading-relaxed text-white md:col-span-5 md:border-l md:border-white/10 md:pl-6 ${
                  row.mono ? 'font-mono-tech text-[13px]' : ''
                }`}
              >
                {row.rightVal}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
