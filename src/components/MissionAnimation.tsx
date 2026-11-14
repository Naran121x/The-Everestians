import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import type { Exhibit } from '../data/exhibits';
import { EXHIBIT_MEDIA } from '../data/exhibitMedia';

interface MissionAnimationProps {
  exhibit: Exhibit;
}

interface PhaseInfo {
  label: string;
  year: string;
  caption: string;
}

const PHASE_LIBRARY: Record<string, [PhaseInfo, PhaseInfo, PhaseInfo]> = {
  'insight-lander': [
    {
      label: '01 · Arrival & SEIS Deployment',
      year: 'Nov–Dec 2018',
      caption:
        'Clean UltraFlex arrays generate peak solar electricity as the robotic arm plants the French SEIS seismometer directly onto Elysium Planitia.',
    },
    {
      label: '02 · Marsquakes & Gradual Dust',
      year: '2019 – May 2022',
      caption:
        'SEIS records 1,300+ marsquakes (up to Magnitude 5.0) while fine red dust steadily settles over the 6-meter solar wings, cutting power output.',
    },
    {
      label: '03 · Critical Power Shutdown',
      year: 'Dec 15–21, 2022',
      caption:
        'Thick surface dust drops solar generation below heater survival thresholds. After a final dusty selfie, InSight misses two beacons and retires.',
    },
  ],
  'apollo-lm': [
    {
      label: '01 · Throttleable Descent',
      year: 'Landing Approach',
      caption:
        'The TR-201 descent engine throttles down to bring the octagonal aluminum stage and four crushable legs gently onto lunar regolith.',
    },
    {
      label: '02 · Surface Base & EVA',
      year: 'Surface Stay',
      caption:
        'Crew steps down the forward ladder to deploy scientific experiments and collect rock samples while the Descent Stage powers systems.',
    },
    {
      label: '03 · Pyrotechnic Separation',
      year: 'Ascent Liftoff',
      caption:
        'Explosive bolts sever the upper cabin. The Ascent Stage fires off the top of the Descent Stage, leaving the gold-wrapped base permanently behind.',
    },
  ],
  'apollo-lrv': [
    {
      label: '01 · Quadrant 1 Unfolding',
      year: 'EVA Deployment',
      caption:
        'Astronauts release cables and hinges to unfold the 210 kg electric buggy from Quadrant 1 of the Descent Stage.',
    },
    {
      label: '02 · Kilometer-Scale Traverses',
      year: 'Apollo 15–17 EVAs',
      caption:
        'Four 190 W wire-mesh hub motors carry two astronauts and tools up to 35.74 km (Apollo 17) across rilles and crater rims.',
    },
    {
      label: '03 · Parked Liftoff Camera',
      year: 'Final Departure',
      caption:
        'Parked ~90–140 m clear of the LM, the LRV’s remotely steered high-gain dish films the Ascent Stage blasting off for orbit.',
    },
  ],
  'apollo-alsep': [
    {
      label: '01 · SNAP-27 Deployment',
      year: '1969 – 1972',
      caption:
        'Astronauts place central telemetry stations, seismometers, and Plutonium-238 RTGs 100–300 m clear of each Lunar Module.',
    },
    {
      label: '02 · Telemetry Shutdown',
      year: 'Sept 30, 1977',
      caption:
        'After recording moonquakes for years, NASA switches off active radio transmitters due to budget limits.',
    },
    {
      label: '03 · Passive Laser Ranging',
      year: '1969 – Present',
      caption:
        'Requiring zero power, the fused-silica corner-cube prisms still return Earth observatory lasers—measuring a 3.8 cm/year lunar recession.',
    },
  ],
  'surveyor-program': [
    {
      label: '01 · Radar Soft Touchdown',
      year: '1966 – 1968',
      caption:
        'Automated landing radar guides five tripod landers gently onto lunar soil (while Surveyor 2 & 4 are lost to propulsion/telemetry failures).',
    },
    {
      label: '02 · Trenching & 4m Hop',
      year: '1967 Surface Ops',
      caption:
        'Surveyor 3 digs lunar soil trenches, Surveyor 5 tests chemistry, and Surveyor 6 executes the first powered 4-meter hop across Sinus Medii.',
    },
    {
      label: '03 · Apollo 12 Reunion',
      year: 'Nov 20, 1969',
      caption:
        'LM Intrepid lands 180 m away; Pete Conrad and Alan Bean walk down to unbolt Surveyor 3’s camera and scoop for return to Earth.',
    },
  ],
  'lunokhod-rovers': [
    {
      label: '01 · Remote Lunar Traverses',
      year: '1970 – 1973',
      caption:
        'Eight-wheeled Soviet rovers traverse 10.5 km (Lunokhod 1) and 39 km (Lunokhod 2) while Polonium-210 heaters guard against freezing nights.',
    },
    {
      label: '02 · Crater Dust Scoop',
      year: 'May 1973',
      caption:
        'Inside Le Monnier Crater, Lunokhod 2’s open solar-panel lid brushes loose lunar soil onto the inner thermal radiator.',
    },
    {
      label: '03 · Nightfall Overheating',
      year: '1973 Loss & Active LRRR',
      caption:
        'Closing the lid dumps insulating dust over the radiator, fatally overheating electronics—yet Lunokhod 1’s French laser mirror stays active.',
    },
  ],
  'pathfinder-sojourner': [
    {
      label: '01 · Airbag Cushion Bounce',
      year: 'July 4, 1997',
      caption:
        'Encased in giant inflated airbags, Mars Pathfinder bounces across Ares Vallis before coming to rest and deflating.',
    },
    {
      label: '02 · Petals & Ramp Rollout',
      year: 'Sols 1–83',
      caption:
        'Three triangular solar petals right the station and 10.6 kg Sojourner rolls down the ramp to test rock chemistry with its APXS.',
    },
    {
      label: '03 · Thermal Battery Loss',
      year: 'Sept 27, 1997',
      caption:
        'After outlasting its 7-day plan by 83 sols, mainboard battery failure in freezing Martian nights ends radio contact.',
    },
  ],
  'spirit-rover': [
    {
      label: '01 · Columbia Hills & Silica',
      year: '2004 – 2008',
      caption:
        'Spirit crosses 7.73 km of Gusev Crater and uncovers 90% pure hot-spring silica deposits with a dragging wheel.',
    },
    {
      label: '02 · Trapped in Soft Sand',
      year: 'May 1, 2009',
      caption:
        'At "Troy," Spirit breaks through a brittle desert crust into loose iron-sulfate sand, halting further driving.',
    },
    {
      label: '03 · Winter Solar Tilt Loss',
      year: 'March 22, 2010',
      caption:
        'Unable to angle dusty panels toward the low northern winter Sun, power drops below survival levels.',
    },
  ],
  'opportunity-rover': [
    {
      label: '01 · 45.16 km Record Trek',
      year: '2004 – May 2018',
      caption:
        'Built for 90 sols, Opportunity explores Eagle, Endurance, Victoria, and Endeavour craters over 5,111 Martian days.',
    },
    {
      label: '02 · Global Dust Storm Envelops Sky',
      year: 'June 2018',
      caption:
        'Planet-wide airborne dust surges atmospheric optical depth (tau), turning noon over Perseverance Valley pitch dark.',
    },
    {
      label: '03 · Battery Depletion & Silence',
      year: 'June 2018 – Feb 2019',
      caption:
        'Starved of sunlight, Opportunity loses mission clock sync; NASA retires MER-B on Feb 13, 2019 after >1,000 recovery calls.',
    },
  ],
  'viking-landers': [
    {
      label: '01 · Touchdown & First Color Views',
      year: 'Summer 1976',
      caption:
        'Viking 1 and 2 land in Chryse and Utopia Planitia, beaming back clear panoramas and conducting automated soil biology tests.',
    },
    {
      label: '02 · Six Years on Plutonium RTGs',
      year: '1976 – 1982',
      caption:
        'Dual SNAP-19 RTGs supply steady 70 W power independent of dust storms; Viking 2 runs until battery loss in April 1980.',
    },
    {
      label: '03 · Antenna Pointing Overwrite',
      year: 'Nov 13, 1982',
      caption:
        'An erroneous ground software command overwrites Viking 1’s Earth-pointing dish parameters, permanently severing its radio link.',
    },
  ],
  'phoenix-lander': [
    {
      label: '01 · Arctic Trenching (18 cm)',
      year: 'May–Aug 2008',
      caption:
        'In northern permafrost at 68.15° N, Phoenix digs 18 cm deep to expose bright subsurface water ice and test soil salts.',
    },
    {
      label: '02 · Polar Night Arrives',
      year: 'Nov 2, 2008',
      caption:
        'Seasonal sunlight vanishes below the arctic horizon, draining Phoenix’s decagonal solar arrays into silence.',
    },
    {
      label: '03 · Dry-Ice Structural Crush',
      year: 'Martian Winter',
      caption:
        'Atmospheric carbon dioxide freezes onto the lander as heavy seasonal dry ice, buckling its solar wings under extreme mass.',
    },
  ],
  'ingenuity-helicopter': [
    {
      label: '01 · First Planetary Flight',
      year: 'April 19, 2021',
      caption:
        'Counter-rotating 1.2 m blades spin at ~2,400 RPM to generate lift in 1%-density air—opening aerial flight on another world.',
    },
    {
      label: '02 · 71 Reconnaissance Flights',
      year: '2021 – Jan 2024',
      caption:
        'Outlasting a 5-flight goal, Ingenuity flies 17.24 km ahead of Perseverance across Jezero Crater.',
    },
    {
      label: '03 · Flight 72 Dune Drift & Impact',
      year: 'Jan 18–25, 2024',
      caption:
        'Over featureless Valinor Hills sand ripples, optical flow cameras lose tracking cues; a hard touchdown fractures a carbon blade tip.',
    },
  ],
  'dawn-spacecraft': [
    {
      label: '01 · Ion Spiral to Vesta & Ceres',
      year: '2007 – 2015',
      caption:
        'Solar-powered xenon ion thrusters propel Dawn to orbit protoplanet 4 Vesta and then depart to orbit dwarf planet 1 Ceres.',
    },
    {
      label: '02 · Hydrazine Exhaustion',
      year: 'Nov 1, 2018',
      caption:
        'Attitude-control hydrazine runs dry, leaving Dawn unable to keep its solar arrays aimed at the Sun or dish pointed toward Earth.',
    },
    {
      label: '03 · 50-Year Planetary Quarantine',
      year: 'Ongoing Orbit',
      caption:
        'Engineered into a stable high orbit, Dawn will circle Ceres silently for >50 years without risking surface contamination.',
    },
  ],
  'near-shoemaker': [
    {
      label: '01 · Year-Long Eros Survey',
      year: '2000 – Feb 2001',
      caption:
        'Designed strictly as an asteroid orbiter with zero landing gear, NEAR Shoemaker maps peanut-shaped 433 Eros.',
    },
    {
      label: '02 · Gentle 1.9 m/s Descent',
      year: 'Feb 12, 2001',
      caption:
        'With orbital science complete, controllers execute an improvised five-burn descent, cushioning onto Eros on four solar panel tips.',
    },
    {
      label: '03 · 16 Days of Surface Spectra',
      year: 'Feb 28, 2001',
      caption:
        'Remarkably intact and aimed at Earth, it transmits unprecedented surface gamma-ray spectra before final shutdown.',
    },
  ],
  'kepler-telescope': [
    {
      label: '01 · Transit Light-Curve Stare',
      year: '2009 – 2013',
      caption:
        'From an Earth-trailing solar orbit, Kepler’s 0.95 m photometer catches tiny starlight dips as exoplanets cross their suns.',
    },
    {
      label: '02 · K2 Solar Balance Extension',
      year: '2014 – Oct 2018',
      caption:
        'After reaction wheel failures, engineers balance Kepler using gentle sunlight pressure to extend observations along the ecliptic.',
    },
    {
      label: '03 · Safe "Goodnight" Shutdown',
      year: 'Oct 30, 2018',
      caption:
        'Hydrazine thruster fuel runs out; NASA commands transmitters permanently off in a safe heliocentric drift.',
    },
  ],
  'pioneer-probes': [
    {
      label: '01 · Asteroid Belt & Outer Giants',
      year: '1972 – 1979',
      caption:
        'Pioneer 10 and 11 survive intense radiation belts at Jupiter and Saturn while gaining solar-system escape speed.',
    },
    {
      label: '02 · Fading Whispers Across 82 AU',
      year: '1995 – Jan 2003',
      caption:
        'Decaying boom RTGs dim radio signals over billions of miles until Pioneer 10 sends its final carrier wave from 82 AU.',
    },
    {
      label: '03 · Silent Interstellar Ambassadors',
      year: 'Indefinite Drift',
      caption:
        'Carrying gold-anodized plaques, Pioneer 10 glides toward Taurus and Pioneer 11 toward Aquila.',
    },
  ],
};

export function MissionAnimation({ exhibit }: MissionAnimationProps) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [playing, setPlaying] = useState(!prefersReduced);

  const phases = PHASE_LIBRARY[exhibit.id] ?? PHASE_LIBRARY['insight-lander'];
  const mediaMeta = EXHIBIT_MEDIA[exhibit.id];

  useEffect(() => {
    setPhase(0);
    setPlaying(!prefersReduced);
  }, [exhibit.id, prefersReduced]);

  useEffect(() => {
    if (!playing || prefersReduced) return;
    const timer = window.setInterval(() => {
      setPhase((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [playing, prefersReduced]);

  const current = phases[phase];

  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-[#0F131C]">
      {/* Explicit Reconstruction Disclosure Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#141923] px-5 py-3.5">
        <div>
          <div className="font-mono-tech text-[11px] uppercase tracking-wider text-[#D4A359]">
            Schematic Mission Reconstruction · Explanatory Visualization (Not Real Footage)
          </div>
          <h3 className="mt-0.5 text-sm font-semibold text-white">
            {mediaMeta?.animationTitle ?? `Mission Ending Sequence: ${exhibit.shortTitle}`}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause mission reconstruction' : 'Play mission reconstruction'}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#0F131C] px-3 py-1.5 text-xs font-medium text-[#F3F4F6] hover:border-[#D4A359] transition-colors whitespace-nowrap cursor-pointer"
          >
            {playing ? <Pause className="h-3.5 w-3.5 text-[#D4A359]" /> : <Play className="h-3.5 w-3.5 text-[#D4A359]" />}
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPhase(0);
              setPlaying(true);
            }}
            aria-label="Restart mission sequence"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#0F131C] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-white/35 transition-colors whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Lightweight Animated SVG Stage */}
      <div className="relative bg-[#07090E] px-4 py-5 sm:px-6">
        <MissionSvgStage exhibit={exhibit} phase={phase} />
      </div>

      {/* Interactive Phase Selector Tabs + Phase Narrative */}
      <div className="border-t border-white/10 p-5">
        <div role="tablist" aria-label="Mission Sequence Phases" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {phases.map((p, idx) => {
            const active = phase === idx;
            return (
              <button
                key={p.label}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setPhase(idx as 0 | 1 | 2);
                  setPlaying(false);
                }}
                className={`min-h-[44px] rounded-lg border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-[#D4A359] bg-[#141923] text-white'
                    : 'border-white/10 bg-[#090B10] text-[#A1AAB8] hover:border-white/25 hover:text-[#E5E7EB]'
                }`}
              >
                <div className="font-mono-tech text-[10px] text-[#D4A359]">{p.year}</div>
                <div className="mt-0.5 text-xs font-semibold">{p.label}</div>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#CBD5E1]">{current.caption}</p>
      </div>
    </div>
  );
}

function MissionSvgStage({ exhibit, phase }: { exhibit: Exhibit; phase: 0 | 1 | 2 }) {
  const accent =
    exhibit.targetBody === 'mars'
      ? '#C86446'
      : exhibit.targetBody === 'moon'
        ? '#D4A359'
        : '#67B7D1';

  // Specialized flagship schematic for InSight (solar power decline curve + dust blanket + SEIS pulse)
  if (exhibit.id === 'insight-lander') {
    const dustOpacity = phase === 0 ? 0.08 : phase === 1 ? 0.52 : 0.92;
    const powerHeight = phase === 0 ? 88 : phase === 1 ? 42 : 9;
    const powerWattText = phase === 0 ? '~4,580 Wh/sol' : phase === 1 ? '~1,750 Wh/sol' : '< 285 Wh/sol (Shutdown)';
    const quakeRingScale = phase === 2 ? 0.3 : 1;

    return (
      <svg
        viewBox="0 0 760 250"
        className="w-full h-auto max-h-[260px]"
        role="img"
        aria-label="Schematic reconstruction of InSight solar array dust buildup and power decline on Elysium Planitia"
      >
        <defs>
          <linearGradient id="marsSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#140D0C" />
            <stop offset="100%" stopColor="#261510" />
          </linearGradient>
        </defs>
        <rect width="760" height="250" rx="8" fill="url(#marsSky)" />
        {/* Elysium horizon */}
        <path d="M0 190 Q190 176 380 188 T760 184 L760 250 L0 250 Z" fill="#3B1D14" />
        <line x1="0" y1="190" x2="760" y2="186" stroke="#C86446" strokeOpacity="0.35" strokeWidth="1" />

        {/* SEIS Seismometer Dome & Seismic Wave Pulses */}
        <g transform="translate(150, 178)">
          <circle
            cx="0"
            cy="10"
            r={phase === 1 ? 42 : 28}
            fill="none"
            stroke="#67B7D1"
            strokeOpacity={0.35 * quakeRingScale}
            strokeWidth="1.5"
            style={{ transition: 'all 0.7s ease-out' }}
          />
          <circle
            cx="0"
            cy="10"
            r={phase === 1 ? 66 : 44}
            fill="none"
            stroke="#67B7D1"
            strokeOpacity={0.18 * quakeRingScale}
            strokeWidth="1"
            style={{ transition: 'all 0.7s ease-out' }}
          />
          <path d="M-20 12 L-16 -4 Q0 -14 16 -4 L20 12 Z" fill="#CBD5E1" />
          <text x="0" y="30" textAnchor="middle" fill="#A1AAB8" fontSize="10" fontFamily="monospace">
            SEIS Seismometer
          </text>
        </g>

        {/* InSight Lander + Twin UltraFlex Circular Panels */}
        <g transform="translate(330, 148)">
          {/* Tripod legs */}
          <line x1="-22" y1="16" x2="-34" y2="42" stroke="#94A3B8" strokeWidth="3" />
          <line x1="22" y1="16" x2="34" y2="42" stroke="#94A3B8" strokeWidth="3" />
          <line x1="0" y1="16" x2="0" y2="40" stroke="#64748B" strokeWidth="2.5" />

          {/* Left UltraFlex Solar Wing */}
          <ellipse cx="-68" cy="4" rx="44" ry="12" fill="#1E3A5F" stroke="#60A5FA" strokeWidth="1.5" />
          <ellipse
            cx="-68"
            cy="4"
            rx="44"
            ry="12"
            fill="#9A4E32"
            fillOpacity={dustOpacity}
            style={{ transition: 'fill-opacity 0.8s ease' }}
          />

          {/* Right UltraFlex Solar Wing */}
          <ellipse cx="68" cy="4" rx="44" ry="12" fill="#1E3A5F" stroke="#60A5FA" strokeWidth="1.5" />
          <ellipse
            cx="68"
            cy="4"
            rx="44"
            ry="12"
            fill="#9A4E32"
            fillOpacity={dustOpacity}
            style={{ transition: 'fill-opacity 0.8s ease' }}
          />

          {/* Central Deck & Arm */}
          <rect x="-26" y="-4" width="52" height="20" rx="3" fill="#D4A359" />
          <path d="M-24 2 L-85 26 L-160 36" fill="none" stroke="#CBD5E1" strokeWidth="2" />
          <text x="0" y="64" textAnchor="middle" fill="#E5E7EB" fontSize="10" fontFamily="monospace">
            InSight UltraFlex Arrays (6.0 m span)
          </text>
        </g>

        {/* Solar Energy Output Meter + Decline Curve */}
        <g transform="translate(530, 32)">
          <rect x="0" y="0" width="198" height="134" rx="6" fill="#0F131C" stroke="rgba(255,255,255,0.14)" />
          <text x="14" y="22" fill="#D4A359" fontSize="10" fontFamily="monospace">
            SOLAR POWER TELEMETRY (SCHEMATIC)
          </text>

          {/* Decline curve */}
          <path
            d="M18 42 Q84 52 122 86 T178 112"
            fill="none"
            stroke="#64748B"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <circle
            cx={phase === 0 ? 22 : phase === 1 ? 105 : 176}
            cy={phase === 0 ? 43 : phase === 1 ? 74 : 112}
            r="5"
            fill={phase === 2 ? '#EF4444' : '#D4A359'}
            style={{ transition: 'all 0.6s ease' }}
          />

          {/* Bar meter */}
          <rect x="14" y="102" width="108" height="10" rx="2" fill="#1E293B" />
          <rect
            x="14"
            y="102"
            width={powerHeight}
            height="10"
            rx="2"
            fill={phase === 2 ? '#EF4444' : '#60A5FA'}
            style={{ transition: 'all 0.7s ease' }}
          />
          <text x="14" y="126" fill="#F3F4F6" fontSize="11" fontFamily="monospace">
            {powerWattText}
          </text>
        </g>
      </svg>
    );
  }

  // Reusable multi-archetype schematic renderer covering all other 15 exhibits accurately
  const isMoon = exhibit.targetBody === 'moon';
  const isDeep = exhibit.targetBody === 'deep-space';

  // Position and visual cues shift smoothly per phase (0 -> 1 -> 2)
  const craftX =
    phase === 0 ? (isDeep ? 170 : 250) : phase === 1 ? (isDeep ? 380 : 380) : isDeep ? 580 : 490;
  const craftY =
    exhibit.id === 'apollo-lm'
      ? phase === 0
        ? 68
        : phase === 1
          ? 148
          : 148
      : exhibit.id === 'ingenuity-helicopter'
        ? phase === 0
          ? 122
          : phase === 1
            ? 84
            : 146
        : isDeep
          ? 118
          : 148;

  const ascentLiftY = exhibit.id === 'apollo-lm' && phase === 2 ? 42 : 124;

  return (
    <svg
      viewBox="0 0 760 230"
      className="w-full h-auto max-h-[250px]"
      role="img"
      aria-label={`Schematic mission reconstruction for ${exhibit.shortTitle}`}
    >
      <rect width="760" height="230" rx="8" fill={isDeep ? '#070A12' : isMoon ? '#0C0F16' : '#180E0C'} />

      {/* Ground horizon for Moon / Mars or Orbital arcs for Deep Space */}
      {isDeep ? (
        <g>
          <ellipse cx="380" cy="118" rx="280" ry="62" fill="none" stroke="#67B7D1" strokeOpacity="0.22" strokeDasharray="4 4" />
          <ellipse cx="380" cy="118" rx="180" ry="38" fill="none" stroke="#67B7D1" strokeOpacity="0.16" />
          <circle cx="110" cy="118" r="14" fill="#D4A359" fillOpacity="0.85" />
          <circle cx="620" cy="118" r="20" fill="#64748B" fillOpacity="0.55" />
        </g>
      ) : (
        <g>
          <path
            d="M0 176 Q190 166 380 178 T760 174 L760 230 L0 230 Z"
            fill={isMoon ? '#1B1F2A' : '#3A1D14'}
          />
          <line x1="0" y1="176" x2="760" y2="174" stroke={accent} strokeOpacity="0.35" strokeWidth="1" />
        </g>
      )}

      {/* Trajectory Path */}
      <path
        d={
          exhibit.id === 'apollo-lm'
            ? 'M180 54 Q300 95 380 154'
            : exhibit.id === 'ingenuity-helicopter'
              ? 'M250 156 Q380 60 510 156'
              : 'M160 148 L580 148'
        }
        fill="none"
        stroke={accent}
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* Special ALSEP / Lunokhod Laser Beam */}
      {(exhibit.id === 'apollo-alsep' || exhibit.id === 'lunokhod-rovers') && phase === 2 && (
        <g>
          <line x1="650" y1="22" x2={craftX} y2="146" stroke="#34D399" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x="580" y="42" fill="#34D399" fontSize="10" fontFamily="monospace">
            Active Earth Laser Ranging Pulse
          </text>
        </g>
      )}

      {/* Apollo LM Split Ascent / Descent Visual */}
      {exhibit.id === 'apollo-lm' ? (
        <g>
          {/* Descent stage */}
          <g transform={`translate(${phase === 0 ? 250 : 380}, ${phase === 0 ? 82 : 148})`} style={{ transition: 'all 0.7s ease' }}>
            <line x1="-22" y1="10" x2="-32" y2="28" stroke="#D4A359" strokeWidth="2.5" />
            <line x1="22" y1="10" x2="32" y2="28" stroke="#D4A359" strokeWidth="2.5" />
            <rect x="-24" y="-6" width="48" height="18" rx="2" fill="#D4A359" />
            <text x="0" y="46" textAnchor="middle" fill="#F9E7C4" fontSize="10" fontFamily="monospace">
              Descent Stage (Permanent Base)
            </text>
          </g>
          {/* Ascent stage */}
          <g transform={`translate(${phase === 0 ? 250 : 380}, ${phase === 0 ? 60 : ascentLiftY})`} style={{ transition: 'all 0.7s ease' }}>
            <polygon points="-16,12 16,12 11,-12 -11,-12" fill="#CBD5E1" />
            {phase === 2 && <polygon points="-6,12 6,12 0,28" fill="#F59E0B" />}
          </g>
        </g>
      ) : (
        /* Generic phase-positioned schematic craft marker */
        <g transform={`translate(${craftX}, ${craftY})`} style={{ transition: 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {phase === 2 && exhibit.targetBody === 'mars' && (
            <circle cx="0" cy="0" r="34" fill="#9A4E32" fillOpacity="0.24" />
          )}
          <rect x="-22" y="-12" width="44" height="22" rx="4" fill={accent} />
          <line x1="-38" y1="-2" x2="-22" y2="-2" stroke="#60A5FA" strokeWidth="4" />
          <line x1="22" y1="-2" x2="38" y2="-2" stroke="#60A5FA" strokeWidth="4" />
          {!isDeep && (
            <>
              <circle cx="-14" cy="14" r="5" fill="#CBD5E1" />
              <circle cx="14" cy="14" r="5" fill="#CBD5E1" />
            </>
          )}
          <text x="0" y="38" textAnchor="middle" fill="#E5E7EB" fontSize="10" fontFamily="monospace">
            {exhibit.shortTitle}
          </text>
        </g>
      )}

      {/* Phase Status Readout */}
      <g transform="translate(24, 24)">
        <text x="0" y="0" fill={accent} fontSize="11" fontFamily="monospace">
          PHASE 0{phase + 1} / 03
        </text>
      </g>
    </svg>
  );
}
