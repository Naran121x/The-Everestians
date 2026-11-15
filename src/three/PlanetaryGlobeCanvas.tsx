import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Compass, Pause, Play, RotateCcw } from 'lucide-react';
import type { TargetBody } from '../data/exhibits';
import {
  createMarsSurfaceTexture,
  createMoonSurfaceTexture,
  createStudioEnvironment,
  detectSoftwareWebGL,
  disposeObject3D,
} from './webglUtils';

export interface GlobePin {
  id: string;
  exhibitId: string;
  label: string;
  sublabel: string;
  coordinateText: string;
  lat: number | null;
  lon: number | null;
}

interface PlanetaryLandmark {
  id: string;
  name: string;
  descriptor: string;
  lat: number;
  lon: number;
}

const PLANETARY_LANDMARKS: Record<'moon' | 'mars', PlanetaryLandmark[]> = {
  moon: [
    {
      id: 'mare-tranquillitatis',
      name: 'Mare Tranquillitatis',
      descriptor: 'Basalt Mare',
      lat: 8.5,
      lon: 31.4,
    },
    {
      id: 'oceanus-procellarum',
      name: 'Oceanus Procellarum',
      descriptor: 'Western Mare',
      lat: 18.4,
      lon: -57.4,
    },
    {
      id: 'mare-imbrium',
      name: 'Mare Imbrium',
      descriptor: 'Impact Basin',
      lat: 32.8,
      lon: -15.6,
    },
    {
      id: 'mare-serenitatis',
      name: 'Mare Serenitatis',
      descriptor: 'Basalt Basin',
      lat: 28.0,
      lon: 17.5,
    },
    {
      id: 'copernicus',
      name: 'Copernicus',
      descriptor: 'Ray Crater',
      lat: 9.62,
      lon: -20.08,
    },
    {
      id: 'tycho',
      name: 'Tycho',
      descriptor: 'Highland Crater',
      lat: -43.31,
      lon: -11.36,
    },
    {
      id: 'south-pole-aitken',
      name: 'South Pole–Aitken',
      descriptor: 'Far-Side Basin',
      lat: -53.0,
      lon: -169.0,
    },
  ],
  mars: [
    {
      id: 'olympus-mons',
      name: 'Olympus Mons',
      descriptor: '21.9 km Shield Volcano',
      lat: 18.65,
      lon: 226.2,
    },
    {
      id: 'valles-marineris',
      name: 'Valles Marineris',
      descriptor: '4,000 km Canyon System',
      lat: -13.9,
      lon: 300.8,
    },
    {
      id: 'gale-crater',
      name: 'Gale Crater',
      descriptor: 'Ancient Lake Basin',
      lat: -5.4,
      lon: 137.8,
    },
    {
      id: 'jezero-crater',
      name: 'Jezero Crater',
      descriptor: 'Ancient River Delta',
      lat: 18.38,
      lon: 77.58,
    },
    {
      id: 'hellas-planitia',
      name: 'Hellas Planitia',
      descriptor: 'Giant Impact Basin',
      lat: -42.4,
      lon: 70.5,
    },
    {
      id: 'planum-boreum',
      name: 'Planum Boreum',
      descriptor: 'North Polar Ice Cap',
      lat: 85.0,
      lon: 0.0,
    },
  ],
};

interface PlanetaryGlobeCanvasProps {
  realm: TargetBody;
  pins: GlobePin[];
  selectedPinId: string | null;
  onSelectPin: (pin: GlobePin) => void;
}

const GLOBE_RADIUS = 2.15;
const DEFAULT_CAMERA_DISTANCE = 4.05;

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function getDefaultCameraPosition(realm: TargetBody): THREE.Vector3 {
  if (realm === 'moon') {
    // Face Lunar Nearside (~20°E, 10°N) so Mare Tranquillitatis, Imbrium & Apollo sites appear immediately
    return latLonToVector3(12, 12, DEFAULT_CAMERA_DISTANCE);
  }
  if (realm === 'mars') {
    // Face Valles Marineris / Meridiani Planum / Tharsis region (~-25°W, 8°N)
    return latLonToVector3(8, -28, DEFAULT_CAMERA_DISTANCE);
  }
  return new THREE.Vector3(0, 1.3, 4.5);
}

export function PlanetaryGlobeCanvas({
  realm,
  pins,
  selectedPinId,
  onSelectPin,
}: PlanetaryGlobeCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [autoSpin, setAutoSpin] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });
  const [projectedPins, setProjectedPins] = useState<
    Array<{ pin: GlobePin; x: number; y: number; visible: boolean }>
  >([]);
  const [projectedLandmarks, setProjectedLandmarks] = useState<
    Array<{ landmark: PlanetaryLandmark; x: number; y: number; visible: boolean; opacity: number }>
  >([]);

  const onSelectPinRef = useRef(onSelectPin);
  onSelectPinRef.current = onSelectPin;
  const selectedPinRef = useRef(selectedPinId);
  selectedPinRef.current = selectedPinId;
  const autoSpinRef = useRef(autoSpin);
  autoSpinRef.current = autoSpin;
  const showLandmarksRef = useRef(showLandmarks);
  showLandmarksRef.current = showLandmarks;

  const globeActionsRef = useRef<{
    flyToPin: (pin: GlobePin) => void;
    resetView: () => void;
    wakeLoop: () => void;
    startSpin: () => void;
    stopSpin: () => void;
  } | null>(null);

  const prevSelectedPinIdRef = useRef<string | null>(selectedPinId);
  const prevRealmRef = useRef<TargetBody>(realm);

  useEffect(() => {
    if (prevRealmRef.current !== realm) {
      prevRealmRef.current = realm;
      prevSelectedPinIdRef.current = selectedPinId;
      return;
    }
    if (prevSelectedPinIdRef.current === selectedPinId) return;
    prevSelectedPinIdRef.current = selectedPinId;

    const selected = pins.find((p) => p.id === selectedPinId);
    if (!selected) return;
    autoSpinRef.current = false;
    setAutoSpin(false);
    globeActionsRef.current?.flyToPin(selected);
  }, [selectedPinId, pins, realm]);

  useEffect(() => {
    globeActionsRef.current?.wakeLoop();
  }, [autoSpin, showLandmarks]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let cancelled = false;
    setContextLost(false);
    const isSoftwareGl = detectSoftwareWebGL();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090e);

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    const initialCamPos = getDefaultCameraPosition(realm);
    camera.position.copy(initialCamPos);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 2.75;
    controls.maxDistance = 7.4;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;

    let targetCameraVec: THREE.Vector3 | null = null;

    controls.addEventListener('start', () => {
      targetCameraVec = null;
      if (autoSpinRef.current) {
        autoSpinRef.current = false;
        setAutoSpin(false);
      }
    });

    // Subtle deep-space starfield
    const starPositions = new Float32Array(1100 * 3);
    for (let i = 0; i < 1100; i++) {
      const r = 26 + (i % 9) * 2.4;
      const theta = ((i * 137.508) % 360) * (Math.PI / 180);
      const phi = Math.acos(2 * (((i * 29.3) % 100) / 100) - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xd8dee9,
      size: 0.068,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // Directional solar key light + physically appropriate shadow fill
    const sunColor = realm === 'mars' ? 0xffe9d6 : realm === 'moon' ? 0xffffff : 0xdbeafe;
    const keyLight = new THREE.DirectionalLight(sunColor, realm === 'moon' ? 2.85 : 2.65);
    keyLight.position.set(6.5, 2.6, 4.2);
    scene.add(keyLight);

    // Airless Moon gets crisp terminator shadows; dusty Mars gets slightly warmer sky scatter fill
    const hemiLight = new THREE.HemisphereLight(
      realm === 'mars' ? 0x5c362a : 0x2a3342,
      0x06080c,
      realm === 'moon' ? 0.24 : realm === 'mars' ? 0.36 : 0.65
    );
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(
      realm === 'mars' ? 0xc86446 : 0x64748b,
      realm === 'moon' ? 0.18 : 0.28
    );
    rimLight.position.set(-5.5, -1.5, -4.5);
    scene.add(rimLight);

    // Rotating planetary body group (planet + surface pins + geographical landmarks move locked together)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const pinWorldNodes: Array<{
      pin: GlobePin;
      mesh: THREE.Mesh;
      haloMesh?: THREE.Mesh;
      localPos: THREE.Vector3;
    }> = [];
    const landmarkNodes: Array<{
      landmark: PlanetaryLandmark;
      localPos: THREE.Vector3;
    }> = [];
    const clickableMeshes: THREE.Mesh[] = [];
    const loadedTextures: THREE.Texture[] = [];

    if (realm === 'moon' || realm === 'mars') {
      const textureLoader = new THREE.TextureLoader();
      const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

      const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 72, 54);
      const globeMat = new THREE.MeshStandardMaterial({
        roughness: realm === 'moon' ? 0.94 : 0.88,
        metalness: 0.02,
      });

      if (realm === 'moon') {
        const lrocTex = textureLoader.load(
          './textures/moon_lroc_2k.jpg',
          () => {
            if (!cancelled) requestRender();
          },
          undefined,
          () => {
            if (!cancelled) {
              const fallback = createMoonSurfaceTexture(renderer);
              loadedTextures.push(fallback);
              globeMat.map = fallback;
              globeMat.needsUpdate = true;
              requestRender();
            }
          }
        );
        lrocTex.colorSpace = THREE.SRGBColorSpace;
        lrocTex.anisotropy = maxAniso;
        loadedTextures.push(lrocTex);
        globeMat.map = lrocTex;

        const lolaBump = textureLoader.load(
          './textures/moon_lola_bump_1k.jpg',
          () => {
            if (!cancelled) requestRender();
          }
        );
        lolaBump.colorSpace = THREE.NoColorSpace;
        lolaBump.anisotropy = maxAniso;
        loadedTextures.push(lolaBump);
        globeMat.bumpMap = lolaBump;
        globeMat.bumpScale = 0.032;
      } else {
        const marsTex = textureLoader.load(
          './textures/mars_albedo_2k.jpg',
          () => {
            if (!cancelled) requestRender();
          },
          undefined,
          () => {
            if (!cancelled) {
              const fallback = createMarsSurfaceTexture(renderer);
              loadedTextures.push(fallback);
              globeMat.map = fallback;
              globeMat.needsUpdate = true;
              requestRender();
            }
          }
        );
        marsTex.colorSpace = THREE.SRGBColorSpace;
        marsTex.anisotropy = maxAniso;
        loadedTextures.push(marsTex);
        globeMat.map = marsTex;
      }

      const globeMesh = new THREE.Mesh(globeGeo, globeMat);
      globeGroup.add(globeMesh);

      // Ultra-subtle equatorial reference line
      const ringGeo = new THREE.TorusGeometry(GLOBE_RADIUS + 0.008, 0.003, 8, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color: realm === 'mars' ? 0xd97757 : 0xd4a359,
        transparent: true,
        opacity: 0.14,
      });
      const eqRing = new THREE.Mesh(ringGeo, ringMat);
      eqRing.rotation.x = Math.PI / 2;
      globeGroup.add(eqRing);

      // Subtle thin dusty atmosphere rim ONLY on Mars (airless Moon has NO atmosphere)
      if (realm === 'mars') {
        const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.032, 64, 48);
        const atmoMat = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uColor: { value: new THREE.Color(0xd9774d) },
          },
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewPos;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vViewPos = -mvPosition.xyz;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform vec3 uColor;
            varying vec3 vNormal;
            varying vec3 vViewPos;
            void main() {
              vec3 viewDir = normalize(vViewPos);
              float rim = max(0.0, 0.65 - dot(-vNormal, viewDir));
              float intensity = pow(rim, 3.0) * 0.45;
              gl_FragColor = vec4(uColor, intensity);
            }
          `,
        });
        scene.add(new THREE.Mesh(atmoGeo, atmoMat));
      }

      // Geographical Feature Landmarks attached to rotating globeGroup
      const landmarks = PLANETARY_LANDMARKS[realm];
      for (const lm of landmarks) {
        const pos = latLonToVector3(lm.lat, lm.lon, GLOBE_RADIUS + 0.012);
        landmarkNodes.push({ landmark: lm, localPos: pos });
      }

      // Surface Landing Site Pins + Halo Rings attached to rotating globeGroup
      for (const pin of pins) {
        if (pin.lat === null || pin.lon === null) continue;
        const surfaceNormal = latLonToVector3(pin.lat, pin.lon, 1).normalize();
        const pos = surfaceNormal.clone().multiplyScalar(GLOBE_RADIUS + 0.032);
        const isSelected = pin.id === selectedPinRef.current;

        const pinMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xfbbf24 : realm === 'mars' ? 0xf97316 : 0xd4a359,
          emissive: isSelected ? 0xf59e0b : realm === 'mars' ? 0xc2410c : 0x92400e,
          emissiveIntensity: isSelected ? 1.35 : 0.9,
          roughness: 0.25,
          metalness: 0.5,
        });
        const pinMesh = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12), pinMat);
        pinMesh.position.copy(pos);
        pinMesh.userData.pin = pin;
        globeGroup.add(pinMesh);

        // Glowing surface halo ring oriented tangent to planetary surface
        const haloMat = new THREE.MeshBasicMaterial({
          color: isSelected ? 0xfde68a : realm === 'mars' ? 0xfb923c : 0xe5b869,
          transparent: true,
          opacity: isSelected ? 0.78 : 0.35,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const haloMesh = new THREE.Mesh(new THREE.RingGeometry(0.058, 0.084, 24), haloMat);
        haloMesh.position.copy(surfaceNormal.clone().multiplyScalar(GLOBE_RADIUS + 0.015));
        haloMesh.lookAt(surfaceNormal.clone().multiplyScalar(GLOBE_RADIUS + 1.0));
        globeGroup.add(haloMesh);

        pinWorldNodes.push({ pin, mesh: pinMesh, haloMesh, localPos: pos.clone() });
        clickableMeshes.push(pinMesh);
      }
    } else {
      // Deep Space & Small Bodies orbital atlas
      const sunMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 32, 24),
        new THREE.MeshStandardMaterial({
          color: 0xfde68a,
          emissive: 0xf59e0b,
          emissiveIntensity: 1.4,
          roughness: 0.2,
        })
      );
      globeGroup.add(sunMesh);

      const radii = [1.05, 1.55, 2.05, 2.65];
      pins.forEach((pin, idx) => {
        const orbitR = radii[idx % radii.length];
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(orbitR, 0.006, 8, 96),
          new THREE.MeshBasicMaterial({
            color: 0x67b7d1,
            transparent: true,
            opacity: 0.3,
          })
        );
        ring.rotation.x = Math.PI / 2;
        globeGroup.add(ring);

        const angle = (idx / Math.max(1, pins.length)) * Math.PI * 2 + 0.6;
        const pos = new THREE.Vector3(
          Math.cos(angle) * orbitR,
          idx % 2 === 0 ? 0.14 : -0.14,
          Math.sin(angle) * orbitR
        );
        const nodeMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.088, 20, 16),
          new THREE.MeshStandardMaterial({
            color: 0x67b7d1,
            emissive: 0x0284c7,
            emissiveIntensity: 0.95,
            roughness: 0.3,
          })
        );
        nodeMesh.position.copy(pos);
        nodeMesh.userData.pin = pin;
        globeGroup.add(nodeMesh);
        pinWorldNodes.push({ pin, mesh: nodeMesh, localPos: pos.clone() });
        clickableMeshes.push(nodeMesh);
      });
    }

    globeActionsRef.current = {
      flyToPin: (pin: GlobePin) => {
        globeGroup.updateMatrixWorld(true);
        if (pin.lat !== null && pin.lon !== null) {
          const localVec = latLonToVector3(pin.lat, pin.lon, GLOBE_RADIUS);
          const worldVec = localVec.applyMatrix4(globeGroup.matrixWorld);
          targetCameraVec = worldVec.normalize().multiplyScalar(DEFAULT_CAMERA_DISTANCE * 0.95);
        } else if (realm === 'deep-space') {
          const idx = pins.findIndex((p) => p.id === pin.id);
          const angle = (idx / Math.max(1, pins.length)) * Math.PI * 2 + 0.6;
          const localVec = new THREE.Vector3(Math.cos(angle) * 4.4, 1.4, Math.sin(angle) * 4.4);
          targetCameraVec = localVec.applyMatrix4(globeGroup.matrixWorld);
        }
        requestRender();
      },
      resetView: () => {
        targetCameraVec = getDefaultCameraPosition(realm).applyQuaternion(globeGroup.quaternion);
        requestRender();
      },
      wakeLoop: () => {
        requestRender();
      },
      startSpin: () => {
        targetCameraVec = null;
        clock.getDelta();
        requestRender();
      },
      stopSpin: () => {
        requestRender();
      },
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0 && hits[0].object.userData.pin) {
        onSelectPinRef.current(hits[0].object.userData.pin as GlobePin);
      }
    };

    let lastHoverCheck = 0;
    const handleMove = (event: MouseEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 45) return;
      lastHoverCheck = now;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0 && hits[0].object.userData.pin) {
        renderer.domElement.style.cursor = 'pointer';
        setHoveredPinId((hits[0].object.userData.pin as GlobePin).id);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredPinId(null);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mousemove', handleMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    const _worldPos = new THREE.Vector3();
    const _proj = new THREE.Vector3();
    const _camDir = new THREE.Vector3();
    const _pointDir = new THREE.Vector3();

    const updateProjections = () => {
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 480;
      _camDir.copy(camera.position).normalize();

      const nextPins = pinWorldNodes.map(({ pin, localPos }) => {
        _worldPos.copy(localPos).applyMatrix4(globeGroup.matrixWorld);
        let visible = true;
        if (realm === 'moon' || realm === 'mars') {
          _pointDir.copy(_worldPos).normalize();
          visible = _pointDir.dot(_camDir) > 0.1;
        }
        _proj.copy(_worldPos).project(camera);
        return {
          pin,
          x: ((_proj.x + 1) / 2) * w,
          y: (-(_proj.y - 1) / 2) * h,
          visible: visible && _proj.z < 1,
        };
      });
      setProjectedPins(nextPins);

      if (showLandmarksRef.current && (realm === 'moon' || realm === 'mars')) {
        const nextLandmarks = landmarkNodes.map(({ landmark, localPos }) => {
          _worldPos.copy(localPos).applyMatrix4(globeGroup.matrixWorld);
          _pointDir.copy(_worldPos).normalize();
          const facing = _pointDir.dot(_camDir);
          _proj.copy(_worldPos).project(camera);
          return {
            landmark,
            x: ((_proj.x + 1) / 2) * w,
            y: (-(_proj.y - 1) / 2) * h,
            visible: facing > 0.22 && _proj.z < 1,
            opacity: Math.min(1, Math.max(0, (facing - 0.22) * 2.4)),
          };
        });
        setProjectedLandmarks(nextLandmarks);
      } else {
        setProjectedLandmarks([]);
      }
    };

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
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

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (cancelled) {
          renderBusy = false;
          return;
        }
        renderDirty = false;
        const delta = Math.min(clock.getDelta(), 0.1);
        let keepAnimating = false;

        if (targetCameraVec) {
          const k = 1 - Math.exp(-5.5 * delta);
          camera.position.lerp(targetCameraVec, k);
          if (camera.position.distanceTo(targetCameraVec) < 0.025) {
            camera.position.copy(targetCameraVec);
            targetCameraVec = null;
          } else {
            keepAnimating = true;
          }
        } else if (autoSpinRef.current) {
          globeGroup.rotation.y += delta * 0.18;
          keepAnimating = true;
        }

        // Update active pin highlight scales and halo opacity
        for (const node of pinWorldNodes) {
          const isSel = node.pin.id === selectedPinRef.current;
          node.mesh.scale.setScalar(isSel ? 1.42 : 1.0);
          if (node.haloMesh) {
            node.haloMesh.scale.setScalar(isSel ? 1.45 : 1.0);
            const mat = node.haloMesh.material as THREE.MeshBasicMaterial;
            mat.opacity = isSel ? 0.85 : 0.35;
          }
        }

        controls.update();
        globeGroup.updateMatrixWorld(true);
        renderer.render(scene, camera);
        updateProjections();

        const done = () => {
          renderBusy = false;
          if (renderDirty || keepAnimating) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    controls.addEventListener('change', requestRender);
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    requestRender();

    return () => {
      cancelled = true;
      globeActionsRef.current = null;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mousemove', handleMove);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      for (const tex of loadedTextures) {
        tex.dispose();
      }
      controls.dispose();
      disposeObject3D(scene);
      envTex.dispose();
      renderer.dispose();
    };
  }, [realm, pins]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[#07090e]">
      <div ref={mountRef} className="h-full w-full" />

      {/* Geographical Feature Labels (cartographic typography, non-interactive) */}
      {showLandmarks && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {projectedLandmarks.map(({ landmark, x, y, visible, opacity }) => {
            if (!visible || opacity <= 0.04) return null;
            return (
              <div
                key={landmark.id}
                style={{
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                  opacity,
                }}
                className="absolute left-0 top-0 flex flex-col items-center text-center"
              >
                <span className="h-1.5 w-1.5 rounded-full border border-white/50 bg-[#07090e]/60" />
                <span
                  className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#E2E8F0] whitespace-nowrap"
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.9)' }}
                >
                  {landmark.name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Projected 3D Landing Site Pin Labels */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {projectedPins.map(({ pin, x, y, visible }) => {
          if (!visible) return null;
          const isSelected = pin.id === selectedPinId;
          const isHovered = pin.id === hoveredPinId;
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => onSelectPin(pin)}
              style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -128%)` }}
              className={`pointer-events-auto absolute left-0 top-0 rounded-md border px-2 py-1 text-left text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'border-[#D4A359] bg-[#141923] text-[#F9E7C4] shadow-lg z-20'
                  : isHovered
                    ? 'border-white/40 bg-[#141923] text-white z-10'
                    : 'border-white/20 bg-[#090B10]/92 text-[#CBD5E1] hover:border-[#D4A359]/60'
              }`}
            >
              {pin.label}
            </button>
          );
        })}
      </div>

      {/* Top-Left Globe Controls (Auto-Spin, Landmarks, Reset) */}
      <div className="pointer-events-auto absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          aria-pressed={autoSpin}
          onClick={() => {
            const next = !autoSpin;
            autoSpinRef.current = next;
            setAutoSpin(next);
            if (next) {
              globeActionsRef.current?.startSpin();
            } else {
              globeActionsRef.current?.stopSpin();
            }
          }}
          className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
            autoSpin
              ? 'border-[#D4A359]/60 bg-[#141923]/95 text-[#F9E7C4]'
              : 'border-white/15 bg-[#090B10]/90 text-[#CBD5E1] hover:border-white/35'
          }`}
        >
          {autoSpin ? <Pause className="h-3 w-3 text-[#D4A359]" /> : <Play className="h-3 w-3" />}
          <span>{autoSpin ? 'Pause Spin' : 'Auto-Spin'}</span>
        </button>

        {(realm === 'moon' || realm === 'mars') && (
          <button
            type="button"
            onClick={() => setShowLandmarks((v) => !v)}
            aria-pressed={showLandmarks}
            className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
              showLandmarks
                ? 'border-white/25 bg-[#141923]/95 text-white'
                : 'border-white/15 bg-[#090B10]/90 text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Compass className="h-3 w-3 text-[#D4A359]" />
            <span>{showLandmarks ? 'Features: On' : 'Features: Off'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => globeActionsRef.current?.resetView()}
          className="inline-flex min-h-[32px] items-center gap-1.5 rounded-md border border-white/15 bg-[#090B10]/90 px-2.5 py-1 text-[11px] font-medium text-[#CBD5E1] hover:border-white/35 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Bottom instruction & scientific map attribution */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
        <div className="rounded-md border border-white/10 bg-[#090B10]/88 px-2.5 py-1 text-[11px] text-[#9CA3AF]">
          Drag to orbit · Scroll to zoom · Click any pin to fly to landing site
        </div>
        {(realm === 'moon' || realm === 'mars') && (
          <div className="rounded-md border border-white/10 bg-[#090B10]/88 px-2.5 py-1 font-mono-tech text-[10px] text-[#9CA3AF]">
            {realm === 'moon'
              ? 'Map: NASA LROC / LOLA (SVS #4720)'
              : 'Map: NASA Viking / USGS / Solar System Scope (CC BY 4.0)'}
          </div>
        )}
      </div>

      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#090B10] p-6 text-center">
          <div>
            <p className="font-display text-xl text-white">3D WebGL Context Interrupted</p>
            <p className="mt-2 text-sm text-[#9CA3AF]">
              Use the site manifest beside this frame to explore landing coordinates directly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
