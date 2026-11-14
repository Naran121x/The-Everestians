export interface NasaPhotoReference {
  nasaId: string;
  title: string;
  imageUrl: string;
  detailUrl: string;
  credit: string;
  caption: string;
}

export interface MissionVideoItem {
  id: string;
  title: string;
  publisher: string;
  demonstrates: string;
  captionSummary: string;
  sourceUrl: string;
  kind: 'nasa-mp4' | 'youtube';
  mp4Url?: string;
  vttUrl?: string;
  posterUrl?: string;
  youtubeId?: string;
}

export interface ExhibitMediaRecord {
  nasaPhoto?: NasaPhotoReference;
  missionVideos: MissionVideoItem[];
  videoArchiveFallbackUrl: string;
  videoArchiveFallbackLabel: string;
  animationTitle: string;
  animationSummary: string;
}

export const EXHIBIT_MEDIA: Record<string, ExhibitMediaRecord> = {
  'insight-lander': {
    nasaPhoto: {
      nasaId: 'PIA25287',
      title: "InSight's Final Selfie",
      imageUrl: 'https://images-assets.nasa.gov/image/PIA25287/PIA25287~medium.jpg',
      detailUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA25287',
      credit: 'NASA / JPL-Caltech',
      caption:
        'Original NASA photograph captured April 24, 2022 (Sol 1211), showing heavy Martian dust coating InSight’s 6-meter UltraFlex solar arrays on Elysium Planitia.',
    },
    missionVideos: [
      {
        id: 'insight-meteoroid-mp4',
        title: 'InSight Captures Sound of a Meteoroid Striking Mars',
        publisher: 'NASA Jet Propulsion Laboratory (JPL)',
        demonstrates:
          'Explains how InSight’s French-built SEIS seismometer detected seismic waves from a Martian meteoroid impact and converted surface vibrations into audible data.',
        captionSummary:
          'Includes official NASA WebVTT closed captions detailing the 2021 meteoroid impact detection and how seismic waves revealed Martian crustal layering.',
        sourceUrl:
          'https://images.nasa.gov/details/JPL-20220919-INSIGHf-0001-InSight%20Captures%20Sound%20of%20a%20Meteoroid%20Striking%20Mars_1080',
        kind: 'nasa-mp4',
        mp4Url:
          'https://images-assets.nasa.gov/video/JPL-20220919-INSIGHf-0001-InSight%20Captures%20Sound%20of%20a%20Meteoroid%20Striking%20Mars_1080/JPL-20220919-INSIGHf-0001-InSight%20Captures%20Sound%20of%20a%20Meteoroid%20Striking%20Mars_1080~medium.mp4',
        vttUrl:
          'https://images-assets.nasa.gov/video/JPL-20220919-INSIGHf-0001-InSight%20Captures%20Sound%20of%20a%20Meteoroid%20Striking%20Mars_1080/JPL-20220919-INSIGHf-0001-InSight%20Captures%20Sound%20of%20a%20Meteoroid%20Striking%20Mars_1080.vtt',
        posterUrl:
          'https://images-assets.nasa.gov/video/JPL-20220919-INSIGHf-0001-InSight%20Captures%20Sound%20of%20a%20Meteoroid%20Striking%20Mars_1080/JPL-20220919-INSIGHf-0001-InSight%20Captures%20Sound%20of%20a%20Meteoroid%20Striking%20Mars_1080~thumb.jpg',
      },
      {
        id: 'insight-landing-yt',
        title: 'InSight Landing on Mars',
        publisher: 'NASA Jet Propulsion Laboratory (JPL)',
        demonstrates:
          'Mission engineering breakdown explaining InSight’s heat shield entry, supersonic parachute, and pulsed retro-rocket touchdown onto Elysium Planitia.',
        captionSummary:
          'Official JPL engineering briefing covering the entry, descent, and landing sequence leading to stationary solar deployment.',
        sourceUrl: 'https://www.youtube.com/watch?v=PDSbUpmRksI',
        kind: 'youtube',
        youtubeId: 'PDSbUpmRksI',
      },
      {
        id: 'insight-control-yt',
        title: 'Mission Control Live: NASA InSight Mars Landing',
        publisher: 'NASA Jet Propulsion Laboratory (JPL)',
        demonstrates:
          'Live November 26, 2018 JPL Mission Control coverage capturing touchdown confirmation and early surface signal acquisition.',
        captionSummary:
          'Live NASA broadcast recording engineers reacting to InSight’s touchdown confirmation and first surface telemetry.',
        sourceUrl: 'https://www.youtube.com/watch?v=bGD_YF64Nwk',
        kind: 'youtube',
        youtubeId: 'bGD_YF64Nwk',
      },
    ],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=InSight%20Mars&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — InSight Archive',
    animationTitle: 'Schematic Reconstruction: Solar Dust Accumulation & Power Decline (2018–2022)',
    animationSummary:
      'Illustrates how settling Martian dust gradually reduced electrical output across InSight’s 6-meter UltraFlex arrays over 4 years while SEIS continued recording marsquakes until critical heater shutdown in December 2022.',
  },

  'apollo-lm': {
    nasaPhoto: {
      nasaId: 'as11-40-5903',
      title: 'Astronaut Edwin Aldrin Beside the Apollo 11 Lunar Module Eagle',
      imageUrl: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg',
      detailUrl: 'https://images.nasa.gov/details/as11-40-5903',
      credit: 'NASA / Apollo 11 Crew',
      caption:
        'Original Apollo 11 Hasselblad photograph showing Lunar Module Pilot Buzz Aldrin on Statio Tranquillitatis beside Eagle’s gold Kapton-wrapped descent stage.',
    },
    missionVideos: [
      {
        id: 'apollo11-flight-mp4',
        title: 'HQ-194, Eagle Has Landed: The Flight of Apollo 11',
        publisher: 'NASA Kennedy Space Center / Historical Film Archive',
        demonstrates:
          'Official archival documentary film following Apollo 11 from Saturn V liftoff through Eagle’s powered descent, moonwalk, and Ascent Stage departure.',
        captionSummary:
          'Official NASA historical film transfer with synchronized WebVTT closed captions documenting the July 1969 Tranquility Base landing and return.',
        sourceUrl:
          'https://images.nasa.gov/details/KSC-19690716-MH-NAS01-0001-The_Flight_of_Apollo_11_The_Eagle_Has_Landed_HS_from_Film_JSC-DVC_1928',
        kind: 'nasa-mp4',
        mp4Url:
          'https://images-assets.nasa.gov/video/KSC-19690716-MH-NAS01-0001-The_Flight_of_Apollo_11_The_Eagle_Has_Landed_HS_from_Film_JSC-DVC_1928/KSC-19690716-MH-NAS01-0001-The_Flight_of_Apollo_11_The_Eagle_Has_Landed_HS_from_Film_JSC-DVC_1928~small.mp4',
        vttUrl:
          'https://images-assets.nasa.gov/video/KSC-19690716-MH-NAS01-0001-The_Flight_of_Apollo_11_The_Eagle_Has_Landed_HS_from_Film_JSC-DVC_1928/KSC-19690716-MH-NAS01-0001-The_Flight_of_Apollo_11_The_Eagle_Has_Landed_HS_from_Film_JSC-DVC_1928.vtt',
        posterUrl:
          'https://images-assets.nasa.gov/video/KSC-19690716-MH-NAS01-0001-The_Flight_of_Apollo_11_The_Eagle_Has_Landed_HS_from_Film_JSC-DVC_1928/KSC-19690716-MH-NAS01-0001-The_Flight_of_Apollo_11_The_Eagle_Has_Landed_HS_from_Film_JSC-DVC_1928~thumb.jpg',
      },
    ],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Apollo%2011%20Eagle&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Apollo 11',
    animationTitle: 'Schematic Reconstruction: Powered Descent & Pyrotechnic Ascent Separation',
    animationSummary:
      'Step-by-step reconstruction showing the TR-201 engine braking to touchdown, astronaut surface activity, and explosive separation of the upper Ascent Stage leaving the octagonal Descent Stage behind.',
  },

  'apollo-lrv': {
    nasaPhoto: {
      nasaId: 'as17-146-22294',
      title: 'Apollo 17 EVA-3 Geological Traverse & Lunar Roving Vehicle',
      imageUrl: 'https://images-assets.nasa.gov/image/as17-146-22294/as17-146-22294~medium.jpg',
      detailUrl: 'https://images.nasa.gov/details/as17-146-22294',
      credit: 'NASA / Apollo 17 Crew',
      caption:
        'Original Apollo 17 photograph in Taurus-Littrow Valley documenting LRV-3 operations during humanity’s longest 35.74 km lunar surface drive.',
    },
    missionVideos: [
      {
        id: 'apollo17-lroc-flyover',
        title: 'Lee Lincoln Scarp at the Apollo 17 Landing Site',
        publisher: 'NASA Goddard Space Flight Center (GSFC)',
        demonstrates:
          'High-resolution Lunar Reconnaissance Orbiter visualization flying over Taurus-Littrow Valley, revealing the Apollo 17 traverse path and where Challenger and LRV-3 rest today.',
        captionSummary:
          'Official GSFC orbital elevation visualization with WebVTT captions mapping the Apollo 17 geological expedition route.',
        sourceUrl:
          'https://images.nasa.gov/details/GSFC_20190513_m4714_Lee_Lincoln_Scarp_Moon_Flyover',
        kind: 'nasa-mp4',
        mp4Url:
          'https://images-assets.nasa.gov/video/GSFC_20190513_m4714_Lee_Lincoln_Scarp_Moon_Flyover/GSFC_20190513_m4714_Lee_Lincoln_Scarp_Moon_Flyover~medium.mp4',
        vttUrl:
          'https://images-assets.nasa.gov/video/GSFC_20190513_m4714_Lee_Lincoln_Scarp_Moon_Flyover/GSFC_20190513_m4714_Lee_Lincoln_Scarp_Moon_Flyover.vtt',
        posterUrl:
          'https://images-assets.nasa.gov/video/GSFC_20190513_m4714_Lee_Lincoln_Scarp_Moon_Flyover/GSFC_20190513_m4714_Lee_Lincoln_Scarp_Moon_Flyover~thumb.jpg',
      },
    ],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Apollo%2017%20Lunar%20Rover&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Apollo LRVs',
    animationTitle: 'Schematic Reconstruction: LRV Deployment, Traverse & Liftoff Filming',
    animationSummary:
      'Illustrates how the folded 210 kg buggy unfolded from Quadrant 1, drove up to 35.74 km, and was parked ~140 m clear so its high-gain TV dish could track the Ascent Stage liftoff.',
  },

  'apollo-alsep': {
    missionVideos: [],
    videoArchiveFallbackUrl: 'https://svs.gsfc.nasa.gov/',
    videoArchiveFallbackLabel: 'NASA Scientific Visualization Studio (SVS #4868)',
    animationTitle: 'Schematic Reconstruction: RTG Network Shutdown & Ongoing Laser Ranging',
    animationSummary:
      'Demonstrates the contrast between the SNAP-27 radio telemetry switch-off in September 1977 and the zero-power fused-silica corner-cube retroreflectors still bouncing Earth laser pulses today.',
  },

  'surveyor-program': {
    nasaPhoto: {
      nasaId: 'as12-48-7136',
      title: 'Apollo 12 Astronaut Alan Bean Inspecting Surveyor 3 on the Moon',
      imageUrl: 'https://images-assets.nasa.gov/image/as12-48-7136/as12-48-7136~medium.jpg',
      detailUrl: 'https://images.nasa.gov/details/as12-48-7136',
      credit: 'NASA / Apollo 12 Crew',
      caption:
        'Original November 1969 Apollo 12 photograph showing Alan Bean beside the stationary Surveyor 3 lander in Oceanus Procellarum, 31 months after its robotic touchdown.',
    },
    missionVideos: [],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Surveyor%203%20Apollo%2012&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Surveyor & Apollo 12',
    animationTitle: 'Schematic Reconstruction: Radar Soft Landing, Surveyor 6 Hop & Apollo 12 Reunion',
    animationSummary:
      'Illustrates Surveyor’s radar-controlled tripod touchdown, Surveyor 6’s 4-meter powered lunar hop, and Apollo 12 astronauts walking 180 meters from LM Intrepid to retrieve Surveyor 3’s camera and scoop.',
  },

  'lunokhod-rovers': {
    nasaPhoto: {
      nasaId: 'PIA12967',
      title: 'LRO Orbital Discovery of Lunokhod 1 and Tracks (Mare Imbrium)',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA12967/PIA12967~small.jpg',
      detailUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA12967',
      credit: 'NASA / GSFC / Arizona State Univ.',
      caption:
        'Verified NASA LROC orbital image (PIA12967) pinpointing the Luna 17 descent stage and Lunokhod 1’s tracks in Mare Imbrium.',
    },
    missionVideos: [],
    videoArchiveFallbackUrl: 'https://svs.gsfc.nasa.gov/',
    videoArchiveFallbackLabel: 'NASA Scientific Visualization Studio (SVS #10595)',
    animationTitle: 'Schematic Reconstruction: Crater Dust Radiator Overheating (Lunokhod 2, May 1973)',
    animationSummary:
      'Shows how Lunokhod 2’s open solar lid accidentally scooped loose crater-wall regolith onto its thermal radiator; closing the lid for lunar night trapped dust inside, causing fatal overheating.',
  },

  'pathfinder-sojourner': {
    nasaPhoto: {
      nasaId: 'PIA00766',
      title: 'Sojourner Microrover Analyzing Rock "Yogi" at Ares Vallis',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA00766/PIA00766~thumb.jpg',
      detailUrl: 'https://images.nasa.gov/details/PIA00766',
      credit: 'NASA / JPL-Caltech',
      caption:
        'Original 1997 Mars Pathfinder IMP image showing the six-wheeled Sojourner rover pressing its Alpha Proton X-ray Spectrometer against Martian rock Yogi.',
    },
    missionVideos: [],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Mars%20Pathfinder%20Sojourner&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Mars Pathfinder',
    animationTitle: 'Schematic Reconstruction: Airbag Cushion Bounce, Petal Opening & Ramp Rollout',
    animationSummary:
      'Illustrates the July 4, 1997 inflatable airbag landing, the unfolding of the three solar petals of Carl Sagan Memorial Station, and Sojourner rolling down onto Ares Vallis.',
  },

  'spirit-rover': {
    nasaPhoto: {
      nasaId: 'PIA05124',
      title: 'Mars Global Surveyor Captures Spirit’s Descent in Gusev Crater',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA05124/PIA05124~medium.jpg',
      detailUrl: 'https://images.nasa.gov/details/PIA05124',
      credit: 'NASA / JPL-Caltech / MSSS',
      caption:
        'Orbital photograph documenting Spirit’s January 2004 landing ellipse inside Gusev Crater before its 7.73 km traverse to Columbia Hills and Troy.',
    },
    missionVideos: [
      {
        id: 'spirit-anniv-mp4',
        title: 'Spirit Mars Exploration Rover: One Year of Roving Gusev Crater',
        publisher: 'NASA Kennedy Space Center / JPL',
        demonstrates:
          'Archival NASA mission featurette chronicling Spirit’s landing in Gusev Crater, grinding of rock Adirondack, and ascent into the Columbia Hills.',
        captionSummary:
          'Includes full WebVTT closed captions summarizing Spirit’s 91-day design goal versus its multi-kilometer geological discoveries.',
        sourceUrl: 'https://images.nasa.gov/details/ksc_122104_spirit_anniv',
        kind: 'nasa-mp4',
        mp4Url:
          'https://images-assets.nasa.gov/video/ksc_122104_spirit_anniv/ksc_122104_spirit_anniv~orig.mp4',
        vttUrl:
          'https://images-assets.nasa.gov/video/ksc_122104_spirit_anniv/ksc_122104_spirit_anniv.vtt',
        posterUrl:
          'https://images-assets.nasa.gov/video/ksc_122104_spirit_anniv/ksc_122104_spirit_anniv~thumb.jpg',
      },
    ],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Spirit%20Mars%20Rover&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Spirit Rover',
    animationTitle: 'Schematic Reconstruction: Silica Discovery, Sand Entrapment at "Troy" & Winter Tilt',
    animationSummary:
      'Illustrates Spirit’s 7.73 km drive up Columbia Hills, breaking through brittle surface crust into soft iron-sulfate sand in May 2009, and losing winter sunlight tilt in March 2010.',
  },

  'opportunity-rover': {
    nasaPhoto: {
      nasaId: 'PIA11738',
      title: 'Opportunity Traverse Route Toward Endeavour Crater (Meridiani Planum)',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA11738/PIA11738~medium.jpg',
      detailUrl: 'https://images.nasa.gov/details/PIA11738',
      credit: 'NASA / JPL-Caltech / Univ. of Arizona',
      caption:
        'HiRISE orbital map plotting Opportunity’s historic multi-year trek across Meridiani Planum craters toward the rim of Endeavour Crater.',
    },
    missionVideos: [],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Opportunity%20Mars%20Rover&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Opportunity',
    animationTitle: 'Schematic Reconstruction: 45.16 km Crater Traverse & June 2018 Dust Storm Blackout',
    animationSummary:
      'Traces Opportunity’s 5,111-sol trek across Eagle, Endurance, Victoria, and Endeavour craters, then visualizes atmospheric optical depth (tau) surging during the June 2018 global dust storm.',
  },

  'viking-landers': {
    nasaPhoto: {
      nasaId: 'PIA00563',
      title: 'First Color Image From Viking Lander 1 (Chryse Planitia)',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA00563/PIA00563~thumb.jpg',
      detailUrl: 'https://photojournal.jpl.nasa.gov/catalog/PIA00563',
      credit: 'NASA / JPL-Caltech',
      caption:
        'Verified JPL Photojournal catalog PIA00563: humanity’s first calibrated color surface portrait of Mars, transmitted from Viking 1 on July 21, 1976.',
    },
    missionVideos: [],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Viking%20Lander%20Mars&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Viking Program',
    animationTitle: 'Schematic Reconstruction: Dual SNAP-19 RTG Power & 1982 Antenna Pointing Loss',
    animationSummary:
      'Shows Viking 1 operating for over six years on nuclear RTG power before an erroneous November 13, 1982 software command rotated its high-gain dish beam off Earth lock.',
  },

  'phoenix-lander': {
    nasaPhoto: {
      nasaId: 'PIA10910',
      title: 'Subsurface Water Ice Exposed in Phoenix’s "Dodo-Goldilocks" Trench',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA10910/PIA10910~thumb.jpg',
      detailUrl: 'https://images.nasa.gov/details/PIA10910',
      credit: 'NASA / JPL-Caltech / Univ. of Arizona',
      caption:
        'Original June 2008 Phoenix Surface Stereo Imager photograph showing bright white permafrost ice chunks sublimating after excavation 18 cm below arctic Mars.',
    },
    missionVideos: [
      {
        id: 'phoenix-launch-mp4',
        title: 'Phoenix Mars Lander Launch Aboard Delta II',
        publisher: 'NASA Kennedy Space Center (KSC)',
        demonstrates:
          'Official August 4, 2007 launch footage of Phoenix departing Cape Canaveral for Mars’ northern polar permafrost zone.',
        captionSummary:
          'Includes NASA WebVTT commentary describing Phoenix’s robotic digging arm and polar summer mission timeline.',
        sourceUrl: 'https://images.nasa.gov/details/ksc_080407_phx_launch',
        kind: 'nasa-mp4',
        mp4Url:
          'https://images-assets.nasa.gov/video/ksc_080407_phx_launch/ksc_080407_phx_launch~orig.mp4',
        vttUrl:
          'https://images-assets.nasa.gov/video/ksc_080407_phx_launch/ksc_080407_phx_launch.vtt',
        posterUrl:
          'https://images-assets.nasa.gov/video/ksc_080407_phx_launch/ksc_080407_phx_launch~thumb.jpg',
      },
      {
        id: 'phoenix-doc-yt',
        title: 'Phoenix Mars Mission: Onto the Ice (Full Documentary)',
        publisher: 'AZPM / University of Arizona Phoenix Mission Partner',
        demonstrates:
          'Comprehensive mission documentary following the University of Arizona and JPL team through landing at 68.15° N and uncovering polar subsurface ice.',
        captionSummary:
          'Partner mission documentary chronicling permafrost excavation, wet chemistry analysis, and polar night shutdown.',
        sourceUrl: 'https://www.youtube.com/watch?v=vK9fQnsN2uc',
        kind: 'youtube',
        youtubeId: 'vK9fQnsN2uc',
      },
    ],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Phoenix%20Mars%20Lander&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Phoenix',
    animationTitle: 'Schematic Reconstruction: Arctic Ice Trenching & Polar Winter CO2 Frost Crush',
    animationSummary:
      'Illustrates Phoenix’s 18 cm trenching during arctic summer followed by total polar darkness and heavy seasonal CO2 dry ice buckling its 5.5 m decagonal solar panels.',
  },

  'ingenuity-helicopter': {
    nasaPhoto: {
      nasaId: 'PIA25686',
      title: 'Perseverance’s Mastcam-Z Views Ingenuity’s 47th Takeoff',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA25686/PIA25686~medium.jpg',
      detailUrl: 'https://images.nasa.gov/details/PIA25686',
      credit: 'NASA / JPL-Caltech / ASU / MSSS',
      caption:
        'Real Mastcam-Z photograph from Perseverance capturing Ingenuity kicking up Martian dust as its 2,400 RPM counter-rotating carbon blades lift off Jezero Crater.',
    },
    missionVideos: [
      {
        id: 'ingenuity-flight3-yt',
        title: "Perseverance Rover's Mastcam-Z Captures Ingenuity's Third Flight",
        publisher: 'NASA Jet Propulsion Laboratory (JPL)',
        demonstrates:
          'Authentic Mastcam-Z video filmed on Mars showing Ingenuity lifting off, flying 50 meters downrange at 2 m/s, and returning to land in Jezero Crater.',
        captionSummary:
          'Official JPL Mars footage proving sustained horizontal flight in Mars’ <1% atmospheric density.',
        sourceUrl: 'https://www.youtube.com/watch?v=kNx9hcrUpww',
        kind: 'youtube',
        youtubeId: 'kNx9hcrUpww',
      },
      {
        id: 'ingenuity-audio-mp4',
        title: 'NASA’s Perseverance Rover Hears Ingenuity Mars Helicopter in Flight',
        publisher: 'NASA Jet Propulsion Laboratory (JPL)',
        demonstrates:
          'First spacecraft-to-spacecraft audio recording on another planet, capturing the ~84 Hz hum of Ingenuity’s 2,400+ RPM blades during Flight 4.',
        captionSummary:
          'Official NASA WebVTT captions explaining how Perseverance’s SuperCam microphone captured Ingenuity’s rotor acoustic signature.',
        sourceUrl:
          'https://images.nasa.gov/details/JPL-20210506-Listen%20to%20NASA%E2%80%99s%20Ingenuity%20Helicopter%20as%20it%20Flies%20on%20Mars-1080',
        kind: 'nasa-mp4',
        mp4Url:
          'https://images-assets.nasa.gov/video/JPL-20210506-Listen%20to%20NASA%E2%80%99s%20Ingenuity%20Helicopter%20as%20it%20Flies%20on%20Mars-1080/JPL-20210506-Listen%20to%20NASA%E2%80%99s%20Ingenuity%20Helicopter%20as%20it%20Flies%20on%20Mars-1080~medium.mp4',
        vttUrl:
          'https://images-assets.nasa.gov/video/JPL-20210506-Listen%20to%20NASA%E2%80%99s%20Ingenuity%20Helicopter%20as%20it%20Flies%20on%20Mars-1080/JPL-20210506-Listen%20to%20NASA%E2%80%99s%20Ingenuity%20Helicopter%20as%20it%20Flies%20on%20Mars-1080.vtt',
        posterUrl:
          'https://images-assets.nasa.gov/video/JPL-20210506-Listen%20to%20NASA%E2%80%99s%20Ingenuity%20Helicopter%20as%20it%20Flies%20on%20Mars-1080/JPL-20210506-Listen%20to%20NASA%E2%80%99s%20Ingenuity%20Helicopter%20as%20it%20Flies%20on%20Mars-1080~thumb.jpg',
      },
    ],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Ingenuity%20Mars%20Helicopter&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Ingenuity',
    animationTitle: 'Schematic Reconstruction: Flight 72 Optical Flow Drift & Rotor Tip Fracture',
    animationSummary:
      'Compares Ingenuity’s nominal terrain-tracked flights with Flight 72 over smooth, featureless sand dunes at Valinor Hills, where navigation drift triggered a hard landing and fractured a blade tip.',
  },

  'dawn-spacecraft': {
    nasaPhoto: {
      nasaId: 'PIA21078',
      title: 'Occator Crater Bright Salt Deposits on 1 Ceres (Captured by Dawn)',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA21078/PIA21078~small.jpg',
      detailUrl: 'https://images.nasa.gov/details/PIA21078',
      credit: 'NASA / JPL-Caltech / UCLA / MPS / DLR / IDA',
      caption:
        'Orbital photograph captured by Dawn at dwarf planet 1 Ceres showing Occator Crater before Dawn exhausted its hydrazine attitude propellant in 2018.',
    },
    missionVideos: [
      {
        id: 'dawn-nimoy-yt',
        title: 'Dawn, Mission to the Asteroid Belt (HD) – Narrated by Leonard Nimoy',
        publisher: 'NASA Jet Propulsion Laboratory (JPL)',
        demonstrates:
          'Official JPL mission overview detailing how Dawn’s solar-electric xenon ion propulsion enabled it to orbit both protoplanet 4 Vesta and dwarf planet 1 Ceres.',
        captionSummary:
          'Official JPL documentary overview covering xenon ion propulsion, asteroid belt dynamics, and dual-target orbital insertion.',
        sourceUrl: 'https://www.youtube.com/watch?v=4ObsViTRT18',
        kind: 'youtube',
        youtubeId: '4ObsViTRT18',
      },
      {
        id: 'dawn-launch-mp4',
        title: 'Dawn Spacecraft Launch Aboard Delta II Heavy',
        publisher: 'NASA Kennedy Space Center (KSC)',
        demonstrates:
          'September 27, 2007 liftoff of Dawn starting its 11-year xenon ion voyage into the main asteroid belt.',
        captionSummary:
          'Official KSC launch archive with WebVTT captions explaining Dawn’s historic mission to Vesta and Ceres.',
        sourceUrl: 'https://images.nasa.gov/details/ksc_092707_dawn_launch',
        kind: 'nasa-mp4',
        mp4Url:
          'https://images-assets.nasa.gov/video/ksc_092707_dawn_launch/ksc_092707_dawn_launch~small.mp4',
        vttUrl:
          'https://images-assets.nasa.gov/video/ksc_092707_dawn_launch/ksc_092707_dawn_launch.vtt',
        posterUrl:
          'https://images-assets.nasa.gov/video/ksc_092707_dawn_launch/ksc_092707_dawn_launch~thumb.jpg',
      },
    ],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Dawn%20Ceres&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Dawn',
    animationTitle: 'Schematic Reconstruction: Xenon Ion Cruise & >50-Year Ceres Quarantine Orbit',
    animationSummary:
      'Visualizes Dawn’s ion-driven transfer from 4 Vesta to 1 Ceres and its final hydrazine exhaustion on November 1, 2018 inside a stable planetary protection orbit.',
  },

  'near-shoemaker': {
    nasaPhoto: {
      nasaId: 'PIA18177',
      title: 'NEAR Shoemaker Rendezvous with Asteroid 433 Eros (NASA Concept)',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA18177/PIA18177~medium.jpg',
      detailUrl: 'https://images.nasa.gov/details/PIA18177',
      credit: 'NASA / JHUAPL',
      caption:
        'Official NASA/JHUAPL mission illustration depicting NEAR Shoemaker descending toward near-Earth asteroid 433 Eros.',
    },
    missionVideos: [],
    videoArchiveFallbackUrl: 'https://pds.nasa.gov/',
    videoArchiveFallbackLabel: 'NASA Planetary Data System (433 Eros Archive)',
    animationTitle: 'Schematic Reconstruction: Improvised ~1.9 m/s Touchdown on 433 Eros',
    animationSummary:
      'Shows an orbiter with no landing legs executing gentle thruster braking on February 12, 2001 to rest on its solar wing tips and beam back 16 days of surface gamma-ray spectra.',
  },

  'kepler-telescope': {
    nasaPhoto: {
      nasaId: 'KSC-2009-1124',
      title: 'Kepler Space Telescope Prior to Launch Integration (2009)',
      imageUrl: 'https://images-assets.nasa.gov/image/KSC-2009-1124/KSC-2009-1124~medium.jpg',
      detailUrl: 'https://images.nasa.gov/details/KSC-2009-1124',
      credit: 'NASA / Kennedy Space Center',
      caption:
        'Original March 2009 NASA cleanroom photograph showing Kepler’s 0.95-meter photometer barrel and angled solar array skirt prior to launch.',
    },
    missionVideos: [
      {
        id: 'kepler-legacy-yt',
        title: 'Legacy of NASA’s Kepler Space Telescope: More Planets Than Stars',
        publisher: 'NASA / Ames Research Center',
        demonstrates:
          'Official NASA mission retrospective explaining how Kepler’s transit photometry proved planets outnumber stars in the Milky Way prior to its October 2018 retirement.',
        captionSummary:
          'Official NASA summary covering the primary Cygnus field survey, K2 extension, and safe heliocentric decommissioning.',
        sourceUrl: 'https://www.youtube.com/watch?v=_V7J05fK5e0',
        kind: 'youtube',
        youtubeId: '_V7J05fK5e0',
      },
      {
        id: 'kepler-tess-mp4',
        title: 'Going Interstellar with TESS and Kepler',
        publisher: 'NASA Goddard Space Flight Center (GSFC)',
        demonstrates:
          'GSFC scientific visualization comparing Kepler’s deep exoplanet survey with successor observatories and mapping discovered systems.',
        captionSummary:
          'Includes official WebVTT captions explaining transit light curves and planetary demographics revealed by Kepler.',
        sourceUrl: 'https://images.nasa.gov/details/GSFC_20190327_TESS_m13155_Voyager',
        kind: 'nasa-mp4',
        mp4Url:
          'https://images-assets.nasa.gov/video/GSFC_20190327_TESS_m13155_Voyager/GSFC_20190327_TESS_m13155_Voyager~medium.mp4',
        vttUrl:
          'https://images-assets.nasa.gov/video/GSFC_20190327_TESS_m13155_Voyager/GSFC_20190327_TESS_m13155_Voyager.vtt',
        posterUrl:
          'https://images-assets.nasa.gov/video/GSFC_20190327_TESS_m13155_Voyager/GSFC_20190327_TESS_m13155_Voyager~thumb.jpg',
      },
    ],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Kepler%20Space%20Telescope&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Kepler',
    animationTitle: 'Schematic Reconstruction: Transit Light-Curve Monitoring & 2018 Transmitter Shutdown',
    animationSummary:
      'Demonstrates how passing exoplanets dip measured starlight inside the 0.95 m photometer, followed by hydrazine depletion and final "goodnight" transmitter shutdown in October 2018.',
  },

  'pioneer-probes': {
    nasaPhoto: {
      nasaId: 'ARC-1972-AC72-2135',
      title: 'Pioneer 10 Spacecraft and Gold-Anodized Interstellar Plaque (1972)',
      imageUrl: 'https://images-assets.nasa.gov/image/ARC-1972-AC72-2135/ARC-1972-AC72-2135~medium.jpg',
      detailUrl: 'https://images.nasa.gov/details/ARC-1972-AC72-2135',
      credit: 'NASA / Ames Research Center',
      caption:
        'Original 1972 NASA Ames archival photograph documenting Pioneer 10 prior to launch on its historic outer-planet and interstellar escape trajectory.',
    },
    missionVideos: [],
    videoArchiveFallbackUrl: 'https://images.nasa.gov/search?q=Pioneer%2010&media=video',
    videoArchiveFallbackLabel: 'NASA Image & Video Library — Pioneer 10 & 11',
    animationTitle: 'Schematic Reconstruction: Outer Planet Flybys & 82 AU Radio Signal Fade',
    animationSummary:
      'Illustrates Pioneer 10 & 11 crossing the asteroid belt, accelerating past Jupiter and Saturn, and fading below Earth’s detection threshold at 82 AU while gliding toward Taurus and Aquila.',
  },
};
