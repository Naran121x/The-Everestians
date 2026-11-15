import { useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import {
  DISPOSITION_TAXONOMY,
  EXHIBITS,
  type DispositionCategory,
  type TargetBody,
} from '../data/exhibits';

interface GalleryViewProps {
  initialRealmFilter: TargetBody | 'all';
  onOpenExhibit: (exhibitId: string) => void;
}

export function GalleryView({ initialRealmFilter, onOpenExhibit }: GalleryViewProps) {
  const [query, setQuery] = useState('');
  const [realmFilter, setRealmFilter] = useState<TargetBody | 'all'>(initialRealmFilter);
  const [dispositionFilter, setDispositionFilter] = useState<DispositionCategory | 'all'>('all');
  const [assetFilter, setAssetFilter] = useState<'all' | 'verified-glb'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXHIBITS.filter((ex) => {
      if (realmFilter !== 'all' && ex.targetBody !== realmFilter) return false;
      if (dispositionFilter !== 'all' && ex.dispositionCategory !== dispositionFilter) return false;
      if (assetFilter === 'verified-glb' && ex.nasa3dAsset.availabilityStatus !== 'verified-glb') {
        return false;
      }
      if (!q) return true;
      const haystack = [
        ex.officialName,
        ex.shortTitle,
        ex.mission,
        ex.cardSnippet,
        ex.targetBodyLabel,
        ex.dispositionLabel,
        ...ex.locations.map((l) => `${l.siteName} ${l.region}`),
        ...ex.achievements,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, realmFilter, dispositionFilter, assetFilter]);

  const resetFilters = () => {
    setQuery('');
    setRealmFilter('all');
    setDispositionFilter('all');
    setAssetFilter('all');
  };

  return (
    <section className="mx-auto max-w-[1380px] px-5 py-10 lg:px-8 lg:py-12">
      <div className="border-b border-white/10 pb-8">
        <div className="text-xs font-mono-tech uppercase tracking-[0.16em] text-[#D4A359]">
          Complete Master Inventory · {EXHIBITS.length} Exhibits
        </div>
        <h1 className="font-display headline-balance mt-2 text-3xl font-semibold text-white sm:text-5xl">
          Interactive Exhibit Gallery
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#A1AAB8]">
          Explore all 12 lunar and Martian monuments in our primary surface collections plus 4
          deep-space &amp; small-body relics in our secondary wing. Open any exhibit to experience
          its 7-chapter story, 3D hardware inspector, and verified NASA sources.
        </p>

        {/* Search & Filter Controls */}
        <div className="mt-7 flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F7888]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search exhibits, missions, craters, or instruments..."
                aria-label="Search museum exhibits"
                className="min-h-[44px] w-full rounded-lg border border-white/15 bg-[#141923] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-[#6F7888] focus:border-[#D4A359] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-[#A1AAB8] hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Target Body Segmented Filter */}
            <div
              role="group"
              aria-label="Filter by Planetary Realm"
              className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#141923] p-1"
            >
              {(
                [
                  { id: 'all', label: 'All (16)' },
                  { id: 'moon', label: 'The Moon (5)' },
                  { id: 'mars', label: 'Mars (7)' },
                  { id: 'deep-space', label: 'Deep Space Wing (4)' },
                ] as const
              ).map((tab) => {
                const active = realmFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setRealmFilter(tab.id)}
                    className={`min-h-[38px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-[#D4A359] text-[#090B10] font-semibold'
                        : 'text-[#CBD5E1] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filter Row: Disposition & 3D Asset Status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-[#A1AAB8]">
                <span>Disposition:</span>
                <select
                  value={dispositionFilter}
                  onChange={(e) =>
                    setDispositionFilter(e.target.value as DispositionCategory | 'all')
                  }
                  className="min-h-[40px] rounded-lg border border-white/15 bg-[#141923] px-3 py-1.5 text-xs text-white focus:border-[#D4A359] focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {DISPOSITION_TAXONOMY.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.shortLabel}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                aria-pressed={assetFilter === 'verified-glb'}
                onClick={() =>
                  setAssetFilter((prev) => (prev === 'all' ? 'verified-glb' : 'all'))
                }
                className={`min-h-[40px] rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  assetFilter === 'verified-glb'
                    ? 'border-[#D4A359] bg-[#D4A359]/15 text-[#F9E7C4]'
                    : 'border-white/15 bg-[#141923] text-[#CBD5E1] hover:border-white/30'
                }`}
              >
                Verified NASA GLB Assets Only
              </button>
            </div>

            <div className="font-mono-tech text-xs text-[#A1AAB8]">
              Showing {filtered.length} of {EXHIBITS.length} exhibits
            </div>
          </div>
        </div>
      </div>

      {/* Exhibit Cards Grid */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-xl border border-white/10 bg-[#141923] p-10 text-center">
          <p className="font-display text-2xl text-white">No matching exhibits found</p>
          <p className="mt-2 text-sm text-[#A1AAB8]">
            Adjust your search keywords or clear the active category filters to inspect all 16
            monuments.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-lg bg-[#D4A359] px-4 py-2 text-xs font-semibold text-[#090B10] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => onOpenExhibit(ex.id)}
              className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#141923] text-left hover:border-[#D4A359]/60 transition-colors cursor-pointer"
            >
              <div className="relative h-52 w-full overflow-hidden bg-[#090B10]">
                <img
                  src={ex.visualImage}
                  alt={ex.shortTitle}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src !== ex.fallbackVisualImage) {
                      e.currentTarget.src = ex.fallbackVisualImage;
                    }
                  }}
                  className={`h-full w-full object-cover ${ex.imagePosition} transition-transform duration-300 group-hover:scale-[1.03]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141923] via-[#141923]/25 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                {/* Clean unboxed typographic metadata (Zero-Pill Discipline) */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A1AAB8]">
                  <span className="font-medium text-[#D4A359]">{ex.targetBodyLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tech">{ex.operationalPeriod}</span>
                  <span aria-hidden="true">·</span>
                  <span>{ex.dispositionShort}</span>
                </div>

                <h2 className="font-display mt-2 text-2xl font-semibold text-white group-hover:text-[#F9E7C4]">
                  {ex.shortTitle}
                </h2>
                <div className="mt-0.5 text-xs text-[#6F7888]">{ex.mission}</div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#CBD5E1]">
                  {ex.cardSnippet}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                  <span className="font-mono-tech text-[#9CA3AF]">
                    {ex.nasa3dAsset.availabilityLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#D4A359]">
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
