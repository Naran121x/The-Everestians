import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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

interface PlanetaryGlobeCanvasProps {
  realm: TargetBody;
  pins: GlobePin[];
  selectedPinId: string | null;
  onSelectPin: (pin: GlobePin) => void;
}

const GLOBE_RADIUS = 1.85;

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
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
  const [projectedPins, setProjectedPins] = useState<
    Array<{ pin: GlobePin; x: number; y: number; visible: boolean }>
  >([]);

  const onSelectPinRef = useRef(onSelectPin);
  onSelectPinRef.current = onSelectPin;
  const selectedPinRef = useRef(selectedPinId);
  selectedPinRef.current = selectedPinId;
  const targetCameraVecRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const selected = pins.find((p) => p.id === selectedPinId);
    if (!selected) return;
    if (selected.lat !== null && selected.lon !== null) {
      const pos = latLonToVector3(selected.lat, selected.lon, GLOBE_RADIUS);
      targetCameraVecRef.current = pos.normalize().multiplyScalar(4.4);
    } else if (realm === 'deep-space') {
      const idx = pins.findIndex((p) => p.id === selectedPinId);
      const angle = (idx / Math.max(1, pins.length)) * Math.PI * 2;
      targetCameraVecRef.current = new THREE.Vector3(
        Math.cos(angle) * 4.6,
        1.5,
        Math.sin(angle) * 4.6
      );
    }
  }, [selectedPinId, pins, realm]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setContextLost(false);
    const isSoftwareGl = detectSoftwareWebGL();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090e);

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 4.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
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
    controls.minDistance = 2.8;
    controls.maxDistance = 8.2;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;

    controls.addEventListener('start', () => {
      targetCameraVecRef.current = null;
    });

    // Subtle procedural starfield
    const starPositions = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      const r = 24 + (i % 7) * 2.5;
      const theta = ((i * 137.5) % 360) * (Math.PI / 180);
      const phi = Math.acos(2 * (((i * 29) % 100) / 100) - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi);
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xd8dee9, size: 0.075, sizeAttenuation: true });
    scene.add(new THREE.Points(starGeo, starMat));

    // Lighting
    const sunColor = realm === 'mars' ? 0xffe4cc : realm === 'moon' ? 0xffffff : 0xdbeafe;
    const keyLight = new THREE.DirectionalLight(sunColor, 2.2);
    keyLight.position.set(5, 3, 4);
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(
      realm === 'mars' ? 0x5c362a : 0x334155,
      0x090b10,
      0.85
    );
    scene.add(hemiLight);

    const pinWorldNodes: Array<{ pin: GlobePin; mesh: THREE.Mesh; localPos: THREE.Vector3 }> = [];
    const clickableMeshes: THREE.Mesh[] = [];

    if (realm === 'moon' || realm === 'mars') {
      const surfaceTex =
        realm === 'moon' ? createMoonSurfaceTexture(renderer) : createMarsSurfaceTexture(renderer);

      const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 48);
      const globeMat = new THREE.MeshStandardMaterial({
        map: surfaceTex,
        roughness: realm === 'moon' ? 0.92 : 0.85,
        metalness: 0.05,
      });
      const globeMesh = new THREE.Mesh(globeGeo, globeMat);
      scene.add(globeMesh);

      // Graticule wire ring (equator + prime meridian)
      const ringGeo = new THREE.TorusGeometry(GLOBE_RADIUS + 0.01, 0.004, 8, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: realm === 'mars' ? 0xc86446 : 0xd4a359,
        transparent: true,
        opacity: 0.22,
      });
      const eqRing = new THREE.Mesh(ringGeo, ringMat);
      eqRing.rotation.x = Math.PI / 2;
      scene.add(eqRing);

      // Atmosphere glow rim for Mars
      if (realm === 'mars') {
        const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.035, 48, 36);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: 0xc86446,
          transparent: true,
          opacity: 0.09,
          side: THREE.BackSide,
        });
        scene.add(new THREE.Mesh(atmoGeo, atmoMat));
      }

      // Surface pins
      for (const pin of pins) {
        if (pin.lat === null || pin.lon === null) continue;
        const pos = latLonToVector3(pin.lat, pin.lon, GLOBE_RADIUS + 0.035);
        const isSelected = pin.id === selectedPinRef.current;
        const pinMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xfbbf24 : realm === 'mars' ? 0xf97316 : 0xd4a359,
          emissive: isSelected ? 0xd97706 : realm === 'mars' ? 0x9a3412 : 0x78350f,
          emissiveIntensity: 0.9,
          roughness: 0.3,
          metalness: 0.6,
        });
        const pinMesh = new THREE.Mesh(new THREE.SphereGeometry(isSelected ? 0.052 : 0.038, 16, 12), pinMat);
        pinMesh.position.copy(pos);
        pinMesh.userData.pin = pin;
        scene.add(pinMesh);
        pinWorldNodes.push({ pin, mesh: pinMesh, localPos: pos.clone() });
        clickableMeshes.push(pinMesh);
      }
    } else {
      // Deep Space & Small Bodies orbital atlas
      const sunMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 32, 24),
        new THREE.MeshStandardMaterial({
          color: 0xfde68a,
          emissive: 0xf59e0b,
          emissiveIntensity: 1.4,
          roughness: 0.2,
        })
      );
      scene.add(sunMesh);

      const radii = [1.0, 1.45, 1.95, 2.55];
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
        scene.add(ring);

        const angle = (idx / Math.max(1, pins.length)) * Math.PI * 2 + 0.6;
        const pos = new THREE.Vector3(Math.cos(angle) * orbitR, (idx % 2 === 0 ? 0.14 : -0.14), Math.sin(angle) * orbitR);
        const nodeMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.085, 20, 16),
          new THREE.MeshStandardMaterial({
            color: 0x67b7d1,
            emissive: 0x0284c7,
            emissiveIntensity: 0.9,
            roughness: 0.3,
          })
        );
        nodeMesh.position.copy(pos);
        nodeMesh.userData.pin = pin;
        scene.add(nodeMesh);
        pinWorldNodes.push({ pin, mesh: nodeMesh, localPos: pos.clone() });
        clickableMeshes.push(nodeMesh);
      });
    }

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

    const _proj = new THREE.Vector3();
    const _camDir = new THREE.Vector3();
    const _pinDir = new THREE.Vector3();

    const updatePinProjections = () => {
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 480;
      _camDir.copy(camera.position).normalize();

      const next = pinWorldNodes.map(({ pin, localPos }) => {
        let visible = true;
        if (realm === 'moon' || realm === 'mars') {
          _pinDir.copy(localPos).normalize();
          visible = _pinDir.dot(_camDir) > 0.08;
        }
        _proj.copy(localPos).project(camera);
        return {
          pin,
          x: ((_proj.x + 1) / 2) * w,
          y: (-(_proj.y - 1) / 2) * h,
          visible: visible && _proj.z < 1,
        };
      });
      setProjectedPins(next);
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
        renderDirty = false;
        const delta = Math.min(clock.getDelta(), 0.05);
        let animatingCamera = false;

        if (targetCameraVecRef.current) {
          const target = targetCameraVecRef.current;
          const k = 1 - Math.exp(-6 * delta);
          camera.position.lerp(target, k);
          if (camera.position.distanceTo(target) < 0.03) {
            camera.position.copy(target);
            targetCameraVecRef.current = null;
          } else {
            animatingCamera = true;
          }
        }

        // Update active pin highlight scales
        for (const node of pinWorldNodes) {
          const isSel = node.pin.id === selectedPinRef.current;
          node.mesh.scale.setScalar(isSel ? 1.4 : 1.0);
        }

        controls.update();
        renderer.render(scene, camera);
        updatePinProjections();

        const done = () => {
          renderBusy = false;
          if (renderDirty || animatingCamera) requestRender();
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
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mousemove', handleMove);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      controls.dispose();
      disposeObject3D(scene);
      envTex.dispose();
      renderer.dispose();
    };
  }, [realm, pins]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[#07090e]">
      <div ref={mountRef} className="h-full w-full" />

      {/* Projected 3D pin labels */}
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
              style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -120%)` }}
              className={`pointer-events-auto absolute left-0 top-0 rounded-md border px-2 py-1 text-left text-[11px] font-medium transition-colors whitespace-nowrap ${
                isSelected
                  ? 'border-[#D4A359] bg-[#141923] text-[#F9E7C4] shadow-lg z-20'
                  : isHovered
                    ? 'border-white/40 bg-[#141923] text-white z-10'
                    : 'border-white/15 bg-[#090B10]/90 text-[#CBD5E1] hover:border-white/40'
              }`}
            >
              {pin.label}
            </button>
          );
        })}
      </div>

      {/* Subtle corner instruction */}
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-white/10 bg-[#090B10]/85 px-2.5 py-1 text-[11px] text-[#9CA3AF]">
        Drag to orbit · Scroll to zoom · Click any pin to inspect landing site
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
