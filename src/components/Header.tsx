import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type RouteView =
  | 'home'
  | 'atlas'
  | 'gallery'
  | 'exhibit'
  | 'compare'
  | 'timeline'
  | 'sources';

interface HeaderProps {
  currentView: RouteView;
  onNavigate: (view: RouteView, exhibitId?: string) => void;
}

const NAV_ITEMS: { id: RouteView; label: string }[] = [
  { id: 'atlas', label: 'Planetary Atlas' },
  { id: 'gallery', label: 'Exhibits' },
  { id: 'compare', label: 'Compare' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'sources', label: 'Sources' },
];

export function Header({ currentView, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (view: RouteView) => {
    setMobileOpen(false);
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090B10]/95">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-8 px-5 py-4 lg:px-8">
        {/* Zone 1: Single-element Brand wordmark */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            go('home');
          }}
          className="font-display text-xl font-semibold tracking-tight text-[#F3F4F6] hover:text-[#D4A359] transition-colors whitespace-nowrap shrink-0"
        >
          Abandoned but not Forgotten
        </a>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary Museum Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A1AAB8]"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              currentView === item.id || (item.id === 'gallery' && currentView === 'exhibit');
            return (
              <a
                key={item.id}
                href={`#/${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.id);
                }}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                  active ? 'text-[#F9E7C4]' : 'hover:text-white'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-[17px] h-[2px] bg-[#D4A359]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => go('gallery')}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#D4A359] px-4 py-2 text-xs font-semibold text-[#090B10] hover:bg-[#e0b46f] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Explore Museum
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-[#141923] text-white md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0F131C] px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#141923] text-[#F9E7C4]'
                      : 'text-[#CBD5E1] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => go('gallery')}
              className="mt-2 w-full rounded-lg bg-[#D4A359] px-4 py-2.5 text-center text-sm font-semibold text-[#090B10]"
            >
              Explore Museum
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
