import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import type { Exhibit } from '../data/exhibits';
import type { ExhibitDocumentaryScript } from '../data/missionDocumentaries';
import { buildProceduralSpacecraft } from './SpacecraftModels';
import {
  createContactShadowTexture,
  createMarsSurfaceTexture,
  createMoonSurfaceTexture,
  createStudioEnvironment,
  detectSoftwareWebGL,
  disposeObject3D,
} from './webglUtils';

export interface TelemetrySnapshot {
  time: number;
  sceneIndex: 0 | 1 | 2 | 3;
  powerRatio: number; // 0..1
  signalRatio: number; // 0..1
  altitudeLabel: string;
}

export interface DocumentaryStageHandle {
  renderAtTime: (t: number) => void;
}

interface DocumentaryStageCanvasProps {
  exhibit: Exhibit;
  script: ExhibitDocumentaryScript;
  playing: boolean;
  speed: number;
  reducedMotion: boolean;
  isVisible: boolean;
  initialTime?: number;
  onTimeAdvance: (nextTime: number, snapshot: TelemetrySnapshot, finished: boolean) => void;
  onWebGLStatusChange?: (supported: boolean) => void;
}

// Pre-allocated math helpers (Zero per-frame GC inside render loop)
const _camPos = new THREE.Vector3();
const _camLook = new THREE.Vector3();
const _tmpVec = new THREE.Vector3();
const _colorA = new THREE.Color();
const _colorB = new THREE.Color();
const _skyCleanMars = new THREE.Color(0x160d0b);
const _skyDustyMars = new THREE.Color(0x2d170f);
const _skyStormMars = new THREE.Color(0x1b0b07);
const _skyOrbitMars = new THREE.Color(0x080a10);
const _skyMoon = new THREE.Color(0x07090f);
const _skySpace = new THREE.Color(0x050811);
const _solarClean = new THREE.Color(0x194b8c);
const _solarDust = new THREE.Color(0x7c4a32);
const _frostWhite = new THREE.Color(0xdbeafe);

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0 || 1));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

function seededRand(seed: number): number {
  const s = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

export const DocumentaryStageCanvas = forwardRef<DocumentaryStageHandle, DocumentaryStageCanvasProps>(
  function DocumentaryStageCanvas(
    {
      exhibit,
      script,
      playing,
      speed,
      reducedMotion,
      isVisible,
      initialTime = 0,
      onTimeAdvance,
      onWebGLStatusChange,
    },
    ref
  ) {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const [webglUnavailable, setWebglUnavailable] = useState(false);

    // Mutable refs so React UI changes never tear down or reset WebGL
    const timeRef = useRef(initialTime);
    const playingRef = useRef(playing);
    playingRef.current = playing;
    const speedRef = useRef(speed);
    speedRef.current = speed;
    const reducedRef = useRef(reducedMotion);
    reducedRef.current = reducedMotion;
    const visibleRef = useRef(isVisible);
    visibleRef.current = isVisible;
    const callbackRef = useRef(onTimeAdvance);
    callbackRef.current = onTimeAdvance;

    const evaluatorRef = useRef<((t: number) => void) | null>(null);
    const loopTriggerRef = useRef<(() => void) | null>(null);

    useImperativeHandle(ref, () => ({
      renderAtTime: (t: number) => {
        timeRef.current = Math.max(0, Math.min(script.duration, t));
        evaluatorRef.current?.(timeRef.current);
      },
    }));

    useEffect(() => {
      loopTriggerRef.current?.();
    }, [playing, isVisible]);

    useEffect(() => {
      timeRef.current = initialTime;
    }, [exhibit.id, script.duration, initialTime]);

    useEffect(() => {
      if (!webglUnavailable) return;
      let raf = 0;
      let last = performance.now();
      const step = (now: number) => {
        if (!playingRef.current || !visibleRef.current) {
          last = now;
          raf = requestAnimationFrame(step);
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.08);
        last = now;
        const nextT = Math.min(script.duration, timeRef.current + dt * speedRef.current);
        timeRef.current = nextT;
        const sIdx = (nextT < 10 ? 0 : nextT < 20 ? 1 : nextT < 30 ? 2 : 3) as 0 | 1 | 2 | 3;
        callbackRef.current(
          nextT,
          {
            time: nextT,
            sceneIndex: sIdx,
            powerRatio: sIdx === 2 ? Math.max(0, 1 - (nextT - 20) / 10) : sIdx === 3 ? 0 : 0.9,
            signalRatio: sIdx === 2 ? Math.max(0, 1 - (nextT - 20) / 10) : sIdx === 3 ? 0 : 1,
            altitudeLabel: script.scenes[sIdx].title,
          },
          nextT >= script.duration
        );
        if (nextT < script.duration) {
          raf = requestAnimationFrame(step);
        }
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [webglUnavailable, script]);

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;
      timeRef.current = initialTime;

      let renderer: THREE.WebGLRenderer;
      try {
        const probeCanvas = document.createElement('canvas');
        const ctx = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!ctx) {
          setWebglUnavailable(true);
          onWebGLStatusChange?.(false);
          return;
        }
        ctx.getExtension('WEBGL_lose_context')?.loseContext();

        const isSoftwareGl = detectSoftwareWebGL();
        renderer = new THREE.WebGLRenderer({
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = !isSoftwareGl;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      } catch {
        setWebglUnavailable(true);
        onWebGLStatusChange?.(false);
        return;
      }

      setWebglUnavailable(false);
      onWebGLStatusChange?.(true);

      const isSoftwareGl = detectSoftwareWebGL();
      const width = container.clientWidth || 720;
      const height = container.clientHeight || 460;
      renderer.setSize(width, height);
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const initialBg =
        exhibit.targetBody === 'mars'
          ? _skyCleanMars.clone()
          : exhibit.targetBody === 'moon'
            ? _skyMoon.clone()
            : _skySpace.clone();
      scene.background = initialBg;
      const fog = new THREE.FogExp2(initialBg.getHex(), 0.025);
      scene.fog = fog;

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 180);
      camera.position.set(4.5, 2.8, 5.2);

      const envTex = createStudioEnvironment(renderer);
      scene.environment = envTex;

      // Warm / cool 3-point lighting rig
      const keyColor =
        exhibit.targetBody === 'mars'
          ? 0xffdfb8
          : exhibit.targetBody === 'moon'
            ? 0xfef3c7
            : 0xe0f2fe;
      const keyLight = new THREE.DirectionalLight(keyColor, 2.5);
      keyLight.position.set(6, 9, 5);
      keyLight.castShadow = !isSoftwareGl;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -4.5;
      keyLight.shadow.camera.right = 4.5;
      keyLight.shadow.camera.top = 4.5;
      keyLight.shadow.camera.bottom = -4.5;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      scene.add(keyLight);

      const hemiLight = new THREE.HemisphereLight(
        exhibit.targetBody === 'mars' ? 0xc27858 : 0x94a3b8,
        0x090b10,
        0.85
      );
      scene.add(hemiLight);

      const rimLight = new THREE.DirectionalLight(
        exhibit.targetBody === 'deep-space' ? 0x67b7d1 : 0xfde68a,
        1.15
      );
      rimLight.position.set(-5, 4, -5);
      scene.add(rimLight);

      // 1. Starfield
      const starCount = 750;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const theta = seededRand(i * 3 + 1) * Math.PI * 2;
        const phi = Math.acos(2 * seededRand(i * 3 + 2) - 1);
        const r = 42 + seededRand(i * 3 + 3) * 32;
        starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = r * Math.cos(phi);
        starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xe2e8f0,
        size: 0.19,
        transparent: true,
        opacity: 0.85,
        fog: false,
      });
      const starPoints = new THREE.Points(starGeo, starMat);
      scene.add(starPoints);

      // 2. Procedural 3D Planet Globe (Moon / Mars / Secondary Deep-Space Bodies)
      const planetGroup = new THREE.Group();
      scene.add(planetGroup);

      let planetTex: THREE.CanvasTexture | null = null;
      const isDeepSpace = exhibit.targetBody === 'deep-space';
      const planetMat = new THREE.MeshStandardMaterial({
        roughness: 0.88,
        metalness: 0.05,
        color: isDeepSpace ? 0x8b95a5 : 0xffffff,
      });
      if (exhibit.targetBody === 'mars') {
        planetTex = createMarsSurfaceTexture(renderer);
        planetMat.map = planetTex;
      } else if (exhibit.targetBody === 'moon') {
        planetTex = createMoonSurfaceTexture(renderer);
        planetMat.map = planetTex;
      }

      const planetMesh = new THREE.Mesh(
        new THREE.SphereGeometry(4.4, 48, 36),
        planetMat
      );
      planetGroup.add(planetMesh);

      // Atmosphere / orbital halo ring around planet
      const atmoRing = new THREE.Mesh(
        new THREE.SphereGeometry(4.54, 40, 28),
        new THREE.MeshBasicMaterial({
          color: exhibit.targetBody === 'mars' ? 0xd97757 : 0x94a3b8,
          transparent: true,
          opacity: exhibit.targetBody === 'mars' ? 0.14 : 0.05,
          side: THREE.BackSide,
          depthWrite: false,
        })
      );
      if (!isDeepSpace) planetGroup.add(atmoRing);

      // Site marker pin on planetary globe for Scene 4 Legacy reveal
      const sitePinGroup = new THREE.Group();
      const pinBeacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b })
      );
      const pinRing = new THREE.Mesh(
        new THREE.RingGeometry(0.22, 0.3, 32),
        new THREE.MeshBasicMaterial({
          color: 0xfde68a,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        })
      );
      pinRing.rotation.x = Math.PI / 2;
      sitePinGroup.add(pinBeacon, pinRing);
      sitePinGroup.position.set(0, 4.46, 0);
      planetGroup.add(sitePinGroup);

      // 3. Surface Terrain Platform (Moon / Mars)
      const terrainGroup = new THREE.Group();
      scene.add(terrainGroup);

      const terrainMat = new THREE.MeshStandardMaterial({
        color: exhibit.targetBody === 'mars' ? 0x7c3f2c : 0x454952,
        roughness: 0.94,
        metalness: 0.04,
        transparent: true,
        opacity: 1,
      });

      const terrainGeo = new THREE.CylinderGeometry(8.5, 9.2, 0.45, 56, 4);
      // Add subtle natural topographic undulation to terrain vertices
      const tPos = terrainGeo.attributes.position;
      for (let i = 0; i < tPos.count; i++) {
        const vx = tPos.getX(i);
        const vy = tPos.getY(i);
        const vz = tPos.getZ(i);
        if (vy > 0.1) {
          const dist = Math.hypot(vx, vz);
          const mound =
            dist > 1.8
              ? Math.sin(vx * 0.7) * Math.cos(vz * 0.7) * 0.16 +
                (seededRand(i) - 0.5) * 0.04
              : 0;
          tPos.setY(i, vy + mound);
        }
      }
      terrainGeo.computeVertexNormals();
      const terrainDisc = new THREE.Mesh(terrainGeo, terrainMat);
      terrainDisc.position.y = -0.225;
      terrainDisc.receiveShadow = true;
      if (!isDeepSpace) terrainGroup.add(terrainDisc);

      // Scattered instanced rocks on planetary surface (zero single primitives!)
      const rockCount = 34;
      const rockInst = new THREE.InstancedMesh(
        new THREE.DodecahedronGeometry(0.18, 0),
        new THREE.MeshStandardMaterial({
          color: exhibit.targetBody === 'mars' ? 0x5c2e20 : 0x525763,
          roughness: 0.9,
          metalness: 0.05,
        }),
        rockCount
      );
      const dummy = new THREE.Object3D();
      for (let i = 0; i < rockCount; i++) {
        const ang = seededRand(i * 5 + 1) * Math.PI * 2;
        const dist = 2.0 + seededRand(i * 5 + 2) * 5.2;
        const sc = 0.4 + seededRand(i * 5 + 3) * 1.4;
        dummy.position.set(Math.cos(ang) * dist, 0.02, Math.sin(ang) * dist);
        dummy.rotation.set(
          seededRand(i + 1) * 2,
          seededRand(i + 2) * 3,
          seededRand(i + 3) * 2
        );
        dummy.scale.set(sc * 1.2, sc * 0.55, sc);
        dummy.updateMatrix();
        rockInst.setMatrixAt(i, dummy.matrix);
      }
      rockInst.receiveShadow = true;
      rockInst.castShadow = true;
      if (!isDeepSpace) terrainGroup.add(rockInst);

      const shadowTex = createContactShadowTexture();
      const contactShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(4.2, 4.2),
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          depthWrite: false,
          opacity: 0.55,
        })
      );
      contactShadow.rotation.x = -Math.PI / 2;
      contactShadow.position.y = 0.015;
      if (!isDeepSpace) terrainGroup.add(contactShadow);

      // 4. Shared Atmospheric / Touchdown Dust Particle System
      const dustCount = 260;
      const dustGeo = new THREE.BufferGeometry();
      const dustPositions = new Float32Array(dustCount * 3);
      const dustSeeds: number[] = [];
      for (let i = 0; i < dustCount; i++) {
        dustSeeds.push(
          seededRand(i * 7 + 1),
          seededRand(i * 7 + 2),
          seededRand(i * 7 + 3)
        );
      }
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
      const dustMat = new THREE.PointsMaterial({
        color: exhibit.targetBody === 'mars' ? 0xd48361 : 0xcbd5e1,
        size: 0.07,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const dustPoints = new THREE.Points(dustGeo, dustMat);
      scene.add(dustPoints);

      // 5. Radio Signal Wave Rings (Expanding skyward arcs that fade away in Scene 3)
      const signalGroup = new THREE.Group();
      scene.add(signalGroup);
      const signalRings: THREE.Mesh[] = [];
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.45, 0.02, 8, 36),
          new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0,
            depthWrite: false,
          })
        );
        ring.rotation.x = Math.PI / 2;
        signalRings.push(ring);
        signalGroup.add(ring);
      }

      // 6. Archetype-Specific Articulated 3D Rigs
      const heroRoot = new THREE.Group();
      scene.add(heroRoot);

      // --- INSIGHT DEDICATED ARTICULATED RIG ---
      const insightParts: {
        landerGroup: THREE.Group;
        heatShield: THREE.Mesh;
        parachuteGroup: THREE.Group;
        plasmaCone: THREE.Mesh;
        thrusterFlames: THREE.Group;
        leftWingPivot: THREE.Group;
        rightWingPivot: THREE.Group;
        wingMatLeft: THREE.MeshStandardMaterial;
        wingMatRight: THREE.MeshStandardMaterial;
        armShoulder: THREE.Group;
        armElbow: THREE.Group;
        seisGroup: THREE.Group;
        cutawayGroup: THREE.Group;
        seismicWaves: THREE.Mesh[];
      } | null =
        script.archetype === 'insight'
          ? (() => {
              const landerGroup = new THREE.Group();
              heroRoot.add(landerGroup);

              const kapton = new THREE.MeshStandardMaterial({
                color: 0xd4a33b,
                metalness: 0.88,
                roughness: 0.25,
              });
              const aluminum = new THREE.MeshStandardMaterial({
                color: 0xcbd5e1,
                metalness: 0.8,
                roughness: 0.3,
              });
              const darkTi = new THREE.MeshStandardMaterial({
                color: 0x3b4252,
                metalness: 0.75,
                roughness: 0.42,
              });
              const whiteShell = new THREE.MeshStandardMaterial({
                color: 0xf1f5f9,
                metalness: 0.15,
                roughness: 0.45,
              });
              const copperMat = new THREE.MeshStandardMaterial({
                color: 0xb87333,
                metalness: 0.85,
                roughness: 0.28,
              });

              // Octagonal main deck
              const deck = new THREE.Mesh(
                new THREE.CylinderGeometry(0.62, 0.58, 0.24, 8),
                kapton
              );
              deck.position.y = 0.54;
              deck.castShadow = true;
              landerGroup.add(deck);

              const electronicsRim = new THREE.Mesh(
                new THREE.CylinderGeometry(0.5, 0.5, 0.14, 12),
                darkTi
              );
              electronicsRim.position.y = 0.72;
              landerGroup.add(electronicsRim);

              // High-gain & UHF antennas
              const uhfMast = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.025, 0.55, 8),
                aluminum
              );
              uhfMast.position.set(-0.26, 0.96, -0.2);
              landerGroup.add(uhfMast);

              // 3 Shock-absorbing tripod legs
              for (let i = 0; i < 3; i++) {
                const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
                const s = new THREE.Vector3(Math.cos(a) * 0.48, 0.46, Math.sin(a) * 0.48);
                const e = new THREE.Vector3(Math.cos(a) * 0.9, 0.04, Math.sin(a) * 0.9);
                const mid = s.clone().add(e).multiplyScalar(0.5);
                const strut = new THREE.Mesh(
                  new THREE.CylinderGeometry(0.035, 0.035, s.distanceTo(e), 10),
                  aluminum
                );
                strut.position.copy(mid);
                strut.quaternion.setFromUnitVectors(
                  new THREE.Vector3(0, 1, 0),
                  e.clone().sub(s).normalize()
                );
                strut.castShadow = true;
                landerGroup.add(strut);

                const pad = new THREE.Mesh(
                  new THREE.CylinderGeometry(0.14, 0.17, 0.06, 16),
                  darkTi
                );
                pad.position.set(e.x, 0.03, e.z);
                pad.castShadow = true;
                landerGroup.add(pad);
              }

              // Twin articulated 6m circular UltraFlex solar wings
              const wingMatLeft = new THREE.MeshStandardMaterial({
                color: _solarClean.clone(),
                metalness: 0.55,
                roughness: 0.25,
              });
              const wingMatRight = wingMatLeft.clone();

              const leftWingPivot = new THREE.Group();
              leftWingPivot.position.set(-0.56, 0.56, 0);
              const leftDisc = new THREE.Mesh(
                new THREE.CylinderGeometry(0.66, 0.66, 0.035, 16),
                wingMatLeft
              );
              leftDisc.position.set(-0.68, 0, 0);
              leftDisc.castShadow = true;
              const leftArm = new THREE.Mesh(
                new THREE.BoxGeometry(0.68, 0.04, 0.08),
                aluminum
              );
              leftArm.position.set(-0.34, 0.02, 0);
              leftWingPivot.add(leftDisc, leftArm);
              landerGroup.add(leftWingPivot);

              const rightWingPivot = new THREE.Group();
              rightWingPivot.position.set(0.56, 0.56, 0);
              const rightDisc = new THREE.Mesh(
                new THREE.CylinderGeometry(0.66, 0.66, 0.035, 16),
                wingMatRight
              );
              rightDisc.position.set(0.68, 0, 0);
              rightDisc.castShadow = true;
              const rightArm = new THREE.Mesh(
                new THREE.BoxGeometry(0.68, 0.04, 0.08),
                aluminum
              );
              rightArm.position.set(0.34, 0.02, 0);
              rightWingPivot.add(rightDisc, rightArm);
              landerGroup.add(rightWingPivot);

              // Articulated 2-joint Robotic Arm (IDA)
              const armShoulder = new THREE.Group();
              armShoulder.position.set(0.18, 0.72, 0.42);
              const upperArm = new THREE.Mesh(
                new THREE.BoxGeometry(0.06, 0.06, 0.55),
                copperMat
              );
              upperArm.position.set(0, 0, 0.27);
              armShoulder.add(upperArm);

              const armElbow = new THREE.Group();
              armElbow.position.set(0, 0, 0.54);
              const foreArm = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.05, 0.46),
                aluminum
              );
              foreArm.position.set(0, 0, 0.22);
              armElbow.add(foreArm);
              armShoulder.add(armElbow);
              landerGroup.add(armShoulder);

              // SEIS Seismometer Dome (moves from deck to Mars soil)
              const seisGroup = new THREE.Group();
              const seisDome = new THREE.Mesh(
                new THREE.SphereGeometry(0.24, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
                whiteShell
              );
              const seisSkirt = new THREE.Mesh(
                new THREE.CylinderGeometry(0.26, 0.28, 0.06, 18),
                kapton
              );
              seisSkirt.position.y = 0.02;
              seisGroup.add(seisDome, seisSkirt);
              seisGroup.castShadow = true;
              heroRoot.add(seisGroup);

              // Entry Heat Shield (detaches below lander during parachute phase)
              const heatShield = new THREE.Mesh(
                new THREE.ConeGeometry(1.18, 0.36, 28),
                new THREE.MeshStandardMaterial({
                  color: 0x3a2a24,
                  roughness: 0.7,
                  metalness: 0.15,
                  transparent: true,
                  opacity: 1,
                })
              );
              heatShield.rotation.x = Math.PI;
              heatShield.position.y = -0.15;
              landerGroup.add(heatShield);

              // Plasma entry glow cone
              const plasmaCone = new THREE.Mesh(
                new THREE.ConeGeometry(1.42, 1.35, 24, 1, true),
                new THREE.MeshBasicMaterial({
                  color: 0xf97316,
                  transparent: true,
                  opacity: 0,
                  side: THREE.DoubleSide,
                  depthWrite: false,
                })
              );
              plasmaCone.rotation.x = Math.PI;
              plasmaCone.position.y = -0.2;
              landerGroup.add(plasmaCone);

              // Supersonic Parachute Canopy + Suspension Riser Lines
              const parachuteGroup = new THREE.Group();
              parachuteGroup.position.set(0, 2.2, 0);
              const canopy = new THREE.Mesh(
                new THREE.SphereGeometry(1.35, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.48),
                new THREE.MeshStandardMaterial({
                  color: 0xea580c,
                  roughness: 0.65,
                  side: THREE.DoubleSide,
                  transparent: true,
                  opacity: 0.94,
                })
              );
              canopy.position.y = 0.5;
              parachuteGroup.add(canopy);
              const riserMat = new THREE.LineBasicMaterial({
                color: 0xe2e8f0,
                transparent: true,
                opacity: 0.7,
              });
              for (let i = 0; i < 6; i++) {
                const a = (i / 6) * Math.PI * 2;
                const lGeo = new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(0, -1.35, 0),
                  new THREE.Vector3(Math.cos(a) * 1.25, 0.55, Math.sin(a) * 1.25),
                ]);
                parachuteGroup.add(new THREE.Line(lGeo, riserMat));
              }
              landerGroup.add(parachuteGroup);

              // 3 Retro-Rocket Plume Cones
              const thrusterFlames = new THREE.Group();
              const flameMat = new THREE.MeshBasicMaterial({
                color: 0x93c5fd,
                transparent: true,
                opacity: 0,
                depthWrite: false,
              });
              for (let i = 0; i < 3; i++) {
                const a = (i / 3) * Math.PI * 2;
                const flame = new THREE.Mesh(
                  new THREE.ConeGeometry(0.11, 0.65, 12),
                  flameMat
                );
                flame.position.set(Math.cos(a) * 0.35, 0.02, Math.sin(a) * 0.35);
                flame.rotation.x = Math.PI;
                thrusterFlames.add(flame);
              }
              landerGroup.add(thrusterFlames);

              // Mars Subterranean Cutaway Cross-Section (Crust / Mantle / Liquid Core + Seismic Waves)
              const cutawayGroup = new THREE.Group();
              cutawayGroup.position.set(0.35, -1.65, 0.45);
              const mantle = new THREE.Mesh(
                new THREE.SphereGeometry(2.1, 28, 20, 0, Math.PI, 0, Math.PI * 0.72),
                new THREE.MeshStandardMaterial({
                  color: 0x8a3320,
                  roughness: 0.78,
                  side: THREE.DoubleSide,
                  transparent: true,
                  opacity: 0,
                })
              );
              mantle.rotation.x = Math.PI / 2;
              const core = new THREE.Mesh(
                new THREE.SphereGeometry(0.92, 24, 18),
                new THREE.MeshStandardMaterial({
                  color: 0xf59e0b,
                  emissive: 0xd97706,
                  emissiveIntensity: 0.85,
                  roughness: 0.3,
                  transparent: true,
                  opacity: 0,
                })
              );
              core.position.y = -0.05;
              cutawayGroup.add(mantle, core);

              const seismicWaves: THREE.Mesh[] = [];
              for (let i = 0; i < 4; i++) {
                const wave = new THREE.Mesh(
                  new THREE.TorusGeometry(0.55 + i * 0.38, 0.032, 10, 44),
                  new THREE.MeshBasicMaterial({
                    color: 0x38bdf8,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                  })
                );
                wave.rotation.x = Math.PI / 2;
                wave.position.set(0.15, 0.25, 0.25);
                seismicWaves.push(wave);
                cutawayGroup.add(wave);
              }
              scene.add(cutawayGroup);

              return {
                landerGroup,
                heatShield,
                parachuteGroup,
                plasmaCone,
                thrusterFlames,
                leftWingPivot,
                rightWingPivot,
                wingMatLeft,
                wingMatRight,
                armShoulder,
                armElbow,
                seisGroup,
                cutawayGroup,
                seismicWaves,
              };
            })()
          : null;

      // --- REUSABLE PROCEDURAL HERO RIG FOR ALL OTHER 15 EXHIBITS ---
      const genericParts: {
        craftGroup: THREE.Group;
        upperStageGroup: THREE.Group | null;
        extraPropGroup: THREE.Group | null;
        laserBeam: THREE.Mesh | null;
        ionPlume: THREE.Mesh | null;
        frostShell: THREE.Mesh | null;
        erosBody: THREE.Mesh | null;
        planetPartner: THREE.Mesh | null;
        exoStar: THREE.Mesh | null;
        exoPlanet: THREE.Mesh | null;
      } | null =
        script.archetype !== 'insight'
          ? (() => {
              const craftGroup = buildProceduralSpacecraft(exhibit.id);
              heroRoot.add(craftGroup);

              let upperStageGroup: THREE.Group | null = null;
              if (script.archetype === 'apollo-lm') {
                upperStageGroup = new THREE.Group();
                const cabin = new THREE.Mesh(
                  new THREE.CylinderGeometry(0.62, 0.68, 0.72, 8),
                  new THREE.MeshStandardMaterial({
                    color: 0xdbe2ea,
                    metalness: 0.75,
                    roughness: 0.32,
                  })
                );
                cabin.position.y = 1.56;
                cabin.castShadow = true;
                const ascentBell = new THREE.Mesh(
                  new THREE.ConeGeometry(0.24, 0.3, 16),
                  new THREE.MeshStandardMaterial({ color: 0x1e222b, metalness: 0.5, roughness: 0.5 })
                );
                ascentBell.position.y = 1.24;
                const ascentFlame = new THREE.Mesh(
                  new THREE.ConeGeometry(0.28, 1.1, 14),
                  new THREE.MeshBasicMaterial({
                    color: 0xfbbf24,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                  })
                );
                ascentFlame.position.y = 0.75;
                ascentFlame.rotation.x = Math.PI;
                ascentFlame.name = 'ascentFlame';
                upperStageGroup.add(cabin, ascentBell, ascentFlame);
                heroRoot.add(upperStageGroup);
              }

              let laserBeam: THREE.Mesh | null = null;
              if (script.archetype === 'alsep' || script.archetype === 'lunokhod') {
                laserBeam = new THREE.Mesh(
                  new THREE.CylinderGeometry(0.025, 0.025, 16, 8),
                  new THREE.MeshBasicMaterial({
                    color: 0x34d399,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                  })
                );
                laserBeam.position.set(0.85, 8.2, 0.55);
                heroRoot.add(laserBeam);
              }

              let ionPlume: THREE.Mesh | null = null;
              if (script.archetype === 'dawn' || script.archetype === 'apollo-lm') {
                ionPlume = new THREE.Mesh(
                  new THREE.ConeGeometry(0.22, 1.4, 14),
                  new THREE.MeshBasicMaterial({
                    color: script.archetype === 'dawn' ? 0x38bdf8 : 0xfbbf24,
                    transparent: true,
                    opacity: 0,
                    depthWrite: false,
                  })
                );
                ionPlume.rotation.x = script.archetype === 'dawn' ? -Math.PI / 2 : Math.PI;
                ionPlume.position.set(
                  0,
                  script.archetype === 'dawn' ? 0.34 : -0.35,
                  script.archetype === 'dawn' ? -1.1 : 0
                );
                craftGroup.add(ionPlume);
              }

              let frostShell: THREE.Mesh | null = null;
              if (script.archetype === 'phoenix') {
                frostShell = new THREE.Mesh(
                  new THREE.CylinderGeometry(1.85, 1.85, 0.09, 24),
                  new THREE.MeshStandardMaterial({
                    color: _frostWhite,
                    roughness: 0.4,
                    metalness: 0.1,
                    transparent: true,
                    opacity: 0,
                  })
                );
                frostShell.position.y = 0.51;
                craftGroup.add(frostShell);
              }

              let erosBody: THREE.Mesh | null = null;
              if (script.archetype === 'near') {
                const eGeo = new THREE.DodecahedronGeometry(2.3, 1);
                eGeo.scale(1.8, 0.65, 0.9);
                erosBody = new THREE.Mesh(
                  eGeo,
                  new THREE.MeshStandardMaterial({ color: 0x5c5f66, roughness: 0.92, metalness: 0.08 })
                );
                erosBody.position.set(0, -1.6, 0);
                scene.add(erosBody);
              }

              let planetPartner: THREE.Mesh | null = null;
              if (script.archetype === 'dawn' || script.archetype === 'pioneer') {
                planetPartner = new THREE.Mesh(
                  new THREE.SphereGeometry(2.2, 32, 24),
                  new THREE.MeshStandardMaterial({
                    color: script.archetype === 'dawn' ? 0x7c746c : 0xd6a76c,
                    roughness: 0.78,
                  })
                );
                planetPartner.position.set(-7, 1.2, -9);
                scene.add(planetPartner);

                if (script.archetype === 'pioneer') {
                  const saturnRing = new THREE.Mesh(
                    new THREE.RingGeometry(2.8, 4.1, 40),
                    new THREE.MeshBasicMaterial({
                      color: 0xe2c799,
                      side: THREE.DoubleSide,
                      transparent: true,
                      opacity: 0.55,
                    })
                  );
                  saturnRing.rotation.x = Math.PI * 0.42;
                  planetPartner.add(saturnRing);
                }
              }

              let exoStar: THREE.Mesh | null = null;
              let exoPlanet: THREE.Mesh | null = null;
              if (script.archetype === 'kepler') {
                exoStar = new THREE.Mesh(
                  new THREE.SphereGeometry(1.7, 28, 20),
                  new THREE.MeshBasicMaterial({ color: 0xfde68a })
                );
                exoStar.position.set(0, 1.4, -14);
                scene.add(exoStar);

                exoPlanet = new THREE.Mesh(
                  new THREE.SphereGeometry(0.28, 20, 16),
                  new THREE.MeshBasicMaterial({ color: 0x090b10 })
                );
                exoPlanet.position.set(-2.5, 1.4, -11.5);
                scene.add(exoPlanet);
              }

              let extraPropGroup: THREE.Group | null = null;
              if (script.archetype === 'ingenuity') {
                // Find rotor blades in Ingenuity procedural model (boxes near y=0.86 and y=0.74)
                extraPropGroup = craftGroup;
              }

              return {
                craftGroup,
                upperStageGroup,
                extraPropGroup,
                laserBeam,
                ionPlume,
                frostShell,
                erosBody,
                planetPartner,
                exoStar,
                exoPlanet,
              };
            })()
          : null;

      // =====================================================================
      // DETERMINISTIC EVALUATION ENGINE: f(t) -> COMPLETE 3D WORLD STATE
      // =====================================================================
      const evaluateAndRender = (t: number) => {
        const dur = script.duration;
        const clampedT = Math.max(0, Math.min(dur, t));
        const sceneIndex = (
          clampedT < 10 ? 0 : clampedT < 20 ? 1 : clampedT < 30 ? 2 : 3
        ) as 0 | 1 | 2 | 3;

        let powerRatio = 1.0;
        let signalRatio = 1.0;
        let altitudeLabel = 'Surface';

        // Starfield gentle drift proportional to time
        starPoints.rotation.y = clampedT * 0.015;

        if (script.archetype === 'insight' && insightParts) {
          const {
            landerGroup,
            heatShield,
            parachuteGroup,
            plasmaCone,
            thrusterFlames,
            leftWingPivot,
            rightWingPivot,
            wingMatLeft,
            wingMatRight,
            armShoulder,
            armElbow,
            seisGroup,
            cutawayGroup,
            seismicWaves,
          } = insightParts;

          // --- SCENE 1 (0..10s): ARRIVAL AT MARS ---
          // --- SCENE 2 (10..20s): A MISSION BEGINS ---
          // --- SCENE 3 (20..30s): THE FADING POWER ---
          // --- SCENE 4 (30..40s): THE LEGACY ---

          if (clampedT < 10) {
            const p1 = clampedT / 10;
            altitudeLabel =
              clampedT < 3.4
                ? 'Atmospheric Entry (Mach 15 -> 2)'
                : clampedT < 6.5
                  ? 'Supersonic Parachute Descent'
                  : 'Retro-Rocket Touchdown';
            powerRatio = 0.2;
            signalRatio = 0.65;

            // Lander descends from orbital altitude y=6.5 down to y=0.0 at t=9.4s
            const descendP = smoothstep(0, 9.4, clampedT);
            landerGroup.position.set(
              (1 - descendP) * -1.4,
              lerp(6.4, 0, descendP),
              (1 - descendP) * -0.8
            );
            landerGroup.rotation.z =
              clampedT < 3.4
                ? 0.35 * (1 - clampedT / 3.4)
                : clampedT < 6.5
                  ? Math.sin(clampedT * 3.2) * 0.11
                  : lerp(0.08 * Math.sin(clampedT * 3.2), 0, smoothstep(6.5, 9.2, clampedT));

            // Heat shield drops away at t=6.2s
            if (clampedT < 6.2) {
              heatShield.visible = true;
              heatShield.position.y = -0.15;
              (heatShield.material as THREE.MeshStandardMaterial).opacity = 1;
            } else {
              const dropP = smoothstep(6.2, 8.2, clampedT);
              heatShield.visible = dropP < 1;
              heatShield.position.y = -0.15 - dropP * 3.5;
              (heatShield.material as THREE.MeshStandardMaterial).opacity = 1 - dropP;
            }

            // Plasma cone glows 0..3.6s
            const plasmaIntensity =
              clampedT < 3.6 ? Math.sin((clampedT / 3.6) * Math.PI) * 0.72 : 0;
            (plasmaCone.material as THREE.MeshBasicMaterial).opacity = plasmaIntensity;
            plasmaCone.visible = plasmaIntensity > 0.01;

            // Parachute deploys 3.4..6.5s then releases upward
            if (clampedT < 3.4) {
              parachuteGroup.visible = false;
            } else if (clampedT < 6.6) {
              parachuteGroup.visible = true;
              const openP = smoothstep(3.4, 4.3, clampedT);
              parachuteGroup.scale.setScalar(lerp(0.08, 1.0, openP));
              parachuteGroup.position.set(0, 2.2, 0);
              parachuteGroup.rotation.z = Math.sin(clampedT * 2.6) * 0.08;
            } else {
              const sepP = smoothstep(6.6, 8.5, clampedT);
              parachuteGroup.visible = sepP < 1;
              parachuteGroup.position.set(-sepP * 2.2, 2.2 + sepP * 5.0, -sepP * 1.2);
            }

            // Retro-rocket flames fire 6.6..9.5s
            const fireP =
              clampedT >= 6.6 && clampedT <= 9.6
                ? Math.sin(((clampedT - 6.6) / 3.0) * Math.PI) * 0.85
                : 0;
            thrusterFlames.visible = fireP > 0.02;
            thrusterFlames.children.forEach((f, idx) => {
              const mesh = f as THREE.Mesh;
              (mesh.material as THREE.MeshBasicMaterial).opacity = fireP;
              mesh.scale.y = 0.7 + Math.sin(clampedT * 32 + idx) * 0.35;
            });

            // Wings stay stowed in Scene 1
            leftWingPivot.rotation.z = -1.42;
            rightWingPivot.rotation.z = 1.42;
            wingMatLeft.color.copy(_solarClean);
            wingMatRight.color.copy(_solarClean);

            // SEIS stowed on deck
            seisGroup.position.copy(landerGroup.position).add(_tmpVec.set(0.16, 0.66, 0.25));
            seisGroup.scale.setScalar(0.85);
            armShoulder.rotation.set(-0.5, 0, 0);
            armElbow.rotation.set(1.2, 0, 0);

            // Terrain rises smoothly to meet landing at t=9.4s
            const terrainAppear = smoothstep(4.2, 8.2, clampedT);
            terrainGroup.visible = terrainAppear > 0.02;
            terrainGroup.position.y = lerp(-5.5, 0, terrainAppear);
            terrainMat.opacity = terrainAppear;
            contactShadow.visible = clampedT > 7.5;

            // Planet visible beneath during early atmospheric entry
            planetGroup.visible = true;
            planetGroup.position.set(0, lerp(-5.6, -9.8, terrainAppear), -2.5);
            planetMesh.rotation.y = clampedT * 0.08;
            sitePinGroup.visible = false;

            // Hide cutaway & signals during EDL
            cutawayGroup.visible = false;
            signalGroup.visible = false;

            // Touchdown dust burst 8.8..10s
            const tdBurst = clampedT > 8.6 ? smoothstep(8.6, 10, clampedT) : 0;
            dustMat.opacity = tdBurst > 0 ? (1 - tdBurst) * 0.7 + 0.15 : 0.08;
            for (let i = 0; i < dustCount; i++) {
              const a = dustSeeds[i * 3] * Math.PI * 2;
              const r = tdBurst * (1.2 + dustSeeds[i * 3 + 1] * 3.4);
              dustPositions[i * 3] = Math.cos(a) * r;
              dustPositions[i * 3 + 1] = 0.08 + Math.sin(tdBurst * Math.PI) * dustSeeds[i * 3 + 2] * 0.9;
              dustPositions[i * 3 + 2] = Math.sin(a) * r;
            }
            dustGeo.attributes.position.needsUpdate = true;

            // Sky transitions from space dark to Mars horizon amber
            _colorA.copy(_skySpace).lerp(_skyCleanMars, smoothstep(2.5, 8.5, clampedT));
            (scene.background as THREE.Color).copy(_colorA);
            fog.color.copy(_colorA);

            // Cinematic EDL camera tracking
            _camPos.set(
              lerp(5.2, 3.6, p1),
              lerp(7.2, 1.85, smoothstep(0, 9.4, clampedT)),
              lerp(6.8, 4.1, p1)
            );
            _camLook.copy(landerGroup.position).add(_tmpVec.set(0, 0.5, 0));
            camera.position.copy(_camPos);
            camera.lookAt(_camLook);
          } else if (clampedT < 20) {
            // --- SCENE 2 (10..20s): A MISSION BEGINS ---
            altitudeLabel = 'Elysium Planitia · Active Science';
            powerRatio = lerp(0.35, 1.0, smoothstep(10, 13.4, clampedT));
            signalRatio = 1.0;

            landerGroup.position.set(0, 0, 0);
            landerGroup.rotation.set(0, 0, 0);
            heatShield.visible = false;
            parachuteGroup.visible = false;
            plasmaCone.visible = false;
            thrusterFlames.visible = false;
            terrainGroup.visible = true;
            terrainGroup.position.y = 0;
            terrainMat.opacity = 1;
            contactShadow.visible = true;
            planetGroup.visible = false;

            // Unfold UltraFlex wings smoothly 10..13.2s
            const wingOpen = smoothstep(10.0, 13.2, clampedT);
            leftWingPivot.rotation.z = lerp(-1.42, 0, wingOpen);
            rightWingPivot.rotation.z = lerp(1.42, 0, wingOpen);
            wingMatLeft.color.copy(_solarClean);
            wingMatRight.color.copy(_solarClean);

            // Robotic arm reaches forward and places SEIS on ground 13.2..16.2s
            const placeP = smoothstep(13.2, 16.0, clampedT);
            const armRetract = smoothstep(16.0, 17.5, clampedT);
            if (clampedT < 16.0) {
              armShoulder.rotation.set(lerp(-0.5, 0.68, placeP), lerp(0, 0.35, placeP), 0);
              armElbow.rotation.set(lerp(1.2, 0.15, placeP), 0, 0);
            } else {
              armShoulder.rotation.set(lerp(0.68, -0.25, armRetract), lerp(0.35, 0.1, armRetract), 0);
              armElbow.rotation.set(lerp(0.15, 0.8, armRetract), 0, 0);
            }
            seisGroup.scale.setScalar(lerp(0.85, 1.0, placeP));
            seisGroup.position.set(
              lerp(0.16, 0.56, placeP),
              lerp(0.66, 0.02, placeP),
              lerp(0.25, 0.92, placeP)
            );

            // Mars Interior Cutaway & Seismic Waves 16.2..20s
            const cutP = smoothstep(16.0, 17.6, clampedT);
            cutawayGroup.visible = cutP > 0.02;
            cutawayGroup.children.forEach((ch) => {
              if (ch instanceof THREE.Mesh && !seismicWaves.includes(ch)) {
                (ch.material as THREE.MeshStandardMaterial).opacity = cutP * 0.95;
              }
            });
            terrainMat.opacity = lerp(1, 0.68, cutP);

            seismicWaves.forEach((w, idx) => {
              const cycle = ((clampedT - 16.0) * 0.75 + idx * 0.25) % 1;
              const s = 0.2 + cycle * 2.6;
              w.scale.setScalar(s);
              w.position.y = lerp(-1.2, 1.8, cycle);
              (w.material as THREE.MeshBasicMaterial).opacity = cutP * (1 - cycle) * 0.85;
            });

            // Active crisp telemetry waves skyward
            signalGroup.visible = true;
            signalGroup.position.set(-0.26, 1.25, -0.2);
            signalRings.forEach((ring, idx) => {
              const cyc = (clampedT * 0.65 + idx * 0.33) % 1;
              ring.position.y = cyc * 2.2;
              ring.scale.setScalar(0.35 + cyc * 2.1);
              (ring.material as THREE.MeshBasicMaterial).color.setHex(0x38bdf8);
              (ring.material as THREE.MeshBasicMaterial).opacity = (1 - cyc) * 0.8;
            });

            // Light surface breeze particles
            dustMat.opacity = 0.18;
            for (let i = 0; i < dustCount; i++) {
              const xBase = (dustSeeds[i * 3] - 0.5) * 12;
              const yBase = 0.1 + dustSeeds[i * 3 + 1] * 2.2;
              const zBase = (dustSeeds[i * 3 + 2] - 0.5) * 10;
              dustPositions[i * 3] = ((xBase + clampedT * 0.9 + 6) % 12) - 6;
              dustPositions[i * 3 + 1] = yBase;
              dustPositions[i * 3 + 2] = zBase;
            }
            dustGeo.attributes.position.needsUpdate = true;

            (scene.background as THREE.Color).copy(_skyCleanMars);
            fog.color.copy(_skyCleanMars);

            // Smooth camera orbital move during deployment -> tilts slightly to reveal interior cutaway
            const sweepP = smoothstep(10, 20, clampedT);
            _camPos.set(
              lerp(3.6, 4.4, sweepP),
              lerp(1.85, 1.35, sweepP),
              lerp(4.1, 4.9, sweepP)
            );
            _camLook.set(0.2, lerp(0.5, -0.35, cutP), 0.25);
            camera.position.copy(_camPos);
            camera.lookAt(_camLook);
          } else if (clampedT < 30) {
            // --- SCENE 3 (20..30s): THE FADING POWER ---
            const dustP = smoothstep(20.0, 29.0, clampedT);
            altitudeLabel = 'Elysium Planitia · Solar Dust Shutdown';
            powerRatio = lerp(0.95, 0.05, dustP);
            signalRatio = clampedT < 29.0 ? lerp(0.9, 0.08, dustP) : 0;

            landerGroup.position.set(0, 0, 0);
            landerGroup.rotation.set(0, 0, 0);
            heatShield.visible = false;
            parachuteGroup.visible = false;
            plasmaCone.visible = false;
            thrusterFlames.visible = false;
            leftWingPivot.rotation.z = 0;
            rightWingPivot.rotation.z = 0;
            seisGroup.position.set(0.56, 0.02, 0.92);
            seisGroup.scale.setScalar(1.0);
            cutawayGroup.visible = false;
            terrainGroup.visible = true;
            terrainGroup.position.y = 0;
            terrainMat.opacity = 1;
            planetGroup.visible = false;

            // Solar panels progressively coat with red Martian iron-oxide dust
            _colorA.copy(_solarClean).lerp(_solarDust, dustP);
            wingMatLeft.color.copy(_colorA);
            wingMatRight.color.copy(_colorA);
            wingMatLeft.roughness = lerp(0.25, 0.88, dustP);
            wingMatRight.roughness = lerp(0.25, 0.88, dustP);

            // Heavy wind-blown Martian dust storm particles settling downward
            dustMat.opacity = lerp(0.25, 0.65, Math.sin(dustP * Math.PI * 0.85));
            for (let i = 0; i < dustCount; i++) {
              const xBase = (dustSeeds[i * 3] - 0.5) * 14;
              const yBase = 0.05 + dustSeeds[i * 3 + 1] * 2.8;
              const zBase = (dustSeeds[i * 3 + 2] - 0.5) * 10;
              dustPositions[i * 3] = ((xBase + clampedT * 2.6 + 7) % 14) - 7;
              dustPositions[i * 3 + 1] = Math.max(0.04, yBase - dustP * 0.7 * dustSeeds[i * 3 + 1]);
              dustPositions[i * 3 + 2] = zBase;
            }
            dustGeo.attributes.position.needsUpdate = true;

            // Weakening, sputtering communication rings that vanish completely at t=29s
            signalGroup.visible = signalRatio > 0.01;
            signalGroup.position.set(-0.26, 1.25, -0.2);
            const sputter = clampedT > 26.5 ? (Math.sin(clampedT * 9) > -0.2 ? 1 : 0.2) : 1;
            signalRings.forEach((ring, idx) => {
              const cyc = (clampedT * lerp(0.6, 0.25, dustP) + idx * 0.33) % 1;
              ring.position.y = cyc * lerp(2.2, 0.9, dustP);
              ring.scale.setScalar(0.35 + cyc * lerp(2.0, 0.8, dustP));
              _colorB.setHex(0x38bdf8).lerp(_colorA.setHex(0xef4444), dustP);
              (ring.material as THREE.MeshBasicMaterial).color.copy(_colorB);
              (ring.material as THREE.MeshBasicMaterial).opacity =
                signalRatio * sputter * (1 - cyc) * 0.8;
            });

            // Warm dusty lighting & sky shift
            _colorA.copy(_skyCleanMars).lerp(_skyDustyMars, Math.sin(dustP * Math.PI)).lerp(_skyStormMars, dustP * 0.6);
            (scene.background as THREE.Color).copy(_colorA);
            fog.color.copy(_colorA);
            keyLight.intensity = lerp(2.5, 1.35, dustP);

            _camPos.set(
              lerp(4.4, -3.2, dustP),
              lerp(1.6, 2.15, dustP),
              lerp(4.6, 3.8, dustP)
            );
            camera.position.copy(_camPos);
            camera.lookAt(0, 0.45, 0);
          } else {
            // --- SCENE 4 (30..40s): THE LEGACY ---
            const pullP = smoothstep(30.0, 38.5, clampedT);
            altitudeLabel =
              clampedT < 34.5 ? 'Pulling Away From Elysium Planitia' : 'Orbital Perspective · Mars';
            powerRatio = 0;
            signalRatio = 0;

            landerGroup.position.set(0, 0, 0);
            leftWingPivot.rotation.z = 0;
            rightWingPivot.rotation.z = 0;
            wingMatLeft.color.copy(_solarDust);
            wingMatRight.color.copy(_solarDust);
            seisGroup.position.set(0.56, 0.02, 0.92);
            cutawayGroup.visible = false;
            signalGroup.visible = false;
            heatShield.visible = false;
            parachuteGroup.visible = false;
            thrusterFlames.visible = false;

            // Fade surface terrain smoothly into Mars planetary globe
            const localFade = 1 - smoothstep(32.5, 35.5, clampedT);
            terrainGroup.visible = localFade > 0.02;
            terrainMat.opacity = localFade;
            landerGroup.visible = localFade > 0.02;
            seisGroup.visible = localFade > 0.02;
            dustMat.opacity = localFade * 0.25;

            planetGroup.visible = pullP > 0.05;
            planetGroup.position.set(0, lerp(-9.5, -0.4, smoothstep(31.5, 36.5, clampedT)), 0);
            planetMesh.rotation.y = 0.4 + (clampedT - 30) * 0.07;
            sitePinGroup.visible = pullP > 0.35;
            pinRing.scale.setScalar(1 + Math.sin(clampedT * 3) * 0.22);

            _colorA.copy(_skyStormMars).lerp(_skyOrbitMars, smoothstep(31.5, 36.0, clampedT));
            (scene.background as THREE.Color).copy(_colorA);
            fog.color.copy(_colorA);
            keyLight.intensity = lerp(1.4, 2.35, pullP);

            _camPos.set(
              lerp(-3.2, 2.8, pullP),
              lerp(2.15, 5.4, pullP),
              lerp(3.8, 12.2, pullP)
            );
            _camLook.set(0, lerp(0.45, -0.35, pullP), 0);
            camera.position.copy(_camPos);
            camera.lookAt(_camLook);
          }
        } else if (genericParts) {
          // =================================================================
          // REUSABLE 4-SCENE ENGINE FOR ALL OTHER 15 EXHIBITS
          // =================================================================
          const {
            craftGroup,
            upperStageGroup,
            laserBeam,
            ionPlume,
            frostShell,
            erosBody,
            planetPartner,
            exoStar,
            exoPlanet,
          } = genericParts;

          const arch = script.archetype;
          const isMars = exhibit.targetBody === 'mars';
          const isMoon = exhibit.targetBody === 'moon';

          // Reset generic helpers cleanly every deterministic evaluation
          if (ionPlume) (ionPlume.material as THREE.MeshBasicMaterial).opacity = 0;
          if (laserBeam) (laserBeam.material as THREE.MeshBasicMaterial).opacity = 0;
          if (frostShell) (frostShell.material as THREE.MeshStandardMaterial).opacity = 0;

          if (clampedT < 10) {
            // --- SCENE 1: ARRIVAL / DEPLOYMENT ---
            const p1 = smoothstep(0, 9.2, clampedT);
            altitudeLabel = isDeepSpace ? 'Deep-Space Approach & Cruise' : 'Arrival & Touchdown';
            powerRatio = lerp(0.5, 1.0, p1);
            signalRatio = 0.85;

            if (isDeepSpace) {
              terrainGroup.visible = false;
              planetGroup.visible = arch === 'dawn';
              planetGroup.position.set(5.5, -1.2, -7);
              planetMesh.rotation.y = clampedT * 0.12;
              if (planetPartner) planetPartner.position.set(-6.5, 1.4, -10);

              craftGroup.position.set(lerp(-3.8, 0, p1), Math.sin(clampedT * 0.9) * 0.18, 0);
              craftGroup.rotation.set(0.08, lerp(-0.5, 0.25, p1), 0);
              if (ionPlume && arch === 'dawn') {
                (ionPlume.material as THREE.MeshBasicMaterial).opacity = 0.85;
              }
            } else {
              terrainGroup.visible = true;
              terrainMat.opacity = smoothstep(2.0, 6.0, clampedT);
              terrainGroup.position.y = lerp(-4.5, 0, smoothstep(2.0, 7.5, clampedT));
              planetGroup.visible = false;

              if (arch === 'pathfinder' || arch === 'mer-rover') {
                // Bounce motion representing airbag cushion touchdown
                const bounce = Math.abs(Math.sin(p1 * Math.PI * 3.2)) * (1 - p1) * 3.6;
                craftGroup.position.set(lerp(-2.5, 0, p1), bounce, 0);
                craftGroup.rotation.set(0, 0, (1 - p1) * Math.sin(clampedT * 4) * 0.35);
              } else {
                craftGroup.position.set(0, lerp(5.4, 0, p1), 0);
                craftGroup.rotation.set(0, (1 - p1) * 0.4, 0);
              }

              if (upperStageGroup) {
                upperStageGroup.position.copy(craftGroup.position);
                upperStageGroup.rotation.copy(craftGroup.rotation);
              }
              if (ionPlume && arch === 'apollo-lm') {
                (ionPlume.material as THREE.MeshBasicMaterial).opacity =
                  clampedT < 8.8 ? 0.78 : 0;
              }
            }

            if (exoStar && exoPlanet) {
              exoPlanet.position.x = lerp(-2.4, 2.4, (clampedT % 10) / 10);
            }

            signalGroup.visible = true;
            signalGroup.position.set(craftGroup.position.x, craftGroup.position.y + 1.2, craftGroup.position.z);
            signalRings.forEach((ring, idx) => {
              const cyc = (clampedT * 0.6 + idx * 0.33) % 1;
              ring.position.y = cyc * 1.8;
              ring.scale.setScalar(0.35 + cyc * 1.8);
              (ring.material as THREE.MeshBasicMaterial).opacity = (1 - cyc) * 0.65;
            });

            _camPos.set(lerp(5.0, 3.5, p1), lerp(3.4, 1.9, p1), lerp(5.6, 4.0, p1));
            camera.position.copy(_camPos);
            camera.lookAt(craftGroup.position.x, craftGroup.position.y + 0.5, craftGroup.position.z);
          } else if (clampedT < 20) {
            // --- SCENE 2: ACTIVE SCIENCE & OPERATIONS ---
            const p2 = smoothstep(10, 20, clampedT);
            altitudeLabel = isDeepSpace ? 'Primary Science Survey' : 'Active Surface Operations';
            powerRatio = 0.95;
            signalRatio = 1.0;

            if (isDeepSpace) {
              terrainGroup.visible = false;
              craftGroup.rotation.set(0.1, clampedT * 0.16, 0);
              if (arch === 'near' && erosBody) {
                // Five gentle braking burns lowering onto asteroid Eros
                craftGroup.position.set(0, lerp(2.2, 0.05, smoothstep(12, 19.5, clampedT)), 0);
              } else if (arch === 'kepler' && exoPlanet) {
                exoPlanet.position.x = lerp(-2.2, 2.2, ((clampedT - 10) % 5) / 5);
                craftGroup.position.set(0, Math.sin(clampedT) * 0.08, 0);
              } else if (arch === 'dawn') {
                craftGroup.position.set(Math.cos(p2 * Math.PI) * 1.6, 0.25, Math.sin(p2 * Math.PI) * 1.2);
                if (ionPlume) (ionPlume.material as THREE.MeshBasicMaterial).opacity = 0.85;
              } else if (arch === 'pioneer' && planetPartner) {
                planetPartner.position.set(lerp(-3, -9, p2), 1.0, -7);
                craftGroup.position.set(lerp(-1, 1.4, p2), 0.1, 0);
              }
            } else {
              terrainGroup.visible = true;
              terrainMat.opacity = 1;
              terrainGroup.position.y = 0;

              if (arch === 'rover-moon' || arch === 'lunokhod' || arch === 'mer-rover' || arch === 'pathfinder') {
                // Real 3D traverse motion across terrain
                const driveDist = lerp(-1.4, 1.6, p2);
                craftGroup.position.set(driveDist, 0, Math.sin(p2 * Math.PI) * 0.45);
                craftGroup.rotation.y = Math.cos(p2 * Math.PI) * 0.35;
              } else if (arch === 'surveyor') {
                // Surveyor 6 powered 4-meter hop at t=14..18s
                const hopP = smoothstep(13.5, 18.0, clampedT);
                craftGroup.position.set(lerp(0, 1.3, hopP), Math.sin(hopP * Math.PI) * 1.45, 0);
                craftGroup.rotation.set(0, 0, 0);
              } else if (arch === 'ingenuity') {
                // Spin counter-rotating blades & lift into Jezero air
                const flightP = smoothstep(10.5, 19.5, clampedT);
                craftGroup.position.set(
                  Math.sin(flightP * Math.PI) * 1.6,
                  Math.sin(flightP * Math.PI) * 1.9,
                  Math.cos(flightP * Math.PI * 2) * 0.6
                );
                craftGroup.rotation.y = clampedT * 0.4;
                // Spin top rotor meshes fast
                craftGroup.children.forEach((child, idx) => {
                  if (idx === 6 || idx === 7) child.rotation.y = clampedT * 24 * (idx === 6 ? 1 : -1);
                });
              } else {
                craftGroup.position.set(0, 0, 0);
                craftGroup.rotation.set(0, 0, 0);
              }

              if (upperStageGroup) {
                upperStageGroup.position.set(0, 0, 0);
                upperStageGroup.rotation.set(0, 0, 0);
              }
            }

            signalGroup.visible = true;
            signalGroup.position.set(craftGroup.position.x, craftGroup.position.y + 1.3, craftGroup.position.z);
            signalRings.forEach((ring, idx) => {
              const cyc = (clampedT * 0.65 + idx * 0.33) % 1;
              ring.position.y = cyc * 2.1;
              ring.scale.setScalar(0.35 + cyc * 2.0);
              (ring.material as THREE.MeshBasicMaterial).color.setHex(0x38bdf8);
              (ring.material as THREE.MeshBasicMaterial).opacity = (1 - cyc) * 0.75;
            });

            _camPos.set(
              craftGroup.position.x + Math.cos(p2 * 1.3) * 3.8,
              craftGroup.position.y + 1.9,
              craftGroup.position.z + Math.sin(p2 * 1.3) * 3.8
            );
            camera.position.copy(_camPos);
            camera.lookAt(craftGroup.position.x, craftGroup.position.y + 0.55, craftGroup.position.z);
          } else if (clampedT < 30) {
            // --- SCENE 3: ENDING / SEPARATION / DEPLETION ---
            const p3 = smoothstep(20, 29.2, clampedT);
            altitudeLabel = 'End of Mission Sequence';
            powerRatio = arch === 'alsep' ? 0.15 : lerp(0.85, 0.04, p3);
            signalRatio = arch === 'alsep' ? 0.6 : lerp(0.85, 0.0, p3);

            if (arch === 'apollo-lm' && upperStageGroup) {
              // Pyrotechnic separation: Ascent stage blasts skyward leaving descent stage behind!
              const liftP = smoothstep(21.5, 28.5, clampedT);
              upperStageGroup.position.set(0, liftP * liftP * 11.5, 0);
              const flame = upperStageGroup.getObjectByName('ascentFlame') as THREE.Mesh | undefined;
              if (flame) {
                (flame.material as THREE.MeshBasicMaterial).opacity =
                  liftP > 0.02 && liftP < 0.95 ? 0.9 : 0;
              }
              craftGroup.position.set(0, 0, 0);
            } else if (arch === 'alsep' || arch === 'lunokhod') {
              // Radio dims, active Earth green LRRR laser bounces off prism
              if (laserBeam) {
                (laserBeam.material as THREE.MeshBasicMaterial).opacity =
                  0.45 + Math.sin(clampedT * 8) * 0.35;
              }
            } else if (arch === 'phoenix' && frostShell) {
              // Polar winter sky darkens & dry ice crust forms
              (frostShell.material as THREE.MeshStandardMaterial).opacity = p3 * 0.9;
              keyLight.intensity = lerp(2.5, 0.7, p3);
            } else if (arch === 'mer-rover' && isMars) {
              // Global dust storm (Opportunity) or Troy winter tilt (Spirit)
              _colorA.copy(_skyCleanMars).lerp(_skyStormMars, p3);
              (scene.background as THREE.Color).copy(_colorA);
              fog.color.copy(_colorA);
              dustMat.opacity = lerp(0.15, 0.75, p3);
              for (let i = 0; i < dustCount; i++) {
                const xBase = (dustSeeds[i * 3] - 0.5) * 14;
                dustPositions[i * 3] = ((xBase + clampedT * 3.0 + 7) % 14) - 7;
                dustPositions[i * 3 + 1] = 0.05 + dustSeeds[i * 3 + 1] * 2.5;
                dustPositions[i * 3 + 2] = (dustSeeds[i * 3 + 2] - 0.5) * 10;
              }
              dustGeo.attributes.position.needsUpdate = true;
            } else if (arch === 'ingenuity') {
              // Flight 72 hard touchdown tilt & rotor stop
              const dropP = smoothstep(20.5, 25.5, clampedT);
              craftGroup.position.set(0, lerp(1.6, 0.02, dropP), 0);
              craftGroup.rotation.z = lerp(0, 0.24, dropP);
              craftGroup.children.forEach((child, idx) => {
                if (idx === 6 || idx === 7) {
                  child.rotation.y = clampedT < 25.5 ? clampedT * 20 : 0.45;
                }
              });
            } else if (arch === 'viking') {
              // Dish slews away from Earth lock
              craftGroup.rotation.y = lerp(0, 1.35, p3);
            } else if (isDeepSpace) {
              craftGroup.rotation.z = lerp(0, 0.35, p3);
            }

            signalGroup.visible = signalRatio > 0.02;
            signalGroup.position.set(craftGroup.position.x, craftGroup.position.y + 1.2, craftGroup.position.z);
            signalRings.forEach((ring, idx) => {
              const cyc = (clampedT * 0.4 + idx * 0.33) % 1;
              ring.position.y = cyc * 1.4;
              ring.scale.setScalar(0.3 + cyc * 1.2);
              (ring.material as THREE.MeshBasicMaterial).color.setHex(0xef4444);
              (ring.material as THREE.MeshBasicMaterial).opacity = signalRatio * (1 - cyc) * 0.7;
            });

            _camPos.set(lerp(3.8, -3.1, p3), lerp(1.9, 2.5, p3), lerp(3.9, 4.4, p3));
            camera.position.copy(_camPos);
            camera.lookAt(craftGroup.position.x, craftGroup.position.y + 0.6, craftGroup.position.z);
          } else {
            // --- SCENE 4: LEGACY PULLBACK ---
            const pullP = smoothstep(30, 38.5, clampedT);
            altitudeLabel = isDeepSpace ? 'Interstellar / Quarantine Drift' : 'Planetary Archive Site';
            powerRatio = 0;
            signalRatio = arch === 'alsep' || arch === 'lunokhod' ? 0.5 : 0;

            if (laserBeam && (arch === 'alsep' || arch === 'lunokhod')) {
              (laserBeam.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - pullP * 0.6);
            }
            if (upperStageGroup) upperStageGroup.visible = false;

            if (!isDeepSpace) {
              const localFade = 1 - smoothstep(32.5, 35.5, clampedT);
              terrainGroup.visible = localFade > 0.02;
              terrainMat.opacity = localFade;
              craftGroup.visible = localFade > 0.02;

              planetGroup.visible = pullP > 0.05;
              planetGroup.position.set(0, lerp(-9.5, -0.35, smoothstep(31.5, 36.5, clampedT)), 0);
              planetMesh.rotation.y = 0.4 + (clampedT - 30) * 0.06;
              sitePinGroup.visible = pullP > 0.35;
              pinRing.scale.setScalar(1 + Math.sin(clampedT * 3) * 0.22);

              _colorA
                .copy(isMars ? _skyDustyMars : _skyMoon)
                .lerp(isMoon ? _skyMoon : _skyOrbitMars, smoothstep(31.5, 36, clampedT));
              (scene.background as THREE.Color).copy(_colorA);
              fog.color.copy(_colorA);
            } else {
              craftGroup.position.set(0, 0, lerp(0, -3.5, pullP));
            }

            _camPos.set(lerp(-3.1, 2.5, pullP), lerp(2.5, 5.2, pullP), lerp(4.4, 12.0, pullP));
            camera.position.copy(_camPos);
            camera.lookAt(0, lerp(0.5, -0.3, pullP), 0);
          }
        }

        renderer.render(scene, camera);
        callbackRef.current(
          clampedT,
          {
            time: clampedT,
            sceneIndex,
            powerRatio,
            signalRatio,
            altitudeLabel,
          },
          clampedT >= dur
        );
      };

      evaluatorRef.current = evaluateAndRender;

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || 720;
        const h = container.clientHeight || 460;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        evaluateAndRender(timeRef.current);
      };
      window.addEventListener('resize', handleResize);

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      // Render initial frame at timeRef.current immediately
      evaluateAndRender(timeRef.current);

      let frameId = 0;
      let lastTs = performance.now();
      let destroyed = false;

      function afterDraw(cb: () => void) {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (gl && typeof gl.fenceSync === 'function') {
          const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
          gl.flush();
          const poll = () => {
            if (destroyed) return;
            const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
            if (state === gl.UNSIGNALED) {
              frameId = window.setTimeout(poll, 5);
            } else {
              if (sync) gl.deleteSync(sync);
              frameId = window.setTimeout(cb, 80);
            }
          };
          frameId = window.setTimeout(poll, 5);
        } else {
          frameId = window.setTimeout(cb, 80);
        }
      }

      const tick = (now: number) => {
        if (destroyed) return;
        if (!playingRef.current || !visibleRef.current) {
          lastTs = now;
          return;
        }
        const rawDelta = Math.min((now - lastTs) / 1000, 0.08);
        lastTs = now;

        // If reduced motion is toggled on, still advance cleanly at gentle cadence
        const stepMultiplier = reducedRef.current ? 0.5 : 1.0;
        const nextT = Math.min(
          script.duration,
          timeRef.current + rawDelta * speedRef.current * stepMultiplier
        );
        timeRef.current = nextT;
        evaluateAndRender(nextT);

        if (nextT >= script.duration) {
          return;
        }

        if (isSoftwareGl) {
          afterDraw(() => tick(performance.now()));
        } else {
          frameId = requestAnimationFrame(tick);
        }
      };

      const startLoopIfNeeded = () => {
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        if (playingRef.current && visibleRef.current && timeRef.current < script.duration) {
          lastTs = performance.now();
          frameId = requestAnimationFrame(tick);
        }
      };

      loopTriggerRef.current = startLoopIfNeeded;
      startLoopIfNeeded();

      return () => {
        destroyed = true;
        loopTriggerRef.current = null;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        window.removeEventListener('resize', handleResize);
        disposeObject3D(scene);
        if (planetTex) planetTex.dispose();
        shadowTex.dispose();
        envTex.dispose();
        renderer.dispose();
        evaluatorRef.current = null;
      };
    }, [exhibit, script, onWebGLStatusChange]);

    if (webglUnavailable) {
      // Deterministic synchronized non-WebGL fallback stage
      const t = timeRef.current;
      const p = clamp01(t / script.duration);
      const sceneIdx = t < 10 ? 0 : t < 20 ? 1 : t < 30 ? 2 : 3;
      const craftY = sceneIdx === 0 ? lerp(25, 68, clamp01(t / 9.5)) : sceneIdx === 3 ? 40 : 68;
      const dustOp = sceneIdx >= 2 ? lerp(0.1, 0.85, clamp01((t - 20) / 10)) : 0;

      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#090B10]">
          <svg
            viewBox="0 0 800 420"
            className="h-full w-full"
            role="img"
            aria-label={`Non-WebGL animated schematic for ${script.title}`}
          >
            <rect width="800" height="420" fill={exhibit.targetBody === 'mars' ? '#1C0E0B' : '#0A0D14'} />
            <path
              d="M0 320 Q220 295 420 315 T800 308 L800 420 L0 420 Z"
              fill={exhibit.targetBody === 'mars' ? '#482217' : '#232834'}
            />
            <g transform={`translate(${lerp(240, 400, p)}, ${craftY * 4})`}>
              <rect x="-42" y="-18" width="84" height="32" rx="6" fill="#D4A359" />
              <ellipse cx="-78" cy="-4" rx="34" ry="9" fill="#1E3A5F" />
              <ellipse cx="78" cy="-4" rx="34" ry="9" fill="#1E3A5F" />
              <ellipse cx="-78" cy="-4" rx="34" ry="9" fill="#8C4830" fillOpacity={dustOp} />
              <ellipse cx="78" cy="-4" rx="34" ry="9" fill="#8C4830" fillOpacity={dustOp} />
            </g>
            <text x="24" y="34" fill="#D4A359" fontSize="13" fontFamily="monospace">
              2D FALLBACK RENDERER (WEBGL UNAVAILABLE) · {script.scenes[sceneIdx].title.toUpperCase()}
            </text>
          </svg>
        </div>
      );
    }

    return <div ref={mountRef} className="h-full w-full" />;
  }
);
