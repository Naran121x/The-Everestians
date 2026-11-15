import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  Captions,
  Film,
  Gauge,
  Pause,
  Play,
  Radio,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Wind,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Exhibit } from '../data/exhibits';
import { MISSION_DOCUMENTARIES } from '../data/missionDocumentaries';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import type { DocumentaryStageHandle, TelemetrySnapshot } from '../three/DocumentaryStageCanvas';

const LazyDocumentaryStageCanvas = lazy(() =>
  import('../three/DocumentaryStageCanvas').then((m) => ({
    default: m.DocumentaryStageCanvas,
  }))
);

interface MissionDocumentaryPlayerProps {
  exhibit: Exhibit;
  onWatchOriginalFootage?: () => void;
  autoPlayOnMount?: boolean;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const;

function formatTimecode(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

export function MissionDocumentaryPlayer({
  exhibit,
  onWatchOriginalFootage,
  autoPlayOnMount = false,
}: MissionDocumentaryPlayerProps) {
  const script =
    MISSION_DOCUMENTARIES[exhibit.id] ?? MISSION_DOCUMENTARIES['insight-lander'];
  const osReducedMotion = Boolean(useReducedMotion());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<DocumentaryStageHandle | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const [playing, setPlaying] = useState(autoPlayOnMount && !osReducedMotion);
  const [speed, setSpeed] = useState<number>(1);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [narrationOn, setNarrationOn] = useState(false);
  const [reducedMotionMode, setReducedMotionMode] = useState(osReducedMotion);
  const [isVisible, setIsVisible] = useState(true);
  const [dragging, setDragging] = useState(false);

  const [telemetry, setTelemetry] = useState<TelemetrySnapshot>({
    time: 0,
    sceneIndex: 0,
    powerRatio: 0.25,
    signalRatio: 0.65,
    altitudeLabel: script.scenes[0].title,
  });

  const lastSpokenSceneRef = useRef<number>(-1);
  const speechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Reset cleanly whenever exhibit changes
  useEffect(() => {
    setPlaying(autoPlayOnMount && !osReducedMotion);
    setTelemetry({
      time: 0,
      sceneIndex: 0,
      powerRatio: 0.25,
      signalRatio: 0.65,
      altitudeLabel: script.scenes[0].title,
    });
    lastSpokenSceneRef.current = -1;
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    stageRef.current?.renderAtTime(0);
  }, [exhibit.id, script, autoPlayOnMount, osReducedMotion, speechSupported]);

  // Pause rendering when player is scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Optional Web Speech API narration synchronized to scenes
  useEffect(() => {
    if (!speechSupported) return;
    if (!narrationOn || !playing || !isVisible) {
      window.speechSynthesis.cancel();
      if (!narrationOn) lastSpokenSceneRef.current = -1;
      return;
    }

    const idx = telemetry.sceneIndex;
    if (lastSpokenSceneRef.current !== idx) {
      lastSpokenSceneRef.current = idx;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(script.scenes[idx].narration);
      utter.rate = Math.min(1.3, Math.max(0.85, speed));
      utter.pitch = 0.96;
      window.speechSynthesis.speak(utter);
    }
  }, [narrationOn, playing, isVisible, telemetry.sceneIndex, script, speed, speechSupported]);

  useEffect(() => {
    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  const handleTimeAdvance = useCallback(
    (_nextTime: number, snapshot: TelemetrySnapshot, finished: boolean) => {
      setTelemetry(snapshot);
      if (finished) {
        setPlaying(false);
      }
    },
    []
  );

  const seekToTime = useCallback(
    (rawTime: number) => {
      const clamped = Math.max(0, Math.min(script.duration, rawTime));
      lastSpokenSceneRef.current = -1;
      if (speechSupported) window.speechSynthesis.cancel();
      stageRef.current?.renderAtTime(clamped);
      const sIdx = (clamped < 10 ? 0 : clamped < 20 ? 1 : clamped < 30 ? 2 : 3) as
        | 0
        | 1
        | 2
        | 3;
      setTelemetry((prev) => ({
        ...prev,
        time: clamped,
        sceneIndex: sIdx,
      }));
    },
    [script.duration, speechSupported]
  );

  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => {
      if (!prev && telemetry.time >= script.duration - 0.1) {
        seekToTime(0);
      }
      return !prev;
    });
  }, [telemetry.time, script.duration, seekToTime]);

  const handleRestart = useCallback(() => {
    lastSpokenSceneRef.current = -1;
    if (speechSupported) window.speechSynthesis.cancel();
    stageRef.current?.renderAtTime(0);
    setPlaying(true);
  }, [speechSupported]);

  const handlePrevScene = useCallback(() => {
    const prevIdx = Math.max(0, telemetry.sceneIndex - 1);
    seekToTime(script.scenes[prevIdx].startTime);
  }, [telemetry.sceneIndex, script.scenes, seekToTime]);

  const handleNextScene = useCallback(() => {
    const nextIdx = Math.min(script.scenes.length - 1, telemetry.sceneIndex + 1);
    seekToTime(script.scenes[nextIdx].startTime);
  }, [telemetry.sceneIndex, script.scenes, seekToTime]);

  const scrubFromClientX = useCallback(
    (clientX: number) => {
      const rail = railRef.current;
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / (rect.width || 1)));
      seekToTime(ratio * script.duration);
    },
    [script.duration, seekToTime]
  );

  const handleRailPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    scrubFromClientX(e.clientX);
  };

  const handleRailPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    scrubFromClientX(e.clientX);
  };

  const handleRailPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handleRailKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      seekToTime(telemetry.time + 2);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      seekToTime(telemetry.time - 2);
    } else if (e.key === 'Home') {
      e.preventDefault();
      seekToTime(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      seekToTime(script.duration);
    } else if (e.key === ' ') {
      e.preventDefault();
      handlePlayPause();
    }
  };

  const activeScene = script.scenes[telemetry.sceneIndex] ?? script.scenes[0];
  const activeCue =
    script.cues.find((c) => telemetry.time >= c.start && telemetry.time <= c.end) ??
    script.cues[script.cues.length - 1];
  const progressPercent = (telemetry.time / script.duration) * 100;

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-xl border border-white/15 bg-[#090B10] shadow-2xl"
    >
      {/* Top Cinema Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0F131C] px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
            Scientific Visualization · 3D Reconstruction (Not Original NASA Footage)
          </div>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
              {script.title}
            </h2>
            <span className="text-xs text-[#A1AAB8]">{script.subtitle}</span>
          </div>
        </div>

        {onWatchOriginalFootage && (
          <button
            type="button"
            onClick={onWatchOriginalFootage}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#D4A359]/45 bg-[#141923] px-3.5 py-2 text-xs font-semibold text-[#F9E7C4] hover:border-[#D4A359] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Film className="h-3.5 w-3.5 text-[#D4A359]" />
            <span>Watch Original NASA Footage</span>
          </button>
        )}
      </div>

      {/* Unobstructed 3D Documentary Viewport */}
      <div className="relative h-[380px] sm:h-[460px] lg:h-[520px] w-full bg-[#07090E]">
        <CanvasErrorBoundary
          fallbackTitle="3D Documentary Stage Paused"
          fallbackDetail="WebGL could not initialize on this browser. Review the mission narrative and original NASA footage below."
        >
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-[#07090E] p-6 text-center">
                <div>
                  <div className="font-mono-tech text-xs uppercase tracking-wider text-[#D4A359]">
                    Initializing 3D Documentary Stage
                  </div>
                  <p className="mt-2 text-sm text-[#A1AAB8]">
                    Loading planetary terrain, spacecraft rigs, and timeline engine…
                  </p>
                </div>
              </div>
            }
          >
            <LazyDocumentaryStageCanvas
              ref={stageRef}
              exhibit={exhibit}
              script={script}
              playing={playing}
              speed={speed}
              reducedMotion={reducedMotionMode}
              isVisible={isVisible}
              initialTime={0}
              onTimeAdvance={handleTimeAdvance}
            />
          </Suspense>
        </CanvasErrorBoundary>

        {/* Minimal Top-Left Scene Title Overlay (Solid Dark Backing, Zero Backdrop-Blur) */}
        <div className="pointer-events-none absolute left-4 top-4 max-w-sm rounded-lg border border-white/15 bg-[#090B10]/90 px-3.5 py-2.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene.id}
              initial={reducedMotionMode ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotionMode ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#D4A359]">
                {activeScene.number} · {activeScene.eraLabel}
              </div>
              <div className="mt-0.5 text-sm font-semibold text-white">{activeScene.title}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Top-Right Compact Telemetry Pill-Free Readout */}
        <div className="pointer-events-none absolute right-4 top-4 hidden rounded-lg border border-white/15 bg-[#090B10]/90 px-3.5 py-2.5 text-xs sm:block">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono-tech uppercase tracking-wider text-[#9CA3AF]">
                <Gauge className="h-3 w-3 text-[#D4A359]" />
                <span>{script.powerMetricName}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full transition-all duration-150"
                    style={{
                      width: `${Math.round(telemetry.powerRatio * 100)}%`,
                      backgroundColor:
                        telemetry.powerRatio > 0.35 ? '#38BDF8' : '#EF4444',
                    }}
                  />
                </div>
                <span className="font-mono-tech text-[11px] text-white">
                  {Math.round(telemetry.powerRatio * 100)}%
                </span>
              </div>
            </div>

            <div className="border-l border-white/15 pl-4">
              <div className="flex items-center gap-1.5 text-[10px] font-mono-tech uppercase tracking-wider text-[#9CA3AF]">
                <Radio className="h-3 w-3 text-[#67B7D1]" />
                <span>Telemetry Link</span>
              </div>
              <div className="font-mono-tech mt-0.5 text-[11px] font-medium text-[#F9E7C4]">
                {telemetry.signalRatio > 0.45
                  ? 'Active Lock'
                  : telemetry.signalRatio > 0.03
                    ? 'Weakening'
                    : 'Signal Lost'}
              </div>
            </div>
          </div>
        </div>

        {/* Direct Stage Play CTA when waiting at 00:00 */}
        {!playing && telemetry.time < 0.1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center">
            <button
              type="button"
              onClick={handlePlayPause}
              className="pointer-events-auto inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-[#F9E7C4]/50 bg-[#D4A359] px-6 py-3 text-sm font-semibold text-[#090B10] shadow-xl hover:bg-[#e0b46f] transition-colors cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Play 3D Documentary ({formatTimecode(script.duration)})</span>
            </button>
          </div>
        )}

        {/* Synchronized Cinema Captions */}
        {captionsOn && activeCue && (
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex justify-center">
            <div className="max-w-3xl rounded-lg border border-white/15 bg-[#090B10]/95 px-4 py-2.5 text-center shadow-lg">
              <p className="text-xs leading-relaxed text-[#F3F4F6] sm:text-sm">
                {activeCue.caption}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Unified Tactile Documentary Timeline & Transport Controls */}
      <div className="border-t border-white/10 bg-[#0F131C] px-4 py-4 sm:px-6">
        {/* Clickable & Draggable Scrubbing Rail */}
        <div className="flex items-center gap-3">
          <span className="font-mono-tech w-11 text-xs text-[#F9E7C4]">
            {formatTimecode(telemetry.time)}
          </span>

          <div
            ref={railRef}
            role="slider"
            tabIndex={0}
            aria-label="Documentary timeline scrubber"
            aria-valuemin={0}
            aria-valuemax={script.duration}
            aria-valuenow={Math.round(telemetry.time)}
            aria-valuetext={`${formatTimecode(telemetry.time)} of ${formatTimecode(script.duration)}, ${activeScene.title}`}
            onPointerDown={handleRailPointerDown}
            onPointerMove={handleRailPointerMove}
            onPointerUp={handleRailPointerUp}
            onKeyDown={handleRailKeyDown}
            className="relative flex h-8 flex-1 touch-none items-center cursor-pointer select-none"
          >
            {/* Track */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full bg-[#D4A359]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Scene boundary ticks at 25%, 50%, 75% */}
            {[25, 50, 75].map((pct) => (
              <span
                key={pct}
                aria-hidden="true"
                style={{ left: `${pct}%` }}
                className="pointer-events-none absolute h-3.5 w-px bg-white/35"
              />
            ))}

            {/* Scrubber Knob */}
            <span
              aria-hidden="true"
              style={{ left: `${progressPercent}%` }}
              className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[#090B10] bg-[#F9E7C4] shadow-md"
            />
          </div>

          <span className="font-mono-tech w-11 text-right text-xs text-[#9CA3AF]">
            {formatTimecode(script.duration)}
          </span>
        </div>

        {/* 4 Clickable Scene Chapter Buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {script.scenes.map((sc, idx) => {
            const active = telemetry.sceneIndex === idx;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => seekToTime(sc.startTime)}
                className={`min-h-[44px] rounded-lg border px-3 py-2 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-[#D4A359] bg-[#141923] text-white'
                    : 'border-white/10 bg-[#090B10] text-[#A1AAB8] hover:border-white/30 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 font-mono-tech text-[10px]">
                  <span className="text-[#D4A359]">{sc.number}</span>
                  <span className="text-[#6F7888]">{formatTimecode(sc.startTime)}</span>
                </div>
                <div className="mt-0.5 truncate text-xs font-semibold">{sc.title}</div>
              </button>
            );
          })}
        </div>

        {/* Transport, Speed, Captions, Narration & Reduced Motion Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3.5">
          {/* Playback Transport Cluster */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePlayPause}
              aria-label={playing ? 'Pause documentary' : 'Play documentary'}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#D4A359] px-4 py-2 text-xs font-semibold text-[#090B10] hover:bg-[#e0b46f] transition-colors whitespace-nowrap cursor-pointer"
            >
              {playing ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>{telemetry.time > 0.2 && telemetry.time < script.duration - 0.1 ? 'Resume' : 'Play Story'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              aria-label="Restart documentary"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#141923] px-3 py-2 text-xs font-medium text-[#E5E7EB] hover:border-[#D4A359] transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#D4A359]" />
              <span>Restart</span>
            </button>

            <button
              type="button"
              onClick={handlePrevScene}
              disabled={telemetry.sceneIndex === 0 && telemetry.time < 1}
              aria-label="Previous scene"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-white/15 bg-[#141923] px-3 py-2 text-xs font-medium text-[#CBD5E1] hover:border-white/35 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <SkipBack className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev Scene</span>
            </button>

            <button
              type="button"
              onClick={handleNextScene}
              disabled={telemetry.sceneIndex === script.scenes.length - 1}
              aria-label="Next scene"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-white/15 bg-[#141923] px-3 py-2 text-xs font-medium text-[#CBD5E1] hover:border-white/35 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="hidden sm:inline">Next Scene</span>
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Speed, Captions, Narration & Reduced Motion Cluster */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Speed Selector */}
            <div
              role="group"
              aria-label="Playback speed"
              className="inline-flex items-center rounded-lg border border-white/15 bg-[#141923] p-0.5"
            >
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSpeed(opt)}
                  aria-pressed={speed === opt}
                  className={`min-h-[36px] rounded-md px-2.5 text-[11px] font-mono-tech transition-colors cursor-pointer ${
                    speed === opt
                      ? 'bg-[#D4A359] font-semibold text-[#090B10]'
                      : 'text-[#CBD5E1] hover:text-white'
                  }`}
                >
                  {opt}x
                </button>
              ))}
            </div>

            {/* Captions Toggle */}
            <button
              type="button"
              onClick={() => setCaptionsOn((v) => !v)}
              aria-pressed={captionsOn}
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                captionsOn
                  ? 'border-[#D4A359]/60 bg-[#141923] text-[#F9E7C4]'
                  : 'border-white/15 bg-[#090B10] text-[#9CA3AF]'
              }`}
            >
              <Captions className="h-3.5 w-3.5" />
              <span>Captions</span>
            </button>

            {/* Optional Narration Toggle */}
            {speechSupported && (
              <button
                type="button"
                onClick={() => setNarrationOn((v) => !v)}
                aria-pressed={narrationOn}
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  narrationOn
                    ? 'border-[#D4A359]/60 bg-[#141923] text-[#F9E7C4]'
                    : 'border-white/15 bg-[#090B10] text-[#9CA3AF]'
                }`}
              >
                {narrationOn ? (
                  <Volume2 className="h-3.5 w-3.5 text-[#D4A359]" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5" />
                )}
                <span>Narration</span>
              </button>
            )}

            {/* Reduced Motion Toggle */}
            <button
              type="button"
              onClick={() => setReducedMotionMode((v) => !v)}
              aria-pressed={reducedMotionMode}
              title="Slow or calm camera and motion intensity"
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                reducedMotionMode
                  ? 'border-[#67B7D1]/60 bg-[#141923] text-[#67B7D1]'
                  : 'border-white/15 bg-[#090B10] text-[#9CA3AF]'
              }`}
            >
              <Wind className="h-3.5 w-3.5" />
              <span>Reduced Motion</span>
            </button>
          </div>
        </div>

        {/* Active Scene Verified Telemetry Note */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#A1AAB8]">
          <span>
            <strong className="font-medium text-white">Active Scene Brief:</strong>{' '}
            {activeScene.narration}
          </span>
          <span className="font-mono-tech text-[11px] text-[#D4A359]">
            {activeScene.telemetryLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
