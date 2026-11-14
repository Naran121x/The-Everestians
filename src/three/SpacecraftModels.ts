import * as THREE from 'three';

function createPalette() {
  return {
    kaptonGold: new THREE.MeshStandardMaterial({
      color: 0xd4a33b,
      metalness: 0.88,
      roughness: 0.24,
    }),
    kaptonAmber: new THREE.MeshStandardMaterial({
      color: 0xa86420,
      metalness: 0.85,
      roughness: 0.32,
    }),
    aluminum: new THREE.MeshStandardMaterial({
      color: 0xc5ccd6,
      metalness: 0.82,
      roughness: 0.3,
    }),
    titaniumDark: new THREE.MeshStandardMaterial({
      color: 0x3b4252,
      metalness: 0.78,
      roughness: 0.42,
    }),
    charcoal: new THREE.MeshStandardMaterial({
      color: 0x1e222b,
      metalness: 0.35,
      roughness: 0.72,
    }),
    solarBlue: new THREE.MeshStandardMaterial({
      color: 0x162b4d,
      metalness: 0.65,
      roughness: 0.22,
    }),
    marsDustSolar: new THREE.MeshStandardMaterial({
      color: 0x5c4234,
      metalness: 0.3,
      roughness: 0.78,
    }),
    whitePaint: new THREE.MeshStandardMaterial({
      color: 0xe6e8ec,
      metalness: 0.15,
      roughness: 0.55,
    }),
    copper: new THREE.MeshStandardMaterial({
      color: 0xb87333,
      metalness: 0.86,
      roughness: 0.28,
    }),
    glassOptic: new THREE.MeshPhysicalMaterial({
      color: 0x89d4f5,
      metalness: 0.1,
      roughness: 0.08,
      clearcoat: 1.0,
    }),
    ionGlow: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      metalness: 0.2,
      roughness: 0.3,
    }),
    regolithGray: new THREE.MeshStandardMaterial({
      color: 0x5c6068,
      metalness: 0.05,
      roughness: 0.92,
    }),
  };
}

function addWheel(
  parent: THREE.Group,
  x: number,
  y: number,
  z: number,
  radius: number,
  width: number,
  rimMat: THREE.Material,
  hubMat: THREE.Material
) {
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 20), rimMat);
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, y, z);
  wheel.castShadow = true;
  parent.add(wheel);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.45, radius * 0.45, width * 1.08, 12), hubMat);
  hub.rotation.z = Math.PI / 2;
  hub.position.set(x, y, z);
  parent.add(hub);
}

function addTripodLegs(
  parent: THREE.Group,
  radiusTop: number,
  radiusFoot: number,
  heightTop: number,
  legMat: THREE.Material,
  padMat: THREE.Material,
  count = 3
) {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.PI / 6;
    const tx = Math.cos(angle) * radiusTop;
    const tz = Math.sin(angle) * radiusTop;
    const fx = Math.cos(angle) * radiusFoot;
    const fz = Math.sin(angle) * radiusFoot;

    const start = new THREE.Vector3(tx, heightTop, tz);
    const end = new THREE.Vector3(fx, 0.05, fz);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const len = start.distanceTo(end);

    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, len, 10), legMat);
    strut.position.copy(mid);
    strut.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
    strut.castShadow = true;
    parent.add(strut);

    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.06, 16), padMat);
    foot.position.set(fx, 0.03, fz);
    foot.castShadow = true;
    foot.receiveShadow = true;
    parent.add(foot);
  }
}

export function buildProceduralSpacecraft(exhibitId: string): THREE.Group {
  const group = new THREE.Group();
  const m = createPalette();

  switch (exhibitId) {
    case 'apollo-lm': {
      // Octagonal Kapton descent stage
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.72, 8), m.kaptonGold);
      body.position.y = 0.72;
      body.castShadow = true;
      group.add(body);

      const upperDeck = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.82, 0.14, 8), m.titaniumDark);
      upperDeck.position.y = 1.13;
      group.add(upperDeck);

      const engineBell = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.42, 20, 1, true), m.charcoal);
      engineBell.position.y = 0.28;
      group.add(engineBell);

      const mesaPanel = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.36, 0.08), m.aluminum);
      mesaPanel.position.set(0.62, 0.74, 0.62);
      mesaPanel.rotation.y = Math.PI / 4;
      group.add(mesaPanel);

      // 4 Landing legs with crushable footpads
      addTripodLegs(group, 0.86, 1.38, 0.72, m.kaptonAmber, m.kaptonGold, 4);

      // Crew ladder on front strut
      const ladder = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.82, 0.03), m.aluminum);
      ladder.position.set(0.78, 0.48, 0.78);
      ladder.rotation.set(-0.45, Math.PI / 4, 0);
      group.add(ladder);
      break;
    }

    case 'apollo-lrv': {
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.95), m.aluminum);
      chassis.position.y = 0.36;
      chassis.castShadow = true;
      group.add(chassis);

      // Two astronaut seats
      for (const sz of [-0.24, 0.24]) {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.34), m.titaniumDark);
        seat.position.set(-0.18, 0.58, sz);
        seat.castShadow = true;
        group.add(seat);
      }

      // Forward console & T-handle
      const consoleBox = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.38), m.kaptonGold);
      consoleBox.position.set(0.48, 0.56, 0);
      group.add(consoleBox);

      // High-gain umbrella dish
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.68, 10), m.aluminum);
      mast.position.set(0.6, 0.75, 0);
      group.add(mast);

      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.14, 16, 1, true), m.aluminum);
      dish.position.set(0.6, 1.08, 0);
      dish.rotation.x = Math.PI * 0.85;
      group.add(dish);

      // 4 wire-mesh wheels
      for (const wx of [-0.66, 0.66]) {
        for (const wz of [-0.56, 0.56]) {
          addWheel(group, wx, 0.24, wz, 0.24, 0.14, m.titaniumDark, m.kaptonGold);
        }
      }
      break;
    }

    case 'apollo-alsep': {
      // Central station
      const hub = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.38, 0.55), m.whitePaint);
      hub.position.set(0, 0.24, 0);
      hub.castShadow = true;
      group.add(hub);

      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.7, 12), m.aluminum);
      antenna.position.set(0, 0.68, 0);
      group.add(antenna);

      // SNAP-27 RTG finned cask
      const rtg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.52, 12), m.charcoal);
      rtg.position.set(-0.8, 0.28, -0.35);
      rtg.castShadow = true;
      group.add(rtg);

      for (let i = 0; i < 6; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.45, 0.02), m.titaniumDark);
        fin.position.set(-0.8, 0.28, -0.35);
        fin.rotation.y = (i / 6) * Math.PI;
        group.add(fin);
      }

      // LRRR Retroreflector array tilted toward Earth
      const lrrrBase = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.06, 0.38), m.aluminum);
      lrrrBase.position.set(0.85, 0.22, 0.55);
      lrrrBase.rotation.set(-0.45, -0.3, 0);
      lrrrBase.castShadow = true;
      group.add(lrrrBase);

      const lrrrGlass = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.31), m.glassOptic);
      lrrrGlass.position.set(0.85, 0.25, 0.55);
      lrrrGlass.rotation.set(-0.45, -0.3, 0);
      group.add(lrrrGlass);
      break;
    }

    case 'surveyor-program': {
      // Triangular core frame
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.55, 3), m.aluminum);
      core.position.y = 0.58;
      core.castShadow = true;
      group.add(core);

      addTripodLegs(group, 0.42, 0.95, 0.48, m.aluminum, m.kaptonGold, 3);

      // Tall central mast & overhead solar panel
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.05, 10), m.aluminum);
      mast.position.y = 1.08;
      group.add(mast);

      const solar = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.04, 0.65), m.solarBlue);
      solar.position.set(0, 1.56, 0);
      solar.rotation.z = 0.3;
      solar.castShadow = true;
      group.add(solar);

      const scoop = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.08), m.titaniumDark);
      scoop.position.set(0.42, 0.55, 0.45);
      scoop.rotation.y = -0.6;
      group.add(scoop);
      break;
    }

    case 'lunokhod-rovers': {
      // Pressurized ribbed instrument hull
      const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.55, 0.45, 12), m.aluminum);
      hull.scale.set(1.3, 1, 0.95);
      hull.position.y = 0.5;
      hull.castShadow = true;
      group.add(hull);

      // Open hinged solar lid
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.06, 12), m.solarBlue);
      lid.scale.set(1.25, 1, 0.9);
      lid.position.set(0, 0.92, -0.45);
      lid.rotation.x = -0.78;
      lid.castShadow = true;
      group.add(lid);

      // French retroreflector box forward
      const lrrr = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.16), m.glassOptic);
      lrrr.position.set(0, 0.62, 0.78);
      group.add(lrrr);

      // 8 independent mesh wheels
      for (const wx of [-0.72, -0.24, 0.24, 0.72]) {
        for (const wz of [-0.62, 0.62]) {
          addWheel(group, wx, 0.2, wz, 0.2, 0.11, m.titaniumDark, m.aluminum);
        }
      }
      break;
    }

    case 'pathfinder-sojourner': {
      // 3 unfolded triangular solar petals
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        const petal = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.04, 3), m.solarBlue);
        petal.position.set(Math.cos(a) * 0.48, 0.06, Math.sin(a) * 0.48);
        petal.rotation.y = -a + Math.PI / 2;
        petal.castShadow = true;
        group.add(petal);
      }

      const centerBox = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.35, 3), m.kaptonGold);
      centerBox.position.y = 0.22;
      group.add(centerBox);

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 10), m.aluminum);
      mast.position.set(-0.15, 0.55, -0.15);
      group.add(mast);

      // Nearby Sojourner microrover
      const rover = new THREE.Group();
      rover.position.set(1.05, 0, 0.65);
      rover.rotation.y = -0.5;
      const rBody = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 0.34), m.solarBlue);
      rBody.position.y = 0.18;
      rBody.castShadow = true;
      rover.add(rBody);
      for (const rx of [-0.17, 0, 0.17]) {
        for (const rz of [-0.21, 0.21]) {
          addWheel(rover, rx, 0.07, rz, 0.07, 0.05, m.titaniumDark, m.aluminum);
        }
      }
      group.add(rover);
      break;
    }

    case 'spirit-rover':
    case 'opportunity-rover': {
      const solarMat = exhibitId === 'opportunity-rover' ? m.marsDustSolar : m.solarBlue;
      // Warm Electronics Box
      const web = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.38, 0.34, 3), m.kaptonGold);
      web.position.y = 0.52;
      web.castShadow = true;
      group.add(web);

      // Triple solar wings deck
      const deck = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.05, 1.15), solarMat);
      deck.position.y = 0.7;
      deck.castShadow = true;
      group.add(deck);

      // Pancam Mast
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.72, 10), m.whitePaint);
      mast.position.set(0, 1.05, 0.4);
      group.add(mast);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.14), m.whitePaint);
      head.position.set(0, 1.4, 0.42);
      head.castShadow = true;
      group.add(head);

      // Front instrument arm
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.55), m.aluminum);
      arm.position.set(0.24, 0.52, 0.78);
      arm.rotation.x = 0.25;
      group.add(arm);

      // 6 rocker-bogie wheels
      for (const wx of [-0.78, 0.78]) {
        for (const wz of [-0.56, 0, 0.56]) {
          addWheel(group, wx, 0.18, wz, 0.18, 0.12, m.titaniumDark, m.aluminum);
        }
      }
      break;
    }

    case 'viking-landers': {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.38, 6), m.whitePaint);
      body.position.y = 0.52;
      body.castShadow = true;
      group.add(body);

      addTripodLegs(group, 0.65, 1.05, 0.45, m.aluminum, m.titaniumDark, 3);

      // Twin SNAP-19 RTG canisters
      for (const rz of [-0.36, 0.36]) {
        const rtg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.36, 12), m.charcoal);
        rtg.position.set(-0.82, 0.54, rz);
        rtg.rotation.z = Math.PI / 2;
        rtg.castShadow = true;
        group.add(rtg);
      }

      // High-gain S-band dish
      const dishMast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 10), m.aluminum);
      dishMast.position.set(0.35, 0.92, -0.25);
      group.add(dishMast);

      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.14, 20, 1, true), m.whitePaint);
      dish.position.set(0.35, 1.24, -0.25);
      dish.rotation.x = Math.PI * 0.78;
      dish.castShadow = true;
      group.add(dish);

      const sampler = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.85), m.aluminum);
      sampler.position.set(0.55, 0.44, 0.55);
      sampler.rotation.y = 0.45;
      group.add(sampler);
      break;
    }

    case 'phoenix-lander': {
      const deck = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.24, 8), m.kaptonGold);
      deck.position.y = 0.48;
      deck.castShadow = true;
      group.add(deck);

      addTripodLegs(group, 0.48, 0.86, 0.42, m.aluminum, m.titaniumDark, 3);

      // Twin decagonal wings
      for (const sx of [-1.15, 1.15]) {
        const wing = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.04, 10), m.solarBlue);
        wing.position.set(sx, 0.48, 0);
        wing.castShadow = true;
        group.add(wing);
      }

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.88), m.aluminum);
      arm.position.set(0.6, 0.38, 0.5);
      arm.rotation.set(0.3, 0.5, 0);
      group.add(arm);
      break;
    }

    case 'insight-lander': {
      const deck = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.26, 8), m.kaptonGold);
      deck.position.y = 0.52;
      deck.castShadow = true;
      group.add(deck);

      addTripodLegs(group, 0.5, 0.88, 0.45, m.aluminum, m.titaniumDark, 3);

      // Twin UltraFlex circular solar wings (dusted)
      for (const sx of [-1.2, 1.2]) {
        const wing = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.64, 0.035, 10), m.marsDustSolar);
        wing.position.set(sx, 0.52, 0);
        wing.castShadow = true;
        group.add(wing);
      }

      // Ground-deployed SEIS Seismometer dome at [0.4, -0.2, 0.8] relative to center
      const seisDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        m.whitePaint
      );
      seisDome.position.set(0.4, 0.04, 0.8);
      seisDome.castShadow = true;
      group.add(seisDome);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.8), m.copper);
      arm.position.set(0.52, 0.65, 0.1);
      arm.rotation.set(-0.3, 0.35, 0);
      group.add(arm);
      break;
    }

    case 'ingenuity-helicopter': {
      const fuselage = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.32), m.kaptonGold);
      fuselage.position.y = 0.36;
      fuselage.castShadow = true;
      group.add(fuselage);

      addTripodLegs(group, 0.16, 0.44, 0.34, m.titaniumDark, m.charcoal, 4);

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.62, 12), m.titaniumDark);
      mast.position.y = 0.68;
      group.add(mast);

      // Twin counter-rotating carbon blades
      const upperBlade = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.02, 0.12), m.charcoal);
      upperBlade.position.y = 0.86;
      upperBlade.rotation.y = 0.45;
      upperBlade.castShadow = true;
      group.add(upperBlade);

      const lowerBlade = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.02, 0.12), m.charcoal);
      lowerBlade.position.y = 0.74;
      lowerBlade.rotation.y = -0.65;
      lowerBlade.castShadow = true;
      group.add(lowerBlade);

      // Top solar charging panel
      const solar = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.03, 0.24), m.solarBlue);
      solar.position.y = 0.98;
      solar.castShadow = true;
      group.add(solar);
      break;
    }

    case 'dawn-spacecraft': {
      const bus = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.72, 0.55), m.kaptonGold);
      bus.position.y = 0.72;
      bus.castShadow = true;
      group.add(bus);

      for (const sx of [-1.25, 1.25]) {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.04, 0.52), m.solarBlue);
        wing.position.set(sx, 0.72, 0);
        wing.castShadow = true;
        group.add(wing);
      }

      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.12, 20, 1, true), m.whitePaint);
      dish.position.set(0, 1.15, 0.32);
      dish.rotation.x = Math.PI * 0.65;
      group.add(dish);

      const ion = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.18, 16), m.ionGlow);
      ion.position.set(0, 0.34, -0.35);
      ion.rotation.x = Math.PI / 2;
      group.add(ion);
      break;
    }

    case 'near-shoemaker': {
      // Rocky Eros patch underneath
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.25, 1), m.regolithGray);
      rock.scale.set(1.5, 0.22, 1.3);
      rock.position.y = 0.02;
      rock.receiveShadow = true;
      group.add(rock);

      const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.55, 8), m.kaptonGold);
      bus.position.y = 0.54;
      bus.castShadow = true;
      group.add(bus);

      // 4 radial solar wings
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.035, 0.42), m.solarBlue);
        wing.position.set(Math.cos(a) * 0.78, 0.56, Math.sin(a) * 0.78);
        wing.rotation.y = -a;
        wing.castShadow = true;
        group.add(wing);
      }

      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.14, 20, 1, true), m.whitePaint);
      dish.position.y = 0.9;
      dish.rotation.x = Math.PI;
      group.add(dish);
      break;
    }

    case 'kepler-telescope': {
      const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.58, 0.52, 6), m.kaptonGold);
      bus.position.y = 0.48;
      bus.castShadow = true;
      group.add(bus);

      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 1.08, 16), m.whitePaint);
      barrel.position.set(0, 1.15, 0.05);
      barrel.rotation.x = 0.18;
      barrel.castShadow = true;
      group.add(barrel);

      const aperture = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.05, 16), m.glassOptic);
      aperture.position.set(0, 1.68, 0.14);
      aperture.rotation.x = 0.18;
      group.add(aperture);

      const solarWing = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.95, 0.04), m.solarBlue);
      solarWing.position.set(0.68, 0.85, -0.52);
      solarWing.rotation.y = 0.42;
      solarWing.castShadow = true;
      group.add(solarWing);
      break;
    }

    case 'pioneer-probes':
    default: {
      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.28, 24, 1, true), m.whitePaint);
      dish.position.y = 0.85;
      dish.rotation.x = Math.PI;
      dish.castShadow = true;
      group.add(dish);

      const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.34, 6), m.kaptonGold);
      bus.position.y = 0.62;
      group.add(bus);

      const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.02), m.kaptonGold);
      plaque.position.set(0.35, 0.62, 0.32);
      group.add(plaque);

      // RTG trusses
      for (const a of [0.35, -0.35]) {
        const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.35, 8), m.aluminum);
        boom.rotation.z = Math.PI / 2;
        boom.rotation.y = a;
        boom.position.set(-0.75, 0.62, Math.sin(a) * 0.4);
        group.add(boom);

        const rtg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.28, 10), m.charcoal);
        rtg.rotation.z = Math.PI / 2;
        rtg.position.set(-1.35, 0.62, Math.sin(a) * 0.72);
        group.add(rtg);
      }
      break;
    }
  }

  return group;
}
