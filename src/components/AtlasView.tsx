import { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { EXHIBITS, REALM_INTRODUCTIONS, type TargetBody } from '../data/exhibits';
import type { GlobePin } from '../three/PlanetaryGlobeCanvas';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';

const LazyPlanetaryGlobeCanvas = lazy(() =>
  import('../three/PlanetaryGlobeCanvas').then((m) => ({ default: m.PlanetaryGlobeCanvas }))
);

interface AtlasViewProps {
  initialRealm: TargetBody;
  onOpenExhibit: (exhibitId: string) => void;
}

export function AtlasView({ initialRealm, onOpenExhibit }: AtlasViewProps) {
  const [realm, setRealm] = useState<TargetBody>(initialRealm);

  const pins = useMemo<GlobePin[]>(() => {
    const list: GlobePin[] = [];
    for (const ex of EXHIBITS) {
      if (ex.targetBody !== realm) continue;
      ex.locations.forEach((loc, idx) => {
        list.push({
          id: `${ex.id}-${idx}`,
          exhibitId: ex.id,
          label: loc.siteName,
          sublabel: `${ex.shortTitle} · ${loc.region}`,
          coordinateText: loc.coordinateText,
          lat: loc.lat,
          lon: loc.lon,
        });
      });
    }
    return list;
  }, [realm]);

  const [selectedPinId, setSelectedPinId] = useState<string | null>(pins[0]?.id ?? null);

  const activePin = useMemo(
    () => pins.find((p) => p.id === selectedPinId) ?? pins[0] ?? null,
    [pins, selectedPinId]
  );
  const activeExhibit = useMemo(
    () => EXHIBITS.find((e) => e.id === activePin?.exhibitId) ?? null,
    [activePin]
  );

  const realmInfo = REALM_INTRODUCTIONS[realm];

  const handleRealmChange = (next: TargetBody) => {
    setRealm(next);
    const firstExhibit = EXHIBITS.find((e) => e.targetBody === next);
    setSelectedPinId(firstExhibit ? `${firstExhibit.id}-0` : null);
  };

  return (
    <section className="mx-auto max-w-[1380px] px-5 py-10 lg:px-8 lg:py-12">
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
        <div>
          <div className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D4A359]">
            Interactive 3D Planetary &amp; Orbital Atlas ·{' '}
            {realm === 'deep-space' ? 'Secondary Wing' : 'Primary Surface Collection'}
          </div>
          <h1 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-5xl">
            {realmInfo.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">{realmInfo.intro}</p>
        </div>

        {/* Realm Selector Tabs */}
        <div
          role="group"
          aria-label="Select Celestial Realm"
          className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-[#141923] p-1.5 shrink-0"
        >
          {(['moon', 'mars', 'deep-space'] as TargetBody[]).map((r) => {
            const active = realm === r;
            const label =
              r === 'moon' ? 'The Moon (Primary)' : r === 'mars' ? 'Mars (Primary)' : 'Deep Space';
            return (
              <button
                key={r}
                type="button"
                aria-pressed={active}
                onClick={() => handleRealmChange(r)}
                className={`min-h-[40px] rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#D4A359] text-[#090B10]'
                    : 'text-[#CBD5E1] hover:bg-white/5 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Globe + Site Directory Split */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="h-[460px] lg:col-span-7 lg:h-[600px]">
          <CanvasErrorBoundary
            fallbackTitle="3D Planetary Globe Paused"
            fallbackDetail="WebGL is unavailable on this browser session. Select any landing coordinate in the Documented Sites directory on the right to open its 7-chapter exhibit monograph."
          >
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-[#07090e] p-6 text-center">
                  <div>
                    <div className="font-mono-tech text-xs uppercase tracking-wider text-[#D4A359]">
                      Loading 3D Planetary Globe
                    </div>
                    <p className="mt-2 text-sm text-[#A1AAB8]">
                      Preparing surface coordinate pins for {realmInfo.title}…
                    </p>
                  </div>
                </div>
              }
            >
              <LazyPlanetaryGlobeCanvas
                realm={realm}
                pins={pins}
                selectedPinId={activePin?.id ?? null}
                onSelectPin={(pin) => setSelectedPinId(pin.id)}
              />
            </Suspense>
          </CanvasErrorBoundary>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-5">
          {/* Active Landing Site Inspector Card */}
          {activePin && activeExhibit && (
            <div className="rounded-xl border border-[#D4A359]/40 bg-[#141923] p-6">
              <div className="flex items-center justify-between gap-2 text-xs text-[#D4A359]">
                <span className="font-mono-tech uppercase tracking-wider">Selected Site</span>
                <span className="font-mono-tech text-[#A1AAB8]">
                  {activeExhibit.accessionNumber}
                </span>
              </div>
              <h2 className="font-display mt-2 text-2xl font-semibold text-white">
                {activePin.label}
              </h2>
              <div className="mt-1 text-sm font-medium text-[#CBD5E1]">{activePin.sublabel}</div>
              <div className="mt-3 flex items-center gap-2 font-mono-tech text-xs text-[#F9E7C4]">
                <MapPin className="h-3.5 w-3.5 text-[#D4A359] shrink-0" />
                <span>{activePin.coordinateText}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#A1AAB8]">
                {activeExhibit.cardSnippet}
              </p>
              {activeExhibit.verificationNote && (
                <p className="mt-2 text-xs italic text-[#9CA3AF]">
                  {activeExhibit.verificationNote}
                </p>
              )}
              <button
                type="button"
                onClick={() => onOpenExhibit(activeExhibit.id)}
                className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#D4A359] px-4 py-2.5 text-xs font-semibold text-[#090B10] hover:bg-[#e0b46f] transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Open 7-Chapter Exhibit Story</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Complete Site Coordinate Manifest for Selected Realm */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0F131C]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#CBD5E1]">
                Documented Sites ({pins.length})
              </span>
              <span className="font-mono-tech text-[11px] text-[#6F7888]">
                Select to focus 3D pin
              </span>
            </div>
            <div className="max-h-[300px] divide-y divide-white/10 overflow-y-auto">
              {pins.map((pin) => {
                const isSelected = pin.id === activePin?.id;
                return (
                  <div
                    key={pin.id}
                    className={`flex items-start justify-between gap-3 px-4 py-3 transition-colors ${
                      isSelected ? 'bg-[#141923]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedPinId(pin.id)}
                      className="min-w-0 flex-1 text-left cursor-pointer py-1"
                    >
                      <div
                        className={`text-sm font-medium ${
                          isSelected ? 'text-[#F9E7C4]' : 'text-white'
                        }`}
                      >
                        {pin.label}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-[#A1AAB8]">{pin.sublabel}</div>
                      <div className="mt-1 font-mono-tech text-[11px] text-[#9CA3AF]">
                        {pin.coordinateText}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenExhibit(pin.exhibitId)}
                      className="min-h-[40px] shrink-0 rounded-md px-2.5 text-xs font-medium text-[#D4A359] hover:bg-white/5 hover:underline cursor-pointer"
                    >
                      Inspect →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
