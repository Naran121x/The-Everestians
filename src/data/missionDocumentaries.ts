export interface DocumentaryCue {
  start: number;
  end: number;
  caption: string;
}

export interface DocumentarySceneScript {
  id: string;
  number: string;
  title: string;
  eraLabel: string;
  startTime: number;
  endTime: number;
  narration: string;
  telemetryLabel: string;
}

export interface ExhibitDocumentaryScript {
  exhibitId: string;
  title: string;
  subtitle: string;
  duration: number;
  archetype:
    | 'insight'
    | 'apollo-lm'
    | 'rover-moon'
    | 'alsep'
    | 'surveyor'
    | 'lunokhod'
    | 'pathfinder'
    | 'mer-rover'
    | 'viking'
    | 'phoenix'
    | 'ingenuity'
    | 'dawn'
    | 'near'
    | 'kepler'
    | 'pioneer';
  powerMetricName: string;
  powerPeakLabel: string;
  powerEndLabel: string;
  scenes: [
    DocumentarySceneScript,
    DocumentarySceneScript,
    DocumentarySceneScript,
    DocumentarySceneScript,
  ];
  cues: DocumentaryCue[];
}

export const MISSION_DOCUMENTARIES: Record<string, ExhibitDocumentaryScript> = {
  'insight-lander': {
    exhibitId: 'insight-lander',
    title: 'InSight: The Last Signal',
    subtitle: 'Elysium Planitia, Mars · 4.502° N, 135.623° E · Nov 2018 – Dec 2022',
    duration: 40,
    archetype: 'insight',
    powerMetricName: 'UltraFlex Solar Output',
    powerPeakLabel: '4,588 Wh/sol',
    powerEndLabel: '< 285 Wh/sol (Lost)',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Arrival at Mars',
        eraLabel: 'November 26, 2018 · EDL Sequence',
        startTime: 0,
        endTime: 10,
        narration:
          'Plunging into Mars’ thin carbon-dioxide atmosphere at 19,800 kilometers per hour, InSight rides its heat shield, pops a supersonic parachute, and fires twelve retro-rockets to touch down on Elysium Planitia.',
        telemetryLabel: 'Entry Velocity -> Soft Touchdown (4.5° N, 135.6° E)',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'A Mission Begins',
        eraLabel: '2018 – 2022 · Listening Inside Mars',
        startTime: 10,
        endTime: 20,
        narration:
          'Twin six-meter circular UltraFlex wings unfurl cleanly to harvest sunlight. A robotic arm lifts the dome-shielded SEIS seismometer onto Martian soil, capturing over 1,300 marsquakes radiating through the planet’s mantle and liquid core.',
        telemetryLabel: '1,319+ Marsquakes · Liquid Core Radius ~1,830 km',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'The Fading Power',
        eraLabel: 'May – December 2022 · Dust Accumulation',
        startTime: 20,
        endTime: 30,
        narration:
          'Unlike nuclear rovers, stationary InSight cannot drive out of settling red dust. By 2022, thick rust blankets its arrays; electrical generation collapses below survival thresholds, and radio beacons fade into silence on December 21.',
        telemetryLabel: 'Dust Coat Thickening · Last Contact Dec 15, 2022',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'The Legacy',
        eraLabel: 'Present Day · Elysium Monument',
        startTime: 30,
        endTime: 40,
        narration:
          'Silent beneath Martian winds, InSight proved Mars remains seismically alive and mapped the deep internal architecture of another rocky planet for the first time in history.',
        telemetryLabel: '1,440 Sols Completed · Retired Dec 21, 2022',
      },
    ],
    cues: [
      { start: 0, end: 3.4, caption: 'Nov 26, 2018: InSight hits Mars’ upper atmosphere at 19,800 km/h behind its thermal heat shield.' },
      { start: 3.4, end: 6.5, caption: 'At Mach 1.7, the supersonic parachute deploys and slows the lander above Elysium Planitia.' },
      { start: 6.5, end: 10, caption: 'Twelve pulsed descent thrusters cushion a gentle three-legged landing on flat volcanic plains.' },
      { start: 10, end: 13.5, caption: 'Twin 6-meter circular UltraFlex solar wings unfold, delivering up to 4,588 Wh per Martian sol.' },
      { start: 13.5, end: 16.8, caption: 'The robotic arm lowers the French SEIS seismometer directly onto the Martian surface.' },
      { start: 16.8, end: 20, caption: 'SEIS records 1,319+ marsquakes, mapping crust thickness and confirming a liquid iron-nickel core.' },
      { start: 20, end: 23.5, caption: 'Over four Martian years, airborne iron-oxide dust settles steadily over both solar arrays.' },
      { start: 23.5, end: 27, caption: 'Power falls below 500 Wh/sol; science shuts down to keep survival heaters alive.' },
      { start: 27, end: 30, caption: 'Dec 15, 2022: Final transmission received. After two missed beacons, NASA retires InSight Dec 21.' },
      { start: 30, end: 35, caption: 'Pulling back from 4.502° N, 135.623° E: InSight stands silent on Elysium Planitia.' },
      { start: 35, end: 40, caption: 'Its seismic catalog remains humanity’s primary window into the deep interior of Mars.' },
    ],
  },

  'apollo-lm': {
    exhibitId: 'apollo-lm',
    title: 'Apollo Descent Stages: Anchored in Tranquility',
    subtitle: 'Six Apollo Landing Sites · Moon · 1969 – 1972',
    duration: 40,
    archetype: 'apollo-lm',
    powerMetricName: 'Stage Propellant',
    powerPeakLabel: '8,200 kg Descent Fuel',
    powerEndLabel: 'Pyrotechnically Severed',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Powered Descent',
        eraLabel: 'July 20, 1969 – Dec 1972',
        startTime: 0,
        endTime: 10,
        narration:
          'Descending over cratered lunar maria, the TR-201 engine throttles smoothly to bring the octagonal aluminum Descent Stage and four crushable footpads onto the Moon.',
        telemetryLabel: 'TR-201 Throttle Descent -> Lunar Contact',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Surface Base of Operations',
        eraLabel: 'Apollo 11, 12, 14, 15, 16, 17',
        startTime: 10,
        endTime: 20,
        narration:
          'Wrapped in gold Kapton thermal foil, the Descent Stage anchors crew life support, experiments, and lunar sample collection across six historic expeditions.',
        telemetryLabel: '6 Landed Stages · 382 kg Lunar Samples',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'Pyrotechnic Separation',
        eraLabel: 'Ascent Liftoff Sequence',
        startTime: 20,
        endTime: 30,
        narration:
          'When exploration ends, explosive bolts sever the upper cabin. Using the Descent Stage as a launchpad, the Ascent Stage blasts off for lunar orbit—leaving the lower stage behind forever.',
        telemetryLabel: 'Ascent Engine Ignition · Base Left Permanently',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Timeless Lunar Monuments',
        eraLabel: 'Present Day · Airless Vacuum',
        startTime: 30,
        endTime: 40,
        narration:
          'Protected by vacuum with no wind or rain, all six Descent Stages still stand upright today, photographed from orbit by NASA’s Lunar Reconnaissance Orbiter.',
        telemetryLabel: 'Intact Heritage Hardware (1969–Present)',
      },
    ],
    cues: [
      { start: 0, end: 5, caption: 'Powered descent begins as the TR-201 engine slows the Lunar Module toward basaltic mare plains.' },
      { start: 5, end: 10, caption: 'Lunar contact probes touch soil; four crushable aluminum-honeycomb legs absorb touchdown.' },
      { start: 10, end: 15, caption: 'Astronauts descend the forward ladder; gold Kapton foil shields propellant tanks from 120°C sunlight.' },
      { start: 15, end: 20, caption: 'Across Apollo 11–17, six Descent Stages serve as habitats, labs, and equipment bays.' },
      { start: 20, end: 25, caption: 'Departure checklist complete: pyrotechnic guillotines sever umbilicals between stages.' },
      { start: 25, end: 30, caption: 'The Ascent Stage ignites directly off the upper deck, blasting astronauts back toward Earth orbit.' },
      { start: 30, end: 35, caption: 'In airless lunar silence, the scorched octagonal Descent Stage stays planted on the regolith.' },
      { start: 35, end: 40, caption: 'LRO orbital photography confirms all six Descent Stages remain upright at their landing sites.' },
    ],
  },

  'apollo-lrv': {
    exhibitId: 'apollo-lrv',
    title: 'Lunar Roving Vehicles: Tracks Across Taurus-Littrow',
    subtitle: 'Apollo 15, 16, 17 · Hadley, Descartes, Taurus-Littrow',
    duration: 40,
    archetype: 'rover-moon',
    powerMetricName: 'Silver-Zinc Batteries',
    powerPeakLabel: '36V Dual 121 Ah',
    powerEndLabel: 'Depleted / Parked',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Unfolding from Quadrant 1',
        eraLabel: '1971 – 1972 · EVA-1',
        startTime: 0,
        endTime: 10,
        narration:
          'Stowed folded inside the Lunar Module’s Quadrant 1 bay, the 210-kilogram electric buggy lowers onto the Moon and locks its four wire-mesh wheels into place.',
        telemetryLabel: 'Mass 210 kg · Payload Capacity 490 kg',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Kilometer-Scale Geology',
        eraLabel: 'Apollo 15 (27.9 km) · 16 (26.7 km) · 17 (35.74 km)',
        startTime: 10,
        endTime: 20,
        narration:
          'Driven by four independent 190-watt hub motors, each rover expands astronaut reach from meters to tens of kilometers across rilles, volcanic vents, and mountain massifs.',
        telemetryLabel: 'Max Traverse 35.74 km (Apollo 17 LRV-3)',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'The Final Liftoff Broadcast',
        eraLabel: 'Mission Departure',
        startTime: 20,
        endTime: 30,
        narration:
          'Before departure, astronauts park the LRV roughly 90 to 140 meters clear of the lander so Earth controllers can remotely tilt its TV camera and film the Ascent Stage liftoff.',
        telemetryLabel: 'Parked 90–140 m Clear · Remote Liftoff Pan',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Three Parked Electric Buggies',
        eraLabel: 'Present Day · Moon',
        startTime: 30,
        endTime: 40,
        narration:
          'Its silver-zinc batteries long exhausted, LRV-1, LRV-2, and LRV-3 still sit with wheels turned beside sharp tire tracks preserved for millions of years.',
        telemetryLabel: '3 Rovers Parked at Hadley, Descartes & Taurus-Littrow',
      },
    ],
    cues: [
      { start: 0, end: 5, caption: 'Apollo 15, 16, and 17 each carry a 210 kg electric rover folded inside LM Quadrant 1.' },
      { start: 5, end: 10, caption: 'Pulling release lanyards unfolds the titanium-zinc mesh wheels onto lunar dust.' },
      { start: 10, end: 15, caption: 'Four 190 W hub motors carry two astronauts across craters at up to 18 km/h.' },
      { start: 15, end: 20, caption: 'Apollo 17’s LRV-3 covers a record 35.74 km through Taurus-Littrow Valley.' },
      { start: 20, end: 25, caption: 'EVA complete: the buggy is parked 90–140 m away, umbrella high-gain dish aimed at Earth.' },
      { start: 25, end: 30, caption: 'Houston commands the rover’s TV camera to pan upward, capturing the Ascent Stage liftoff live.' },
      { start: 30, end: 40, caption: 'Without wind or rain, all three LRVs and their winding tire tracks remain undisturbed on the Moon.' },
    ],
  },

  'apollo-alsep': {
    exhibitId: 'apollo-alsep',
    title: 'ALSEP & Retroreflectors: Still Answering Earth',
    subtitle: 'Apollo 11–17 Lunar Network · 1969 – Present',
    duration: 40,
    archetype: 'alsep',
    powerMetricName: 'SNAP-27 RTG & LRRR',
    powerPeakLabel: '~70 W Active Radio',
    powerEndLabel: '0 W Passive Mirrors Active',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Deploying the Science Network',
        eraLabel: '1969 – 1972 · Nuclear Station Setup',
        startTime: 0,
        endTime: 10,
        narration:
          'Astronauts carry Plutonium-238 fuel casks and central telemetry stations hundreds of meters away from each lander, wiring seismometers and magnetometers across the Moon’s nearside.',
        telemetryLabel: '5 Full ALSEP Stations + Apollo 11 EASEP',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Listening to Moonquakes',
        eraLabel: '1969 – September 1977',
        startTime: 10,
        endTime: 20,
        narration:
          'Operating continuously through scorching lunar days and 14-day freezing nights on 70 watts of RTG power, the network records thousands of deep moonquakes and meteoroid impacts.',
        telemetryLabel: '2,200+ Days Continuous Network Operation',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'Radio Shutdown, Optical Survival',
        eraLabel: 'September 30, 1977',
        startTime: 20,
        endTime: 30,
        narration:
          'On September 30, 1977, NASA switches off active ALSEP radio telemetry due to budget constraints. Yet the passive glass retroreflector arrays require zero electricity—and never went dark.',
        telemetryLabel: 'Radio Off Sept 1977 · LRRR Laser Return Active',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: '3.8 Centimeters Per Year',
        eraLabel: '1969 – Present Day',
        startTime: 30,
        endTime: 40,
        narration:
          'Every week for over half a century, Earth observatories bounce laser pulses off Apollo 11, 14, and 15 fused-silica prisms—proving the Moon recedes 3.8 centimeters every year.',
        telemetryLabel: 'Longest-Running NASA Science Hardware',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: 'Apollo astronauts deploy SNAP-27 RTG power casks, central antennas, and seismometers clear of landing blast.' },
      { start: 10, end: 20, caption: 'Five full ALSEP stations run simultaneously for years, revealing the Moon’s crust and tidal moonquakes.' },
      { start: 20, end: 26, caption: 'Sept 30, 1977: NASA transmits shutdown commands to end active ALSEP radio monitoring.' },
      { start: 26, end: 32, caption: 'Beside the quiet electronics, zero-power corner-cube glass arrays remain aimed precisely at Earth.' },
      { start: 32, end: 40, caption: 'Today, green Earth observatory lasers still strike Apollo prisms, tracking a 3.8 cm/year lunar drift.' },
    ],
  },

  'surveyor-program': {
    exhibitId: 'surveyor-program',
    title: 'Surveyor 1–7: Proving the Moon Would Hold',
    subtitle: 'Surveyor 1, 3, 5, 6, 7 · 1966 – 1968 & Apollo 12',
    duration: 40,
    archetype: 'surveyor',
    powerMetricName: 'Solar Mast Array',
    powerPeakLabel: '~85 W Peak Solar',
    powerEndLabel: 'Retired / Sampled by Apollo 12',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Radar Soft Landing',
        eraLabel: 'May 1966 – Jan 1968',
        startTime: 0,
        endTime: 10,
        narration:
          'Before humans could land, engineers feared deep lunar dust might swallow a spacecraft. Surveyor’s closed-loop Doppler radar guides three-legged robotic landers gently onto solid ground.',
        telemetryLabel: '5 Successful Landings (Surveyor 2 & 4 Lost)',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Digging Soil & First Lunar Hop',
        eraLabel: '1967 Surface Breakthroughs',
        startTime: 10,
        endTime: 20,
        narration:
          'Surveyor 3 trenches lunar regolith with a mechanical scoop, while Surveyor 6 fires its vernier engines in Sinus Medii—executing humanity’s first powered hop across another world.',
        telemetryLabel: 'Surveyor 6: 4 m Powered Surface Hop',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: '31 Months Later: The Apollo 12 Reunion',
        eraLabel: 'November 20, 1969',
        startTime: 20,
        endTime: 30,
        narration:
          'After freezing into silence in 1967, Surveyor 3 receives unexpected visitors: Apollo 12 astronauts Pete Conrad and Alan Bean walk 180 meters down a crater slope and unbolt its camera for return to Earth.',
        telemetryLabel: 'Apollo 12 Landed 180 m Away · Camera Returned',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Five Pioneers Across the Nearside',
        eraLabel: 'Present Day · Moon',
        startTime: 30,
        endTime: 40,
        narration:
          'Five Surveyor landers still anchor their landing sites across Oceanus Procellarum, Mare Tranquillitatis, Sinus Medii, and Tycho ejecta—having cleared the path for Apollo.',
        telemetryLabel: 'Verified Lunar Soil Bearing Strength for Apollo',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: 'June 2, 1966: Surveyor 1 executes America’s first soft lunar landing, proving regolith supports spacecraft.' },
      { start: 10, end: 20, caption: 'Surveyor 3 trenches soil; Surveyor 6 fires thrusters for a historic 4-meter hop on the Moon.' },
      { start: 20, end: 30, caption: 'Nov 1969: Apollo 12’s Intrepid touches down 180 m from Surveyor 3; astronauts retrieve its camera and scoop.' },
      { start: 30, end: 40, caption: 'Surveyor 3’s camera now rests in the Smithsonian, while five tripod frames stay permanently on the Moon.' },
    ],
  },

  'lunokhod-rovers': {
    exhibitId: 'lunokhod-rovers',
    title: 'Lunokhod 1 & 2: Eight Wheels in the Dust',
    subtitle: 'Mare Imbrium (1970) & Le Monnier Crater (1973)',
    duration: 40,
    archetype: 'lunokhod',
    powerMetricName: 'Solar Lid & Po-210 Thermal',
    powerPeakLabel: '8-Wheel Remote Traverse',
    powerEndLabel: 'Overheated / LRRR Active',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Rolling Off Luna Ramps',
        eraLabel: 'Nov 1970 & Jan 1973',
        startTime: 0,
        endTime: 10,
        narration:
          'Descending twin fold-out ramps from Soviet Luna 17 and Luna 21 landers, the pressurized eight-wheeled Lunokhod rovers become the first tele-operated explorers on another world.',
        telemetryLabel: '5-Person Earth Crew Real-Time Driving',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: '10.5 km & 39 km of Lunar Exploration',
        eraLabel: '1970 – May 1973',
        startTime: 10,
        endTime: 20,
        narration:
          'Flipping open their clam-shell solar lids by day and closing them over Polonium-210 heaters at night, Lunokhod 1 drives 10.5 km and Lunokhod 2 covers 39 km across Le Monnier Crater.',
        telemetryLabel: 'Lunokhod 2 Distance: ~39 km',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'The Fatal Dust Scoop',
        eraLabel: 'May 1973 · Crater Wall Incident',
        startTime: 20,
        endTime: 30,
        narration:
          'Backing inside a crater wall in May 1973, Lunokhod 2’s open solar lid scrapes loose lunar regolith. Closing the lid for lunar night dumps insulating dust onto its radiator, fatally overheating the rover.',
        telemetryLabel: 'Radiator Blanketed -> Fatal Overheating',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Rediscovered After 37 Years',
        eraLabel: '2010 LRO Pinpoint · Laser Ranging',
        startTime: 30,
        endTime: 40,
        narration:
          'Decades later, NASA’s Lunar Reconnaissance Orbiter spotted Lunokhod 1 and its tracks in Mare Imbrium—enabling Earth lasers to bounce off its French prism mirror once again.',
        telemetryLabel: 'Lunokhod 1 Laser Mirror Still Responding',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: 'Nov 1970 & Jan 1973: Eight-wheeled Lunokhod rovers roll off Luna descent ramps onto lunar plains.' },
      { start: 10, end: 20, caption: 'With clam-shell solar lids open, Lunokhod 1 drives 10.5 km and Lunokhod 2 explores 39 km of crater terrain.' },
      { start: 20, end: 30, caption: 'May 1973: Lunokhod 2’s open lid scoops crater soil onto its radiator; closing it traps fatal heat.' },
      { start: 30, end: 40, caption: 'In 2010, NASA LRO imaging re-acquired Lunokhod 1, restoring laser bounces off its French reflector.' },
    ],
  },

  'pathfinder-sojourner': {
    exhibitId: 'pathfinder-sojourner',
    title: 'Pathfinder & Sojourner: First Wheels on Mars',
    subtitle: 'Ares Vallis, Mars · July 4 – Sept 27, 1997',
    duration: 40,
    archetype: 'pathfinder',
    powerMetricName: 'Solar Petals & Rover Panel',
    powerPeakLabel: '3-Petal Station + 10.6 kg Rover',
    powerEndLabel: 'Thermal Battery Loss (Sol 83)',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Airbag Cushion Bounce',
        eraLabel: 'July 4, 1997 · Ares Vallis',
        startTime: 0,
        endTime: 10,
        narration:
          'Wrapped in massive tetrahedral airbags, Mars Pathfinder strikes Ares Vallis at high speed and bounces more than fifteen times across the ancient flood plain before rolling to a stop.',
        telemetryLabel: 'Airbag Entry -> Ares Vallis Touchdown',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Petals Unfold, Sojourner Rolls Out',
        eraLabel: 'July 5 – Sept 1997 · Sols 1–83',
        startTime: 10,
        endTime: 20,
        narration:
          'Three triangular solar petals unfold to right the Carl Sagan Memorial Station. Microrover Sojourner—just 10.6 kilograms—rolls down the ramp and presses its X-ray spectrometer against Martian rocks.',
        telemetryLabel: '12x Design Life · 16,500+ Lander Images',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'Freezing Nights End the Radio Link',
        eraLabel: 'September 27, 1997 · Sol 83',
        startTime: 20,
        endTime: 30,
        narration:
          'Engineered for just seven days, the pair operates for 83 sols before battery degradation in -100°C Martian nights ends the lander’s transmitter—leaving Sojourner autonomously circling in silence.',
        telemetryLabel: 'Last Contact Sept 27, 1997 (Sol 83)',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Pioneer of Every Mars Rover Since',
        eraLabel: 'Present Day · Ares Vallis',
        startTime: 30,
        endTime: 40,
        narration:
          'Proving low-cost airbags and mobile six-wheel rocker-bogie suspension on Mars, Pathfinder and tiny Sojourner opened the road for Spirit, Opportunity, Curiosity, and Perseverance.',
        telemetryLabel: 'Carl Sagan Memorial Station & Sojourner Resting Site',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: 'July 4, 1997: Encased in inflated airbags, Pathfinder bounces across flood-carved Ares Vallis.' },
      { start: 10, end: 20, caption: 'Three solar petals open; 10.6 kg Sojourner descends the ramp to analyze rocks like Barnacle Bill and Yogi.' },
      { start: 20, end: 30, caption: 'Outlasting its 7-day plan by 12x, battery wear in freezing nights cuts off radio contact Sept 27.' },
      { start: 30, end: 40, caption: 'Sojourner proved rocker-bogie mobility on Mars, inspiring every NASA rover that followed.' },
    ],
  },

  'spirit-rover': {
    exhibitId: 'spirit-rover',
    title: 'Spirit (MER-A): Trapped at Troy',
    subtitle: 'Gusev Crater, Mars · 2004 – 2010',
    duration: 40,
    archetype: 'mer-rover',
    powerMetricName: 'Triple Solar Deck',
    powerPeakLabel: '~900 Wh/sol Peak',
    powerEndLabel: 'Sand-Trapped Winter Tilt Loss',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Gusev Crater Landing',
        eraLabel: 'January 4, 2004',
        startTime: 0,
        endTime: 10,
        narration:
          'Airbags settle inside 166-kilometer-wide Gusev Crater. Spirit unfolds its solar wings, stands onto six rocker-bogie wheels, and begins what was planned as a 90-day mission.',
        telemetryLabel: '90-Sol Goal -> 2,208 Sols Operated',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Climbing Columbia Hills & Silica',
        eraLabel: '2004 – 2008 · 7.73 km Traverse',
        startTime: 10,
        endTime: 20,
        narration:
          'Climbing 100 meters up Husband Hill even after a right-front wheel locks up, Spirit’s dragging wheel scrapes open bright white soil—uncovering 90% pure silica forged by ancient hot springs.',
        telemetryLabel: '7.73 km Driven · Ancient Hydrothermal Silica',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'Sand Trap at "Troy" & Martian Winter',
        eraLabel: 'May 2009 – March 22, 2010',
        startTime: 20,
        endTime: 30,
        narration:
          'In May 2009 at "Troy," Spirit breaks through brittle desert crust into loose iron-sulfate sand. Unable to tilt its dusty arrays toward the low northern winter Sun, power drops silent March 22, 2010.',
        telemetryLabel: 'Wheel Entrapment -> Last Signal Mar 22, 2010',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Still Anchored on the Ridge of Home Plate',
        eraLabel: 'Present Day · Columbia Hills',
        startTime: 30,
        endTime: 40,
        narration:
          'Even stationary, Spirit turned its winter prison into a weather observatory and left behind ironclad geological proof that liquid water once warmed Gusev Crater.',
        telemetryLabel: 'Declared Stationary Lab Jan 2010 · Retired May 2011',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: 'Jan 4, 2004: Spirit rolls off its landing platform inside Gusev Crater.' },
      { start: 10, end: 20, caption: 'Over 7.73 km, Spirit scales Husband Hill and exposes hydrothermal hot-spring silica deposits.' },
      { start: 20, end: 30, caption: 'May 2009: Wheels sink into soft sulfate sand at Troy; winter sun starvation silences Spirit Mar 2010.' },
      { start: 30, end: 40, caption: 'Stationed beside Home Plate plateau, Spirit transformed a 90-sol sprint into six years of Mars science.' },
    ],
  },

  'opportunity-rover': {
    exhibitId: 'opportunity-rover',
    title: 'Opportunity (MER-B): Outlasting the Storm',
    subtitle: 'Meridiani Planum, Mars · 2004 – 2019',
    duration: 40,
    archetype: 'mer-rover',
    powerMetricName: 'Dust-Darkened Array',
    powerPeakLabel: '~900 Wh/sol Peak',
    powerEndLabel: '0 W (2018 Global Dust Storm)',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Hole-in-One at Eagle Crater',
        eraLabel: 'January 25, 2004',
        startTime: 0,
        endTime: 10,
        narration:
          'Opportunity bounces right into the tiny bowl of Eagle Crater—the first spacecraft to land beside exposed Martian bedrock. Blue-gray hematite spheres immediately point to ancient standing water.',
        telemetryLabel: 'Meridiani Planum · 1.95° S, 354.47° E',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: '45.16 km Across Four Craters',
        eraLabel: '2004 – May 2018 · 5,111 Sols',
        startTime: 10,
        endTime: 20,
        narration:
          'Cleared periodically by Martian wind gusts, Opportunity turns a 90-day mission into a 14-year, 45.16-kilometer off-world marathon—exploring Eagle, Endurance, Victoria, and Endeavour craters.',
        telemetryLabel: '45.16 km Record · 217,000+ Raw Images',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'The 2018 Planet-Encircling Dust Storm',
        eraLabel: 'June 10, 2018 – Feb 13, 2019',
        startTime: 20,
        endTime: 30,
        narration:
          'In June 2018, a colossal dust storm swallows Mars, plunging noon sky in Perseverance Valley into pitch darkness. Starved of sunlight, Opportunity’s batteries drain permanently.',
        telemetryLabel: 'Last Transmission June 10, 2018 (Sol 5111)',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Silent on Perseverance Valley',
        eraLabel: 'Present Day · Endeavour Crater Rim',
        startTime: 30,
        endTime: 40,
        narration:
          'After beaming over 1,000 recovery commands across eight quiet months, NASA declares Opportunity’s mission complete in February 2019—leaving a 45-kilometer trail across Mars.',
        telemetryLabel: '14.5 Earth Years · Retired Feb 13, 2019',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: 'Jan 25, 2004: Opportunity lands inside Eagle Crater right beside water-altered bedrock.' },
      { start: 10, end: 20, caption: 'For 5,111 sols, the rover traverses 45.16 km across Meridiani Planum to Endeavour Crater.' },
      { start: 20, end: 30, caption: 'June 2018: A global dust storm blacks out sunlight; final telemetry arrives June 10, 2018.' },
      { start: 30, end: 40, caption: 'After 1,000+ unanswered pings, NASA bids farewell Feb 13, 2019 inside Perseverance Valley.' },
    ],
  },

  'viking-landers': {
    exhibitId: 'viking-landers',
    title: 'Viking 1 & 2: First Color From Mars',
    subtitle: 'Chryse Planitia & Utopia Planitia · 1976 – 1982',
    duration: 40,
    archetype: 'viking',
    powerMetricName: 'Dual SNAP-19 RTGs',
    powerPeakLabel: '70 W Nuclear Power',
    powerEndLabel: 'Antenna Overwrite / Battery Loss',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'First Soft Landings on Mars',
        eraLabel: 'July 20 & Sept 3, 1976',
        startTime: 0,
        endTime: 10,
        narration:
          'Decoupling from orbiters over Chryse and Utopia Planitia, Viking 1 and 2 descend on parachutes and retro-thrusters—beaming back humanity’s first crisp color photographs from the Martian surface.',
        telemetryLabel: 'First Successful Long-Term Mars Landers',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Six Years of Nuclear Weather Watch',
        eraLabel: '1976 – 1982 · Mutch Memorial Station',
        startTime: 10,
        endTime: 20,
        narration:
          'Powered by twin Plutonium-238 RTGs immune to dust storms, the landers scoop Martian soil for biology laboratories and monitor atmospheric pressure through six Earth years.',
        telemetryLabel: 'Viking 1: 2,245 Sols · 4,500+ Surface Photos',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'One Command Slews the Dish Off Earth',
        eraLabel: 'April 1980 (V2) & Nov 13, 1982 (V1)',
        startTime: 20,
        endTime: 30,
        narration:
          'Viking 2 falls silent in April 1980 from battery failure. Two years later, a ground software update accidentally overwrites Viking 1’s antenna pointing table—swinging its dish away from Earth.',
        telemetryLabel: 'Signal Lost Nov 13, 1982 (Pointing Error)',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Thomas A. Mutch Memorial Station',
        eraLabel: 'Present Day · Chryse & Utopia',
        startTime: 30,
        endTime: 40,
        narration:
          'Both white-shelled landers sit intact on northern Martian plains, having held the Mars surface longevity record for nearly three decades.',
        telemetryLabel: 'Foundation of Modern Mars Surface Science',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: 'July 20 & Sept 3, 1976: Viking 1 and 2 make humanity’s first long-lived landings on Mars.' },
      { start: 10, end: 20, caption: 'Dual SNAP-19 RTGs keep Viking 1 transmitting weather and soil data across six Martian years.' },
      { start: 20, end: 30, caption: 'Nov 13, 1982: An erroneous ground command rotates Viking 1’s high-gain antenna off Earth lock.' },
      { start: 30, end: 40, caption: 'Named Thomas A. Mutch Memorial Station, Viking 1 sits silent on Chryse Planitia.' },
    ],
  },

  'phoenix-lander': {
    exhibitId: 'phoenix-lander',
    title: 'Phoenix: Frozen in the Martian Arctic',
    subtitle: 'Vastitas Borealis · 68.15° N · May – Nov 2008',
    duration: 40,
    archetype: 'phoenix',
    powerMetricName: 'Decagonal Arctic Solar',
    powerPeakLabel: 'Polar Midnight Sun',
    powerEndLabel: 'Polar Night + Dry Ice Crush',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Landing at 68° North',
        eraLabel: 'May 25, 2008 · Vastitas Borealis',
        startTime: 0,
        endTime: 10,
        narration:
          'Guiding down onto Mars’ flat northern arctic plains beneath never-setting summer sunlight, Phoenix lands cleanly and unfolds twin decagonal solar wings.',
        telemetryLabel: 'Site: 68.15° N, 234.25° E (Arctic Plains)',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Touchdown of Water Ice',
        eraLabel: 'June – Aug 2008 · 18 cm Trench',
        startTime: 10,
        endTime: 20,
        narration:
          'Extending its 2.35-meter robotic backhoe arm, Phoenix scrapes just centimeters below dry red soil—exposing bright white water-ice permafrost that vanishes into vapor over four sols.',
        telemetryLabel: 'Water Ice Verified + Perchlorates & Snowfall',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'Arctic Night & Carbon-Dioxide Crush',
        eraLabel: 'November 2, 2008 · Polar Winter',
        startTime: 20,
        endTime: 30,
        narration:
          'As northern winter arrives, sunlight disappears beneath the horizon. Final contact ends November 2; soon hundreds of kilograms of frozen CO2 dry ice buckle Phoenix’s solar panels.',
        telemetryLabel: 'MRO Images Later Confirmed Panel Buckling',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Proof of Accessible Arctic Water',
        eraLabel: 'Present Day · Vastitas Borealis',
        startTime: 30,
        endTime: 40,
        narration:
          'Designed strictly for one summer, Phoenix rests beneath seasonal dry-ice cycles after directly tasting Martian water ice for future human and robotic explorers.',
        telemetryLabel: '157 Martian Sols · Direct Ice Confirmation',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: 'May 25, 2008: Phoenix lands in Mars’ northern arctic plains and unfolds twin decagonal wings.' },
      { start: 10, end: 20, caption: 'Its robotic arm excavates 18 cm into permafrost, confirming subsurface water ice and soil perchlorates.' },
      { start: 20, end: 30, caption: 'Nov 2, 2008: Polar night cuts solar power; heavy winter CO2 frost later crushes its solar wings.' },
      { start: 30, end: 40, caption: 'Orbital imagery from Mars Reconnaissance Orbiter confirms Phoenix’s icy resting state.' },
    ],
  },

  'ingenuity-helicopter': {
    exhibitId: 'ingenuity-helicopter',
    title: 'Ingenuity: 72 Flights Above Mars',
    subtitle: 'Jezero Crater, Mars · 2021 – Jan 2024',
    duration: 40,
    archetype: 'ingenuity',
    powerMetricName: 'Rotor RPM & Battery',
    powerPeakLabel: '2,537 RPM · 72 Flights',
    powerEndLabel: 'Rotor Tip Fractured (Flight 72)',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Wright Brothers Field',
        eraLabel: 'April 4 – 19, 2021',
        startTime: 0,
        endTime: 10,
        narration:
          'Dropping from the belly of Perseverance onto Jezero Crater, 1.8-kilogram Ingenuity unfolds four spindly carbon legs and spins 1.2-meter blades at over 2,400 RPM—achieving the first powered flight on another planet.',
        telemetryLabel: 'Atmospheric Density < 1% of Earth',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Outlasting 5 Flights to Fly 72',
        eraLabel: '2021 – Jan 2024 · 17.24 km Flown',
        startTime: 10,
        endTime: 20,
        narration:
          'Built as a 30-day tech demo for five flights, Ingenuity becomes Perseverance’s aerial scout—logging 72 flights, 128.8 minutes aloft, and 17.24 kilometers across Jezero’s delta.',
        telemetryLabel: '72 Flights · 17.24 km · Max Alt 24 m',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'Featureless Sand & Flight 72 Impact',
        eraLabel: 'January 18 – 25, 2024 · Valinor Hills',
        startTime: 20,
        endTime: 30,
        narration:
          'Ascending over smooth, featureless sand ripples during Flight 72, Ingenuity’s downward navigation camera loses terrain landmarks. Uncommanded horizontal drift triggers a hard landing that fractures a blade tip.',
        telemetryLabel: 'Navigation Drift -> Rotor Damage (Jan 18, 2024)',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Valinor Hills Airfield Monument',
        eraLabel: 'Present Day · Jezero Crater',
        startTime: 30,
        endTime: 40,
        narration:
          'Upright and still communicating briefly as a weather outpost until Perseverance drove out of range, Ingenuity proved aerial exploration works across the Solar System.',
        telemetryLabel: 'Carries Fabric From 1903 Wright Flyer',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: 'April 19, 2021: Blades spin at ~2,537 RPM, lifting Ingenuity into Jezero Crater’s 1% air.' },
      { start: 10, end: 20, caption: 'Over nearly three years, Ingenuity completes 72 flights covering 17.24 km ahead of Perseverance.' },
      { start: 20, end: 30, caption: 'Jan 18, 2024 (Flight 72): Smooth sand ripples confuse optical navigation; hard touchdown fractures a carbon blade.' },
      { start: 30, end: 40, caption: 'Anchored upright at Valinor Hills, Ingenuity proved extraterrestrial aviation for future rotorcraft.' },
    ],
  },

  'dawn-spacecraft': {
    exhibitId: 'dawn-spacecraft',
    title: 'Dawn: Ion Voyage to Two Lost Worlds',
    subtitle: '4 Vesta & Dwarf Planet 1 Ceres · 2007 – 2018',
    duration: 40,
    archetype: 'dawn',
    powerMetricName: 'Hydrazine Attitude Fuel',
    powerPeakLabel: 'Xenon Ion Cruise (3x NSTAR)',
    powerEndLabel: '0 kg Hydrazine (Nov 1, 2018)',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Blue Ion Spiral Outward',
        eraLabel: '2007 – 2012 · Protoplanet 4 Vesta',
        startTime: 0,
        endTime: 10,
        narration:
          'Propelled by three glowing blue xenon ion thrusters fed by sprawling 20-meter solar wings, Dawn spirals into the main asteroid belt to become the first spacecraft ever to orbit two extraterrestrial bodies.',
        telemetryLabel: 'Delta-V 11.4 km/s via Ion Propulsion',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Departing Vesta for Dwarf Planet Ceres',
        eraLabel: '2015 – 2018 · Occator Crater',
        startTime: 10,
        endTime: 20,
        narration:
          'Breaking orbit from giant asteroid 4 Vesta, Dawn cruises onward to dwarf planet 1 Ceres—uncovering bright carbonate salt domes inside Occator Crater and cryo-volcanic Ahuna Mons.',
        telemetryLabel: 'Orbits Around 4 Vesta & 1 Ceres Verified',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'Hydrazine Exhaustion',
        eraLabel: 'October 31 – November 1, 2018',
        startTime: 20,
        endTime: 30,
        narration:
          'After eleven years, Dawn exhausts the last drops of hydrazine used to point its solar arrays at the Sun and its antenna toward Earth. It misses scheduled Deep Space Network check-ins November 1.',
        telemetryLabel: 'Attitude Propellant Depleted (Nov 1, 2018)',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Fifty-Year Ceres Quarantine Orbit',
        eraLabel: 'Present Day · 1 Ceres Orbit',
        startTime: 30,
        endTime: 40,
        narration:
          'Engineered deliberately into a high, stable orbit before fuel ran dry, Dawn will circle Ceres silently for more than fifty years to protect potential icy subsurface habitats from contamination.',
        telemetryLabel: '>50-Year Planetary Protection Orbit',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: '2007–2012: Gentle blue xenon ion thrusters spiral Dawn into orbit around protoplanet 4 Vesta.' },
      { start: 10, end: 20, caption: 'In 2015, Dawn breaks Vesta orbit and reaches dwarf planet 1 Ceres, mapping bright salt deposits.' },
      { start: 20, end: 30, caption: 'Nov 1, 2018: Hydrazine attitude propellant runs dry; Dawn loses Sun and Earth pointing.' },
      { start: 30, end: 40, caption: 'Dawn glides permanently in a 50+ year quarantine orbit above Ceres.' },
    ],
  },

  'near-shoemaker': {
    exhibitId: 'near-shoemaker',
    title: 'NEAR Shoemaker: Improvised Landing on 433 Eros',
    subtitle: 'Near-Earth Asteroid 433 Eros · 2000 – 2001',
    duration: 40,
    archetype: 'near',
    powerMetricName: 'Solar + Surface Beacon',
    powerPeakLabel: 'Orbiter -> Surface Station',
    powerEndLabel: 'Hibernation (Feb 28, 2001)',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Rendezvous with a Peanut Asteroid',
        eraLabel: 'February 14, 2000',
        startTime: 0,
        endTime: 10,
        narration:
          'Entering orbit around peanut-shaped asteroid 433 Eros, NEAR Shoemaker becomes the first human spacecraft to orbit a small near-Earth asteroid—mapping its scarred regolith for a full year.',
        telemetryLabel: 'Target: 433 Eros (34 km x 11 km)',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'A Bold Final Decision: Land Anyway',
        eraLabel: 'February 12, 2001 · 5-Burn Descent',
        startTime: 10,
        endTime: 20,
        narration:
          'Built with zero landing legs and never intended to touch ground, engineers improvise five gentle braking burns—guiding the spacecraft down at walking pace of 1.9 meters per second.',
        telemetryLabel: 'Touchdown Speed ~1.5–1.8 m/s (Zero Landing Gear)',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'Sixteen Bonus Days on Asteroid Soil',
        eraLabel: 'Feb 12 – Feb 28, 2001',
        startTime: 20,
        endTime: 30,
        narration:
          'Cushioning softly onto its four solar panel tips near Himeros crater, NEAR survives intact and beams back 16 unprecedented days of surface gamma-ray spectra before extreme cold triggers shutdown.',
        telemetryLabel: 'Last Contact Feb 28, 2001 (No Response Dec 2002)',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'First Monument on an Asteroid',
        eraLabel: 'Present Day · 433 Eros',
        startTime: 30,
        endTime: 40,
        narration:
          'Resting motionless on solar wingtips while Eros tumbles through solar orbit, NEAR Shoemaker proved humanity could rendezvous with and touch down on small primitive worlds.',
        telemetryLabel: 'First Asteroid Orbit & Surface Contact',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: 'Feb 2000: NEAR Shoemaker becomes the first spacecraft to orbit a near-Earth asteroid, 433 Eros.' },
      { start: 10, end: 20, caption: 'Feb 12, 2001: With orbital goals met, engineers execute an improvised 5-burn controlled descent.' },
      { start: 20, end: 30, caption: 'Cushioning at ~1.8 m/s on solar tips, NEAR beams surface spectra for 16 days until Feb 28, 2001.' },
      { start: 30, end: 40, caption: 'Silent on Eros’s regolith, NEAR pioneered the science later expanded by OSIRIS-REx and DART.' },
    ],
  },

  'kepler-telescope': {
    exhibitId: 'kepler-telescope',
    title: 'Kepler: Counting Worlds Beyond Our Sun',
    subtitle: 'Earth-Trailing Heliocentric Orbit · 2009 – 2018',
    duration: 40,
    archetype: 'kepler',
    powerMetricName: 'Hydrazine & Reaction Wheels',
    powerPeakLabel: '0.95 m Photometer Survey',
    powerEndLabel: 'Fuel Dry · "Goodnight" Oct 2018',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'Staring Into Cygnus',
        eraLabel: 'March 2009 – 2013',
        startTime: 0,
        endTime: 10,
        narration:
          'Trailing Earth around the Sun far clear of planetary glare, Kepler locks its 0.95-meter photometer onto 150,000 stars in Cygnus—watching for minuscule dips as exoplanets cross their suns.',
        telemetryLabel: '150,000+ Target Stars Monitored',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'K2: Balancing on Sunlight Alone',
        eraLabel: '2014 – 2018 · Extended Survey',
        startTime: 10,
        endTime: 20,
        narration:
          'When two reaction wheels fail in 2013, engineers refuse to quit—aiming Kepler along the ecliptic plane and using gentle solar photon pressure like a cosmic keel to steady the telescope for four more years.',
        telemetryLabel: '2,600+ Confirmed Exoplanets Discovered',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'Sending the Final "Goodnight"',
        eraLabel: 'October 30 – November 15, 2018',
        startTime: 20,
        endTime: 30,
        narration:
          'In October 2018, the final hydrazine fuel needed for pointing depletes. Engineers send permanent transmitter shut-off commands on November 15—the anniversary of astronomer Johannes Kepler’s passing.',
        telemetryLabel: 'Retired Oct 30, 2018 · Safe Heliocentric Drift',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'More Planets Than Stars',
        eraLabel: 'Present Day · Solar Orbit',
        startTime: 30,
        endTime: 40,
        narration:
          'Drifting quietly in a safe solar orbit, Kepler forever transformed humanity’s view of the cosmos by proving planets outnumber stars across the Milky Way.',
        telemetryLabel: '2,662+ Exoplanets · Quiet Solar Orbit',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: '2009: Kepler monitors 150,000 stars in Cygnus, spotting minuscule starlight dips from transiting worlds.' },
      { start: 10, end: 20, caption: 'After wheel failures, engineers balance Kepler on sunlight pressure for the four-year K2 extension.' },
      { start: 20, end: 30, caption: 'Oct–Nov 2018: Hydrazine fuel runs out; NASA beams permanent transmitter "goodnight" commands.' },
      { start: 30, end: 40, caption: 'Kepler proved Earth-sized worlds are common, uncovering over 2,600 exoplanets before drifting dark.' },
    ],
  },

  'pioneer-probes': {
    exhibitId: 'pioneer-probes',
    title: 'Pioneer 10 & 11: Silent Ambassadors Beyond 82 AU',
    subtitle: 'Outer Solar System & Interstellar Escape · 1972 – 2003',
    duration: 40,
    archetype: 'pioneer',
    powerMetricName: 'SNAP-19 RTGs',
    powerPeakLabel: '155 W Launch Output',
    powerEndLabel: '< Threshold at 82 AU (2003)',
    scenes: [
      {
        id: 'arrival',
        number: 'Scene 01',
        title: 'First Through the Asteroid Belt',
        eraLabel: '1972 – 1979 · Jupiter & Saturn',
        startTime: 0,
        endTime: 10,
        narration:
          'Launched in 1972 and 1973, Pioneer 10 and 11 prove spacecraft can cross the asteroid belt safely and survive Jupiter’s lethal radiation belts—slingshotting faster than any probe before them.',
        telemetryLabel: 'Pioneer 10 (Jupiter 1973) · 11 (Saturn 1979)',
      },
      {
        id: 'mission',
        number: 'Scene 02',
        title: 'Carrying Humanity’s Gold Plaques',
        eraLabel: '1980s – 1995 · Outer Heliosphere',
        startTime: 10,
        endTime: 20,
        narration:
          'Spin-stabilized behind 2.74-meter dishes, both probes explore solar wind out toward Neptune’s orbit while carrying gold-anodized plaques depicting Earth’s pulsar coordinates and human figures.',
        telemetryLabel: 'First Hardware on Solar System Escape Vectors',
      },
      {
        id: 'fading-power',
        number: 'Scene 03',
        title: 'Fading Whispers Across Billions of Miles',
        eraLabel: '1995 (P11) & Jan 23, 2003 (P10)',
        startTime: 20,
        endTime: 30,
        narration:
          'Decaying Plutonium-238 RTGs dim their radio power until Pioneer 11 falls silent in 1995 and Pioneer 10 transmits its final faint carrier signal from 82.19 AU—12.2 billion kilometers away.',
        telemetryLabel: 'Final Carrier Wave Jan 23, 2003 (82.19 AU)',
      },
      {
        id: 'legacy',
        number: 'Scene 04',
        title: 'Drifting Toward Taurus and Aquila',
        eraLabel: 'Indefinite Interstellar Coast',
        startTime: 30,
        endTime: 40,
        narration:
          'Unpowered and silent now past 115–135 AU, both Pioneer probes glide indefinitely through interstellar space—humanity’s earliest monuments bound for the stars.',
        telemetryLabel: 'Bound Toward Aldebaran & Constellation Aquila',
      },
    ],
    cues: [
      { start: 0, end: 10, caption: '1972–1979: Pioneer 10 and 11 blaze through the asteroid belt to capture close views of Jupiter and Saturn.' },
      { start: 10, end: 20, caption: 'Both carry Carl Sagan’s gold-anodized interstellar plaques outward beyond the planetary orbits.' },
      { start: 20, end: 30, caption: 'Jan 23, 2003: From 82.19 AU, Pioneer 10 sends its final whisper before RTG power drops below Earth detection.' },
      { start: 30, end: 40, caption: 'Silent now, Pioneer 10 drifts toward Taurus and Pioneer 11 toward Aquila for millions of years.' },
    ],
  },
};
