import heroLunarMonumentImg from '../assets/images/hero_lunar_monument_1794670403479.jpg';
import realmMoonSurfaceImg from '../assets/images/realm_moon_surface_1794670403686.jpg';
import realmMarsSurfaceImg from '../assets/images/realm_mars_surface_1794670404187.jpg';
import realmDeepspaceVoidImg from '../assets/images/realm_deepspace_void_1794670405054.jpg';
import exhibitIngenuityStudyImg from '../assets/images/exhibit_ingenuity_study_1794670405580.jpg';
import { EXHIBIT_MEDIA } from './exhibitMedia';
import {
  EXHIBIT_NARRATIVES,
  type EvidenceSourceItem,
  type GlossaryTerm,
} from './exhibitNarratives';

export type { EvidenceSourceItem, GlossaryTerm };

export type TargetBody = 'moon' | 'mars' | 'deep-space';

export type DispositionCategory =
  | 'intentionally-left-behind'
  | 'depleted-environmental'
  | 'hardware-malfunction'
  | 'orbital-deep-space';

export interface LocationCoordinate {
  siteName: string;
  region: string;
  lat: number | null;
  lon: number | null;
  coordinateText: string;
  statusNote?: string;
}

export interface SpecificationItem {
  label: string;
  value: string;
  phaseNote?: string;
}

export interface ExhibitTimelineItem {
  date: string;
  sortYear: number;
  title: string;
  detail: string;
}

export interface HotspotAnnotation {
  id: string;
  label: string;
  position: [number, number, number];
  annotation: string;
}

export interface NasaImageReference {
  assetId: string;
  description: string;
  attribution: string;
  portalName: string;
  portalUrl: string;
}

export interface Nasa3DReference {
  availabilityStatus: 'verified-glb' | 'stl-printable' | 'cad-shape-archive' | 'image-only';
  availabilityLabel: string;
  assetName: string;
  format: string;
  fileSize: string;
  downloadLocation: string;
  technicalNotes: string;
  portalUrl: string;
}

export interface ComparisonMetrics {
  massSummary: string;
  dimensionsSummary: string;
  powerSource: string;
  distanceTraveled: string;
  lifespanSummary: string;
}

export interface Exhibit {
  id: string;
  accessionNumber: string;
  officialName: string;
  shortTitle: string;
  mission: string;
  targetBody: TargetBody;
  targetBodyLabel: string;
  operationalPeriod: string;
  dispositionCategory: DispositionCategory;
  dispositionLabel: string;
  dispositionShort: string;
  cardSnippet: string;
  visualImage: string;
  fallbackVisualImage: string;
  imagePosition: string;
  visualStudyLabel: string;
  historicalBackground: string;
  originalPurpose: string;
  locations: LocationCoordinate[];
  keyDates: { label: string; value: string }[];
  specifications: SpecificationItem[];
  comparison: ComparisonMetrics;
  achievements: string[];
  abandonmentReason: string;
  currentStatus: string;
  timeline: ExhibitTimelineItem[];
  hotspots: HotspotAnnotation[];
  nasaImage: NasaImageReference;
  nasa3dAsset: Nasa3DReference;
  verificationNote?: string;
  discoveryHook: string;
  glossaryTerms: GlossaryTerm[];
  journeyNarrative: string;
  endingDetails: {
    verifiedFacts: string;
    distinctionNote?: string;
  };
  legacyImpact: {
    significance: string;
    futureLessons: string[];
  };
  evidenceSources: EvidenceSourceItem[];
}

export const MUSEUM_IMAGES = {
  hero: heroLunarMonumentImg,
  moon: realmMoonSurfaceImg,
  mars: realmMarsSurfaceImg,
  deepSpace: realmDeepspaceVoidImg,
  ingenuity: exhibitIngenuityStudyImg,
};

export const HERO_COPY = {
  title: 'BEYOND THEIR MISSION',
  subtitle: 'Exploring the Silent Monuments of Solar System Exploration',
  lead: 'Across the airless maria of the Moon and the icy deserts of Mars, human ingenuity has left behind an extraordinary legacy. Explore the interactive 3D digital museum cataloging NASA’s non-functional landers, rovers, and spacecraft resting in the quiet expanse of off-world space.',
};

export const REALM_INTRODUCTIONS: Record<
  TargetBody,
  {
    id: TargetBody;
    title: string;
    subtitle: string;
    intro: string;
    accentHex: string;
    image: string;
    exhibitCount: number;
  }
> = {
  moon: {
    id: 'moon',
    title: 'The Moon Collection',
    subtitle: 'Basaltic Maria & Highland Relics · 1966–1977 (Laser Ranging Ongoing)',
    intro:
      'Six crewed landings, robotic soft landers, and autonomous rover buggies lie preserved in the vacuum of the lunar surface. From Apollo descent stages to radioisotope-powered retroreflectors, discover the stepping stones that opened the Moon to humanity.',
    accentHex: '#D4A359',
    image: realmMoonSurfaceImg,
    exhibitCount: 5,
  },
  mars: {
    id: 'mars',
    title: 'The Mars Collection',
    subtitle: 'Iron Oxide Basins, Polar Caps & Aerial Scars · 1976–2024',
    intro:
      'The Red Planet is home to silent rovers, stationary landers, and a grounded aerial demonstrator. Explore how solar dust, polar ice, and mechanical endurance shaped the lifespans of machines that revealed Mars’ ancient water and interior dynamics.',
    accentHex: '#C86446',
    image: realmMarsSurfaceImg,
    exhibitCount: 7,
  },
  'deep-space': {
    id: 'deep-space',
    title: 'Deep Space & Small Bodies',
    subtitle: 'Asteroid Belt, Heliocentric Drift & Interstellar Escape · 1972–2018',
    intro:
      'Beyond planetary surfaces, unpowered spacecraft drift in perpetual asteroid orbits, asteroid landing sites, and interstellar escape paths, carrying golden plaques into the galaxy.',
    accentHex: '#67B7D1',
    image: realmDeepspaceVoidImg,
    exhibitCount: 4,
  },
};

export const DISPOSITION_TAXONOMY: {
  id: DispositionCategory;
  title: string;
  shortLabel: string;
  description: string;
  examples: string;
}[] = [
  {
    id: 'intentionally-left-behind',
    title: 'Intentionally Left Behind Surface Infrastructure',
    shortLabel: 'Intentionally Left Behind',
    description:
      'Equipment engineered specifically to serve as permanent surface bases, landing platforms, or passive long-term scientific stations after human or robotic departure.',
    examples: 'Apollo Lunar Module Descent Stages, ALSEP scientific arrays, Lunar Roving Vehicles',
  },
  {
    id: 'depleted-environmental',
    title: 'Depleted / Environmentally Decommissioned Hardware',
    shortLabel: 'Depleted / Environmental',
    description:
      'Active surface explorers that completed their primary scientific missions but were silenced by environmental factors such as solar panel dust accumulation, polar winter darkness, or battery depletion.',
    examples: 'InSight Lander, Spirit & Opportunity Rovers, Phoenix Lander, Viking 1 & 2',
  },
  {
    id: 'hardware-malfunction',
    title: 'Hardware Malfunction & Mechanical Relics',
    shortLabel: 'Hardware Malfunction',
    description:
      'Spacecraft that suffered structural, mechanical, or aerodynamic injury during touchdown or operational maneuvers, rendering them stationary surface relics despite maintaining structural integrity.',
    examples: 'Ingenuity Mars Helicopter rotor blade fracture, Surveyor 2 and 4 impact sites',
  },
  {
    id: 'orbital-deep-space',
    title: 'Orbital, Deep Space & Small-Body Relics',
    shortLabel: 'Orbital / Deep Space',
    description:
      'Spacecraft residing in permanent non-surface orbital paths, heliocentric drift trajectories, small-body landing sites, or outward interstellar escape vectors after exhausting onboard attitude-control propellants.',
    examples: 'Dawn Spacecraft at Ceres, NEAR Shoemaker on 433 Eros, Kepler Space Telescope, Pioneer 10 & 11',
  },
];

export const OFFICIAL_NASA_SOURCES: {
  name: string;
  description: string;
  url: string;
}[] = [
  {
    name: 'NASA Science 3D Resources Hub',
    description: 'Official repository for interactive and downloadable glTF/GLB and USDZ spacecraft assets.',
    url: 'https://science.nasa.gov/3d-resources/',
  },
  {
    name: 'NASA Planetary Data System (PDS)',
    description: 'Archival mission telemetry, asteroid 3D shape models (433 Eros), and planetary datasets.',
    url: 'https://pds.nasa.gov/',
  },
  {
    name: 'NASA Scientific Visualization Studio (SVS)',
    description: 'High-resolution visualizations and models including SVS #4868 and SVS #10595.',
    url: 'https://svs.gsfc.nasa.gov/',
  },
  {
    name: 'NASA Lunar Reconnaissance Orbiter Camera (LROC)',
    description: 'ASU orbital imagery and stereo DEMs documenting Apollo, Surveyor, and Lunokhod sites.',
    url: 'https://www.lroc.asu.edu/',
  },
  {
    name: 'NASA Technical Reports Server (NTRS)',
    description: 'Primary engineering specifications, flight investigations, and mission post-mortems.',
    url: 'https://ntrs.nasa.gov/',
  },
  {
    name: 'NASA JPL Mars Exploration & Photojournal',
    description: 'Official planetary image archive (PIA series) and Mars surface mission portals.',
    url: 'https://photojournal.jpl.nasa.gov/',
  },
];

type BaseExhibit = Omit<
  Exhibit,
  | 'fallbackVisualImage'
  | 'imagePosition'
  | 'discoveryHook'
  | 'glossaryTerms'
  | 'journeyNarrative'
  | 'endingDetails'
  | 'legacyImpact'
  | 'evidenceSources'
>;

const RAW_EXHIBITS: BaseExhibit[] = [
  {
    id: 'apollo-lm',
    accessionNumber: 'ACC.MOON.01',
    officialName: 'Apollo Lunar Module (LM) Descent Stage (Apollo 11, 12, 14, 15, 16, 17)',
    shortTitle: 'Apollo Lunar Module Descent Stages',
    mission: 'NASA Apollo Program (1969–1972)',
    targetBody: 'moon',
    targetBodyLabel: 'The Moon',
    operationalPeriod: '1969 – 1972',
    dispositionCategory: 'intentionally-left-behind',
    dispositionLabel: 'Intentionally Left Behind Surface Infrastructure',
    dispositionShort: 'Intentionally Left Behind',
    cardSnippet:
      'The gold-foil landing platforms that served as crew surface bases and launchpads for returning home.',
    visualImage: heroLunarMonumentImg,
    visualStudyLabel: 'Curatorial Visual Reconstruction · Tranquility Base Study',
    historicalBackground:
      'Six crewed Apollo landings placed octagonal aluminum descent stages across the lunar maria and highlands between 1969 and 1972. Each descent stage acted as both the braking vehicle for lunar touchdown and the permanent base from which the ascent stage launched back to lunar orbit.',
    originalPurpose:
      'Provided controlled powered descent from lunar orbit to the surface, housing the throttleable descent engine, landing gear, propellant tanks, and surface EVA equipment. Served as the crew’s operational base on the Moon.',
    locations: [
      {
        siteName: 'Apollo 11 (Eagle)',
        region: 'Statio Tranquillitatis',
        lat: 0.67408,
        lon: 23.47297,
        coordinateText: '0.67408° N, 23.47297° E',
      },
      {
        siteName: 'Apollo 12 (Intrepid)',
        region: 'Oceanus Procellarum',
        lat: -3.01239,
        lon: -23.41863,
        coordinateText: '3.01239° S, 23.41863° W',
      },
      {
        siteName: 'Apollo 14 (Antares)',
        region: 'Fra Mauro Highlands',
        lat: -3.6453,
        lon: -17.47136,
        coordinateText: '3.64530° S, 17.47136° W',
      },
      {
        siteName: 'Apollo 15 (Falcon)',
        region: 'Hadley-Apennine',
        lat: 26.13222,
        lon: 3.63386,
        coordinateText: '26.13222° N, 3.63386° E',
      },
      {
        siteName: 'Apollo 16 (Orion)',
        region: 'Descartes Highlands',
        lat: -8.97301,
        lon: 15.50019,
        coordinateText: '8.97301° S, 15.50019° E',
      },
      {
        siteName: 'Apollo 17 (Challenger)',
        region: 'Taurus-Littrow',
        lat: 20.1908,
        lon: 30.77168,
        coordinateText: '20.19080° N, 30.77168° E',
      },
    ],
    keyDates: [
      { label: 'First Landing (Apollo 11)', value: 'July 20, 1969' },
      { label: 'Final Landing (Apollo 17)', value: 'December 11, 1972' },
    ],
    specifications: [
      { label: 'Dry Mass', value: '~2,034 kg', phaseNote: 'Dry structure' },
      { label: 'Fueled Mass', value: '~10,334 kg', phaseNote: 'Descent propellant loaded' },
      { label: 'Height', value: '3.22 m (with legs extended)' },
      { label: 'Diagonal Span', value: '9.4 m across touchdown pads' },
      { label: 'Descent Engine', value: 'TRW Aerojet TR-201 throttleable engine (43.9 kN thrust)' },
      { label: 'Structure', value: 'Aluminum alloy wrapped in gold and amber Kapton thermal insulation foil' },
    ],
    comparison: {
      massSummary: '~2,034 kg (Dry) / ~10,334 kg (Fueled)',
      dimensionsSummary: '3.22 m H × 9.4 m diagonal span',
      powerSource: 'Descent batteries (expendable)',
      distanceTraveled: 'Stationary landing platform',
      lifespanSummary: '6 landings across 1969–1972',
    },
    achievements: [
      'Enabled six successful crewed lunar landings between 1969 and 1972.',
      'Housed the MESA camera equipment that broadcasted Neil Armstrong’s first steps live to Earth.',
      'Served as stable pyrotechnically separated launchpads for all six LM Ascent Stages.',
    ],
    abandonmentReason:
      'Intentionally used as the launch platform for the LM Ascent Stage. Payload return constraints required jettisoning the descent stage to allow the ascent stage to reach lunar orbit.',
    currentStatus:
      'All six descent stages remain standing intact at their landing sites. LROC orbital photography confirms they are surrounded by astronaut tracks, equipment bags, and parked rovers.',
    timeline: [
      {
        date: 'July 16, 1969',
        sortYear: 1969.54,
        title: 'Saturn V Liftoff',
        detail: 'Apollo 11 launches from Kennedy Space Center Pad 39A.',
      },
      {
        date: 'July 20, 1969 (20:17 UTC)',
        sortYear: 1969.55,
        title: 'Touchdown at Statio Tranquillitatis',
        detail: 'LM Eagle settles onto the Sea of Tranquility.',
      },
      {
        date: 'July 21, 1969 (02:56 UTC)',
        sortYear: 1969.552,
        title: 'First Human Steps & EASEP Deployment',
        detail: 'Neil Armstrong steps onto the lunar surface via the descent stage ladder; EASEP array deployed.',
      },
      {
        date: 'July 21, 1969 (17:54 UTC)',
        sortYear: 1969.554,
        title: 'Ascent Stage Departure',
        detail: 'LM Ascent Stage fires off the top of the descent stage, leaving it permanently as a launchpad.',
      },
      {
        date: 'December 11, 1972',
        sortYear: 1972.94,
        title: 'Final Apollo Descent Stage Landing',
        detail: 'Apollo 17 Challenger touches down in Taurus-Littrow Valley.',
      },
    ],
    hotspots: [
      {
        id: 'kapton-body',
        label: 'Kapton Thermal Foil Bay',
        position: [1.45, 1.48, 1.45],
        annotation:
          'Octagonal aluminum alloy bay wrapped in gold and amber Kapton multi-layer insulation to shield descent propellant tanks from extreme lunar thermal swings.',
      },
      {
        id: 'tr201-engine',
        label: 'TR-201 Descent Engine Bell',
        position: [0.0, 0.56, 0.25],
        annotation:
          'Throttleable 43.9 kN descent engine beneath the octagon that enabled precision hovering and soft lunar touchdown.',
      },
      {
        id: 'landing-gear',
        label: 'Crushable Honeycomb Footpad',
        position: [3.02, 0.18, 0.0],
        annotation:
          '9.4 m diagonal four-leg landing gear engineered with crushable aluminum honeycomb shock absorbers and lunar surface sensing probes.',
      },
      {
        id: 'egress-ladder',
        label: 'Front Egress Ladder & MESA Bay',
        position: [0.0, 1.25, 2.45],
        annotation:
          'Nine-rung descent ladder mounted on the forward landing strut beside the Apollo 11 plaque and Modularized Equipment Stowage Assembly.',
      },
    ],
    nasaImage: {
      assetId: 'AS11-40-5903',
      description: 'Buzz Aldrin beside Apollo 11 Eagle Descent Stage at Tranquility Base',
      attribution: 'NASA / Apollo 11 Crew',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/as11-40-5903',
    },
    nasa3dAsset: {
      availabilityStatus: 'verified-glb',
      availabilityLabel: 'Verified Local NASA GLB',
      assetName: 'apollo-lunar-module.glb',
      format: 'glTF 2.0 (Draco)',
      fileSize: '700 KB',
      downloadLocation: 'NASA 3D Resources (nasa/NASA-3D-Resources)',
      technicalNotes:
        'Official NASA Lunar Module GLB with separable Ascent and Descent stage geometry; Chapter 05 isolates the abandoned Descent Stage by default.',
      portalUrl: 'https://science.nasa.gov/3d-resources/apollo-lunar-module/',
    },
  },
  {
    id: 'apollo-lrv',
    accessionNumber: 'ACC.MOON.02',
    officialName: 'Lunar Roving Vehicle (LRV-1, LRV-2, LRV-3)',
    shortTitle: 'Lunar Roving Vehicles (LRVs)',
    mission: 'Apollo 15, 16 & 17 "J-Series" Missions (1971–1972)',
    targetBody: 'moon',
    targetBodyLabel: 'The Moon',
    operationalPeriod: '1971 – 1972',
    dispositionCategory: 'intentionally-left-behind',
    dispositionLabel: 'Intentionally Left Behind Surface Infrastructure',
    dispositionShort: 'Intentionally Left Behind',
    cardSnippet: 'Electric moon buggies left parked at Apollo 15, 16, and 17 landing sites.',
    visualImage: realmMoonSurfaceImg,
    visualStudyLabel: 'Curatorial Visual Study · Hadley-Apennine Tracks',
    historicalBackground:
      'Built for the extended scientific "J-series" Apollo expeditions, three lightweight electric buggies transformed astronauts from pedestrians limited to a few hundred meters into geological explorers covering tens of kilometers.',
    originalPurpose:
      'Electric four-wheeled mobility buggies built to transport two astronauts, science instruments, tools, and regolith samples across extended distances up to 7.5 km from the LM.',
    locations: [
      {
        siteName: 'LRV-1 (Apollo 15)',
        region: 'Hadley-Apennine',
        lat: 26.1322,
        lon: 3.6338,
        coordinateText: '26.1322° N, 3.6338° E (~100 m from LM)',
      },
      {
        siteName: 'LRV-2 (Apollo 16)',
        region: 'Descartes Highlands',
        lat: -8.973,
        lon: 15.5002,
        coordinateText: '8.9730° S, 15.5002° E (~90 m from LM)',
      },
      {
        siteName: 'LRV-3 (Apollo 17)',
        region: 'Taurus-Littrow',
        lat: 20.1908,
        lon: 30.7717,
        coordinateText: '20.1908° N, 30.7717° E (~140 m from LM, pointed at liftoff path)',
      },
    ],
    keyDates: [
      { label: 'First Drive (Apollo 15)', value: 'July 31, 1971' },
      { label: 'Final Drive (Apollo 17)', value: 'December 13, 1972' },
    ],
    specifications: [
      { label: 'Empty Mass (Earth)', value: '210 kg', phaseNote: 'Unloaded vehicle mass on Earth' },
      { label: 'Payload Capacity', value: '490 kg (including two astronauts)' },
      { label: 'Dimensions', value: '3.1 m L × 1.8 m W × 1.14 m H (2.3 m wheelbase)' },
      { label: 'Motors', value: 'Four 0.25 hp (190 W) DC electric motors (one per wheel)' },
      { label: 'Power', value: 'Dual 36V silver-zinc potassium hydroxide non-rechargeable batteries' },
      { label: 'Tires', value: 'Woven zinc-coated steel mesh with titanium chevron treads' },
    ],
    comparison: {
      massSummary: '210 kg (Empty Earth mass) / 490 kg payload',
      dimensionsSummary: '3.1 m L × 1.8 m W × 1.14 m H',
      powerSource: 'Dual 36V silver-zinc non-rechargeable batteries',
      distanceTraveled: '35.74 km (LRV-3, Apollo 17)',
      lifespanSummary: '1971 – 1972 (3 J-Series EVAs)',
    },
    achievements: [
      'Enabled the Apollo 17 crew to cover 35.74 km of total driving distance across Taurus-Littrow.',
      'Reached a lunar surface top speed of 18 km/h driven by Gene Cernan.',
      'Carried remotely controlled high-gain TV cameras that filmed Apollo ascent stage liftoffs from the lunar surface.',
    ],
    abandonmentReason:
      'Mass constraints prohibited bringing 210 kg vehicles back inside the Command Module. Vehicles were parked at designated distances to record LM ascent liftoff with their high-gain TV cameras.',
    currentStatus:
      'Permanently parked on the lunar surface. Electrical systems are dead, but chassis structures remain fully intact.',
    timeline: [
      {
        date: 'July 31, 1971',
        sortYear: 1971.58,
        title: 'First Lunar Drive (LRV-1)',
        detail: 'Apollo 15 astronauts deploy and drive the first electric vehicle on the Moon at Hadley-Apennine.',
      },
      {
        date: 'April 1972',
        sortYear: 1972.3,
        title: 'LRV-2 Operations',
        detail: 'Apollo 16 crew traverses Descartes Highlands before parking LRV-2 ~90 m from Orion.',
      },
      {
        date: 'December 13, 1972',
        sortYear: 1972.95,
        title: 'Final Lunar Drive (LRV-3)',
        detail: 'Apollo 17 completes 35.74 km total traverse and parks LRV-3 ~140 m from Challenger to film liftoff.',
      },
    ],
    hotspots: [
      {
        id: 'mesh-wheels',
        label: 'Wire-Mesh Titanium Tires',
        position: [0.95, 0.25, 0.72],
        annotation: 'Woven zinc-coated steel mesh with titanium chevron treads powered by individual 190 W hub motors.',
      },
      {
        id: 'high-gain-dish',
        label: 'High-Gain Umbrella Dish',
        position: [0.6, 1.05, 0.0],
        annotation: 'Mesh parabolic antenna that transmitted live television of Apollo 15–17 liftoffs back to Earth.',
      },
      {
        id: 'crew-seats',
        label: 'Dual Astronaut Console',
        position: [-0.2, 0.68, 0.0],
        annotation: 'Lightweight aluminum frame seating two suited astronauts with a central T-handle drive controller.',
      },
    ],
    nasaImage: {
      assetId: 'AS15-88-11901',
      description: 'Lunar Roving Vehicle (LRV-1) photographed during Apollo 15 EVA',
      attribution: 'NASA / Apollo 15 Crew',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/as15-88-11901',
    },
    nasa3dAsset: {
      availabilityStatus: 'image-only',
      availabilityLabel: '2D Archives / Procedural Render',
      assetName: 'No standalone official GLB hosted',
      format: 'Archival Photography (AS15-88-11901)',
      fileSize: 'Unknown',
      downloadLocation: 'NASA Science Photojournal',
      technicalNotes: 'No standalone official NASA GLB scan currently hosted on NASA 3D Resources.',
      portalUrl: 'https://science.nasa.gov/3d-resources/',
    },
  },
  {
    id: 'apollo-alsep',
    accessionNumber: 'ACC.MOON.03',
    officialName: 'Apollo Lunar Surface Experiments Package (ALSEP) & Laser Ranging Retroreflector (LRRR)',
    shortTitle: 'ALSEP Packages & Laser Retroreflectors',
    mission: 'Apollo 11 (EASEP), 12, 14, 15, 16 & 17 (1969–1977; Laser Ongoing)',
    targetBody: 'moon',
    targetBodyLabel: 'The Moon',
    operationalPeriod: '1969 – 1977 (Active laser ongoing)',
    dispositionCategory: 'intentionally-left-behind',
    dispositionLabel: 'Intentionally Left Behind Surface Infrastructure',
    dispositionShort: 'Intentionally Left Behind',
    cardSnippet:
      'Plutonium-powered geophysical stations and passive optical prism arrays still reflecting Earth lasers today.',
    visualImage: realmMoonSurfaceImg,
    visualStudyLabel: 'Curatorial Visual Study · Lunar Geophysical Station',
    historicalBackground:
      'Once astronauts departed each Apollo site, these autonomous nuclear-powered laboratories continued listening to the Moon’s interior for years—while their passive optical retroreflectors remain active more than five decades later.',
    originalPurpose:
      'Autonomous instrument arrays deployed on the surface to measure moonquakes, solar wind, magnetic fields, heat flow, and lunar atmospheric density over multi-year periods.',
    locations: [
      {
        siteName: 'Apollo 11–17 Deployment Perimeter',
        region: '100–300 m from each Apollo LM site',
        lat: 0.67408,
        lon: 23.47297,
        coordinateText: 'Deployed 100–300 m from Apollo 11, 12, 14, 15, 16, 17 sites',
        statusNote: 'Primary coordinate plotted at Apollo 11 EASEP sector.',
      },
    ],
    keyDates: [
      { label: 'Deployment Window', value: '1969 – 1972' },
      { label: 'Official NASA Telemetry Shutdown', value: 'September 30, 1977' },
      { label: 'Laser Retroreflector Status', value: '100% Operational Today' },
    ],
    specifications: [
      { label: 'Power Source', value: 'SNAP-27 RTG (~70W DC power fueled by Plutonium-238)' },
      { label: 'Primary Instruments', value: 'Passive Seismic Experiment (PSE), Lunar Surface Magnetometer (LSM), Heat Flow Experiment (HFE)' },
      { label: 'LRRR Optical Design', value: 'Fused silica corner-cube optical prisms (Apollo 11 & 14: 100 prisms; Apollo 15: 300 prisms)' },
      { label: 'Total Station Mass & Dimensions', value: 'Unknown (Not specified in reference)' },
    ],
    comparison: {
      massSummary: 'Unknown (Not specified in reference)',
      dimensionsSummary: 'Unknown (Not specified in reference)',
      powerSource: 'SNAP-27 RTG (~70W DC, Pu-238) + Passive LRRR',
      distanceTraveled: 'Stationary (deployed 100–300 m from LM)',
      lifespanSummary: 'Telemetry 1969–1977; LRRR ongoing >55 yrs',
    },
    achievements: [
      'Recorded multi-year moonquake seismic networks, solar wind, heat flow, and magnetic field data until 1977.',
      'Passive Laser Retroreflectors require zero electrical power and remain 100% operational today.',
      'Earth-to-Moon laser ranging proves the Moon is receding from Earth by 3.8 cm/year.',
    ],
    abandonmentReason:
      'Engineered as permanent surface installations. Active telemetry was turned off by NASA on September 30, 1977 due to budget constraints.',
    currentStatus:
      'Active radio telemetry is shut down, but the passive fused-silica Laser Retroreflectors remain operational and are routinely targeted by Earth observatories.',
    timeline: [
      {
        date: 'July 21, 1969',
        sortYear: 1969.55,
        title: 'EASEP & First Retroreflector Deployed',
        detail: 'Apollo 11 crew deploys the Early Apollo Scientific Experiments Package and 100-prism LRRR.',
      },
      {
        date: '1969 – 1972',
        sortYear: 1971.0,
        title: 'Network Expansion (Apollo 12–17)',
        detail: 'SNAP-27 RTG-powered ALSEP stations and expanded 300-prism Apollo 15 retroreflector established.',
      },
      {
        date: 'September 30, 1977',
        sortYear: 1977.75,
        title: 'Telemetry Shutdown',
        detail: 'NASA switches off ALSEP radio transmissions due to budget constraints.',
      },
      {
        date: 'Present Day',
        sortYear: 2026.0,
        title: 'Ongoing Laser Ranging',
        detail: 'Passive corner-cube arrays continue returning Earth laser pulses, tracking the 3.8 cm/year recession.',
      },
    ],
    hotspots: [
      {
        id: 'snap27-rtg',
        label: 'SNAP-27 RTG Finned Cask',
        position: [-0.8, 0.35, -0.35],
        annotation: 'Plutonium-238 radioisotope generator supplying ~70 W DC continuously through frigid lunar nights.',
      },
      {
        id: 'lrrr-array',
        label: 'Corner-Cube Retroreflector Panel',
        position: [0.85, 0.25, 0.55],
        annotation: '100 to 300 fused-silica optical prisms requiring zero power; still actively reflecting Earth laser pulses.',
      },
      {
        id: 'central-station',
        label: 'Central Telemetry Hub & Antenna',
        position: [0.0, 0.65, 0.0],
        annotation: 'Command receiver and helical antenna relaying seismic and magnetometer readings until Sept 30, 1977.',
      },
    ],
    nasaImage: {
      assetId: 'AS12-47-6918',
      description: 'Deployed Apollo 12 ALSEP scientific instruments on Oceanus Procellarum',
      attribution: 'NASA / Apollo 12 Crew',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/as12-47-6918',
    },
    nasa3dAsset: {
      availabilityStatus: 'cad-shape-archive',
      availabilityLabel: '2D Archives / LROC Altimetry',
      assetName: 'NASA SVS #4868 Visualization',
      format: 'LROC Altimetry / SVS Media',
      fileSize: 'Unknown',
      downloadLocation: 'NASA Scientific Visualization Studio',
      technicalNotes: 'Documented in LROC surface photography and NASA SVS #4868.',
      portalUrl: 'https://svs.gsfc.nasa.gov/',
    },
  },
  {
    id: 'surveyor-program',
    accessionNumber: 'ACC.MOON.04',
    officialName: 'Surveyor Program Landers (Surveyor 1 through Surveyor 7)',
    shortTitle: 'Surveyor Landers (1–7)',
    mission: 'NASA Jet Propulsion Laboratory Surveyor Program (1966–1968)',
    targetBody: 'moon',
    targetBodyLabel: 'The Moon',
    operationalPeriod: '1966 – 1968',
    dispositionCategory: 'hardware-malfunction',
    dispositionLabel: 'Intentionally Left Behind & Crash Relics',
    dispositionShort: 'Intentionally Left Behind / Crashes',
    cardSnippet:
      'Seven robotic lunar scouts that proved soft radar landings and soil strength before Apollo arrived.',
    visualImage: realmMoonSurfaceImg,
    visualStudyLabel: 'Curatorial Visual Study · Oceanus Procellarum Basin',
    historicalBackground:
      'Before any human could risk landing on the Moon, JPL launched seven robotic tripod landers to prove that lunar dust would not swallow a spacecraft whole. Five succeeded brilliantly—and Surveyor 3 was later visited in person by Apollo 12 astronauts.',
    originalPurpose:
      'Robotic soft-landing demonstrators built to test automated landing radar, measure soil bearing strength, and capture surface TV imagery to confirm the lunar surface could support Apollo landers.',
    locations: [
      {
        siteName: 'Surveyor 1',
        region: 'Oceanus Procellarum',
        lat: -2.474,
        lon: -43.339,
        coordinateText: '2.474° S, 43.339° W (June 2, 1966 · 11,237 images)',
        statusNote: 'Intentionally Left Behind / Silent',
      },
      {
        siteName: 'Surveyor 2',
        region: 'Near Copernicus Crater',
        lat: 5.5,
        lon: -12.0,
        coordinateText: '5.5° N, 12.0° W (Crashed Sept 23, 1966)',
        statusNote: 'Impact Crash Site (mid-course thruster failed)',
      },
      {
        siteName: 'Surveyor 3',
        region: 'Oceanus Procellarum',
        lat: -3.015,
        lon: -23.418,
        coordinateText: '3.015° S, 23.418° W (April 20, 1967 · 6,315 images)',
        statusNote: 'Visited Nov 20, 1969 by Apollo 12 crew',
      },
      {
        siteName: 'Surveyor 4',
        region: 'Sinus Medii',
        lat: 0.45,
        lon: -1.39,
        coordinateText: '0.45° N, 1.39° W (Crashed July 17, 1967)',
        statusNote: 'Impact Crash Site (telemetry lost 2 mins before landing)',
      },
      {
        siteName: 'Surveyor 5',
        region: 'Mare Tranquillitatis',
        lat: 1.461,
        lon: 23.195,
        coordinateText: '1.461° N, 23.195° E (Sept 11, 1967)',
        statusNote: 'First chemical analysis via alpha-scattering',
      },
      {
        siteName: 'Surveyor 6',
        region: 'Sinus Medii',
        lat: 0.473,
        lon: -1.48,
        coordinateText: '0.473° N, 1.480° W (Nov 10, 1967)',
        statusNote: 'Executed first powered lunar hop (4 m)',
      },
      {
        siteName: 'Surveyor 7',
        region: 'Tycho Crater Rim',
        lat: -40.974,
        lon: -11.439,
        coordinateText: '40.974° S, 11.439° W (Jan 10, 1968)',
        statusNote: 'Explored highland ejecta',
      },
    ],
    keyDates: [
      { label: 'Surveyor 1 Soft Landing', value: 'June 2, 1966' },
      { label: 'Surveyor 3 Landing', value: 'April 20, 1967' },
      { label: 'Surveyor 7 Highland Landing', value: 'January 10, 1968' },
      { label: 'Apollo 12 Visit to Surveyor 3', value: 'November 20, 1969' },
    ],
    specifications: [
      { label: 'Landed Mass', value: '~290–300 kg', phaseNote: 'Dry landed spacecraft' },
      { label: 'Height', value: '3.0 m' },
      { label: 'Chassis', value: 'Tripod chassis with aluminum tubular legs and overhead solar array panel' },
    ],
    comparison: {
      massSummary: '~290–300 kg (Landed mass)',
      dimensionsSummary: '3.0 m height (tripod span)',
      powerSource: 'Overhead solar panel + batteries',
      distanceTraveled: '4 m powered hop (Surveyor 6)',
      lifespanSummary: '1966 – 1968 (7 spacecraft)',
    },
    achievements: [
      'Surveyor 1 transmitted 11,237 images proving robotic soft landing on lunar regolith.',
      'Surveyor 3 performed the first lunar soil trenching and later had its camera & scoop returned to Earth by Apollo 12 astronauts Pete Conrad and Alan Bean.',
      'Surveyor 5 conducted the first chemical analysis of lunar soil using an alpha-scattering instrument.',
      'Surveyor 6 executed the first powered lunar hop, lifting 4 meters across the surface.',
    ],
    abandonmentReason:
      'Five soft landers were intentionally left behind after completing surface telemetry; Surveyor 2 suffered a mid-course thruster failure and Surveyor 4 lost telemetry two minutes before landing, creating impact crash sites.',
    currentStatus:
      'Five intact silent landers (Surveyor 1, 3, 5, 6, 7) and two crash sites (Surveyor 2, 4) remain across the lunar nearside.',
    timeline: [
      {
        date: 'June 2, 1966',
        sortYear: 1966.42,
        title: 'Surveyor 1 Touchdown',
        detail: 'First U.S. soft lunar landing in Oceanus Procellarum; transmits 11,237 images.',
      },
      {
        date: 'April 17, 1967',
        sortYear: 1967.29,
        title: 'Surveyor 3 Launch',
        detail: 'Launched from Cape Canaveral toward Oceanus Procellarum.',
      },
      {
        date: 'April 20, 1967',
        sortYear: 1967.3,
        title: 'Surveyor 3 Soft Touchdown',
        detail: 'Lands inside a crater in Oceanus Procellarum and conducts first soil trenching.',
      },
      {
        date: 'May 3, 1967',
        sortYear: 1967.34,
        title: 'Surveyor 3 Final Signal',
        detail: 'Concludes transmission after 6,315 TV images.',
      },
      {
        date: 'November 10, 1967 & January 10, 1968',
        sortYear: 1968.02,
        title: 'Surveyor 6 Hop & Surveyor 7 Highland Landing',
        detail: 'Surveyor 6 hops 4 m in Sinus Medii; Surveyor 7 analyzes Tycho Crater rim.',
      },
      {
        date: 'November 19–20, 1969',
        sortYear: 1969.89,
        title: 'Apollo 12 Inspection of Surveyor 3',
        detail: 'LM Intrepid lands 180 m away; Pete Conrad and Alan Bean walk to Surveyor 3 to unbolt its camera and scoop.',
      },
    ],
    hotspots: [
      {
        id: 'tripod-legs',
        label: 'Aluminum Tripod Landing Gear',
        position: [0.95, 0.18, 0.55],
        annotation: 'Three tubular aluminum legs with crushable footpads designed to verify lunar bearing strength.',
      },
      {
        id: 'solar-mast',
        label: 'Overhead Solar Array & Mast',
        position: [0.0, 1.45, 0.0],
        annotation: '3.0 m tall mast supporting the steerable solar panel and planar high-gain antenna.',
      },
      {
        id: 'soil-scoop',
        label: 'Surface Sampler & TV Camera',
        position: [0.42, 0.55, 0.45],
        annotation: 'Soil trenching scoop and television camera retrieved from Surveyor 3 by Apollo 12 astronauts in 1969.',
      },
    ],
    nasaImage: {
      assetId: 'AS12-48-7136 / NASA JPL Photojournal',
      description: 'Apollo 12 astronaut inspecting Surveyor 3 lander',
      attribution: 'NASA / Apollo 12 Crew',
      portalName: 'NASA JPL Photojournal',
      portalUrl: 'https://photojournal.jpl.nasa.gov/',
    },
    nasa3dAsset: {
      availabilityStatus: 'cad-shape-archive',
      availabilityLabel: 'LROC DEMs & Stereo Scans',
      assetName: 'LROC Stereo DEM Maps',
      format: 'LROC Stereo DEM / Photo Archives',
      fileSize: 'Unknown',
      downloadLocation: 'LROC ASU Repository',
      technicalNotes: 'Documented via LROC Stereo DEM maps and Apollo 12 handheld photography.',
      portalUrl: 'https://www.lroc.asu.edu/',
    },
  },
  {
    id: 'lunokhod-rovers',
    accessionNumber: 'ACC.MOON.05',
    officialName: 'Lunokhod 1 (Luna 17) & Lunokhod 2 (Luna 21)',
    shortTitle: 'Soviet Lunokhod 1 & 2 Rovers',
    mission: 'Soviet Union Luna Program (1970–1973)',
    targetBody: 'moon',
    targetBodyLabel: 'The Moon',
    operationalPeriod: '1970 – 1973',
    dispositionCategory: 'depleted-environmental',
    dispositionLabel: 'Depleted / Environmentally Decommissioned Hardware',
    dispositionShort: 'Depleted / Overheated',
    cardSnippet:
      'Eight-wheeled remote-controlled Soviet lunar rovers, including one whose French laser reflector remains active.',
    visualImage: realmMoonSurfaceImg,
    visualStudyLabel: 'Curatorial Visual Study · Mare Imbrium & Le Monnier',
    historicalBackground:
      'Before human-driven Apollo buggies rolled across the Moon, Soviet engineers landed Lunokhod 1 in November 1970—the first successful remote-controlled robotic rover on another celestial body—followed by the long-distance Lunokhod 2 in 1973.',
    originalPurpose:
      'Eight-wheeled remote-controlled robotic rovers engineered to traverse lunar maria, transmit TV panoramas, analyze soil density with cone penetrometers, and conduct X-ray fluorescence tests.',
    locations: [
      {
        siteName: 'Lunokhod 1 (Luna 17)',
        region: 'Mare Imbrium',
        lat: 38.28,
        lon: -35.0,
        coordinateText: '38.28° N, 325.00° E',
        statusNote: 'Silent surface rover; French retroreflector active',
      },
      {
        siteName: 'Lunokhod 2 (Luna 21)',
        region: 'Le Monnier Crater',
        lat: 25.85,
        lon: 30.45,
        coordinateText: '25.85° N, 30.45° E',
        statusNote: 'Silent surface rover (overheated May 1973)',
      },
    ],
    keyDates: [
      { label: 'Lunokhod 1 Landing', value: 'November 17, 1970' },
      { label: 'Lunokhod 1 Last Contact', value: 'September 14, 1971' },
      { label: 'Lunokhod 2 Landing', value: 'January 15, 1973' },
      { label: 'Lunokhod 2 Loss', value: 'May 1973' },
    ],
    specifications: [
      { label: 'Mass (Lunokhod 1)', value: '756 kg' },
      { label: 'Mass (Lunokhod 2)', value: '840 kg' },
      { label: 'Length × Width', value: '2.3 m L × 1.5 m W (Height: Unknown in reference)' },
      { label: 'Power & Thermal', value: 'Solar panel lid charging internal batteries with Polonium-210 radioisotope thermal heater' },
    ],
    comparison: {
      massSummary: '756 kg (Lunokhod 1) / 840 kg (Lunokhod 2)',
      dimensionsSummary: '2.3 m L × 1.5 m W (Height: Unknown)',
      powerSource: 'Solar panel lid + Polonium-210 thermal heater',
      distanceTraveled: '10.5 km (L1) / 39 km (L2)',
      lifespanSummary: '322 days (L1) / 4 months (L2)',
    },
    achievements: [
      'Lunokhod 1 operated for 322 Earth days (10 lunar days) and drove 10.5 km across Mare Imbrium.',
      'Lunokhod 2 traversed 39 km in 4 months inside Le Monnier Crater.',
      'Lunokhod 1 carries a French corner-cube retroreflector rediscovered by LRO and still active for laser ranging.',
    ],
    abandonmentReason:
      'Lunokhod 1 ceased contact on September 14, 1971 after exhausting its Polonium-210 thermal source. In May 1973, Lunokhod 2 accidentally scooped loose lunar soil onto its open lid radiator inside a crater; closing the lid dumped regolith onto the radiator, causing fatal overheating.',
    currentStatus:
      'Both rovers rest permanently on the lunar maria; Lunokhod 1’s French laser retroreflector remains active.',
    timeline: [
      {
        date: 'November 17, 1970',
        sortYear: 1970.88,
        title: 'Lunokhod 1 Arrives on Luna 17',
        detail: 'First robotic rover rolls onto the Moon in Mare Imbrium.',
      },
      {
        date: 'September 14, 1971',
        sortYear: 1971.7,
        title: 'Lunokhod 1 Final Contact',
        detail: 'Concludes 322 Earth days and 10.5 km of lunar exploration.',
      },
      {
        date: 'January 15, 1973',
        sortYear: 1973.04,
        title: 'Lunokhod 2 Arrives on Luna 21',
        detail: 'Lands in Le Monnier Crater and begins a 39 km traverse.',
      },
      {
        date: 'May 1973',
        sortYear: 1973.38,
        title: 'Radiator Dust Overheating',
        detail: 'Open lid scoops crater wall dust onto the thermal radiator, causing fatal overheating when closed.',
      },
    ],
    hotspots: [
      {
        id: 'solar-lid',
        label: 'Hinged Solar Panel Lid',
        position: [0.0, 0.85, -0.35],
        annotation: 'Opened during lunar daylight to charge batteries and closed at night over the pressurized hull.',
      },
      {
        id: 'eight-wheels',
        label: 'Eight-Wheel Independent Suspension',
        position: [0.85, 0.22, 0.55],
        annotation: 'Eight spoked titanium-alloy wire-mesh wheels driven independently over basaltic craters.',
      },
      {
        id: 'french-lrrr',
        label: 'French Laser Retroreflector',
        position: [0.0, 0.62, 0.88],
        annotation: 'Mounted forward on Lunokhod 1; located in LRO imagery (PIA12967) and still returning Earth laser pulses.',
      },
    ],
    nasaImage: {
      assetId: 'PIA12967 / NASA LROC / SVS #10595',
      description: 'Lunokhod 1 landing site and track marks from orbit',
      attribution: 'NASA / GSFC / Arizona State Univ.',
      portalName: 'NASA LROC / JPL Photojournal',
      portalUrl: 'https://photojournal.jpl.nasa.gov/',
    },
    nasa3dAsset: {
      availabilityStatus: 'image-only',
      availabilityLabel: 'LROC Orbital Photos & Laser Ranging',
      assetName: 'PIA12967 LROC Orbital Capture',
      format: 'Orbital Imagery',
      fileSize: 'Unknown',
      downloadLocation: 'NASA LROC / SVS #10595',
      technicalNotes: 'NASA LROC imagery documents Luna 17 landing stage and Lunokhod 1 tracks.',
      portalUrl: 'https://www.lroc.asu.edu/',
    },
  },
  {
    id: 'pathfinder-sojourner',
    accessionNumber: 'ACC.MARS.01',
    officialName: 'Mars Pathfinder Lander (Carl Sagan Memorial Station) & Sojourner Microrover',
    shortTitle: 'Mars Pathfinder & Sojourner',
    mission: 'NASA Discovery Program / Mars Pathfinder (1996–1997)',
    targetBody: 'mars',
    targetBodyLabel: 'Mars',
    operationalPeriod: '1997',
    dispositionCategory: 'depleted-environmental',
    dispositionLabel: 'Depleted / Environmentally Decommissioned Hardware',
    dispositionShort: 'Depleted (Nighttime thermal battery)',
    cardSnippet:
      'Airbag-cushioned tetrahedron station and the microwave-oven-sized microrover that pioneered Mars mobility.',
    visualImage: realmMarsSurfaceImg,
    visualStudyLabel: 'Curatorial Visual Study · Ares Vallis Outflow Plain',
    historicalBackground:
      'Arriving on July 4, 1997 inside bouncing airbags, Mars Pathfinder proved NASA’s "faster, better, cheaper" Discovery paradigm and deployed Sojourner—the first wheeled robot ever to roam the Martian surface.',
    originalPurpose:
      'Technology demonstrator sent to validate airbag landing systems and field the first mobile microrover on Mars to explore surface rocks and soil.',
    locations: [
      {
        siteName: 'Carl Sagan Memorial Station',
        region: 'Ares Vallis, Chryse Planitia',
        lat: 19.13,
        lon: -33.22,
        coordinateText: '19.13° N, 33.22° W',
      },
    ],
    keyDates: [
      { label: 'Launch', value: 'December 4, 1996' },
      { label: 'Mars Landing', value: 'July 4, 1997' },
      { label: 'Final Contact', value: 'September 27, 1997' },
    ],
    specifications: [
      { label: 'Sojourner Mass', value: '10.6 kg (Earth mass) / 0.68 kg (Mars mass — per source ref)' },
      { label: 'Sojourner Dimensions', value: '65 cm L × 48 cm W × 30 cm H' },
      { label: 'Pathfinder Landed Mass', value: '360 kg (landed mass); tetrahedron structure with solar panels' },
      { label: 'Science Instruments', value: 'Alpha Proton X-ray Spectrometer (APXS), IMP camera array' },
    ],
    comparison: {
      massSummary: '360 kg (Lander) + 10.6 kg (Sojourner Earth mass)',
      dimensionsSummary: '65 × 48 × 30 cm (Sojourner)',
      powerSource: 'Solar panels + non-rechargeable thermal battery',
      distanceTraveled: 'Rested meters from lander (exact meters unspecified)',
      lifespanSummary: '83 sols (Planned: 7 days)',
    },
    achievements: [
      'Validated airbag-cushioned landing technology later scaled up for Spirit and Opportunity.',
      'Fielded the first mobile microrover on Mars, operating 83 sols against a 7-day baseline plan.',
      'Analyzed Martian rocks and soil chemistry using the APXS spectrometer and IMP stereo camera.',
    ],
    abandonmentReason:
      'Intentionally non-returnable mission. Final communication failure occurred due to mainboard battery failure after 83 sols of operation.',
    currentStatus:
      'Carl Sagan Memorial Station rests open on Ares Vallis with Sojourner parked meters away.',
    timeline: [
      {
        date: 'December 4, 1996',
        sortYear: 1996.93,
        title: 'Launch from Cape Canaveral',
        detail: 'Mars Pathfinder begins its seven-month cruise to Mars.',
      },
      {
        date: 'July 4, 1997',
        sortYear: 1997.51,
        title: 'Airbag Touchdown at Ares Vallis',
        detail: 'Lander bounces to rest in Chryse Planitia and opens its solar petals; Sojourner rolls down ramp.',
      },
      {
        date: 'September 27, 1997',
        sortYear: 1997.74,
        title: 'Final Transmission',
        detail: 'Mainboard battery failure ends communications after 83 Martian sols.',
      },
    ],
    hotspots: [
      {
        id: 'tetrahedron-petals',
        label: 'Unfolded Tetrahedron Solar Petals',
        position: [0.0, 0.2, 0.0],
        annotation: 'Three hinged triangular petals righted the lander after airbag deflation and supplied solar power.',
      },
      {
        id: 'sojourner-rover',
        label: 'Sojourner Microrover',
        position: [1.05, 0.18, 0.65],
        annotation: '10.6 kg six-wheeled rover carrying an Alpha Proton X-ray Spectrometer (APXS) for rock chemistry.',
      },
      {
        id: 'imp-mast',
        label: 'IMP Stereo Camera Mast',
        position: [-0.15, 0.85, -0.15],
        annotation: 'Imager for Mars Pathfinder captured panoramic surface vistas and tracked Sojourner’s path.',
      },
    ],
    nasaImage: {
      assetId: 'PIA00766',
      description: 'Sojourner microrover analyzing rock "Yogi" at Ares Vallis',
      attribution: 'NASA / JPL-Caltech',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/PIA00766',
    },
    nasa3dAsset: {
      availabilityStatus: 'image-only',
      availabilityLabel: 'NASA Photo Archives',
      assetName: 'PIA00604 Archive',
      format: 'NASA Image Archives',
      fileSize: 'Unknown',
      downloadLocation: 'NASA JPL Image Archives',
      technicalNotes: 'Documented in NASA JPL Photojournal archives; no standalone GLB listed.',
      portalUrl: 'https://photojournal.jpl.nasa.gov/',
    },
    verificationNote:
      'Note: The reference document lists Sojourner’s Mars weight/mass entry as 0.68 kg alongside its 10.6 kg Earth mass (exact Earth-to-Mars gravity conversion is ~4.0 kg weight-equivalent). Both source numbers are preserved transparently.',
  },
  {
    id: 'spirit-rover',
    accessionNumber: 'ACC.MARS.02',
    officialName: 'Mars Exploration Rover A (Spirit)',
    shortTitle: 'Spirit Rover (MER-A)',
    mission: 'NASA Mars Exploration Rover Program (2003–2011)',
    targetBody: 'mars',
    targetBodyLabel: 'Mars',
    operationalPeriod: '2004 – 2010',
    dispositionCategory: 'depleted-environmental',
    dispositionLabel: 'Depleted / Environmentally Decommissioned Hardware',
    dispositionShort: 'Depleted (Stuck in sand / winter)',
    cardSnippet:
      'Robotic geologist that discovered ancient hot-spring silica deposits before becoming trapped in soft sand at Troy.',
    visualImage: realmMarsSurfaceImg,
    visualStudyLabel: 'Curatorial Visual Study · Gusev Crater / "Troy"',
    historicalBackground:
      'Designed for a 90-sol trek across Gusev Crater, Spirit drove across basaltic plains and climbed the Columbia Hills for over five years before breaking through a surface crust into soft iron-sulfate sand.',
    originalPurpose:
      'Mobile robotic geologist sent to explore Gusev Crater for signs of past water ice and volcanic lake activity.',
    locations: [
      {
        siteName: 'Columbia Memorial Station ("Troy" final site)',
        region: 'Gusev Crater',
        lat: -14.5692,
        lon: 175.4729,
        coordinateText: '14.5692° S, 175.4729° E',
        statusNote: 'Final rover traverse endpoint ("Troy")',
      },
    ],
    keyDates: [
      { label: 'Launch', value: 'June 10, 2003' },
      { label: 'Landing at Gusev Crater', value: 'January 4, 2004' },
      { label: 'Stuck in Sand ("Troy")', value: 'May 1, 2009' },
      { label: 'Final Signal', value: 'March 22, 2010' },
      { label: 'Officially Decommissioned', value: 'May 25, 2011' },
    ],
    specifications: [
      { label: 'Mass', value: '185 kg' },
      { label: 'Dimensions', value: '1.5 m H × 2.3 m W × 1.6 m L' },
      { label: 'Power', value: 'Solar arrays generating up to 140W DC power' },
      { label: 'Drive System', value: '6-wheel rocker-bogie mechanism' },
      { label: 'Total Distance Driven', value: '7.73 km' },
    ],
    comparison: {
      massSummary: '185 kg (Rover dry/landed mass)',
      dimensionsSummary: '1.5 m H × 2.3 m W × 1.6 m L',
      powerSource: 'Solar arrays (up to 140W DC)',
      distanceTraveled: '7.73 km',
      lifespanSummary: '6+ Earth years (Planned: 90 sols)',
    },
    achievements: [
      'Discovered 90% pure silica deposits in Gusev Crater—key evidence of ancient Martian hot springs or fumaroles.',
      'Drove 7.73 km across crater plains and up Husband Hill.',
      'Operated as a stationary science station for nearly a year after becoming immobilized.',
    ],
    abandonmentReason:
      'In May 2009, Spirit broke through a thin surface crust into soft iron-sulfate sand at "Troy." Unable to free its wheels or tilt its dusty solar arrays toward the winter sun, power fell below survival thresholds in March 2010.',
    currentStatus:
      'Stationary and permanently silent embedded in the iron-sulfate sand of Troy, Gusev Crater.',
    timeline: [
      {
        date: 'June 10, 2003',
        sortYear: 2003.44,
        title: 'Launch from Cape Canaveral',
        detail: 'Spirit lifts off aboard a Delta II rocket ahead of twin Opportunity.',
      },
      {
        date: 'January 4, 2004',
        sortYear: 2004.01,
        title: 'Airbag Landing in Gusev Crater',
        detail: 'Touches down at Columbia Memorial Station.',
      },
      {
        date: 'May 1, 2009',
        sortYear: 2009.33,
        title: 'Immobilized at "Troy"',
        detail: 'Wheels sink through brittle crust into soft iron-sulfate sand.',
      },
      {
        date: 'March 22, 2010',
        sortYear: 2010.22,
        title: 'Final Winter Signal',
        detail: 'Low solar-array tilt during Martian winter prevents further communications.',
      },
      {
        date: 'May 25, 2011',
        sortYear: 2011.4,
        title: 'Mission Officially Decommissioned',
        detail: 'NASA ends recovery listening after 7.73 km driven.',
      },
    ],
    hotspots: [
      {
        id: 'solar-deck',
        label: '140 W Solar Array Wings',
        position: [0.0, 0.72, 0.0],
        annotation: 'Fold-out triple-junction solar wings that powered Spirit for over 6 years until Martian winter tilt loss.',
      },
      {
        id: 'rocker-bogie',
        label: '6-Wheel Rocker-Bogie Suspension',
        position: [0.95, 0.22, 0.6],
        annotation: 'Articulated six-wheel suspension that carried Spirit 7.73 km before entrapping at Troy.',
      },
      {
        id: 'pancam-mast',
        label: 'Pancam Mast Assembly',
        position: [0.0, 1.38, 0.45],
        annotation: '1.5 m panoramic camera mast used for navigation, stereo terrain imaging, and solar-array selfies.',
      },
    ],
    nasaImage: {
      assetId: 'PIA12007',
      description: 'Spirit rover wheels embedded in soft sand at "Troy" on Sol 1899',
      attribution: 'NASA / JPL-Caltech / Cornell',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/PIA12007',
    },
    nasa3dAsset: {
      availabilityStatus: 'verified-glb',
      availabilityLabel: 'Verified NASA GLB Reference',
      assetName: '24883_MER_static.glb',
      format: 'glTF / USDZ',
      fileSize: '11.36 MB',
      downloadLocation: 'NASA Science 3D Resources',
      technicalNotes: 'Static MER model showing solar panels & mast.',
      portalUrl: 'https://science.nasa.gov/3d-resources/',
    },
    verificationNote:
      'Coordinates reflect Spirit’s traverse map endpoint at "Troy" rather than a single fixed lander point.',
  },
  {
    id: 'opportunity-rover',
    accessionNumber: 'ACC.MARS.03',
    officialName: 'Mars Exploration Rover B (Opportunity)',
    shortTitle: 'Opportunity Rover (MER-B)',
    mission: 'NASA Mars Exploration Rover Program (2003–2019)',
    targetBody: 'mars',
    targetBodyLabel: 'Mars',
    operationalPeriod: '2004 – 2018',
    dispositionCategory: 'depleted-environmental',
    dispositionLabel: 'Depleted / Environmentally Decommissioned Hardware',
    dispositionShort: 'Depleted (Global dust storm)',
    cardSnippet:
      'The legendary MER rover that drove 45 km across Mars over 14.5 years before a global dust storm.',
    visualImage: realmMarsSurfaceImg,
    visualStudyLabel: 'Curatorial Visual Study · Perseverance Valley, Endeavour Crater',
    historicalBackground:
      'Engineered for a 90-sol sprint, Opportunity became an icon of endurance—crossing craters for 5,111 Martian sols (14.5 Earth years) and setting the off-world driving distance record before a planet-encircling dust storm blotted out the Sun.',
    originalPurpose:
      'Mobile robotic geologist sent to explore Meridiani Planum for hematite mineral deposits indicating past liquid water.',
    locations: [
      {
        siteName: 'Perseverance Valley (Endeavour Crater Rim)',
        region: 'Meridiani Planum',
        lat: -1.9483,
        lon: 354.4742,
        coordinateText: '1.9483° S, 354.4742° E',
        statusNote: 'Final rover traverse endpoint',
      },
    ],
    keyDates: [
      { label: 'Launch', value: 'July 7, 2003' },
      { label: 'Landing at Meridiani Planum', value: 'January 25, 2004' },
      { label: 'Final Contact', value: 'June 10, 2018' },
      { label: 'Officially Decommissioned', value: 'February 13, 2019' },
    ],
    specifications: [
      { label: 'Mass', value: '185 kg' },
      { label: 'Dimensions', value: '1.5 m H × 2.3 m W × 1.6 m L' },
      { label: 'Total Distance Driven', value: '45.16 km (Off-world driving record)' },
      { label: 'Operational Lifespan', value: '5,111 Sols (14.5 years; planned: 90 days)' },
    ],
    comparison: {
      massSummary: '185 kg (Rover dry/landed mass)',
      dimensionsSummary: '1.5 m H × 2.3 m W × 1.6 m L',
      powerSource: 'Solar arrays + lithium-ion batteries',
      distanceTraveled: '45.16 km (Off-world record)',
      lifespanSummary: '5,111 Sols / 14.5 years (Planned: 90 days)',
    },
    achievements: [
      'Set the off-world driving record of 45.16 km across Meridiani Planum.',
      'Operated for 5,111 sols (14.5 years)—over 55× its planned 90-day mission.',
      'Confirmed widespread evidence of ancient surface and groundwater across Eagle, Endurance, Victoria, and Endeavour craters.',
    ],
    abandonmentReason:
      'A massive global dust storm enveloped Mars in June 2018, completely blocking solar irradiance. The rover suffered catastrophic battery depletion and could not reboot.',
    currentStatus:
      'Resting silently on the slope of Perseverance Valley along the western rim of Endeavour Crater.',
    timeline: [
      {
        date: 'July 7, 2003',
        sortYear: 2003.52,
        title: 'Launch from Cape Canaveral',
        detail: 'MER-B Opportunity departs Earth bound for Meridiani Planum.',
      },
      {
        date: 'January 25, 2004',
        sortYear: 2004.07,
        title: 'Hole-in-One Landing in Eagle Crater',
        detail: 'Airbag landing delivers Opportunity directly onto layered bedrock.',
      },
      {
        date: 'June 10, 2018',
        sortYear: 2018.44,
        title: 'Final Signal in Global Dust Storm',
        detail: 'Darkened skies over Perseverance Valley starve the solar arrays; Opportunity enters critical low-power fault.',
      },
      {
        date: 'February 13, 2019',
        sortYear: 2019.12,
        title: 'Mission Declared Complete',
        detail: 'After >1,000 recovery commands and 45.16 km driven, NASA closes the MER-B mission.',
      },
    ],
    hotspots: [
      {
        id: 'merb-pancam',
        label: 'Pancam Mast & Navcam Stereo Head',
        position: [0.04, 1.48, -0.37],
        annotation:
          '1.5 m elevated camera mast carrying dual Pancam color imagers, Navcams, and the Mini-TES thermal spectrometer.',
      },
      {
        id: 'merb-solar',
        label: 'Deployable Solar Array Wings',
        position: [0.86, 0.68, 0.12],
        annotation:
          'Triple-junction gallium-arsenide solar panels that powered 5,111 sols until the June 2018 global dust storm dropped sky opacity past survival limits.',
      },
      {
        id: 'merb-arm',
        label: 'Instrument Deployment Device (IDD)',
        position: [0.0, 0.42, -0.46],
        annotation:
          'Five-degree-of-freedom forward robotic arm bearing the Rock Abrasion Tool (RAT), Microscopic Imager, APXS, and Mössbauer spectrometer.',
      },
      {
        id: 'merb-wheels',
        label: '6-Wheel Rocker-Bogie Suspension',
        position: [-0.56, 0.18, -0.52],
        annotation:
          'Six independently steered 25 cm cleated aluminum wheels that carried Opportunity a record 45.16 km across Meridiani Planum.',
      },
      {
        id: 'merb-hga',
        label: 'High-Gain Dish & Warm Electronics Box',
        position: [-0.36, 1.02, 0.48],
        annotation:
          'Steerable X-band parabolic antenna and insulated rover electronics deck housing lithium-ion batteries and flight computers.',
      },
    ],
    nasaImage: {
      assetId: 'PIA15114',
      description: 'Opportunity rover Navcam self-portrait showing dust-coated solar deck',
      attribution: 'NASA / JPL-Caltech / Cornell / ASU',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/PIA15114',
    },
    nasa3dAsset: {
      availabilityStatus: 'verified-glb',
      availabilityLabel: 'Verified Local NASA GLB',
      assetName: 'opportunity-mer-b.glb',
      format: 'glTF 2.0 (MER_static)',
      fileSize: '11.36 MB',
      downloadLocation: 'NASA Science 3D Resources (VTAD)',
      technicalNotes:
        'Official static NASA Mars Exploration Rover GLB (MER_static) with textured solar wings, Pancam mast, IDD arm, and 6-wheel rocker-bogie chassis.',
      portalUrl: 'https://science.nasa.gov/resource/mars-exploration-rovers-3d-model/',
    },
    verificationNote:
      'Quote Verification: "My battery is low and it’s getting dark" was NOT an exact voice or text message sent by Opportunity, but a poetically paraphrased interpretation by science journalist Jacob Margolis based on telemetry (low state of charge and high atmospheric optical depth tau).',
  },
  {
    id: 'viking-landers',
    accessionNumber: 'ACC.MARS.04',
    officialName: 'Viking Lander 1 (Thomas Mutch Memorial Station) & Viking Lander 2 (Gerald Soffen Memorial Station)',
    shortTitle: 'Viking 1 & Viking 2 Landers',
    mission: 'NASA Viking Program (1975–1982)',
    targetBody: 'mars',
    targetBodyLabel: 'Mars',
    operationalPeriod: '1976 – 1982',
    dispositionCategory: 'depleted-environmental',
    dispositionLabel: 'Depleted / Environmentally Decommissioned Hardware',
    dispositionShort: 'Depleted (Command overwrite / battery)',
    cardSnippet:
      'Plutonium-powered twin landers that transmitted humanity’s first clear surface portraits of Mars.',
    visualImage: realmMarsSurfaceImg,
    visualStudyLabel: 'Curatorial Visual Study · Chryse & Utopia Planitia',
    historicalBackground:
      'In the summer of 1976, Viking 1 and Viking 2 executed the first fully successful U.S. landings on Mars. Fueled by radioisotope generators rather than sunlight, Viking 1 operated for over six years—until an accidental command overwrite severed its radio link.',
    originalPurpose:
      'Fixed surface landers dispatched to capture first high-res color panoramas, analyze atmosphere, and execute automated biology life-detection experiments.',
    locations: [
      {
        siteName: 'Viking 1 (Thomas Mutch Memorial Station)',
        region: 'Chryse Planitia',
        lat: 22.48,
        lon: -47.97,
        coordinateText: '22.48° N, 47.97° W (Landed July 20, 1976 · Final Contact Nov 13, 1982)',
      },
      {
        siteName: 'Viking 2 (Gerald Soffen Memorial Station)',
        region: 'Utopia Planitia',
        lat: 48.269,
        lon: 225.99,
        coordinateText: '48.269° N, 225.99° E (Landed Sept 3, 1976 · Final Contact April 11, 1980)',
      },
    ],
    keyDates: [
      { label: 'Viking 1 Landing', value: 'July 20, 1976' },
      { label: 'Viking 2 Landing', value: 'September 3, 1976' },
      { label: 'Viking 2 Final Contact', value: 'April 11, 1980' },
      { label: 'Viking 1 Final Contact', value: 'November 13, 1982' },
    ],
    specifications: [
      { label: 'Landed Mass', value: '572 kg per lander', phaseNote: 'Stationary surface configuration' },
      { label: 'Power', value: 'Dual SNAP-19 RTGs (radioisotope thermal generator producing 70W DC)' },
      { label: 'Dimensions', value: 'Unknown (Not specified in reference)' },
    ],
    comparison: {
      massSummary: '572 kg per lander (Landed mass)',
      dimensionsSummary: 'Unknown (Not specified in reference)',
      powerSource: 'Dual SNAP-19 RTGs (70W DC)',
      distanceTraveled: 'Stationary fixed landers',
      lifespanSummary: '6+ yrs (V1) / ~3.6 yrs (V2)',
    },
    achievements: [
      'Captured the first high-resolution color surface panoramas of Mars.',
      'Conducted the first automated biological life-detection and atmospheric chemistry experiments on the Martian surface.',
      'Provided multi-year meteorological data across Chryse Planitia and Utopia Planitia.',
    ],
    abandonmentReason:
      'Intentionally stationary landers. Viking 1 failed on November 13, 1982 when an erroneous software update overwrote antenna pointing parameters; Viking 2 failed on April 11, 1980 due to battery depletion.',
    currentStatus:
      'Both memorial stations remain intact and silent on the northern Martian plains.',
    timeline: [
      {
        date: 'July 20, 1976',
        sortYear: 1976.55,
        title: 'Viking 1 Touchdown in Chryse Planitia',
        detail: 'First sustained U.S. surface station begins imaging and meteorology on Mars.',
      },
      {
        date: 'September 3, 1976',
        sortYear: 1976.68,
        title: 'Viking 2 Touchdown in Utopia Planitia',
        detail: 'Second lander deploys automated biology lab and surface sampler.',
      },
      {
        date: 'April 11, 1980',
        sortYear: 1980.28,
        title: 'Viking 2 Final Contact',
        detail: 'Onboard battery depletion ends communications from Utopia Planitia.',
      },
      {
        date: 'November 13, 1982',
        sortYear: 1982.87,
        title: 'Viking 1 Final Contact',
        detail: 'Erroneous software command overwrites high-gain antenna pointing parameters.',
      },
    ],
    hotspots: [
      {
        id: 'snap19-rtg',
        label: 'Dual SNAP-19 RTGs',
        position: [-0.85, 0.52, 0.0],
        annotation: 'Twin Plutonium-238 radioisotope thermal generators producing 70 W DC independent of Martian dust storms.',
      },
      {
        id: 'viking-dish',
        label: 'S-Band High-Gain Dish',
        position: [0.35, 1.25, -0.25],
        annotation: 'Direct-to-Earth steerable antenna whose pointing parameters were accidentally overwritten on Viking 1 in 1982.',
      },
      {
        id: 'biology-sampler',
        label: 'Soil Sampler Boom & Biology Lab',
        position: [0.75, 0.42, 0.65],
        annotation: 'Retractable boom that scooped regolith into the automated life-detection chambers.',
      },
    ],
    nasaImage: {
      assetId: '101-KSC-75P-12',
      description: 'Viking Lander 1 flight spacecraft during pre-launch integration at KSC',
      attribution: 'NASA / Kennedy Space Center',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/101-KSC-75P-12',
    },
    nasa3dAsset: {
      availabilityStatus: 'stl-printable',
      availabilityLabel: 'Printable 3D STL Available',
      assetName: '3D Viking Lander.stl',
      format: 'STL',
      fileSize: '~15 MB',
      downloadLocation: 'NASA 3D Resources',
      technicalNotes: '3D printable mesh (convert to GLB for web).',
      portalUrl: 'https://science.nasa.gov/3d-resources/',
    },
  },
  {
    id: 'phoenix-lander',
    accessionNumber: 'ACC.MARS.05',
    officialName: 'Phoenix Mars Lander',
    shortTitle: 'Phoenix Mars Lander',
    mission: 'NASA Mars Scout Program (2007–2008)',
    targetBody: 'mars',
    targetBodyLabel: 'Mars',
    operationalPeriod: '2008',
    dispositionCategory: 'depleted-environmental',
    dispositionLabel: 'Depleted / Environmentally Decommissioned Hardware',
    dispositionShort: 'Depleted (Polar winter ice crush)',
    cardSnippet:
      'Arctic Mars digger that verified shallow subsurface water ice before polar winter dry ice crushed its solar wings.',
    visualImage: realmMarsSurfaceImg,
    visualStudyLabel: 'Curatorial Visual Study · Vastitas Borealis Arctic Plains',
    historicalBackground:
      'Sent far north to Mars’ arctic permafrost zone, Phoenix’s robotic trenching arm scraped directly into bright subsurface water ice—knowing from launch that the coming polar night would bury the lander beneath frozen carbon dioxide.',
    originalPurpose:
      'Fixed polar lander equipped with a robotic trenching arm to dig into Martian permafrost and analyze ice-soil chemistry.',
    locations: [
      {
        siteName: 'Green Valley',
        region: 'Vastitas Borealis',
        lat: 68.15,
        lon: -125.9,
        coordinateText: '68.15° N, 125.9° W',
      },
    ],
    keyDates: [
      { label: 'Launch', value: 'August 4, 2007' },
      { label: 'Polar Touchdown', value: 'May 25, 2008' },
      { label: 'Final Signal', value: 'November 2, 2008' },
    ],
    specifications: [
      { label: 'Landed Mass', value: '350 kg' },
      { label: 'Span', value: '5.5 m width across solar panels' },
      { label: 'Trenching Arm Depth', value: '18 cm into ice' },
    ],
    comparison: {
      massSummary: '350 kg (Landed mass)',
      dimensionsSummary: '5.5 m width across solar panels',
      powerSource: 'Decagonal solar panel wings',
      distanceTraveled: 'Stationary (18 cm trench depth)',
      lifespanSummary: '~5 months (May – Nov 2008)',
    },
    achievements: [
      'Confirmed subsurface water ice layers within centimeters of the northern Martian surface.',
      'Detected calcium carbonate and perchlorates in Martian polar soil.',
      'Observed snowfall descending from high-altitude Martian clouds.',
    ],
    abandonmentReason:
      'Northern polar winter brought complete darkness and carbon dioxide ice accumulation. The solar panels were crushed under heavy dry-ice buildup during the polar night.',
    currentStatus:
      'Structurally damaged by seasonal CO2 ice accumulation and permanently silent in Vastitas Borealis.',
    timeline: [
      {
        date: 'August 4, 2007',
        sortYear: 2007.59,
        title: 'Launch from Cape Canaveral',
        detail: 'Phoenix Mars Scout mission departs for the northern Martian arctic.',
      },
      {
        date: 'May 25, 2008',
        sortYear: 2008.4,
        title: 'Touchdown in Green Valley',
        detail: 'Powered descent places Phoenix onto polygonal permafrost terrain at 68.15° N.',
      },
      {
        date: 'November 2, 2008',
        sortYear: 2008.84,
        title: 'Polar Night Shutdown',
        detail: 'Dwindling sunlight and approaching CO2 dry-ice winter end operations.',
      },
    ],
    hotspots: [
      {
        id: 'decagonal-wings',
        label: 'Decagonal Solar Array Wings (5.5 m)',
        position: [-1.15, 0.45, 0.0],
        annotation: 'Circular twin arrays spanning 5.5 m; later buckled beneath heavy seasonal CO2 dry ice in polar darkness.',
      },
      {
        id: 'trench-arm',
        label: 'Robotic Trenching Arm (18 cm)',
        position: [0.85, 0.32, 0.62],
        annotation: 'Excavated 18 cm into permafrost, exposing bright subsurface water ice to Phoenix’s cameras and ovens.',
      },
      {
        id: 'wet-chem',
        label: 'TEGA & Wet Chemistry Lab',
        position: [0.0, 0.58, -0.15],
        annotation: 'Analyzed dug soil samples, detecting calcium carbonate and perchlorate salts.',
      },
    ],
    nasaImage: {
      assetId: 'PIA10793',
      description: 'Panorama of Phoenix Mars Lander solar panel and robotic digging arm',
      attribution: 'NASA / JPL-Caltech / Univ. of Arizona / Texas A&M',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/PIA10793',
    },
    nasa3dAsset: {
      availabilityStatus: 'image-only',
      availabilityLabel: 'NASA Image Archives',
      assetName: 'No web GLB model hosted',
      format: 'NASA Image Archives',
      fileSize: 'Unknown',
      downloadLocation: 'NASA JPL Mars Exploration',
      technicalNotes: 'Documented in NASA press archives; no web GLB model hosted on NASA 3D Resources.',
      portalUrl: 'https://science.nasa.gov/3d-resources/',
    },
  },
  {
    id: 'insight-lander',
    accessionNumber: 'ACC.MARS.06',
    officialName: 'Interior Exploration using Seismic Investigations, Geodesy and Heat Transport (InSight)',
    shortTitle: 'InSight Geophysical Lander',
    mission: 'NASA Discovery Program (2018–2022)',
    targetBody: 'mars',
    targetBodyLabel: 'Mars',
    operationalPeriod: '2018 – 2022',
    dispositionCategory: 'depleted-environmental',
    dispositionLabel: 'Depleted / Environmentally Decommissioned Hardware',
    dispositionShort: 'Depleted (Solar array dust buildup)',
    cardSnippet:
      'NASA’s stationary Martian observatory that detected 1,300+ marsquakes before dust choked its solar panels.',
    visualImage: realmMarsSurfaceImg,
    visualStudyLabel: 'Curatorial Visual Study · Elysium Planitia',
    historicalBackground:
      'While rovers scanned the surface, InSight pressed a French-built seismometer directly onto the plains of Elysium Planitia to take Mars’ vital signs—revealing the thickness of its crust and the radius of its liquid iron core.',
    originalPurpose:
      'Fixed geophysical observatory engineered to map the Martian interior crust, mantle, and core using a ground-deployed seismometer and heat flow probe.',
    locations: [
      {
        siteName: 'InSight Landing Site',
        region: 'Elysium Planitia',
        lat: 4.5024,
        lon: 135.6234,
        coordinateText: '4.5024° N, 135.6234° E',
      },
    ],
    keyDates: [
      { label: 'Launch', value: 'May 5, 2018' },
      { label: 'Landing at Elysium Planitia', value: 'November 26, 2018' },
      { label: 'SEIS Surface Deployment', value: 'December 19, 2018' },
      { label: 'Mag 5.0 Marsquake', value: 'May 4, 2022' },
      { label: 'Final Signal', value: 'December 15, 2022' },
      { label: 'Decommissioned', value: 'December 21, 2022' },
    ],
    specifications: [
      { label: 'Landed Mass', value: '358 kg' },
      { label: 'Solar Array Span', value: '6.0 m (Dual UltraFlex panels)' },
      { label: 'Instruments', value: 'SEIS (CNES seismometer), HP3 (DLR "Mole" heat probe), RISE (radio transponders)' },
    ],
    comparison: {
      massSummary: '358 kg (Landed mass)',
      dimensionsSummary: '6.0 m UltraFlex solar span',
      powerSource: 'Dual UltraFlex circular solar panels',
      distanceTraveled: 'Stationary geophysical observatory',
      lifespanSummary: '4 years (2018 – 2022)',
    },
    achievements: [
      'Recorded over 1,300 marsquakes, including a record-breaking Magnitude 5.0 quake on May 4, 2022.',
      'Measured Mars’ liquid core radius (~1,830 km) and mapped its crustal and mantle layers.',
      'Executed the first robotic-arm surface placement of a precision planetary seismometer on Mars.',
    ],
    abandonmentReason:
      'Dust accumulation choked off power generation on the UltraFlex solar panels. After 4 years of science, power dropped below critical shutdown thresholds.',
    currentStatus:
      'Dust-blanketed and permanently silent on Elysium Planitia beside its deployed SEIS dome and heat probe.',
    timeline: [
      {
        date: 'May 5, 2018',
        sortYear: 2018.34,
        title: 'Launch aboard Atlas V',
        detail: 'Lifts off from Vandenberg Air Force Base on a trajectory to Elysium Planitia.',
      },
      {
        date: 'November 26, 2018',
        sortYear: 2018.9,
        title: 'Touchdown on Elysium Planitia',
        detail: 'InSight lands safely on smooth volcanic plains.',
      },
      {
        date: 'December 19, 2018',
        sortYear: 2018.96,
        title: 'SEIS Seismometer Deployed',
        detail: 'Robotic arm sets the CNES seismometer directly onto the Martian regolith.',
      },
      {
        date: 'May 4, 2022',
        sortYear: 2022.34,
        title: 'Magnitude 5.0 Marsquake Detected',
        detail: 'Largest seismic event ever recorded on another planet.',
      },
      {
        date: 'December 15, 2022',
        sortYear: 2022.95,
        title: 'Final Surface Selfie & Signal',
        detail: 'Captures final image showing heavy red dust coating the UltraFlex arrays.',
      },
      {
        date: 'December 21, 2022',
        sortYear: 2022.97,
        title: 'Official Decommissioning',
        detail: 'After two missed communication sessions, NASA declares InSight retired.',
      },
    ],
    hotspots: [
      {
        id: 'seis',
        label: 'SEIS Seismometer',
        position: [0.4, -0.2, 0.8],
        annotation: 'Deployed directly onto Martian regolith to detect seismic marsquakes.',
      },
      {
        id: 'solar-arrays',
        label: 'UltraFlex Solar Arrays',
        position: [-1.2, 0.1, 0.0],
        annotation: 'Twin 2.15 m circular panels choked by dust accumulation in late 2022.',
      },
      {
        id: 'hp3-mole',
        label: 'HP3 Heat Flow Probe & Arm',
        position: [0.75, 0.35, -0.35],
        annotation: '2.4 m robotic arm and DLR heat-flow probe stationed next to the main lander deck.',
      },
    ],
    nasaImage: {
      assetId: 'PIA25287 / NASA JPL Photojournal',
      description: 'Final solar panel selfie showing accumulated dust',
      attribution: 'NASA / JPL-Caltech',
      portalName: 'NASA JPL Photojournal',
      portalUrl: 'https://photojournal.jpl.nasa.gov/',
    },
    nasa3dAsset: {
      availabilityStatus: 'verified-glb',
      availabilityLabel: 'Verified NASA GLB Reference',
      assetName: '24880_InSight_deployed.glb',
      format: 'glTF / USDZ',
      fileSize: '21.32 MB',
      downloadLocation: 'NASA Science 3D Resources',
      technicalNotes: 'Deployed model with solar panels & SEIS arm.',
      portalUrl: 'https://science.nasa.gov/3d-resources/',
    },
  },
  {
    id: 'ingenuity-helicopter',
    accessionNumber: 'ACC.MARS.07',
    officialName: 'Mars 2020 Ingenuity Helicopter',
    shortTitle: 'Ingenuity Mars Helicopter',
    mission: 'NASA Mars 2020 Mission (Companion to Perseverance Rover)',
    targetBody: 'mars',
    targetBodyLabel: 'Mars',
    operationalPeriod: '2021 – 2024',
    dispositionCategory: 'hardware-malfunction',
    dispositionLabel: 'Hardware Malfunction & Mechanical Relics',
    dispositionShort: 'Hardware Malfunction (Rotor damage)',
    cardSnippet:
      'The historic first aircraft on another planet, grounded at Jezero Crater after 72 heroic flights.',
    visualImage: exhibitIngenuityStudyImg,
    visualStudyLabel: 'Curatorial Visual Study · Valinor Hills (Airfield Chi)',
    historicalBackground:
      'Originally built as a five-flight proof-of-concept to see whether aerodynamic lift was even possible in Mars’ 1%-density atmosphere, Ingenuity flew 72 times across nearly three years—acting as an aerial scout before rotor damage grounded it permanently.',
    originalPurpose:
      'Aerial technology demonstrator designed to achieve powered, controlled flight in Mars’ thin atmosphere (<1% Earth atmospheric density).',
    locations: [
      {
        siteName: 'Valinor Hills (Airfield Chi)',
        region: 'Jezero Crater',
        lat: 18.4448,
        lon: 77.451,
        coordinateText: '18.4448° N, 77.4510° E',
      },
    ],
    keyDates: [
      { label: 'Landing (aboard Perseverance)', value: 'February 18, 2021' },
      { label: 'First Extraterrestrial Flight', value: 'April 19, 2021' },
      { label: 'Final Flight #72', value: 'January 18, 2024' },
      { label: 'Decommissioned', value: 'January 25, 2024' },
    ],
    specifications: [
      { label: 'Mass', value: '1.8 kg (Earth mass) / 0.68 kg (Mars mass)' },
      { label: 'Height', value: '0.49 m' },
      { label: 'Rotor System', value: 'Dual counter-rotating carbon-fiber blades (1.2 m diameter) spinning at ~2,400 RPM' },
      { label: 'Flight Performance', value: '72 total flights (planned: 5); 17.24 km total distance; 128.8 mins airborne' },
    ],
    comparison: {
      massSummary: '1.8 kg (Earth) / 0.68 kg (Mars)',
      dimensionsSummary: '0.49 m H × 1.2 m rotor diameter',
      powerSource: 'Top-mounted solar panel + Li-ion cells',
      distanceTraveled: '17.24 km across 72 flights',
      lifespanSummary: '128.8 mins airborne (2021 – 2024)',
    },
    achievements: [
      'Achieved humanity’s first powered, controlled aerodynamic flight on another planet on April 19, 2021.',
      'Completed 72 flights versus a 5-flight design baseline, logging 17.24 km and 128.8 airborne minutes.',
      'Served as an operational aerial reconnaissance scout ahead of the Perseverance rover.',
    ],
    abandonmentReason:
      'During Flight 72 on January 18, 2024 over featureless sand dunes at Valinor Hills, optical flow navigation camera drift caused a hard touchdown. Impact fractured at least one carbon-fiber rotor blade tip, rendering the rotor unbalanced.',
    currentStatus:
      'Upright and powered at Airfield Chi in Jezero Crater, permanently grounded as a stationary weather and telemetry monument.',
    timeline: [
      {
        date: 'February 18, 2021',
        sortYear: 2021.13,
        title: 'Arrival at Jezero Crater',
        detail: 'Touches down attached to the Perseverance rover’s belly pan.',
      },
      {
        date: 'April 19, 2021',
        sortYear: 2021.3,
        title: 'First Powered Flight on Mars',
        detail: 'Hovers to 3 meters altitude at Wright Brothers Field, opening aerial planetary exploration.',
      },
      {
        date: 'April 2021 – January 2024',
        sortYear: 2022.8,
        title: '71 Flights Across Jezero Crater',
        detail: 'Transitions from technology demonstrator into an aerial scout for Perseverance.',
      },
      {
        date: 'January 18, 2024',
        sortYear: 2024.05,
        title: 'Flight 72 Hard Touchdown',
        detail: '12-meter pop-up over featureless Valinor Hills dunes leads to optical flow drift and rotor tip fracture.',
      },
      {
        date: 'January 25, 2024',
        sortYear: 2024.07,
        title: 'Officially Grounded at Airfield Chi',
        detail: 'NASA concludes Ingenuity’s flight operations after 72 historic flights.',
      },
    ],
    hotspots: [
      {
        id: 'carbon-rotors',
        label: 'Counter-Rotating Carbon Blades (1.2 m)',
        position: [0.0, 0.78, 0.0],
        annotation: 'Dual 1.2 m rotors spinning at ~2,400 RPM; Flight 72 impact fractured at least one blade tip.',
      },
      {
        id: 'top-solar',
        label: 'Mast Solar Charging Panel',
        position: [0.0, 0.98, 0.0],
        annotation: 'Charges six internal lithium-ion batteries to survive freezing Martian nights.',
      },
      {
        id: 'fuselage-nav',
        label: 'Optical Flow Navigation Fuselage',
        position: [0.0, 0.36, 0.22],
        annotation: 'Insulated avionics box housing downward-facing terrain tracking cameras that lost texture cues over smooth dunes.',
      },
    ],
    nasaImage: {
      assetId: 'PIA25686',
      description: 'Perseverance Mastcam-Z photograph of Ingenuity lifting off on Mars',
      attribution: 'NASA / JPL-Caltech / ASU / MSSS',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/PIA25686',
    },
    nasa3dAsset: {
      availabilityStatus: 'verified-glb',
      availabilityLabel: 'Verified NASA GLB Reference',
      assetName: '25043_Ingenuity_v3.glb',
      format: 'glTF / USDZ',
      fileSize: '1.73 MB',
      downloadLocation: 'NASA Science 3D Resources',
      technicalNotes: 'High-fidelity v3 rotorcraft asset.',
      portalUrl: 'https://science.nasa.gov/3d-resources/',
    },
  },
  {
    id: 'dawn-spacecraft',
    accessionNumber: 'ACC.DEEP.01',
    officialName: 'Dawn Spacecraft',
    shortTitle: 'Dawn Spacecraft',
    mission: 'NASA Discovery Program (2007–2018)',
    targetBody: 'deep-space',
    targetBodyLabel: 'Deep Space & Small Bodies',
    operationalPeriod: '2007 – 2018',
    dispositionCategory: 'orbital-deep-space',
    dispositionLabel: 'Orbital, Deep Space & Small-Body Relics',
    dispositionShort: 'Orbital Relic (Hydrazine exhaustion)',
    cardSnippet:
      'Ion-propelled explorer that orbited both protoplanets 4 Vesta and 1 Ceres before exhausting attitude propellant.',
    visualImage: realmDeepspaceVoidImg,
    visualStudyLabel: 'Curatorial Visual Study · 1 Ceres Polar Orbit',
    historicalBackground:
      'Powered by xenon ion thrusters, Dawn became the first spacecraft to orbit two extraterrestrial bodies—mapping giant asteroid 4 Vesta before cruising to dwarf planet 1 Ceres, where strict planetary protection rules keep it in silent high orbit.',
    originalPurpose:
      'Deep-space ion-propelled probe sent to orbit main-belt protoplanets 4 Vesta and 1 Ceres.',
    locations: [
      {
        siteName: 'Permanent Unpowered Orbit',
        region: 'Dwarf Planet 1 Ceres (Main Asteroid Belt)',
        lat: null,
        lon: null,
        coordinateText: 'Permanent unpowered orbit around 1 Ceres (>50-year stability)',
      },
    ],
    keyDates: [
      { label: 'Launch', value: 'September 27, 2007' },
      { label: '4 Vesta Orbit', value: '2011 – 2012' },
      { label: '1 Ceres Orbit', value: '2015 – 2018' },
      { label: 'Mission End', value: 'November 1, 2018' },
    ],
    specifications: [
      { label: 'Propulsion', value: 'Ion-propelled main thrusters + hydrazine attitude control' },
      { label: 'Mass & Dimensions', value: 'Unknown (Not specified in reference)' },
      { label: 'Orbital Longevity', value: '>50 years without impacting Ceres surface' },
    ],
    comparison: {
      massSummary: 'Unknown (Not specified in reference)',
      dimensionsSummary: 'Unknown (Not specified in reference)',
      powerSource: 'Dual large solar wings + xenon ion drive',
      distanceTraveled: 'Orbited 4 Vesta & 1 Ceres',
      lifespanSummary: '11 years (2007 – 2018)',
    },
    achievements: [
      'First spacecraft to orbit an object in the main asteroid belt (4 Vesta, 2011–2012).',
      'First spacecraft to orbit a dwarf planet (1 Ceres, 2015–2018) and enter orbit around two distinct targets.',
      'Mapped bright salt deposits and cryovolcanic features on Ceres.',
    ],
    abandonmentReason:
      'Exhausted its hydrazine attitude-control propellant, preventing solar panel and antenna orientation.',
    currentStatus:
      'Unpowered and silent in a stable planetary-protection orbit around 1 Ceres where it will remain for over 50 years without impacting the surface.',
    timeline: [
      {
        date: 'September 27, 2007',
        sortYear: 2007.74,
        title: 'Launch',
        detail: 'Dawn departs Earth on an ion-propelled voyage to the asteroid belt.',
      },
      {
        date: '2011 – 2012',
        sortYear: 2011.5,
        title: 'Orbiting Protoplanet 4 Vesta',
        detail: 'Spends 14 months mapping Vesta’s giant south-polar crater and crust.',
      },
      {
        date: '2015 – 2018',
        sortYear: 2015.2,
        title: 'Orbiting Dwarf Planet 1 Ceres',
        detail: 'Arrives at Ceres, lowering into close mapping orbits.',
      },
      {
        date: 'November 1, 2018',
        sortYear: 2018.84,
        title: 'Hydrazine Exhaustion & Mission End',
        detail: 'Missed DSN check-ins confirm attitude propellant exhaustion in safe Ceres orbit.',
      },
    ],
    hotspots: [
      {
        id: 'dawn-wings',
        label: 'High-Span Solar Array Wings',
        position: [-1.1, 0.25, 0.0],
        annotation: 'Supplied electrical power to Dawn’s high-efficiency xenon ion thrusters across the asteroid belt.',
      },
      {
        id: 'ion-thrusters',
        label: 'Xenon Ion Propulsion Engine',
        position: [0.0, -0.35, -0.45],
        annotation: 'Delivered unprecedented delta-v allowing Dawn to orbit both 4 Vesta and 1 Ceres.',
      },
      {
        id: 'dawn-dish',
        label: 'High-Gain Parabolic Dish',
        position: [0.0, 0.55, 0.4],
        annotation: 'Could no longer point toward Earth once hydrazine attitude-control fuel ran dry on Nov 1, 2018.',
      },
    ],
    nasaImage: {
      assetId: 'PIA14125',
      description: 'NASA Dawn spacecraft with solar arrays and ion drive en route to Vesta and Ceres',
      attribution: 'NASA / JPL-Caltech',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/PIA14125',
    },
    nasa3dAsset: {
      availabilityStatus: 'cad-shape-archive',
      availabilityLabel: 'NASA CAD Files Available',
      assetName: 'dawn.glb / NASA CAD',
      format: 'CAD / GLB Reference',
      fileSize: 'Unknown',
      downloadLocation: 'NASA 3D Resources',
      technicalNotes: 'NASA 3D CAD files referenced on NASA 3D Resources (dawn.glb).',
      portalUrl: 'https://science.nasa.gov/3d-resources/',
    },
  },
  {
    id: 'near-shoemaker',
    accessionNumber: 'ACC.DEEP.02',
    officialName: 'Near Earth Asteroid Rendezvous (NEAR) Shoemaker',
    shortTitle: 'NEAR Shoemaker Spacecraft',
    mission: 'NASA Discovery Program (1996–2001)',
    targetBody: 'deep-space',
    targetBodyLabel: 'Deep Space & Small Bodies',
    operationalPeriod: '1996 – 2001',
    dispositionCategory: 'orbital-deep-space',
    dispositionLabel: 'Orbital, Deep Space & Small-Body Relics',
    dispositionShort: 'Small-Body Touchdown Site',
    cardSnippet:
      'Orbital asteroid probe that pulled off an improvised gentle landing on 433 Eros at 1.9 m/s.',
    visualImage: realmDeepspaceVoidImg,
    visualStudyLabel: 'Curatorial Visual Study · Asteroid 433 Eros Touchdown',
    historicalBackground:
      'Never equipped with landing legs, NEAR Shoemaker ended a year in orbit around peanut-shaped asteroid 433 Eros by firing its thrusters in a daring controlled descent—touching down intact and beaming back surface gamma-ray readings.',
    originalPurpose:
      'Orbital mission to analyze near-Earth asteroid 433 Eros.',
    locations: [
      {
        siteName: 'Touchdown Site on 433 Eros',
        region: 'Near-Earth Asteroid 433 Eros',
        lat: null,
        lon: null,
        coordinateText: 'Surface of Asteroid 433 Eros',
      },
    ],
    keyDates: [
      { label: 'Launch', value: 'February 17, 1996' },
      { label: 'Touchdown on 433 Eros', value: 'February 12, 2001' },
      { label: 'Final Shutdown', value: 'February 28, 2001' },
    ],
    specifications: [
      { label: 'Touchdown Velocity', value: '~1.9 m/s controlled surface impact' },
      { label: 'Surface Instrument', value: 'Gamma-ray spectrometer' },
      { label: 'Mass & Dimensions', value: 'Unknown (Not specified in reference)' },
    ],
    comparison: {
      massSummary: 'Unknown (Not specified in reference)',
      dimensionsSummary: 'Unknown (Not specified in reference)',
      powerSource: 'Four radial solar panels',
      distanceTraveled: '1-year Eros orbit + surface touchdown (~1.9 m/s)',
      lifespanSummary: '5 years (1996 – 2001)',
    },
    achievements: [
      'First spacecraft to orbit and land on an asteroid (433 Eros).',
      'Executed a controlled touchdown at ~1.9 m/s despite not being designed as a lander.',
      'Transmitted valuable gamma-ray spectrum data directly from the asteroid surface.',
    ],
    abandonmentReason:
      'Concluded mission on the surface of 433 Eros after power depletion and final shutdown commands on February 28, 2001.',
    currentStatus:
      'Resting intact and unpowered on the regolith of asteroid 433 Eros.',
    timeline: [
      {
        date: 'February 17, 1996',
        sortYear: 1996.13,
        title: 'Launch',
        detail: 'First NASA Discovery Program spacecraft launches toward 433 Eros.',
      },
      {
        date: 'February 12, 2001',
        sortYear: 2001.12,
        title: 'Controlled Touchdown on 433 Eros',
        detail: 'Descends gently onto the asteroid surface at ~1.9 m/s, surviving to transmit data.',
      },
      {
        date: 'February 28, 2001',
        sortYear: 2001.16,
        title: 'Final Surface Shutdown',
        detail: 'After 16 days of surface gamma-ray telemetry, NEAR Shoemaker goes silent.',
      },
    ],
    hotspots: [
      {
        id: 'radial-panels',
        label: 'Four-Wing Solar Array',
        position: [0.9, 0.25, 0.0],
        annotation: 'Cushioned the improvised ~1.9 m/s touchdown onto 433 Eros on February 12, 2001.',
      },
      {
        id: 'gamma-spec',
        label: 'Gamma-Ray Spectrometer',
        position: [0.0, 0.05, 0.55],
        annotation: 'Collected unprecedented surface elemental spectra directly from asteroid regolith before shutdown.',
      },
      {
        id: 'near-dish',
        label: 'Fixed High-Gain Antenna',
        position: [0.0, 0.72, 0.0],
        annotation: 'Maintained Earth communication lock after landing upright on Eros.',
      },
    ],
    nasaImage: {
      assetId: 'PIA18177',
      description: 'NEAR Shoemaker spacecraft rendezvous with asteroid 433 Eros',
      attribution: 'NASA / JHUAPL',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/PIA18177',
    },
    nasa3dAsset: {
      availabilityStatus: 'cad-shape-archive',
      availabilityLabel: '3D Shape Models Available',
      assetName: 'Asteroid 433 Eros Shape Model',
      format: 'PDS 3D Shape Model',
      fileSize: 'Unknown',
      downloadLocation: 'NASA PDS Archives',
      technicalNotes: 'Asteroid 433 Eros 3D shape files available in NASA PDS archives.',
      portalUrl: 'https://pds.nasa.gov/',
    },
  },
  {
    id: 'kepler-telescope',
    accessionNumber: 'ACC.DEEP.03',
    officialName: 'Kepler Space Telescope',
    shortTitle: 'Kepler Space Telescope',
    mission: 'NASA Discovery Program (2009–2018)',
    targetBody: 'deep-space',
    targetBodyLabel: 'Deep Space & Small Bodies',
    operationalPeriod: '2009 – 2018',
    dispositionCategory: 'orbital-deep-space',
    dispositionLabel: 'Orbital, Deep Space & Small-Body Relics',
    dispositionShort: 'Heliocentric Orbital Relic',
    cardSnippet:
      'Exoplanet-hunting space observatory drifting silently in a safe Earth-trailing solar orbit.',
    visualImage: realmDeepspaceVoidImg,
    visualStudyLabel: 'Curatorial Visual Study · Earth-Trailing Heliocentric Orbit',
    historicalBackground:
      'Staring relentlessly at hundreds of thousands of stars for tiny dips in starlight, Kepler transformed humanity’s view of the cosmos by proving planets outnumber stars in the Milky Way before running out of thruster fuel in 2018.',
    originalPurpose:
      'Space telescope equipped with a 0.95 m photometer to detect exoplanet transits.',
    locations: [
      {
        siteName: 'Earth-Trailing Heliocentric Orbit',
        region: 'Heliocentric Solar Orbit',
        lat: null,
        lon: null,
        coordinateText: 'Safe Earth-trailing heliocentric orbit',
      },
    ],
    keyDates: [
      { label: 'Launch', value: 'March 7, 2009' },
      { label: 'Fuel Exhaustion & Shutdown', value: 'October 30, 2018' },
    ],
    specifications: [
      { label: 'Primary Instrument', value: '0.95 m photometer' },
      { label: 'Mass & Dimensions', value: 'Unknown (Not specified in reference)' },
      { label: 'Propellant Status', value: 'Hydrazine exhausted; transmitters commanded off' },
    ],
    comparison: {
      massSummary: 'Unknown (Not specified in reference)',
      dimensionsSummary: '0.95 m photometer aperture',
      powerSource: 'Curved solar array skirt',
      distanceTraveled: 'Earth-trailing heliocentric orbit',
      lifespanSummary: '9.6 years (2009 – 2018)',
    },
    achievements: [
      'Monitored stellar brightness with a 0.95 m photometer to detect exoplanet transits.',
      'Completed both its primary Cygnus field survey and extended K2 ecliptic campaign.',
      'Safely parked and powered down in an orbit that avoids Earth interference.',
    ],
    abandonmentReason:
      'Exhausted hydrazine fuel required for pointing; NASA sent shutdown commands to turn off transmitters.',
    currentStatus:
      'Decommissioned with transmitters turned off, drifting safely in an Earth-trailing heliocentric orbit.',
    timeline: [
      {
        date: 'March 7, 2009',
        sortYear: 2009.18,
        title: 'Launch from Cape Canaveral',
        detail: 'Enters an Earth-trailing heliocentric orbit to stare continuously at distant starfields.',
      },
      {
        date: 'October 30, 2018',
        sortYear: 2018.83,
        title: 'Hydrazine Exhaustion & Decommissioning',
        detail: 'Fuel reserves run dry; engineers command transmitters off for safe retirement.',
      },
    ],
    hotspots: [
      {
        id: 'photometer-barrel',
        label: '0.95 m Photometer Sunshade',
        position: [0.0, 0.78, 0.15],
        annotation: 'Baffled optical barrel housing the 0.95 m Schmidt telescope photometer for transit detection.',
      },
      {
        id: 'solar-skirt',
        label: 'Curved Solar Array Wing',
        position: [0.75, -0.1, -0.45],
        annotation: 'Provided continuous electrical power while shielding the telescope from stray solar glare.',
      },
      {
        id: 'thruster-bus',
        label: 'Hydrazine Reaction Bus',
        position: [0.0, -0.58, 0.0],
        annotation: 'Exhausted its final hydrazine attitude-control fuel in October 2018.',
      },
    ],
    nasaImage: {
      assetId: 'KSC-2009-1124',
      description: 'Kepler Space Telescope photometer barrel & solar array during KSC testing',
      attribution: 'NASA / Kennedy Space Center',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/KSC-2009-1124',
    },
    nasa3dAsset: {
      availabilityStatus: 'verified-glb',
      availabilityLabel: 'Verified NASA GLB Reference',
      assetName: 'kepler.glb',
      format: 'glTF / USDZ',
      fileSize: '~2.5 MB',
      downloadLocation: 'NASA Science 3D Resources',
      technicalNotes: 'Spacecraft body with solar panel array.',
      portalUrl: 'https://science.nasa.gov/3d-resources/',
    },
  },
  {
    id: 'pioneer-probes',
    accessionNumber: 'ACC.DEEP.04',
    officialName: 'Pioneer 10 & Pioneer 11',
    shortTitle: 'Pioneer 10 & 11 Probes',
    mission: 'NASA Pioneer Program (1972–2003)',
    targetBody: 'deep-space',
    targetBodyLabel: 'Deep Space & Small Bodies',
    operationalPeriod: '1972 – 2003 (Signal loss)',
    dispositionCategory: 'orbital-deep-space',
    dispositionLabel: 'Orbital, Deep Space & Small-Body Relics',
    dispositionShort: 'Interstellar Drift Probes',
    cardSnippet:
      'Outer-planet trailblazers carrying gold-anodized interstellar plaques outward toward Taurus and Aquila.',
    visualImage: realmDeepspaceVoidImg,
    visualStudyLabel: 'Curatorial Visual Study · Interstellar Escape Vectors',
    historicalBackground:
      'Before the Voyager twins, Pioneer 10 and 11 braved the asteroid belt and Jupiter’s crushing radiation belts—and today drift silently beyond the planets as humanity’s earliest ambassadors into interstellar space.',
    originalPurpose:
      'Outer planet flyby probes (Jupiter & Saturn reconnaissance).',
    locations: [
      {
        siteName: 'Pioneer 10 Escape Trajectory',
        region: 'Interstellar Space (Outbound toward Taurus)',
        lat: null,
        lon: null,
        coordinateText: 'Outbound toward constellation Taurus (Last signal at 82 AU)',
      },
      {
        siteName: 'Pioneer 11 Escape Trajectory',
        region: 'Interstellar Space (Outbound toward Aquila)',
        lat: null,
        lon: null,
        coordinateText: 'Outbound toward constellation Aquila',
      },
    ],
    keyDates: [
      { label: 'Pioneer 10 Launch', value: 'March 2, 1972' },
      { label: 'Pioneer 11 Launch', value: 'April 6, 1973' },
      { label: 'Pioneer 11 Final Signal', value: 'November 30, 1995' },
      { label: 'Pioneer 10 Final Signal', value: 'January 23, 2003 (82 AU)' },
    ],
    specifications: [
      { label: 'Payloads', value: 'Gold-anodized aluminum interstellar plaques' },
      { label: 'Mass & Dimensions', value: 'Unknown (Not specified in reference)' },
      { label: 'Last Tracked Distance', value: '82 AU (Pioneer 10, Jan 23, 2003)' },
    ],
    comparison: {
      massSummary: 'Unknown (Not specified in reference)',
      dimensionsSummary: 'Unknown (Not specified in reference)',
      powerSource: 'Outboard boom RTGs (faded over multi-billion miles)',
      distanceTraveled: '82 AU at final signal (Pioneer 10)',
      lifespanSummary: '31 yrs signal life (Pioneer 10)',
    },
    achievements: [
      'Pioneered outer planet reconnaissance at Jupiter (Pioneer 10 & 11) and Saturn (Pioneer 11).',
      'Maintained faint Deep Space Network contact across 82 Astronomical Units until January 23, 2003.',
      'Carry iconic gold-anodized plaques depicting Earth’s cosmic address for potential interstellar discovery.',
    ],
    abandonmentReason:
      'Radio transmitters and power faded over multi-billion-mile interstellar distances.',
    currentStatus:
      'Silent and uncontactable, drifting indefinitely on solar-system escape trajectories toward Taurus and Aquila.',
    timeline: [
      {
        date: 'March 2, 1972',
        sortYear: 1972.17,
        title: 'Pioneer 10 Launch',
        detail: 'Departs Earth for the first Jupiter flyby and asteroid belt crossing.',
      },
      {
        date: 'April 6, 1973',
        sortYear: 1973.26,
        title: 'Pioneer 11 Launch',
        detail: 'Follows toward Jupiter and the first flyby reconnaissance of Saturn.',
      },
      {
        date: 'November 30, 1995',
        sortYear: 1995.91,
        title: 'Pioneer 11 Final Signal',
        detail: 'Fading RTG power ends routine contact on trajectory toward Aquila.',
      },
      {
        date: 'January 23, 2003',
        sortYear: 2003.06,
        title: 'Pioneer 10 Final Signal (82 AU)',
        detail: 'Last whisper received from 82 AU out toward Taurus.',
      },
    ],
    hotspots: [
      {
        id: 'parabolic-dish',
        label: 'High-Gain Parabolic Dish',
        position: [0.0, 0.35, 0.0],
        annotation: 'Beamed faint telemetry back to Earth across 82 AU until January 2003.',
      },
      {
        id: 'pioneer-plaque',
        label: 'Gold-Anodized Interstellar Plaque',
        position: [0.35, -0.05, 0.32],
        annotation: 'Engraved message riding indefinitely into interstellar space toward Taurus and Aquila.',
      },
      {
        id: 'rtg-booms',
        label: 'Outboard RTG Struts',
        position: [-1.15, 0.0, 0.3],
        annotation: 'Extended radioisotope power booms positioned away from sensitive science sensors.',
      },
    ],
    nasaImage: {
      assetId: 'ARC-1972-AC72-2135',
      description: 'Pioneer 10 spacecraft and gold-anodized interstellar plaque prior to launch',
      attribution: 'NASA / Ames Research Center',
      portalName: 'NASA Image and Video Library',
      portalUrl: 'https://images.nasa.gov/details/ARC-1972-AC72-2135',
    },
    nasa3dAsset: {
      availabilityStatus: 'cad-shape-archive',
      availabilityLabel: 'NASA CAD Files Available',
      assetName: 'Pioneer 10/11 CAD Archives',
      format: 'CAD Models',
      fileSize: 'Unknown',
      downloadLocation: 'NASA Archives',
      technicalNotes: 'NASA 3D CAD models available in NASA archives.',
      portalUrl: 'https://science.nasa.gov/3d-resources/',
    },
  },
];

const IMAGE_POSITION_BY_ID: Record<string, string> = {
  'kepler-telescope': 'object-[50%_28%]',
  'apollo-lm': 'object-[50%_40%]',
  'apollo-lrv': 'object-[50%_55%]',
  'surveyor-program': 'object-[50%_35%]',
  'spirit-rover': 'object-[50%_55%]',
  'opportunity-rover': 'object-[50%_45%]',
  'phoenix-lander': 'object-[50%_50%]',
  'ingenuity-helicopter': 'object-[50%_50%]',
};

export const EXHIBITS: Exhibit[] = RAW_EXHIBITS.map((ex) => {
  const narrative = EXHIBIT_NARRATIVES[ex.id];
  const mediaPhoto = EXHIBIT_MEDIA[ex.id]?.nasaPhoto;
  const studySuffix = ex.visualStudyLabel.includes('·')
    ? ex.visualStudyLabel.split('·').slice(1).join('·').trim()
    : ex.visualStudyLabel;
  return {
    ...ex,
    fallbackVisualImage: ex.visualImage,
    visualImage: mediaPhoto?.imageUrl ?? ex.visualImage,
    imagePosition: IMAGE_POSITION_BY_ID[ex.id] ?? 'object-center',
    visualStudyLabel: mediaPhoto
      ? `Original NASA Archival Record · ${mediaPhoto.nasaId} (${mediaPhoto.credit})`
      : `AI-Generated Curatorial Reconstruction (Not an Original NASA Photograph) · ${studySuffix}`,
    ...narrative,
  };
});

export const IMAGE_ATTRIBUTION_DIRECTORY = [
  {
    exhibitId: 'apollo-lm',
    description: 'Buzz Aldrin beside Apollo 11 Eagle Descent Stage at Tranquility Base',
    assetId: 'AS11-40-5903',
    credit: 'NASA / Apollo 11 Crew',
  },
  {
    exhibitId: 'apollo-lrv',
    description: 'Lunar Roving Vehicle (LRV-1) photographed against highlands at Hadley-Apennine',
    assetId: 'AS15-88-11901',
    credit: 'NASA / Apollo 15 Crew',
  },
  {
    exhibitId: 'apollo-alsep',
    description: 'Deployed Apollo 12 ALSEP scientific instruments on Oceanus Procellarum',
    assetId: 'AS12-47-6918',
    credit: 'NASA / Apollo 12 Crew',
  },
  {
    exhibitId: 'surveyor-program',
    description: 'Apollo 12 astronaut inspecting Surveyor 3 lander in Oceanus Procellarum',
    assetId: 'AS12-48-7136',
    credit: 'NASA / Apollo 12 Crew',
  },
  {
    exhibitId: 'lunokhod-rovers',
    description: 'LRO orbital capture of Luna 17 lander and Lunokhod 1 tracks in Mare Imbrium',
    assetId: 'PIA12967 / NASA LROC',
    credit: 'NASA / GSFC / Arizona State Univ.',
  },
  {
    exhibitId: 'pathfinder-sojourner',
    description: 'Sojourner microrover analyzing rock "Yogi" at Ares Vallis',
    assetId: 'PIA00766',
    credit: 'NASA / JPL-Caltech',
  },
  {
    exhibitId: 'spirit-rover',
    description: 'Spirit rover wheels embedded in soft iron-sulfate sand at Troy (Sol 1899)',
    assetId: 'PIA12007',
    credit: 'NASA / JPL-Caltech / Cornell',
  },
  {
    exhibitId: 'opportunity-rover',
    description: 'Opportunity rover Navcam self-portrait showing dust-coated solar deck',
    assetId: 'PIA15114',
    credit: 'NASA / JPL-Caltech / Cornell / ASU',
  },
  {
    exhibitId: 'viking-landers',
    description: 'Viking Lander 1 flight spacecraft during pre-launch integration at KSC',
    assetId: '101-KSC-75P-12',
    credit: 'NASA / Kennedy Space Center',
  },
  {
    exhibitId: 'phoenix-lander',
    description: 'Panorama of Phoenix Mars Lander solar wing and robotic digging arm',
    assetId: 'PIA10793',
    credit: 'NASA / JPL-Caltech / Univ. of Arizona / Texas A&M',
  },
  {
    exhibitId: 'insight-lander',
    description: 'Final solar panel selfie showing accumulated dust on Elysium Planitia',
    assetId: 'PIA25287',
    credit: 'NASA / JPL-Caltech',
  },
  {
    exhibitId: 'ingenuity-helicopter',
    description: 'Perseverance Mastcam-Z photograph of Ingenuity lifting off on Mars',
    assetId: 'PIA25686',
    credit: 'NASA / JPL-Caltech / ASU / MSSS',
  },
  {
    exhibitId: 'dawn-spacecraft',
    description: 'Dawn spacecraft with solar wings and xenon ion thruster en route to Vesta & Ceres',
    assetId: 'PIA14125',
    credit: 'NASA / JPL-Caltech',
  },
  {
    exhibitId: 'near-shoemaker',
    description: 'NEAR Shoemaker spacecraft rendezvous with asteroid 433 Eros',
    assetId: 'PIA18177',
    credit: 'NASA / JHUAPL',
  },
  {
    exhibitId: 'kepler-telescope',
    description: 'Kepler Space Telescope photometer barrel & solar array during KSC testing',
    assetId: 'KSC-2009-1124',
    credit: 'NASA / Kennedy Space Center',
  },
  {
    exhibitId: 'pioneer-probes',
    description: 'Pioneer 10 spacecraft and gold-anodized interstellar plaque prior to launch',
    assetId: 'ARC-1972-AC72-2135',
    credit: 'NASA / Ames Research Center',
  },
];

export const MODEL_3D_DIRECTORY = [
  {
    exhibitId: 'apollo-lm',
    assetName: 'apollo-lunar-module.glb (Local Integrated)',
    format: 'glTF 2.0 (Draco)',
    fileSize: '700 KB',
    location: 'NASA 3D Resources (nasa/NASA-3D-Resources)',
    notes: 'High-poly LM model with separable Descent and Ascent stages; integrated locally.',
  },
  {
    exhibitId: 'spirit-rover',
    assetName: '24883_MER_static.glb',
    format: 'glTF / USDZ',
    fileSize: '11.36 MB',
    location: 'NASA Science 3D Resources',
    notes: 'Static MER reference; rendered with procedural Three.js hardware reconstruction in viewport.',
  },
  {
    exhibitId: 'opportunity-rover',
    assetName: 'opportunity-mer-b.glb (Local Integrated)',
    format: 'glTF 2.0 (MER_static)',
    fileSize: '11.36 MB',
    location: 'NASA Science 3D Resources (VTAD)',
    notes: 'Official static MER-B chassis with solar panels, mast, IDD arm, and wheels; integrated locally.',
  },
  {
    exhibitId: 'insight-lander',
    assetName: '24880_InSight_deployed.glb',
    format: 'glTF / USDZ',
    fileSize: '21.32 MB',
    location: 'NASA Science 3D Resources',
    notes: 'Deployed model reference; rendered with procedural Three.js hardware reconstruction in viewport.',
  },
  {
    exhibitId: 'ingenuity-helicopter',
    assetName: '25043_Ingenuity_v3.glb',
    format: 'glTF / USDZ',
    fileSize: '1.73 MB',
    location: 'NASA Science 3D Resources',
    notes: 'High-fidelity v3 rotorcraft reference; rendered with procedural Three.js reconstruction in viewport.',
  },
  {
    exhibitId: 'kepler-telescope',
    assetName: 'kepler.glb',
    format: 'glTF / USDZ',
    fileSize: '~2.5 MB',
    location: 'NASA Science 3D Resources',
    notes: 'Spacecraft body reference; rendered with procedural Three.js reconstruction in viewport.',
  },
  {
    exhibitId: 'viking-landers',
    assetName: '3D Viking Lander.stl',
    format: 'STL',
    fileSize: '~15 MB',
    location: 'NASA 3D Resources',
    notes: '3D printable mesh reference; rendered with procedural Three.js reconstruction in viewport.',
  },
];

export const VERIFICATION_NOTES = [
  {
    title: 'Photojournal Catalog ID & Mass Audit',
    detail:
      'Independent audit confirmed PIA00563 (Viking 1), PIA12967 (Lunokhod 1), and PIA25287 (InSight Final Selfie). However, four IDs in the initial Handoff Document point to unrelated catalog records (PIA00604 = Galileo/Jupiter, PIA05196 = Opportunity APXS, PIA22328 = Curiosity SAM graph, PIA24808 = Perseverance Sample Tube 266), and Sojourner’s 0.68 kg Mars entry reflects Ingenuity’s Mars weight rather than ~4.0 kg (~0.38g). All discrepancies are flagged per exhibit.',
  },
  {
    title: 'Visual & 3D Asset Transparency',
    detail:
      'Apollo Lunar Module (apollo-lunar-module.glb) and Opportunity Rover (opportunity-mer-b.glb) load verified local NASA 3D Resources / NASA Science VTAD GLB meshes directly in Chapter 05. Other exhibits render transparent Procedural 3D Hardware Reconstructions unless a visitor loads a local .glb/.stl file.',
  },
  {
    title: 'Opportunity Quote & Coordinate Standards',
    detail:
      'Final rover coordinates (Opportunity at Perseverance Valley: 1.9483° S, 354.4742° E; Spirit at Troy: 14.5692° S, 175.4729° E) represent traverse endpoints. The line "My battery is low and it’s getting dark" was journalist Jacob Margolis’s poetic paraphrase of telemetry, not a direct spacecraft transmission.',
  },
];
