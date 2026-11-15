/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { EXHIBITS, type TargetBody } from './data/exhibits';
import { Header, type RouteView } from './components/Header';
import { LandingView } from './components/LandingView';
import { AtlasView } from './components/AtlasView';
import { GalleryView } from './components/GalleryView';
import { ExhibitDetailView } from './components/ExhibitDetailView';
import { CompareView } from './components/CompareView';
import { TimelineView } from './components/TimelineView';
import { SourcesView } from './components/SourcesView';

interface ParsedHash {
  view: RouteView;
  exhibitId?: string;
}

function parseHashRoute(): ParsedHash {
  const withoutHash = window.location.hash.replace(/^#\/?/, '');
  const cleanPath = withoutHash.split('?')[0].replace(/\/+$/, '').trim();
  if (!cleanPath || cleanPath.toLowerCase() === 'home') return { view: 'home' };
  const [rawSegment, rawParam] = cleanPath.split('/');
  const segment = rawSegment.toLowerCase();
  if (segment === 'exhibit' && rawParam) {
    const matched = EXHIBITS.find((e) => e.id.toLowerCase() === rawParam.toLowerCase());
    if (matched) return { view: 'exhibit', exhibitId: matched.id };
  }
  if (segment === 'exhibits' || segment === 'gallery') {
    return { view: 'gallery' };
  }
  if (
    segment === 'atlas' ||
    segment === 'compare' ||
    segment === 'timeline' ||
    segment === 'sources'
  ) {
    return { view: segment };
  }
  return { view: 'home' };
}

export default function App() {
  const initial = parseHashRoute();
  const [view, setView] = useState<RouteView>(initial.view);
  const [selectedExhibitId, setSelectedExhibitId] = useState<string>(
    initial.exhibitId || EXHIBITS[0].id
  );
  const [galleryRealmFilter, setGalleryRealmFilter] = useState<TargetBody | 'all'>('all');
  const [atlasRealm, setAtlasRealm] = useState<TargetBody>('moon');
  const [compareLeftId, setCompareLeftId] = useState<string>('apollo-lm');

  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#') {
      window.history.replaceState(null, '', '#/');
    }
    const onHashChange = () => {
      const parsed = parseHashRoute();
      setView(parsed.view);
      if (parsed.exhibitId) setSelectedExhibitId(parsed.exhibitId);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (nextView: RouteView, exhibitId?: string) => {
    setView(nextView);
    if (nextView === 'exhibit' && exhibitId) {
      setSelectedExhibitId(exhibitId);
      window.location.hash = `#/exhibit/${exhibitId}`;
    } else if (nextView === 'home') {
      window.location.hash = '#/';
    } else if (nextView === 'gallery') {
      window.location.hash = '#/exhibits';
    } else {
      window.location.hash = `#/${nextView}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openExhibit = (exhibitId: string) => {
    navigateTo('exhibit', exhibitId);
  };

  const activeExhibit = EXHIBITS.find((e) => e.id === selectedExhibitId) ?? EXHIBITS[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#090B10] text-[#F3F4F6]">
      <Header currentView={view} onNavigate={navigateTo} />

      <main className="flex-1">
        {view === 'home' && (
          <LandingView
            onNavigate={navigateTo}
            onSelectRealmGallery={(realm) => {
              setGalleryRealmFilter(realm);
              navigateTo('gallery');
            }}
            onSelectRealmAtlas={(realm) => {
              setAtlasRealm(realm);
              navigateTo('atlas');
            }}
          />
        )}

        {view === 'atlas' && (
          <AtlasView
            key={atlasRealm}
            initialRealm={atlasRealm}
            onOpenExhibit={openExhibit}
          />
        )}

        {view === 'gallery' && (
          <GalleryView
            key={galleryRealmFilter}
            initialRealmFilter={galleryRealmFilter}
            onOpenExhibit={openExhibit}
          />
        )}

        {view === 'exhibit' && (
          <ExhibitDetailView
            exhibit={activeExhibit}
            onBackToGallery={() => {
              setGalleryRealmFilter('all');
              navigateTo('gallery');
            }}
            onOpenExhibit={openExhibit}
            onCompareWith={(id) => {
              setCompareLeftId(id);
              navigateTo('compare');
            }}
          />
        )}

        {view === 'compare' && (
          <CompareView
            key={compareLeftId}
            initialLeftId={compareLeftId}
            onOpenExhibit={openExhibit}
          />
        )}

        {view === 'timeline' && <TimelineView onOpenExhibit={openExhibit} />}

        {view === 'sources' && <SourcesView onOpenExhibit={openExhibit} />}
      </main>

      <footer className="border-t border-white/10 bg-[#0F131C]">
        <div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-6 px-5 py-8 sm:flex-row sm:items-center lg:px-8">
          <div>
            <div className="font-display text-lg font-semibold text-white">
              Beyond Their Misson
            </div>
            <p className="mt-1 text-xs text-[#9CA3AF]">
              NASA Space Apps Challenge 2026 · Team The Everestians · Scientific & Archival Data via
              NASA / JPL / LROC / PDS
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#CBD5E1]">
            <button
              type="button"
              onClick={() => navigateTo('gallery')}
              className="hover:text-[#D4A359] cursor-pointer"
            >
              All 16 Exhibits
            </button>
            <button
              type="button"
              onClick={() => navigateTo('atlas')}
              className="hover:text-[#D4A359] cursor-pointer"
            >
              3D Planetary Atlas
            </button>
            <button
              type="button"
              onClick={() => navigateTo('compare')}
              className="hover:text-[#D4A359] cursor-pointer"
            >
              Artifact Comparator
            </button>
            <button
              type="button"
              onClick={() => navigateTo('sources')}
              className="hover:text-[#D4A359] cursor-pointer"
            >
              NASA Sources & Credits
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
