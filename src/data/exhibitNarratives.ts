export interface GlossaryTerm {
  term: string;
  plainExplanation: string;
}

export interface EvidenceSourceItem {
  claimOrAsset: string;
  label: string;
  url: string;
  linkType: 'direct-record' | 'archive-portal';
  lookupTerm?: string;
  correctionNote?: string;
}

export interface ExhibitNarrativeData {
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

export const EXHIBIT_NARRATIVES: Record<string, ExhibitNarrativeData> = {
  'apollo-lm': {
    discoveryHook:
      'Standing upright in the airless dust of six lunar landing sites are the gold-wrapped lower halves of the Apollo Lunar Modules—each one both the braking rocket that carried astronauts safely down and the silent launchpad they blasted away from to return home.',
    glossaryTerms: [
      {
        term: 'Kapton Multi-Layer Insulation',
        plainExplanation:
          'Thin, gold- and amber-tinted polyimide foil sheets layered to reflect intense sunlight and trap heat inside the spacecraft in the airless lunar vacuum.',
      },
      {
        term: 'Throttleable Descent Engine (TR-201)',
        plainExplanation:
          'A rocket engine whose thrust could be smoothly adjusted mid-flight, allowing astronauts to slow down from orbital speed and hover while choosing a boulder-free landing spot.',
      },
      {
        term: 'Pyrotechnic Stage Separation',
        plainExplanation:
          'Small explosive bolts and cable cutters that severed the upper crew cabin (Ascent Stage) from the lower landing platform (Descent Stage) at liftoff.',
      },
    ],
    journeyNarrative:
      'Because a single spacecraft could not carry enough fuel to descend to the Moon and lift its entire landing gear back into orbit, NASA split the Lunar Module into two stages. On July 20, 1969, Eagle fired its throttleable TR-201 engine to settle onto Statio Tranquillitatis. After astronauts descended the ladder and deployed surface experiments, pyrotechnic charges severed the upper Ascent Stage, turning the Descent Stage into a permanent lunar launchpad—a sequence repeated five more times through Apollo 17 in 1972.',
    endingDetails: {
      verifiedFacts:
        'Each Descent Stage was intentionally left behind when the crew fired the Ascent Stage engine to rendezvous with the Command Module in lunar orbit. Return-payload mass limits made bringing the ~2,034 kg lower platform back impossible.',
      distinctionNote:
        'Verified Fact vs. Observation: While surface conditions cannot be inspected in person today, high-resolution imagery from NASA’s Lunar Reconnaissance Orbiter Camera (LROC) confirms all six descent stages remain standing upright at their landing coordinates.',
    },
    legacyImpact: {
      significance:
        'Together, the six Apollo Descent Stages mark humanity’s first crewed outposts on another celestial body and preserve untouched footprints, blast halos, and deployed tools in the lunar vacuum.',
      futureLessons: [
        'Staged landers minimize return propellant mass by leaving heavy landing legs and empty descent tanks behind.',
        'Rocket exhaust plumes during both touchdown and liftoff disturb surface regolith, guiding how Artemis landers must protect nearby lunar infrastructure.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Apollo 11 landing date, crew surface operations & Eagle Descent Stage deployment',
        label: 'NASA Science — Apollo 11 Mission Overview',
        url: 'https://science.nasa.gov/mission/apollo-11/',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'Apollo 17 final crewed lunar landing coordinates & surface history',
        label: 'NASA Science — Apollo 17 Mission Overview',
        url: 'https://science.nasa.gov/mission/apollo-17/',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'AS11-40-5921 Tranquility Base photographic record & SVS #4868 visualization',
        label: 'NASA Scientific Visualization Studio (SVS)',
        url: 'https://svs.gsfc.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search SVS #4868 or Apollo 11 AS11-40-5921',
      },
      {
        claimOrAsset: 'LROC orbital confirmation of intact Apollo 11–17 descent stages',
        label: 'NASA LROC Orbital Archive (ASU)',
        url: 'https://www.lroc.asu.edu/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Apollo 11 / 12 / 14 / 15 / 16 / 17 landing sites',
      },
      {
        claimOrAsset: 'Official NASA 3D mesh reference: Apollo Lunar Module.glb (716.8 KB)',
        label: 'NASA Science 3D Resources Hub',
        url: 'https://science.nasa.gov/3d-resources/',
        linkType: 'archive-portal',
        lookupTerm: 'Apollo Lunar Module.glb',
      },
    ],
  },

  'apollo-lrv': {
    discoveryHook:
      'Parked roughly 90 to 140 meters away from the Apollo 15, 16, and 17 landing sites sit three folded-and-unpacked electric Moon buggies—their wire-mesh wheels still angled where astronauts aimed their TV cameras to film their own departures.',
    glossaryTerms: [
      {
        term: 'Silver-Zinc Non-Rechargeable Batteries',
        plainExplanation:
          'High-energy-density primary batteries chosen to power all four wheel motors for days of lunar traverses without needing solar recharging.',
      },
      {
        term: 'Woven Zinc-Coated Steel Mesh Tires',
        plainExplanation:
          'Flexible spring-like wire-mesh wheels with titanium chevron treads that could not puncture in the vacuum and kept traction in powdery lunar regolith.',
      },
      {
        term: 'J-Series Apollo Missions',
        plainExplanation:
          'The final three Apollo flights (15, 16, and 17), upgraded with longer lunar surface stays and mobile rovers for deep geological fieldwork.',
      },
    ],
    journeyNarrative:
      'During Apollo 11, 12, and 14, suited astronauts could only walk a few hundred meters on foot. To reach distant rilles, highland craters, and valley walls, engineers packed a 210 kg electric rover folded into Quadrant 1 of the Descent Stage. Starting with Apollo 15 on July 31, 1971, crews unfolded LRV-1, LRV-2, and LRV-3 to carry tools and rock boxes across kilometers of terrain—culminating in Apollo 17’s 35.74 km traverse and an 18 km/h surface speed run.',
    endingDetails: {
      verifiedFacts:
        'Return mass constraints inside the Lunar Module Ascent Stage meant the 210 kg rovers could never be flown back to orbit. At the end of each final EVA, astronauts parked the LRV ~90–140 m away so its remotely steered high-gain TV camera could film the Ascent Stage liftoff.',
      distinctionNote:
        'Verified Fact vs. Current State: Electrical systems and non-rechargeable batteries are long depleted, while LROC orbital images confirm the parked chassis and tire tracks remain undisturbed on the surface.',
    },
    legacyImpact: {
      significance:
        'The LRVs multiplied the geological reach of Apollo astronauts by more than tenfold, enabling the collection of diverse highland and volcanic samples.',
      futureLessons: [
        'Compliant wire-mesh tires proved superior to pneumatic rubber in extreme lunar temperature swings and abrasive regolith.',
        'Remotely operated surface cameras parked clear of ascent blast zones provided crucial engineering footage of lunar liftoff.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'LRV-1 deployment and Hadley-Apennine traverse on Apollo 15',
        label: 'NASA Science — Apollo 15 Mission Overview',
        url: 'https://science.nasa.gov/mission/apollo-15/',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'LRV-2 operations in Descartes Highlands on Apollo 16',
        label: 'NASA Science — Apollo 16 Mission Overview',
        url: 'https://science.nasa.gov/mission/apollo-16/',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'LRV-3 35.74 km traverse, 18 km/h top speed & parked liftoff filming (AS17-146-22294)',
        label: 'NASA Science — Apollo 17 Mission Overview',
        url: 'https://science.nasa.gov/mission/apollo-17/',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'Archival photography AS17-146-22294 & AS15-88-11901',
        label: 'NASA Science Photojournal Portal',
        url: 'https://photojournal.jpl.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search AS17-146-22294 or AS15-88-11901',
      },
    ],
  },

  'apollo-alsep': {
    discoveryHook:
      'Although NASA switched off their radio transmitters in 1977, small glass prism panels set out by Apollo astronauts beside plutonium-powered science stations are still answering laser pulses fired from Earth today.',
    glossaryTerms: [
      {
        term: 'SNAP-27 RTG (Radioisotope Thermoelectric Generator)',
        plainExplanation:
          'A nuclear battery that converted heat from naturally decaying Plutonium-238 into ~70 watts of steady electricity, surviving two-week freezing lunar nights.',
      },
      {
        term: 'Corner-Cube Retroreflector',
        plainExplanation:
          'A precision fused-silica prism shaped like the inside corner of a cube; any beam of light entering it bounces straight back toward its source regardless of angle.',
      },
      {
        term: 'Moonquake Seismic Network',
        plainExplanation:
          'Linked seismometers at multiple Apollo sites that recorded vibrations inside the Moon, revealing its crust, mantle, and core structure.',
      },
    ],
    journeyNarrative:
      'Apollo 11 left a compact Early Apollo Scientific Experiments Package (EASEP), followed on Apollos 12, 14, 15, 16, and 17 by full ALSEP networks placed 100–300 meters from the noisy landers. Fueled by Plutonium-238 RTGs, these stations continuously transmitted moonquake tremors, solar wind measurements, heat flow, and magnetic field readings back to Earth for up to eight years.',
    endingDetails: {
      verifiedFacts:
        'Engineered as permanent surface stations, active radio telemetry from the ALSEP network was deliberately shut down by NASA on September 30, 1977 due to budget constraints—not instrument failure. However, the passive Laser Ranging Retroreflectors (LRRRs) require zero electricity and remain 100% operational today.',
      distinctionNote:
        'Scientific Distinction: ALSEP electronic transmitters are permanently inactive, whereas the optical corner-cube prism arrays remain active scientific instruments used by Earth observatories.',
    },
    legacyImpact: {
      significance:
        'Over half a century of continuous Earth-to-Moon laser ranging off Apollo retroreflectors proved the Moon is receding from Earth at 3.8 cm per year and refined tests of general relativity.',
      futureLessons: [
        'Passive optical targets can deliver multi-decade scientific returns long after active electronics and funding end.',
        'Radioisotope thermal power remains essential for multi-year surface stations operating through 14-day lunar nights.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Apollo 11 EASEP & 100-prism Laser Ranging Retroreflector deployment',
        label: 'NASA Science — Apollo 11 Mission Overview',
        url: 'https://science.nasa.gov/mission/apollo-11/',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'Apollo 15 expanded 300-prism LRRR & ALSEP geophysical deployment',
        label: 'NASA Science — Apollo 15 Mission Overview',
        url: 'https://science.nasa.gov/mission/apollo-15/',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'SEP 30, 1977 ALSEP telemetry shutdown & 3.8 cm/year lunar recession reports',
        label: 'NASA Technical Reports Server (NTRS)',
        url: 'https://ntrs.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search ALSEP 1977 termination report / Lunar Laser Ranging',
      },
      {
        claimOrAsset: 'SVS #4868 visualization & LROC surface documentation of ALSEP perimeters',
        label: 'NASA Scientific Visualization Studio (SVS)',
        url: 'https://svs.gsfc.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search SVS #4868',
      },
    ],
  },

  'surveyor-program': {
    discoveryHook:
      'Before any astronaut risked touching down on the Moon, seven robotic tripod scouts were sent ahead to test whether lunar dust would support a lander—five succeeded, two crashed, and one was visited face-to-face by Apollo 12 astronauts.',
    glossaryTerms: [
      {
        term: 'Automated Landing Radar',
        plainExplanation:
          'Radar sensors bouncing beams off the lunar ground to measure altitude and descent speed continuously so retro-rockets could brake automatically.',
      },
      {
        term: 'Soil Bearing Strength',
        plainExplanation:
          'How much weight lunar dust can support without a spacecraft footpad sinking or tipping over—critical data before sending crewed Apollo Lunar Modules.',
      },
      {
        term: 'Alpha-Scattering Instrument',
        plainExplanation:
          'A sensor on Surveyor 5 that bombarded lunar soil with alpha particles and measured how they bounced back to identify chemical elements.',
      },
    ],
    journeyNarrative:
      'In June 1966, Surveyor 1 executed the first U.S. soft landing on the Moon and sent back 11,237 images, dispelling fears of bottomless lunar dust. Even as Surveyor 2 and 4 were lost to thruster and telemetry failures, Surveyor 3 dug trenches in Oceanus Procellarum, Surveyor 5 ran the first chemical soil analysis, Surveyor 6 performed the first powered lunar hop (4 meters), and Surveyor 7 explored highland ejecta near Tycho Crater.',
    endingDetails: {
      verifiedFacts:
        'Surveyor 1, 3, 5, 6, and 7 were intentionally non-returnable robotic landers that ceased operations after completing surface telemetry. Surveyor 2 crashed near Copernicus Crater on Sept 23, 1966 after a mid-course vernier thruster failed to ignite; Surveyor 4 lost telemetry two minutes before touchdown in Sinus Medii on July 17, 1967.',
      distinctionNote:
        'Unique Reunion: On November 20, 1969, Apollo 12 astronauts Pete Conrad and Alan Bean landed 180 meters from Surveyor 3, walked down into its crater, and unbolted its TV camera and soil scoop for return to Earth.',
    },
    legacyImpact: {
      significance:
        'Surveyor validated the radar-guided soft-landing techniques and soil properties that directly enabled the Apollo crewed landings.',
      futureLessons: [
        'Returning parts of Surveyor 3 after 31 months on the Moon gave engineers real data on how solar radiation, vacuum, and micrometeorites age spacecraft hardware.',
        'Precision landing within 180 meters (achieved by Apollo 12) demonstrated pinpoint navigation to pre-existing surface assets.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Apollo 12 precision landing & Nov 20, 1969 inspection of Surveyor 3 (AS12-48-7136)',
        label: 'NASA Science — Apollo 12 Mission Overview',
        url: 'https://science.nasa.gov/mission/apollo-12/',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'Surveyor 1–7 engineering specifications, hop test & crash investigations',
        label: 'NASA Technical Reports Server (NTRS)',
        url: 'https://ntrs.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Surveyor Program Final Report JPL',
      },
      {
        claimOrAsset: 'LROC Stereo DEMs locating Surveyor 1, 3, 5, 6, 7 & crash craters',
        label: 'NASA LROC Orbital Archive (ASU)',
        url: 'https://www.lroc.asu.edu/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Surveyor 1 / Surveyor 3 LROC',
      },
    ],
  },

  'lunokhod-rovers': {
    discoveryHook:
      'Years before the first Mars rover, two eight-wheeled Soviet bathtub-shaped robots rolled 49.5 combined kilometers across the Moon under remote Earth control—until Polonium exhaustion silenced one and crater dust overheated the other.',
    glossaryTerms: [
      {
        term: 'Polonium-210 Thermal Heater',
        plainExplanation:
          'A radioactive heat source sealed inside the rover’s pressurized body to keep electronics warm during brutal -150°C two-week lunar nights.',
      },
      {
        term: 'Cone Penetrometer',
        plainExplanation:
          'A mechanical probe pressed into lunar soil to measure compaction, strength, and bearing resistance along the rover’s route.',
      },
      {
        term: 'Radiator Lid',
        plainExplanation:
          'A hinged top cover coated with solar cells on the inside; opening it exposed a cooling radiator to space during daytime and charged the batteries.',
      },
    ],
    journeyNarrative:
      'Delivered by Luna 17 in November 1970, Lunokhod 1 became the first remote-controlled robotic rover on another world, operating for 322 Earth days and driving 10.5 km across Mare Imbrium. In January 1973, Luna 21 delivered the upgraded 840 kg Lunokhod 2 into Le Monnier Crater, where it covered 39 km in just four months—a lunar distance record that stood for decades.',
    endingDetails: {
      verifiedFacts:
        'Lunokhod 1 lost contact on September 14, 1971 after its Polonium-210 thermal source decayed and internal temperatures dropped fatally. In May 1973, Lunokhod 2 accidentally backed or brushed its open solar lid against a crater wall, scooping loose lunar dust onto the radiator; when the lid closed at lunar nightfall, the dust coated the cooling radiator and caused fatal overheating.',
      distinctionNote:
        'Active Relic Note: While both rovers are permanently silent, Lunokhod 1 carries a French corner-cube laser retroreflector that was rediscovered in LRO imagery (PIA12967) and still answers Earth lasers today.',
    },
    legacyImpact: {
      significance:
        'Lunokhod proved long-duration teleoperated planetary roving across multiple lunar day-night cycles decades before Mars rovers.',
      futureLessons: [
        'Electrostatic lunar dust poses severe thermal risks when it coats radiator surfaces or moving hinged mechanisms.',
        'Long-lived passive optical retroreflectors continue adding value to laser ranging networks long after active rover systems expire.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Verified JPL Photojournal record PIA12967: LRO orbital imagery of Lunokhod 1 & tracks',
        label: 'NASA JPL Photojournal — Catalog PIA12967',
        url: 'https://photojournal.jpl.nasa.gov/catalog/PIA12967',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'NASA SVS #10595 Lunokhod 1 rediscovery & laser ranging visualization',
        label: 'NASA Scientific Visualization Studio (SVS)',
        url: 'https://svs.gsfc.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search SVS #10595 or Lunokhod',
      },
      {
        claimOrAsset: 'LROC high-resolution mapping of Luna 17 / Luna 21 landing sites',
        label: 'NASA LROC Orbital Archive (ASU)',
        url: 'https://www.lroc.asu.edu/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Lunokhod 1 / Lunokhod 2',
      },
    ],
  },

  'pathfinder-sojourner': {
    discoveryHook:
      'Bouncing to a stop inside giant inflatable airbags on July 4, 1997, Mars Pathfinder unfolded like a metal flower—and sent the microwave-oven-sized Sojourner down a ramp as the first wheeled robot ever to rove Mars.',
    glossaryTerms: [
      {
        term: 'Airbag Landing System',
        plainExplanation:
          'A cluster of tough, inflated fabric cushions surrounding the lander that absorbed high-speed impact and bounced across the Martian plain before deflating.',
      },
      {
        term: 'Alpha Proton X-Ray Spectrometer (APXS)',
        plainExplanation:
          'A compact sensor Sojourner pressed against rocks to identify their chemical makeup using alpha particles and X-rays.',
      },
      {
        term: 'Martian Sol',
        plainExplanation:
          'One solar day on Mars—approximately 24 hours, 39 minutes, and 35 seconds long.',
      },
    ],
    journeyNarrative:
      'Designed as a low-cost Discovery technology demonstrator, Mars Pathfinder landed in the ancient flood plain of Ares Vallis on July 4, 1997. After its three triangular solar petals opened and righted the Carl Sagan Memorial Station, the 10.6 kg six-wheeled Sojourner drove down the deployment ramp. Planned for just seven days, the pair collaborated for 83 sols—measuring wind, soil chemistry, and flood-deposited rocks.',
    endingDetails: {
      verifiedFacts:
        'Intentionally non-returnable, Pathfinder transmitted its final signal on September 27, 1997. Mission engineers concluded that mainboard battery failure during freezing Martian nights ended its ability to reboot and maintain its radio link, leaving Sojourner parked meters away.',
      distinctionNote:
        'Reference Data Clarification: The project Handoff Document lists Sojourner’s Mars mass entry as "0.68 kg" alongside its 10.6 kg Earth mass. In physics, mass remains 10.6 kg everywhere, while weight-equivalent under Mars’ ~0.38g surface gravity is ~4.0 kg (0.68 kg is actually Ingenuity’s Mars weight-equivalent). Both are transparently documented here.',
    },
    legacyImpact: {
      significance:
        'Pathfinder proved that airbag landings and small autonomous rovers could work reliably on Mars, directly paving the way for Spirit and Opportunity.',
      futureLessons: [
        'Low-cost, fault-tolerant landing architectures can open planetary surfaces when paired with mobile surface scouts.',
        'Non-rechargeable thermal batteries impose hard lifespan limits once Martian winter nights deepen.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Mars Pathfinder & Sojourner official telemetry, mission logs & imagery',
        label: 'NASA Mars Exploration Program Archive',
        url: 'https://mars.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Mars Pathfinder / Sojourner 1997',
      },
      {
        claimOrAsset: 'Pathfinder lander & Sojourner engineering specifications (10.6 kg mass, 83 sols)',
        label: 'NASA Technical Reports Server (NTRS)',
        url: 'https://ntrs.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Mars Pathfinder 1997 mission summary',
      },
      {
        claimOrAsset: 'Photojournal Catalog Audit Notice regarding Handoff ID PIA00604',
        label: 'NASA JPL Photojournal — Catalog Check',
        url: 'https://photojournal.jpl.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Mars Pathfinder Sojourner',
        correctionNote:
          'Audit Clarification: Although the initial Handoff Document listed PIA00604 for Pathfinder, JPL Photojournal PIA00604 is actually a Dec 1996 Galileo image of Jupiter. Use the Photojournal search term "Mars Pathfinder" for authentic 1997 surface images.',
      },
    ],
  },

  'spirit-rover': {
    discoveryHook:
      'Built to survive 90 days in Gusev Crater, Spirit climbed mountains and uncovered ancient hot-spring silica over five years—until its wheels broke through a thin desert crust into soft sand at "Troy" and Martian winter froze its silent arrays.',
    glossaryTerms: [
      {
        term: '6-Wheel Rocker-Bogie Suspension',
        plainExplanation:
          'An articulated chassis linkage with no springs that keeps all six wheels in contact with uneven rocks while limiting body tilt.',
      },
      {
        term: 'Silica Deposits',
        plainExplanation:
          'Nearly pure silicon dioxide minerals that on Earth typically form in hot springs or volcanic steam vents—strong evidence of past hot water.',
      },
      {
        term: 'Martian Winter Solar Tilt',
        plainExplanation:
          'During winter in the Martian southern hemisphere, the Sun stays low in the north; flat solar panels must be angled toward the Sun to generate survival heat.',
      },
    ],
    journeyNarrative:
      'After bouncing down in Gusev Crater on January 4, 2004, Spirit initially found volcanic basalt instead of a dry lakebed. Rather than stop, engineers drove it kilometers eastward up Husband Hill and into the Columbia Hills. Along the way, a dragging broken right-front wheel accidentally scraped away topsoil to expose 90% pure silica—evidence of ancient hydrothermal vents—before Spirit broke into soft iron-sulfate sand on May 1, 2009.',
    endingDetails: {
      verifiedFacts:
        'Unable to free its wheels from the soft sand trap at "Troy," Spirit operated as a stationary science station for nearly a year. Because its solar arrays could not be tilted northward toward the low winter Sun, internal power fell below heater thresholds after its final signal on March 22, 2010; NASA officially ended recovery listening on May 25, 2011.',
      distinctionNote:
        'Coordinate Note: Spirit’s plotted coordinates (14.5692° S, 175.4729° E) represent its final traverse endpoint at "Troy" after 7.73 km of driving, rather than its initial Columbia Memorial Station landing point.',
    },
    legacyImpact: {
      significance:
        'Spirit proved that ancient Mars hosted hydrothermal hot-spring environments capable of supporting key chemical ingredients for life.',
      futureLessons: [
        'Hidden loose sulfates beneath brittle surface crusts remain a primary mobility hazard for wheeled planetary rovers.',
        'Solar-powered rovers at mid-latitudes must actively manage winter tilt angles to survive cold seasons.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Spirit Gusev Crater 7.73 km traverse, silica discovery & May 25, 2011 decommissioning',
        label: 'NASA Mars Exploration Program Archive',
        url: 'https://mars.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Spirit MER-A Gusev Crater Troy',
      },
      {
        claimOrAsset: 'Official NASA 3D mesh reference: 24883_MER_static.glb (11.36 MB)',
        label: 'NASA Science 3D Resources Hub',
        url: 'https://science.nasa.gov/3d-resources/',
        linkType: 'archive-portal',
        lookupTerm: '24883_MER_static.glb',
      },
      {
        claimOrAsset: 'Photojournal Catalog Audit Notice regarding Handoff ID PIA05196',
        label: 'NASA JPL Photojournal — Catalog PIA05196',
        url: 'https://photojournal.jpl.nasa.gov/catalog/PIA05196',
        linkType: 'direct-record',
        correctionNote:
          'Audit Clarification: The Handoff Document cited PIA05196 for Spirit at Gusev Crater, but JPL Catalog PIA05196 actually depicts Spirit’s twin Opportunity deploying its APXS at Meridiani Planum (Jan 2004).',
      },
    ],
  },

  'opportunity-rover': {
    discoveryHook:
      'Designed for a 90-sol sprint, Opportunity rolled 45.16 kilometers across Meridiani Planum for 14.5 Earth years—until a planet-encircling dust storm turned Martian noon into pitch darkness in June 2018.',
    glossaryTerms: [
      {
        term: 'Atmospheric Optical Depth (Tau)',
        plainExplanation:
          'A measure of how much dust in the Martian sky blocks sunlight; during the June 2018 global storm, tau rose so high that solar panels could barely generate electricity.',
      },
      {
        term: 'Hematite Mineral Spheres ("Blueberries")',
        plainExplanation:
          'Tiny iron-oxide concretions formed inside wet rock sediments long ago, discovered by Opportunity as early proof of liquid water.',
      },
      {
        term: 'Perseverance Valley',
        plainExplanation:
          'A shallow channel carved into the western rim of Endeavour Crater where Opportunity made its final scientific climb.',
      },
    ],
    journeyNarrative:
      'Landing directly inside tiny Eagle Crater on January 25, 2004, Opportunity immediately photographed layered bedrock bearing water-formed minerals. Over the next 5,111 Martian sols—more than 55 times its planned mission—it surveyed Endurance, Victoria, and giant 22-kilometer Endeavour Crater, setting the all-time off-world driving record of 45.16 km before a historic global dust storm rolled over Perseverance Valley.',
    endingDetails: {
      verifiedFacts:
        'In June 2018, planet-wide airborne dust choked off solar irradiance, draining Opportunity’s lithium-ion batteries and causing its mission clock to lose time. After transmitting over 1,000 recovery commands without reply, NASA declared the mission complete on February 13, 2019.',
      distinctionNote:
        'Quote Verification: The widely shared line "My battery is low and it’s getting dark" was NOT transmitted by Opportunity. Science journalist Jacob Margolis wrote it as a poetic summary of engineering telemetry reporting low battery charge and extreme atmospheric dust opacity.',
    },
    legacyImpact: {
      significance:
        'Opportunity transformed Mars from a dry desert image into a documented world of ancient lakes, acidic groundwater, and habitable-era clay minerals.',
      futureLessons: [
        'Global dust storms can starve solar-powered surface missions anywhere on Mars for months at a time.',
        'Long-duration rovers benefit from redundant flash memory workarounds and careful wheel-current diagnostics.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Opportunity 45.16 km driving record, 5,111 sols & Feb 13, 2019 mission completion',
        label: 'NASA Mars Exploration Program Archive',
        url: 'https://mars.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Opportunity MER-B Perseverance Valley 45.16 km',
      },
      {
        claimOrAsset: 'Official NASA 3D mesh reference: 24883_MER_static.glb (11.36 MB)',
        label: 'NASA Science 3D Resources Hub',
        url: 'https://science.nasa.gov/3d-resources/',
        linkType: 'archive-portal',
        lookupTerm: '24883_MER_static.glb',
      },
      {
        claimOrAsset: 'Photojournal Catalog Audit Notice regarding Handoff ID PIA22328',
        label: 'NASA JPL Photojournal — Catalog Check',
        url: 'https://photojournal.jpl.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Opportunity Perseverance Valley Endeavour Crater',
        correctionNote:
          'Audit Clarification: Although the Handoff Document cited PIA22328 for Opportunity’s Endeavour Crater panorama, JPL Catalog PIA22328 is actually a Curiosity SAM methane measurement graph (June 2018).',
      },
    ],
  },

  'viking-landers': {
    discoveryHook:
      'In the summer of 1976, two nuclear-powered stationary laboratories transmitted humanity’s first crisp color panoramas of Martian soil—and Viking 1 kept sending weather data for over six years until a mistaken software command pointed its antenna away from Earth.',
    glossaryTerms: [
      {
        term: 'SNAP-19 Radioisotope Thermoelectric Generator',
        plainExplanation:
          'Twin plutonium-powered generators on each lander producing 70 watts of steady electricity regardless of dust storms or seasons.',
      },
      {
        term: 'Automated Biology Laboratory',
        plainExplanation:
          'A compact chemistry chamber that mixed scooped Martian soil with water and nutrients to test for metabolic gas release from potential microbes.',
      },
      {
        term: 'High-Gain Antenna Pointing Parameters',
        plainExplanation:
          'Stored mathematical coordinates telling the lander’s dish antenna where Earth is in the Martian sky so radio signals reach Deep Space Network receivers.',
      },
    ],
    journeyNarrative:
      'Viking 1 touched down in Chryse Planitia on July 20, 1976, followed six weeks later by Viking 2 in Utopia Planitia. Carrying biology labs, weather booms, seismometers, and soil scoops, the twin stations revolutionized planetary science with multi-year Martian climate logs and the first chemical assays of red regolith.',
    endingDetails: {
      verifiedFacts:
        'Both were intentionally stationary landers. Viking 2 went silent on April 11, 1980 when its aging batteries failed. Viking 1—renamed the Thomas Mutch Memorial Station—kept working until November 13, 1982, when an erroneous memory-update command sent from Earth accidentally overwrote its antenna pointing software.',
      distinctionNote:
        'Verified Fact: Viking 1’s hardware was still powered by its SNAP-19 RTGs when contact was lost, but without accurate Earth-pointing coordinates its radio beam could no longer be locked onto by ground antennas.',
    },
    legacyImpact: {
      significance:
        'The Viking landers established the first long-term surface meteorology baselines on Mars and drove decades of debate over Martian soil oxidants and perchlorates.',
      futureLessons: [
        'Strict uplink command verification and safe-mode antenna recovery routines are critical so software patches cannot sever Earth contact.',
        'Radioisotope generators eliminate vulnerability to seasonal Martian dust and high-latitude winters.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Verified JPL Photojournal record PIA00563: First Color Image from Viking Lander 1',
        label: 'NASA JPL Photojournal — Catalog PIA00563',
        url: 'https://photojournal.jpl.nasa.gov/catalog/PIA00563',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'Viking 1 & 2 mission timelines, 572 kg landed mass & 1980/1982 loss reports',
        label: 'NASA Mars Exploration Program Archive',
        url: 'https://mars.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Viking 1 Viking 2 Landers 1976',
      },
      {
        claimOrAsset: 'Official NASA printable 3D reference: 3D Viking Lander.stl (~15 MB)',
        label: 'NASA Science 3D Resources Hub',
        url: 'https://science.nasa.gov/3d-resources/',
        linkType: 'archive-portal',
        lookupTerm: '3D Viking Lander.stl',
      },
    ],
  },

  'phoenix-lander': {
    discoveryHook:
      'Sent to the frozen arctic plains of Mars knowing it could never survive winter, Phoenix scraped 18 centimeters through red soil to expose gleaming white water ice—before seasonal darkness buried its solar wings under heavy dry ice.',
    glossaryTerms: [
      {
        term: 'Permafrost & Subsurface Water Ice',
        plainExplanation:
          'Frozen water locked permanently beneath the upper centimeters of Martian polar soil, directly uncovered by Phoenix’s robotic scoop.',
      },
      {
        term: 'Perchlorates',
        plainExplanation:
          'Reactive chlorine-oxygen salts detected by Phoenix’s wet-chemistry lab, important for understanding Martian soil chemistry and future human resource hazards.',
      },
      {
        term: 'Dry-Ice (CO2) Seasonal Deposition',
        plainExplanation:
          'During Martian polar winter, temperatures plunge cold enough for carbon dioxide in the thin air to freeze directly onto the ground and spacecraft as heavy frost.',
      },
    ],
    journeyNarrative:
      'Landing at 68.15° N in Vastitas Borealis on May 25, 2008, Phoenix unfolded its 5.5-meter decagonal solar wings and extended a 2.35-meter robotic arm. Digging up to 18 cm deep, it exposed bright subsurface water ice that sublimated away over days, detected calcium carbonate and perchlorates, and watched snow fall from high Martian clouds.',
    endingDetails: {
      verifiedFacts:
        'Phoenix was engineered solely for northern Martian summer. As sunlight vanished in late autumn, final contact occurred on November 2, 2008. Subsequent Mars Reconnaissance Orbiter images showed structural damage consistent with Phoenix’s solar panels buckling under heavy seasonal carbon-dioxide dry ice.',
      distinctionNote:
        'Verified Fact: The mission ended exactly as polar orbital geometry dictated; extended-life survival through arctic Martian winter was never physically possible on solar power.',
    },
    legacyImpact: {
      significance:
        'Phoenix provided direct, physical verification of shallow water-ice sheets in the Martian arctic—confirming orbital neutron spectrometer predictions.',
      futureLessons: [
        'Shallow polar water ice is accessible with simple mechanical trenching tools, though perchlorates require careful filtration.',
        'High-latitude solar missions must be scheduled tightly around polar daylight windows.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Phoenix polar landing at 68.15° N, 18 cm ice trenching & Nov 2, 2008 shutdown',
        label: 'NASA Mars Exploration Program Archive',
        url: 'https://mars.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Phoenix Mars Lander Vastitas Borealis 2008',
      },
      {
        claimOrAsset: 'Phoenix TEGA, Wet Chemistry Lab & orbital CO2 ice damage findings',
        label: 'NASA Technical Reports Server (NTRS)',
        url: 'https://ntrs.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Phoenix Mars Lander 2008 permafrost',
      },
    ],
  },

  'insight-lander': {
    discoveryHook:
      'Instead of driving across Mars, InSight planted a French-built seismometer directly onto the plains of Elysium Planitia—listening to over 1,300 marsquakes until settling red dust slowly choked off its circular solar wings.',
    glossaryTerms: [
      {
        term: 'SEIS Planetary Seismometer',
        plainExplanation:
          'An ultra-sensitive instrument capped by a wind-and-thermal shield that detected faint ground tremors inside Mars down to the scale of a hydrogen atom.',
      },
      {
        term: 'HP3 Heat-Flow "Mole"',
        plainExplanation:
          'A self-hammering probe designed to burrow underground to measure heat escaping from Mars’ interior; unexpected soil cohesion prevented full burrowing.',
      },
      {
        term: 'Liquid Core Radius (~1,830 km)',
        plainExplanation:
          'By timing seismic waves bouncing off the deep center of Mars, InSight measured the size and molten state of the planet’s iron-rich core.',
      },
    ],
    journeyNarrative:
      'Touching down on Elysium Planitia on November 26, 2018, InSight used its robotic arm to place the SEIS seismometer dome directly onto Martian regolith. Across four years, it recorded over 1,300 marsquakes—peaking with a Magnitude 5.0 quake on May 4, 2022—while progressively losing solar output as fine dust blanketed its 6-meter UltraFlex panels.',
    endingDetails: {
      verifiedFacts:
        'Dust accumulation reduced InSight’s solar power generation below survival levels. After beaming back its final dusty selfie and telemetry on December 15, 2022, InSight missed two consecutive communication sessions, prompting NASA to officially decommission the mission on December 21, 2022.',
      distinctionNote:
        'Verified Fact: Unlike Opportunity’s sudden global storm, InSight experienced gradual dust buildup—even using its robotic scoop to trickle sand over one panel to help wind sweep away finer dust grains, extending science into late 2022.',
    },
    legacyImpact: {
      significance:
        'InSight produced the first seismic map of Mars’ crust, mantle, and ~1,830 km liquid core, transforming planetary geophysics beyond Earth and the Moon.',
      futureLessons: [
        'Robotic surface placement of shielded seismometers works reliably on Mars and isolates wind noise.',
        'Passive solar missions on low-wind Martian plains require realistic dust-degradation margins or dust-mitigation mechanisms.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'InSight mission overview, 1,300+ marsquakes, Mag 5.0 event & Dec 21, 2022 retirement',
        label: 'NASA Science — InSight Mission Overview',
        url: 'https://science.nasa.gov/mission/insight/',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'Verified JPL Photojournal record PIA25287: InSight’s Final Selfie showing dusty solar arrays',
        label: 'NASA JPL Photojournal — Catalog PIA25287',
        url: 'https://photojournal.jpl.nasa.gov/catalog/PIA25287',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'Official NASA 3D mesh reference: 24880_InSight_deployed.glb (21.32 MB)',
        label: 'NASA Science 3D Resources Hub',
        url: 'https://science.nasa.gov/3d-resources/',
        linkType: 'archive-portal',
        lookupTerm: '24880_InSight_deployed.glb',
      },
    ],
  },

  'ingenuity-helicopter': {
    discoveryHook:
      'Built to attempt five risky test flights in air 100 times thinner than Earth’s, the 1.8 kg Ingenuity helicopter flew 72 times across nearly three years—before bland, ripple-free sand dunes confused its navigation camera and fractured a rotor blade on touchdown.',
    glossaryTerms: [
      {
        term: 'Counter-Rotating Carbon Blades (~2,400 RPM)',
        plainExplanation:
          'Two stacked 1.2-meter carbon-fiber rotors spinning in opposite directions nearly ten times faster than Earth helicopters to bite into Mars’ <1%-density air.',
      },
      {
        term: 'Optical Flow Navigation',
        plainExplanation:
          'A downward-facing camera tracking rocks and surface features frame-by-frame to measure horizontal drift and speed automatically during flight.',
      },
      {
        term: 'Jezero Crater / Airfield Chi',
        plainExplanation:
          'The landing zones inside ancient lakebed Jezero Crater; Valinor Hills ("Airfield Chi") is where Ingenuity remains upright after Flight 72.',
      },
    ],
    journeyNarrative:
      'Dropped from Perseverance’s belly in Jezero Crater, Ingenuity made history on April 19, 2021 with humanity’s first powered, controlled aerodynamic flight on another planet. Outlasting its five-flight design spec by more than fourteenfold, it flew 17.24 km over 128.8 airborne minutes—serving as an aerial scout ahead of Perseverance until Flight 72 on January 18, 2024.',
    endingDetails: {
      verifiedFacts:
        'During a vertical pop-up flight over smooth, featureless sand ripples at Valinor Hills, Ingenuity’s downward navigation camera lacked enough distinct surface texture to track horizontal velocity accurately. The resulting hard touchdown fractured at least one carbon-fiber rotor blade tip, permanently unbalancing the rotor system; NASA retired flight operations on January 25, 2024.',
      distinctionNote:
        'Operational Status Note: Ingenuity remains upright and solar-powered at Airfield Chi, unable to fly again, serving as a stationary monument and engineering testbed.',
    },
    legacyImpact: {
      significance:
        'Ingenuity opened the era of extraterrestrial aviation, proving aerodynamic flight is practical as a reconnaissance companion to surface rovers.',
      futureLessons: [
        'Visual-inertial navigation requires fallback hazard estimation when flying over featureless sand dunes or snowfields.',
        'Lightweight off-the-shelf processors and high-RPM carbon rotors can survive thousands of Martian thermal cycles.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Ingenuity 72 flights, 17.24 km total distance, Flight 72 blade damage & Jan 25, 2024 retirement',
        label: 'NASA Science — Mars 2020 Ingenuity Helicopter',
        url: 'https://science.nasa.gov/mission/mars-2020-ingenuity/',
        linkType: 'direct-record',
      },
      {
        claimOrAsset: 'Official NASA 3D mesh reference: 25043_Ingenuity_v3.glb (1.73 MB)',
        label: 'NASA Science 3D Resources Hub',
        url: 'https://science.nasa.gov/3d-resources/',
        linkType: 'archive-portal',
        lookupTerm: '25043_Ingenuity_v3.glb',
      },
      {
        claimOrAsset: 'Photojournal Catalog Audit Notice regarding Handoff ID PIA24808',
        label: 'NASA JPL Photojournal — Catalog Check',
        url: 'https://photojournal.jpl.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Ingenuity Valinor Hills Airfield Chi',
        correctionNote:
          'Audit Clarification: Although the Handoff Document cited PIA24808 for Perseverance’s photo of Ingenuity on sand, JPL Catalog PIA24808 actually depicts Perseverance Sample Tube 266.',
      },
    ],
  },

  'dawn-spacecraft': {
    discoveryHook:
      'Driven not by chemical explosions but by a gentle blue stream of xenon ions, Dawn became the first spacecraft to orbit two extraterrestrial worlds—now circling dwarf planet Ceres in silent, 50-year quarantine so it cannot contaminate a potentially watery world.',
    glossaryTerms: [
      {
        term: 'Xenon Ion Propulsion',
        plainExplanation:
          'Electric engines that ionize xenon gas using solar electricity and accelerate it through charged grids—producing tiny thrust continuously for years to achieve huge speed changes.',
      },
      {
        term: 'Hydrazine Attitude Control',
        plainExplanation:
          'Small chemical thrusters used to point Dawn’s solar wings toward the Sun and its dish antenna toward Earth once reaction wheels wore out.',
      },
      {
        term: 'Planetary Protection Orbit',
        plainExplanation:
          'An internationally agreed parking orbit engineered to prevent an unsterilized defunct probe from crashing onto a body with subsurface water or organic chemistry.',
      },
    ],
    journeyNarrative:
      'Launched on September 27, 2007, Dawn spiraled out to protoplanet 4 Vesta, orbiting it from 2011 to 2012 before firing its xenon ion thrusters again to leave Vesta and enter orbit around dwarf planet 1 Ceres in 2015. Inside Ceres’ bright craters, Dawn mapped sodium-carbonate salt deposits and cryovolcanic domes before its hydrazine attitude propellant ran dry.',
    endingDetails: {
      verifiedFacts:
        'On November 1, 2018, Dawn missed scheduled Deep Space Network check-ins, confirming it had exhausted the last of its hydrazine attitude-control propellant. Unable to keep its solar arrays pointed at the Sun or its antenna aimed at Earth, Dawn entered permanent unpowered silence.',
      distinctionNote:
        'Planetary Protection Fact: Before fuel ran out, flight controllers placed Dawn into a high-stability orbit around 1 Ceres calculated to avoid impacting Ceres’ surface for more than 50 years.',
    },
    legacyImpact: {
      significance:
        'Dawn proved solar-electric ion propulsion can turn a single spacecraft into an interplanetary multi-orbit explorer across the main asteroid belt.',
      futureLessons: [
        'Low-thrust ion engines unlock missions between multiple small bodies that chemical rockets cannot afford.',
        'End-of-mission planetary protection orbits must be planned well before hydrazine attitude reserves reach zero.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Dawn 4 Vesta & 1 Ceres orbital science, Nov 1, 2018 hydrazine exhaustion & >50-year orbit',
        label: 'NASA Planetary Data System (PDS) & Mission Archive',
        url: 'https://pds.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Dawn Mission Vesta Ceres',
      },
      {
        claimOrAsset: 'Official NASA 3D CAD reference: dawn.glb',
        label: 'NASA Science 3D Resources Hub',
        url: 'https://science.nasa.gov/3d-resources/',
        linkType: 'archive-portal',
        lookupTerm: 'dawn.glb',
      },
    ],
  },

  'near-shoemaker': {
    discoveryHook:
      'Built strictly as an asteroid orbiter with zero landing legs, NEAR Shoemaker ended a year-long survey of peanut-shaped 433 Eros by gently touching down on the asteroid’s surface at 1.9 m/s—and surviving to beam back 16 days of surface data.',
    glossaryTerms: [
      {
        term: 'Near-Earth Asteroid 433 Eros',
        plainExplanation:
          'A stony, ~34-kilometer-long asteroid whose orbit crosses near Mars and approaches Earth’s neighborhood, studied as a primitive solar-system building block.',
      },
      {
        term: 'Gamma-Ray Spectrometer',
        plainExplanation:
          'An instrument measuring faint gamma rays emitted by asteroid elements under cosmic-ray bombardment—far more sensitive when resting directly on the surface.',
      },
      {
        term: '1.9 m/s Controlled Descent',
        plainExplanation:
          'A gentle walking-pace touchdown (~4.3 mph) achieved using orbital maneuvering thrusters in Eros’ tiny microgravity field.',
      },
    ],
    journeyNarrative:
      'Launched on February 17, 1996 as the first mission in NASA’s Discovery Program, NEAR Shoemaker spent a year orbiting 433 Eros, mapping over 160,000 images of its cratered regolith. With primary orbital objectives complete and fuel nearly spent, engineers improvised a slow, five-burn descent onto Eros’ saddle region on February 12, 2001—cushioning the landing on the tips of its four radial solar panels.',
    endingDetails: {
      verifiedFacts:
        'Against odds, NEAR Shoemaker remained upright and locked onto Earth after touchdown, operating its gamma-ray spectrometer directly on the asteroid surface for 16 days until power depletion and final shutdown commands on February 28, 2001.',
      distinctionNote:
        'Verified Fact: The landing was an end-of-mission bonus maneuver after all primary orbital goals had been satisfied.',
    },
    legacyImpact: {
      significance:
        'NEAR Shoemaker achieved humanity’s first orbit and first landing on an asteroid, transforming small-body exploration from brief flybys to sustained close-up science.',
      futureLessons: [
        'Low-gravity asteroid landings can be executed with gentle thruster braking even without dedicated landing gear.',
        'Close-range surface spectroscopy dramatically improves elemental detection over orbital passes.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'NEAR Shoemaker 433 Eros shape models, Feb 12, 2001 touchdown & gamma-ray datasets',
        label: 'NASA Planetary Data System (PDS) — Small Bodies Node',
        url: 'https://pds.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search NEAR Shoemaker 433 Eros',
      },
      {
        claimOrAsset: 'NEAR Shoemaker ~1.9 m/s descent engineering report & Feb 28, 2001 shutdown',
        label: 'NASA Technical Reports Server (NTRS)',
        url: 'https://ntrs.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search NEAR Shoemaker Eros landing 2001',
      },
    ],
  },

  'kepler-telescope': {
    discoveryHook:
      'For over nine years in an Earth-trailing solar orbit, a single 0.95-meter space telescope stared at distant stars waiting for tiny flickers of passing planets—before exhausting its final drops of thruster fuel and powering down forever.',
    glossaryTerms: [
      {
        term: 'Transit Photometry',
        plainExplanation:
          'Measuring the tiny, repeating dip in a star’s brightness when an orbiting exoplanet crosses directly in front of it from the telescope’s viewpoint.',
      },
      {
        term: '0.95 m Photometer',
        plainExplanation:
          'Kepler’s dedicated wide-field telescope optics and CCD camera array built to track the brightness of more than 150,000 stars simultaneously.',
      },
      {
        term: 'Earth-Trailing Heliocentric Orbit',
        plainExplanation:
          'An orbit around the Sun that drifts slowly behind Earth, keeping the observatory away from Earth’s thermal glare and reflected light.',
      },
    ],
    journeyNarrative:
      'Launched on March 7, 2009, Kepler spent four years staring steadily at a star-rich patch in Cygnus. When two of its four reaction wheels failed, engineers ingeniously balanced the telescope against gentle sunlight pressure to launch the extended K2 ecliptic survey—continuing discoveries until hydrazine fuel ran dry.',
    endingDetails: {
      verifiedFacts:
        'After exhausting the hydrazine propellant needed to aim its telescope and antenna, Kepler was officially retired. On October 30, 2018, engineers sent "goodnight" commands to disable its safety modes and permanently turn off its radio transmitters while drifting safely in its Earth-trailing solar orbit.',
      distinctionNote:
        'Orbital Safety Note: Its heliocentric drift keeps Kepler well clear of Earth and prevents radio frequency interference with active missions.',
    },
    legacyImpact: {
      significance:
        'Kepler revolutionized astrophysics by proving statistically that planets outnumber stars in the Milky Way and uncovering rocky Earth-sized worlds.',
      futureLessons: [
        'Solar radiation pressure can serve as an improvised third-axis stabilizer when mechanical reaction wheels fail.',
        'Clean transmitter shutdowns preserve radio spectrum for next-generation exoplanet observatories.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Kepler 0.95 m photometer specifications, K2 operations & Oct 30, 2018 decommissioning',
        label: 'NASA Technical Reports Server (NTRS)',
        url: 'https://ntrs.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Kepler Space Telescope decommissioning 2018',
      },
      {
        claimOrAsset: 'Official NASA 3D mesh reference: kepler.glb (~2.5 MB)',
        label: 'NASA Science 3D Resources Hub',
        url: 'https://science.nasa.gov/3d-resources/',
        linkType: 'archive-portal',
        lookupTerm: 'kepler.glb',
      },
    ],
  },

  'pioneer-probes': {
    discoveryHook:
      'Launched in 1972 and 1973 to test whether spacecraft could survive the asteroid belt and Jupiter’s intense radiation, Pioneer 10 and 11 now glide silently toward distant constellations—carrying gold-anodized plaques long after their radio whispers faded.',
    glossaryTerms: [
      {
        term: 'Astronomical Unit (AU)',
        plainExplanation:
          'The average distance between Earth and the Sun (~150 million km). Pioneer 10’s final signal arrived from 82 AU—over 12 billion kilometers away.',
      },
      {
        term: 'Outboard Boom RTGs',
        plainExplanation:
          'Plutonium radioisotope power generators mounted on long struts away from the main dish so their radiation would not interfere with science sensors.',
      },
      {
        term: 'Pioneer Plaque',
        plainExplanation:
          'A gold-anodized aluminum plate bolted to each probe’s antenna struts depicting hydrogen atoms, pulsar directions to our Sun, and human figures.',
      },
    ],
    journeyNarrative:
      'Pioneer 10 launched on March 2, 1972 and became the first probe to cross the main asteroid belt and fly past Jupiter; Pioneer 11 followed in April 1973 to reach both Jupiter and Saturn. Accelerated onto solar-system escape trajectories, their dwindling RTGs kept faint signals audible across decades—until Pioneer 11 faded in 1995 and Pioneer 10 whispered its last detectable carrier signal from 82 AU on January 23, 2003.',
    endingDetails: {
      verifiedFacts:
        'Neither probe suffered a sudden crash; rather, radioactive decay gradually lowered RTG electrical power until onboard transmitters could no longer send signals detectable by Earth’s Deep Space Network across multi-billion-mile distances.',
      distinctionNote:
        'Trajectory Fact: Pioneer 10 is drifting outward toward the constellation Taurus, while Pioneer 11 heads toward Aquila on permanent interstellar escape paths.',
    },
    legacyImpact: {
      significance:
        'Pioneer 10 and 11 proved outer-planet missions could survive the asteroid belt and Jovian radiation belts, clearing the path for Voyager, Galileo, Cassini, and New Horizons.',
      futureLessons: [
        'High-gain dishes and long-half-life radioisotope power sources enable multi-decade communication across tens of AU.',
        'Radiation shielding lessons from Pioneer’s Jupiter flybys directly informed all subsequent outer-planet spacecraft.',
      ],
    },
    evidenceSources: [
      {
        claimOrAsset: 'Pioneer 10 & 11 outer-planet reconnaissance, 82 AU signal loss & plaque specs',
        label: 'NASA Technical Reports Server (NTRS)',
        url: 'https://ntrs.nasa.gov/',
        linkType: 'archive-portal',
        lookupTerm: 'Search Pioneer 10 11 82 AU 2003',
      },
      {
        claimOrAsset: 'Pioneer 10 / 11 spacecraft CAD archives & visualization resources',
        label: 'NASA Science 3D Resources Hub',
        url: 'https://science.nasa.gov/3d-resources/',
        linkType: 'archive-portal',
        lookupTerm: 'Pioneer 10 Pioneer 11 CAD',
      },
    ],
  },
};
