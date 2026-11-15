import { useEffect, useState } from 'react';
import { ExternalLink, FileText, Film, VideoOff } from 'lucide-react';
import type { Exhibit } from '../data/exhibits';
import { EXHIBIT_MEDIA, type MissionVideoItem } from '../data/exhibitMedia';

interface WatchMissionSectionProps {
  exhibit: Exhibit;
}

export function WatchMissionSection({ exhibit }: WatchMissionSectionProps) {
  const media = EXHIBIT_MEDIA[exhibit.id];
  const videos = media?.missionVideos ?? [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [vttText, setVttText] = useState<string | null>(null);
  const [vttLoading, setVttLoading] = useState(false);

  useEffect(() => {
    setSelectedIndex(0);
    setTranscriptOpen(false);
    setVttText(null);
  }, [exhibit.id]);

  const activeVideo: MissionVideoItem | undefined = videos[selectedIndex] ?? videos[0];

  const handleToggleTranscript = async () => {
    if (transcriptOpen) {
      setTranscriptOpen(false);
      return;
    }
    setTranscriptOpen(true);
    if (!activeVideo?.vttUrl || vttText !== null) return;
    setVttLoading(true);
    try {
      const res = await fetch(activeVideo.vttUrl);
      if (!res.ok) throw new Error('Captions unavailable');
      const raw = await res.text();
      const cleaned = raw
        .replace(/^WEBVTT.*$/gm, '')
        .replace(/^\d+$/gm, '')
        .replace(/\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[.,]\d{3}.*/g, '')
        .replace(/\r?\n{2,}/g, '\n')
        .trim();
      setVttText(cleaned || activeVideo.captionSummary);
    } catch {
      setVttText(activeVideo.captionSummary);
    } finally {
      setVttLoading(false);
    }
  };

  if (videos.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#141923] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-[#0F131C]">
            <VideoOff className="h-5 w-5 text-[#9CA3AF]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
              Watch Original NASA Footage · Official Archive Notice
            </div>
            <h3 className="font-display mt-1 text-2xl font-semibold text-white">
              Verified Embedded NASA Footage Unavailable
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">
              To preserve scientific and archival integrity, this museum never guesses or fabricates
              video IDs. No verified embeddable NASA video stream is currently bundled for{' '}
              {exhibit.shortTitle}; open the official NASA archive directly below to view raw
              mission reels and visualizations.
            </p>
            {media?.videoArchiveFallbackUrl && (
              <a
                href={media.videoArchiveFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#D4A359]/45 bg-[#0F131C] px-4 py-2 text-xs font-semibold text-[#F9E7C4] hover:border-[#D4A359] transition-colors"
              >
                <span>Open {media.videoArchiveFallbackLabel}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-[#141923]">
      {/* Header & Multi-Clip Selector */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 bg-[#0F131C] px-6 py-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
            <Film className="h-3.5 w-3.5" />
            <span>Watch Original NASA Footage · Official Publisher Stream</span>
          </div>
          <h3 className="font-display mt-1 text-2xl font-semibold text-white">
            {activeVideo.title}
          </h3>
          <div className="mt-0.5 text-xs text-[#A1AAB8]">
            Publisher: <span className="text-[#E5E7EB]">{activeVideo.publisher}</span>
          </div>
        </div>

        {videos.length > 1 && (
          <div role="tablist" aria-label="Official Mission Footage Clips" className="flex flex-wrap gap-2">
            {videos.map((vid, idx) => {
              const active = idx === selectedIndex;
              return (
                <button
                  key={vid.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setTranscriptOpen(false);
                    setVttText(null);
                  }}
                  className={`min-h-[40px] rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'border-[#D4A359] bg-[#D4A359] text-[#090B10] font-semibold'
                      : 'border-white/15 bg-[#141923] text-[#CBD5E1] hover:border-white/35'
                  }`}
                >
                  Clip 0{idx + 1} · {vid.kind === 'nasa-mp4' ? 'NASA MP4' : 'Video'}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Responsive Player + Narrative Context Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="bg-black lg:col-span-7">
          {activeVideo.kind === 'nasa-mp4' && activeVideo.mp4Url ? (
            <video
              key={activeVideo.mp4Url}
              controls
              preload="metadata"
              poster={activeVideo.posterUrl}
              crossOrigin="anonymous"
              className="aspect-video w-full bg-black object-contain"
            >
              <source src={activeVideo.mp4Url} type="video/mp4" />
              {activeVideo.vttUrl && (
                <track
                  kind="captions"
                  src={activeVideo.vttUrl}
                  srcLang="en"
                  label="English Captions"
                  default
                />
              )}
              Your browser does not support HTML5 video playback.
            </video>
          ) : (
            <div className="aspect-video w-full">
              <iframe
                key={activeVideo.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between p-6 lg:col-span-5">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                What This Footage Demonstrates
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[#E5E7EB]">
                {activeVideo.demonstrates}
              </p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Captions &amp; Archival Notes
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#A1AAB8]">
                {activeVideo.captionSummary}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
            <a
              href={activeVideo.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#D4A359] px-4 py-2 text-xs font-semibold text-[#090B10] hover:bg-[#e0b46f] transition-colors whitespace-nowrap"
            >
              <span>Watch Original Source</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            {activeVideo.vttUrl && (
              <button
                type="button"
                aria-expanded={transcriptOpen}
                onClick={handleToggleTranscript}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-[#0F131C] px-4 py-2 text-xs font-medium text-[#F9E7C4] hover:border-[#D4A359] transition-colors whitespace-nowrap cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-[#D4A359]" />
                <span>{transcriptOpen ? 'Hide Captions Text' : 'Read NASA Captions'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Closed-Caption Transcript Panel */}
      {transcriptOpen && (
        <div className="border-t border-white/10 bg-[#090B10] px-6 py-4">
          <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
            Official NASA WebVTT Caption Transcript
          </div>
          <p className="mt-2 max-h-48 overflow-y-auto whitespace-pre-line text-xs leading-relaxed text-[#CBD5E1]">
            {vttLoading ? 'Loading NASA captions…' : vttText || activeVideo.captionSummary}
          </p>
        </div>
      )}
    </div>
  );
}
