# Abandoned but not Forgotten — Interactive Digital Museum

An interactive 3D digital museum and scientific archive for the NASA Space Apps Challenge 2026, cataloging all 16 non-functional spacecraft, landers, rovers, and scientific payloads across the Moon, Mars, small bodies, and interstellar space using the uploaded Development Handoff Document as the single authoritative source of truth.

## User Review & Critical Decisions

> [!IMPORTANT]
> This revised plan incorporates your **Section 9 Critical Development Instructions** alongside the four confirmed preferences from Phase 1 and the findings of our workspace inspection.

- **Workspace Asset Inspection Findings**: Inspection of the workspace confirmed that only the Development Handoff Document is currently present in the local public assets directory—no pre-downloaded NASA `.glb`, `.stl`, or archival photograph files are bundled yet. Every museum visual, 3D model, and portal reference is therefore designed for **zero broken assets** and **zero fabricated URLs**.
- **Confirmed Decision 1 — Complete 16-Exhibit Scope**: Cover every exhibit in the Handoff Document across **The Moon** (5 exhibits), **Mars** (7 exhibits), and **Deep Space & Small Bodies** (4 exhibits) with zero silent omissions.
- **Confirmed Decision 2 — Visual Aesthetic**: **Editorial Dark Museum** pairing deep obsidian and midnight cosmos grounds with warm archival gold accents, editorial serif headings, and tabular monospace telemetry figures.
- **Confirmed Decision 3 — Priority Interactive Features**: Interactive 3D planetary globes with exact coordinate pins, interactive 3D spacecraft viewers with clickable hotspot callouts and genuine GLB/STL loader support, and a side-by-side artifact comparison tool.
- **Confirmed Decision 4 — Technical Stack & GitHub Pages Readiness**: React, Tailwind CSS, and Three.js using relative Vite asset resolution and client-side hash routing so the compiled static bundle deploys cleanly to GitHub Pages or any free static host.

---

## 1. Overview & Data Integrity Policy

- **Authoritative Source Discipline**: All mission histories, landing coordinates, dates, mass/dimension specs, abandonment causes, and scientific achievements come strictly from the uploaded Development Handoff Document.
- **Verified Facts vs. Unavailable Information**: Any specification omitted from the Handoff Document (for example, exact chassis dimensions for Deep Space probes or incomplete coordinate precision on rover traverse endpoints) is explicitly labeled **`Unknown (Not specified in reference)`** or annotated with the Handoff Document's Section 10 verification notes—never guessed or padded.
- **Mass & Quote Rigor**: Mass figures explicitly preserve operational phase labels (**Launch Mass**, **Fueled Mass**, **Landed Mass**, **Dry Mass**), and Opportunity's viral phrase (*"My battery is low and it's getting dark"*) is explicitly documented as journalist Jacob Margolis's poetic paraphrase of telemetry rather than a literal rover transmission.
- **Authentic Media vs. Reconstructions**:
  - **Imagery**: Bespoke museum illustrations are generated locally and bundled as static assets, clearly labeled as *Curatorial Visual Studies*, while every exhibit displays its exact NASA Asset ID (`AS11-40-5921`, `AS17-146-22294`, `AS12-48-7136`, `PIA12967`, `PIA00563`, `PIA05196`, `PIA22328`, `PIA25287`, `PIA24808`) and NASA/JPL attribution with direct links to official NASA portals.
  - **3D Models**: Each exhibit clearly badges whether an official NASA 3D file is documented (`Apollo Lunar Module.glb`, `24883_MER_static.glb`, `24880_InSight_deployed.glb`, `25043_Ingenuity_v3.glb`, `kepler.glb`, `3D Viking Lander.stl`, or CAD/DEM/Shape archives). The viewer automatically attempts to load a matching local asset via Three.js `GLTFLoader` (`DRACOLoader`) or `STLLoader` if present, supports direct user file upload of downloaded NASA `.glb`/`.stl` files for live inspection, and renders a multi-part procedural Three.js hardware reconstruction by default—explicitly labeled as a **Procedural 3D Reconstruction** so authentic NASA meshes and procedural reconstructions are never conflated.

### Complete 16-Exhibit Coverage Table

| Realm | Included Exhibits (16 Total — Zero Omissions) |
| :--- | :--- |
| **The Moon (5)** | Apollo Lunar Module Descent Stages (`apollo-lm`), Lunar Roving Vehicles LRV-1/2/3 (`apollo-lrv`), ALSEP & Laser Retroreflectors (`apollo-alsep`), Complete Surveyor Program 1–7 (`surveyor-program`), Soviet Lunokhod 1 & 2 Rovers (`lunokhod-rovers`) |
| **Mars (7)** | Mars Pathfinder & Sojourner (`pathfinder-sojourner`), Spirit Rover MER-A (`spirit-rover`), Opportunity Rover MER-B (`opportunity-rover`), Viking 1 & 2 Landers (`viking-landers`), Phoenix Mars Lander (`phoenix-lander`), InSight Geophysical Lander (`insight-lander`), Ingenuity Mars Helicopter (`ingenuity-helicopter`) |
| **Deep Space & Small Bodies (4)** | Dawn Spacecraft at 1 Ceres (`dawn-spacecraft`), NEAR Shoemaker on 433 Eros (`near-shoemaker`), Kepler Space Telescope (`kepler-telescope`), Pioneer 10 & 11 Probes (`pioneer-probes`) |

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Landing & Museum Entrance**:
   - Editorial Hero presenting *"Abandoned but not Forgotten — Exploring the Silent Monuments of Solar System Exploration"*, lead narrative copy from the Handoff Document, and a primary **"Explore the Museum"** CTA.
   - Three distinct realm portals (**The Moon**, **Mars**, **Deep Space & Small Bodies**) with dedicated section introductions, exhibit counts, and atmosphere cues, followed by the 4-tier **Operational Disposition Taxonomy** reference.
2. **Planet & Realm Atlas (3D Globes & Orbital Map)**:
   - Interactive Three.js 3D globes for **The Moon** and **Mars** plus an interactive **Deep Space Relics Orbital Explorer**.
   - Exact documented latitude/longitude pins (including all 6 Apollo LM sites, all 7 Surveyor sites, both Lunokhod sites, both Viking sites, Pathfinder, Spirit, Opportunity, Phoenix, InSight, and Ingenuity Airfield Chi). Clicking any pin smoothly rotates the globe and opens a live site card linking directly to that exhibit's detail page.
3. **Interactive Exhibit Gallery**:
   - Instant keyword search (name, mission, location, scientific instrument, or discovery) combined with interactive segmented filters for **Target Body**, **Disposition Tier**, and **NASA 3D Asset Status**.
   - Every card opens the unified dynamic Exhibit Detail view—zero duplicated per-exhibit page code.
4. **Unified Exhibit Detail Page**:
   - Split editorial layout pairing an **Interactive 3D Hardware Inspector** (with clickable 3D component hotspots, camera presets, wireframe/lighting toggles, reset view, and local NASA `.glb`/`.stl` file loader) with an **Accession & Engineering Specification Table**.
   - Structured narrative sections: Historical Background, Original Purpose, Landing/Deployment Coordinates, Individual Exhibit Timeline, Scientific Achievements & Trivia, Why Left Behind / Failure Analysis, Current Status, Educational Field Notes, and NASA Image & 3D Asset Credits.
5. **Side-by-Side Artifact Comparison Tool**:
   - Compare any two of the 16 exhibits across Operational Period, Disposition Category, Mass (by phase), Dimensions, Power Source, Distance Traveled, Primary Scientific Milestone, and NASA 3D Asset Availability.
6. **Master Interactive Timeline & Educational Experience**:
   - Filterable chronological timeline spanning **1966 (Surveyor 1)** through **2024 (Ingenuity Flight 72)** and **Ongoing (Passive Lunar Laser Retroreflectors)**, paired with scientific explainers (retroreflector physics, solar dust vs. RTG longevity, polar CO2 dry-ice crushing, and optical flow navigation drift).
7. **Sources & Credits Directory**:
   - Full 9-row Image & Attribution Directory, 7-row Downloadable 3D Model Directory, and direct verified links to the 6 official NASA/JPL portals (NASA Science 3D Portal, NASA PDS, NASA SVS, LROC ASU, NTRS, and NASA JPL Mars).

### Visual Identity & Responsive Polish

- **Color Palette (60-30-10)**:
  - **60% Canvas**: Obsidian (`#090B10`) and Midnight Cosmos (`#0F131C`).
  - **30% Structural Surfaces**: Slate Exhibit Panels (`#141923`) with subtle 1px hairline borders (`rgba(255, 255, 255, 0.09)`).
  - **10% Curatorial Accents**: Warm Archival Gold (`#D4A359`) primary/Moon accent, Oxidized Mars Rust (`#C86446`) Mars accent, and Calibrated Ice Cyan (`#67B7D1`) Deep Space accent.
- **Typography**: `Cormorant Garamond` for display headlines, `Plus Jakarta Sans` for body prose (`65–75ch` reading width) and UI controls, and `JetBrains Mono` (`tabular-nums`) for coordinates, dates, and engineering specs.
- **Layout & Performance Discipline**: Desktop 1440px grid and responsive mobile drawer/stacked layouts; clean 3-zone single-row header; zero pill clutter on static metadata; zero pulsing dots; compositor-only transitions (`transform`, `opacity`) honoring `prefers-reduced-motion`; and software-WebGL detection so rendering remains responsive across hardware and headless environments.

---

## 3. Staged Development Workflow

Building proceeds sequentially in six testable stages, verifying navigation, rendering, and factual accuracy before moving to the next stage:

1. **Stage 1 — Data Architecture, Design System & Landing Shell**: Author the single-source typed database for all 16 exhibits, global editorial theme tokens, hash-based router, 3-zone Top Bar, and Landing Hero + Realm Portals.
2. **Stage 2 — Interactive 3D Planetary Globes & Deep Space Map**: Implement the Moon 3D globe, Mars 3D globe, and Deep Space trajectory explorer with exact coordinate pins and site selection cards.
3. **Stage 3 — Complete 16-Exhibit Gallery & Unified Exhibit Detail Pages**: Build search, multi-facet filters, and the reusable Exhibit Detail view covering every required historical, technical, and attribution field.
4. **Stage 4 — 3D Spacecraft Hardware Inspector & Genuine Model Loader**: Build the multi-part Three.js spacecraft reconstructions with `Raycaster` hotspot callouts, studio PMREM lighting, collapsible bottom control dock, and `GLTFLoader`/`DRACOLoader`/`STLLoader` support for local or user-loaded NASA `.glb`/`.stl` files.
5. **Stage 5 — Interactive Timelines, Artifact Comparator & Educational Notes**: Implement the master chronological timeline, per-exhibit timelines, 2-slot engineering comparison tool, and scientific context panels.
6. **Stage 6 — Sources/Credits, Responsive Audit & Deployment Verification**: Complete the NASA/JPL credits directory, verify mobile and desktop layouts, check all 16 exhibits, validate image fallbacks, run `npm run lint` and `npm run build`, and confirm zero console errors and GitHub Pages static bundle compatibility.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```text
┌──────────────────────────────────────────────────────────────────────┐
│              Single-Source Typed Museum Data Layer                   │
│  16 Exhibits · Exact Coordinates · Specs · Timelines · NASA Credits  │
│  Explicit "Unknown" Flags · Verification Notes (Section 10)          │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│               Hash-Routed Application Shell                          │
│  3-Zone Header · Mobile Drawer · Active Route & Comparison State     │
└──┬─────────────┬──────────────┬───────────────┬──────────────┬───────┘
   │             │              │               │              │
   ▼             ▼              ▼               ▼              ▼
┌────────┐ ┌───────────┐ ┌─────────────┐ ┌────────────┐ ┌──────────────┐
│ Hero & │ │ 3D Atlas  │ │  Filterable │ │  2-Slot    │ │  Timeline &  │
│ Realms │ │  Globes   │ │   Gallery   │ │ Comparator │ │   Sources    │
└────────┘ └─────┬─────┘ └──────┬──────┘ └────────────┘ └──────────────┘
                 │              │
                 │              ▼
                 │       ┌─────────────────────────────────────────────┐
                 └──────▶│      Unified Exhibit Detail Monograph       │
                         │  ┌───────────────────┐  ┌────────────────┐  │
                         │  │ Three.js Viewport │  │ Accession Spec │  │
                         │  │ Procedural + GLB/ │  │ Grid, Timeline │  │
                         │  │ STL Loader +      │  │ Story & NASA   │  │
                         │  │ Hotspot Callouts  │  │ Attribution    │  │
                         │  └───────────────────┘  └────────────────┘  │
                         └─────────────────────────────────────────────┘
```

### Data Model & Interactive State Mapping

- **Decoupled Exhibit Schema**: Every exhibit shares one strict TypeScript interface (`id`, `officialName`, `shortTitle`, `program`, `targetBody`, `operationalPeriod`, `dispositionCategory`, `dispositionReason`, `cardSnippet`, `historicalBackground`, `originalPurpose`, `locations`, `keyDates`, `specifications`, `achievements`, `abandonmentCause`, `currentStatus`, `timeline`, `hotspots`, `nasaImage`, `nasa3dAsset`, `educationalFacts`, `verificationNote`). Updating or adding exhibits requires editing only the data module.
- **Interactive Handlers & Persistence**:
  - **Search & Filter State**: Filters the 16-exhibit list instantaneously by text query, target body (`all`, `moon`, `mars`, `deep-space`), disposition tier, and 3D asset availability, with a one-click reset when zero results match.
  - **WebGL Lifecycle Safety**: Both the 3D Globes and 3D Spacecraft Inspector isolate their WebGL `<canvas>` inside dedicated refs, initialize `RoomEnvironment` PMREM reflections, adapt pixel ratio and render-on-demand pacing when software WebGL is detected, handle `webglcontextlost`, and provide a clean 2D fallback view.
  - **Static Hosting Configuration**: Configure relative asset paths (`base: './'`) and hash URLs (`#/...`) so `npm run build` works directly on GitHub Pages without server-side routing.
