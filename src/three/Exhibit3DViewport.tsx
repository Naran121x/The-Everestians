import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { Eye, EyeOff, RotateCcw, Upload, Box, Sparkles } from 'lucide-react';
import type { Exhibit, HotspotAnnotation } from '../data/exhibits';
import { buildProceduralSpacecraft } from './SpacecraftModels';
import {
  createContactShadowTexture,
  createStudioEnvironment,
  detectSoftwareWebGL,
  disposeObject3D,
} from './webglUtils';

interface Exhibit3DViewportProps {
  exhibit: Exhibit;
}

export function Exhibit3DViewport({ exhibit }: Exhibit3DViewportProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [hudHidden, setHudHidden] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<HotspotAnnotation | null>(
    exhibit.hotspots[0] ?? null
  );
  const [modelMode, setModelMode] = useState<'procedural' | 'official-glb'>('procedural');
  const [loadMessage, setLoadMessage] = useState<string | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [projectedHotspots, setProjectedHotspots] = useState<
    Array<{ hotspot: HotspotAnnotation; x: number; y: number; visible: boolean }>
  >([]);

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;
  const wireframeRef = useRef(wireframe);
  wireframeRef.current = wireframe;

  const sceneActionsRef = useRef<{
    resetCamera: () => void;
    focusHotspot: (h: HotspotAnnotation) => void;
    loadLocalFile: (file: File) => void;
    toggleWireframe: (enabled: boolean) => void;
  } | null>(null);

  useEffect(() => {
    setActiveHotspot(exhibit.hotspots[0] ?? null);
    setModelMode('procedural');
    setLoadMessage(null);
  }, [exhibit]);

  useEffect(() => {
    sceneActionsRef.current?.toggleWireframe(wireframe);
  }, [wireframe]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    setContextLost(false);
    const isSoftwareGl = detectSoftwareWebGL();
    const scene = new THREE.Scene();
    const bgHex =
      exhibit.targetBody === 'mars'
        ? 0x120d0c
        : exhibit.targetBody === 'moon'
          ? 0x090b10
          : 0x070a12;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.045);

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 80);
    const defaultCamPos = new THREE.Vector3(2.9, 1.9, 3.2);
    const defaultTarget = new THREE.Vector3(0, 0.45, 0);
    camera.position.copy(defaultCamPos);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;

    const handleLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', handleLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleRestored);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(defaultTarget);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.4;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI * 0.54;

    // Three-point studio lighting + environment tint
    const keyColor =
      exhibit.targetBody === 'mars' ? 0xffdfb8 : exhibit.targetBody === 'moon' ? 0xffffff : 0xe0f2fe;
    const keyLight = new THREE.DirectionalLight(keyColor, 2.4);
    keyLight.position.set(4.5, 6.0, 3.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(
      exhibit.targetBody === 'mars' ? 0x9a5a3a : 0x64748b,
      0x090b10,
      0.85
    );
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(
      exhibit.targetBody === 'deep-space' ? 0x67b7d1 : 0xfde68a,
      1.1
    );
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Subtle planetary pedestal / contact ground plane
    const shadowTex = createContactShadowTexture();
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.72,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    scene.add(shadowPlane);

    const groundColor =
      exhibit.targetBody === 'mars'
        ? 0x2d1812
        : exhibit.targetBody === 'moon'
          ? 0x1b1e26
          : 0x0d121d;
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.75, 0.06, 48),
      new THREE.MeshStandardMaterial({
        color: groundColor,
        roughness: 0.92,
        metalness: 0.06,
      })
    );
    plinth.position.y = -0.03;
    plinth.receiveShadow = true;
    scene.add(plinth);

    const modelRoot = new THREE.Group();
    scene.add(modelRoot);

    const setProceduralModel = () => {
      while (modelRoot.children.length > 0) {
        const child = modelRoot.children[0];
        modelRoot.remove(child);
        disposeObject3D(child);
      }
      const meshGroup = buildProceduralSpacecraft(exhibit.id);
      modelRoot.add(meshGroup);
      applyWireframe(wireframeRef.current);
      setModelMode('procedural');
    };

    const normalizeLoadedObject = (obj: THREE.Object3D) => {
      while (modelRoot.children.length > 0) {
        const child = modelRoot.children[0];
        modelRoot.remove(child);
        disposeObject3D(child);
      }
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2.2 / maxDim;
      obj.scale.multiplyScalar(scale);
      obj.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
      obj.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      modelRoot.add(obj);
      applyWireframe(wireframeRef.current);
      setModelMode('official-glb');
    };

    const applyWireframe = (enabled: boolean) => {
      modelRoot.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          const mats = Array.isArray(c.material) ? c.material : [c.material];
          mats.forEach((mat) => {
            if (mat && 'wireframe' in mat) {
              (mat as THREE.MeshStandardMaterial).wireframe = enabled;
            }
          });
        }
      });
    };

    // Build initial procedural model immediately (zero 404 guarantee)
    setProceduralModel();

    // Optionally check if user placed an official NASA GLB inside /models/
    const assetFilename = exhibit.nasa3dAsset.assetName;
    if (exhibit.nasa3dAsset.availabilityStatus === 'verified-glb' && assetFilename.endsWith('.glb')) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      fetch(`./models/${encodeURIComponent(assetFilename)}`, { method: 'HEAD' })
        .then((res) => {
          const ct = res.headers.get('content-type') || '';
          if (res.ok && !ct.includes('text/html')) {
            gltfLoader.load(
              `./models/${encodeURIComponent(assetFilename)}`,
              (gltf) => {
                normalizeLoadedObject(gltf.scene);
                setLoadMessage(`Loaded official NASA asset: ${assetFilename}`);
                requestRender();
              },
              undefined,
              () => {
                /* keep procedural fallback */
              }
            );
          }
        })
        .catch(() => {
          /* silent fallback to procedural */
        });
    }

    let scriptCamPos: THREE.Vector3 | null = null;
    let scriptTarget: THREE.Vector3 | null = null;

    controls.addEventListener('start', () => {
      scriptCamPos = null;
      scriptTarget = null;
    });

    sceneActionsRef.current = {
      resetCamera: () => {
        scriptCamPos = defaultCamPos.clone();
        scriptTarget = defaultTarget.clone();
        requestRender();
      },
      focusHotspot: (h: HotspotAnnotation) => {
        const hp = new THREE.Vector3(...h.position);
        const offset = hp.clone().normalize().multiplyScalar(2.4);
        if (offset.lengthSq() < 0.2) offset.set(1.8, 1.2, 1.8);
        offset.y = Math.max(offset.y, 0.85);
        scriptTarget = hp;
        scriptCamPos = hp.clone().add(offset);
        requestRender();
      },
      toggleWireframe: (enabled: boolean) => {
        applyWireframe(enabled);
        requestRender();
      },
      loadLocalFile: (file: File) => {
        const lower = file.name.toLowerCase();
        const objectUrl = URL.createObjectURL(file);
        if (lower.endsWith('.glb') || lower.endsWith('.gltf')) {
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
          const loader = new GLTFLoader();
          loader.setDRACOLoader(dracoLoader);
          loader.load(
            objectUrl,
            (gltf) => {
              normalizeLoadedObject(gltf.scene);
              setLoadMessage(`Loaded local file: ${file.name}`);
              URL.revokeObjectURL(objectUrl);
              requestRender();
            },
            undefined,
            () => {
              setLoadMessage(`Could not parse ${file.name}. Reverting to procedural hardware.`);
              URL.revokeObjectURL(objectUrl);
            }
          );
        } else if (lower.endsWith('.stl')) {
          const stlLoader = new STLLoader();
          stlLoader.load(
            objectUrl,
            (geometry) => {
              geometry.computeVertexNormals();
              const mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshStandardMaterial({
                  color: 0xcbd5e1,
                  metalness: 0.45,
                  roughness: 0.48,
                })
              );
              mesh.rotation.x = -Math.PI / 2;
              normalizeLoadedObject(mesh);
              setLoadMessage(`Loaded local STL mesh: ${file.name}`);
              URL.revokeObjectURL(objectUrl);
              requestRender();
            },
            undefined,
            () => {
              setLoadMessage(`Could not parse ${file.name}.`);
              URL.revokeObjectURL(objectUrl);
            }
          );
        } else {
          setLoadMessage('Unsupported format. Please select a .glb, .gltf, or .stl file.');
          URL.revokeObjectURL(objectUrl);
        }
      },
    };

    const _proj = new THREE.Vector3();
    const updateHotspotProjections = () => {
      if (modelMode === 'official-glb') {
        setProjectedHotspots([]);
        return;
      }
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 480;
      const next = exhibit.hotspots.map((hotspot) => {
        _proj.set(hotspot.position[0], hotspot.position[1], hotspot.position[2]);
        _proj.applyMatrix4(modelRoot.matrixWorld);
        _proj.project(camera);
        return {
          hotspot,
          x: ((_proj.x + 1) / 2) * w,
          y: (-(_proj.y - 1) / 2) * h,
          visible: _proj.z < 1 && _proj.z > -1,
        };
      });
      setProjectedHotspots(next);
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

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
        let needsNextFrame = false;

        if (autoRotateRef.current && !isSoftwareGl) {
          modelRoot.rotation.y += delta * 0.28;
          needsNextFrame = true;
        }

        if (scriptCamPos && scriptTarget) {
          const k = 1 - Math.exp(-6.5 * delta);
          camera.position.lerp(scriptCamPos, k);
          controls.target.lerp(scriptTarget, k);
          if (
            camera.position.distanceTo(scriptCamPos) < 0.025 &&
            controls.target.distanceTo(scriptTarget) < 0.025
          ) {
            camera.position.copy(scriptCamPos);
            controls.target.copy(scriptTarget);
            scriptCamPos = null;
            scriptTarget = null;
          } else {
            needsNextFrame = true;
          }
        }

        controls.update();
        modelRoot.updateMatrixWorld(true);
        renderer.render(scene, camera);
        updateHotspotProjections();

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsNextFrame) requestRender();
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

    // Re-trigger loop when autoRotate changes
    const rotateWatcher = window.setInterval(() => {
      if (autoRotateRef.current && !isSoftwareGl) {
        requestRender();
      }
    }, 250);

    return () => {
      clearInterval(rotateWatcher);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleRestored);
      controls.dispose();
      disposeObject3D(scene);
      envTex.dispose();
      renderer.dispose();
    };
  }, [exhibit]);

  return (
    <div className="relative flex h-[480px] lg:h-[540px] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#07090e]">
      {/* Isolated WebGL mount */}
      <div ref={mountRef} className="h-full w-full" />

      {/* Top left explicit reconstruction vs official mesh badge */}
      {!hudHidden && (
        <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-[#090B10]/90 px-2.5 py-1 text-[11px] font-medium text-[#E5E7EB]">
            <Box className="h-3.5 w-3.5 text-[#D4A359]" />
            {modelMode === 'procedural'
              ? 'Procedural 3D Hardware Reconstruction'
              : 'Loaded Official NASA 3D Mesh'}
          </span>
          {loadMessage && (
            <span className="rounded-md border border-[#D4A359]/40 bg-[#141923] px-2.5 py-1 text-[11px] text-[#F9E7C4]">
              {loadMessage}
            </span>
          )}
        </div>
      )}

      {/* Projected 3D Hotspot Markers */}
      {!hudHidden && modelMode === 'procedural' && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {projectedHotspots.map(({ hotspot, x, y, visible }, idx) => {
            if (!visible) return null;
            const isActive = activeHotspot?.id === hotspot.id;
            return (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => {
                  setActiveHotspot(hotspot);
                  sceneActionsRef.current?.focusHotspot(hotspot);
                }}
                style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
                className={`pointer-events-auto absolute left-0 top-0 flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-[#D4A359] bg-[#141923] text-[#F9E7C4] z-20 shadow-lg'
                    : 'border-white/25 bg-[#090B10]/90 text-[#CBD5E1] hover:border-[#D4A359]/70 z-10'
                }`}
              >
                <span className="font-mono-tech text-[10px] text-[#D4A359]">{idx + 1}</span>
                <span>{hotspot.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Hotspot Callout Card (top-right, compact) */}
      {!hudHidden && activeHotspot && modelMode === 'procedural' && (
        <div className="absolute right-4 top-4 hidden max-w-[270px] rounded-lg border border-white/15 bg-[#0F131C]/95 p-3.5 text-left md:block">
          <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#D4A359]">
            Component Callout
          </div>
          <div className="mt-1 text-sm font-semibold text-white">{activeHotspot.label}</div>
          <p className="mt-1.5 text-xs leading-relaxed text-[#CBD5E1]">{activeHotspot.annotation}</p>
        </div>
      )}

      {/* Collapsible Bottom Control Dock */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 flex w-[calc(100%-1.5rem)] max-w-[680px] -translate-x-1/2 flex-col items-center">
        <button
          type="button"
          onClick={() => setHudHidden((prev) => !prev)}
          className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-[#0F131C]/95 px-2.5 py-1 text-[11px] font-medium text-[#CBD5E1] hover:text-white transition-colors whitespace-nowrap"
        >
          {hudHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          <span>{hudHidden ? 'Show Controls' : 'Hide Controls'}</span>
        </button>

        {!hudHidden && (
          <div className="pointer-events-auto flex w-full flex-wrap items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#0F131C]/95 px-3 py-2">
            <button
              type="button"
              onClick={() => setAutoRotate((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                autoRotate
                  ? 'bg-[#D4A359] text-[#090B10]'
                  : 'bg-[#1A2130] text-[#E5E7EB] hover:bg-white/10'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{autoRotate ? 'Pause Spin' : 'Auto-Rotate'}</span>
            </button>

            <button
              type="button"
              onClick={() => setWireframe((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                wireframe
                  ? 'bg-[#D4A359] text-[#090B10]'
                  : 'bg-[#1A2130] text-[#E5E7EB] hover:bg-white/10'
              }`}
            >
              <span>{wireframe ? 'Solid Mesh' : 'Wireframe'}</span>
            </button>

            <button
              type="button"
              onClick={() => sceneActionsRef.current?.resetCamera()}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#1A2130] px-2.5 py-1.5 text-xs font-medium text-[#E5E7EB] hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset View</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#D4A359]/40 bg-[#141923] px-2.5 py-1.5 text-xs font-medium text-[#F9E7C4] hover:bg-[#D4A359]/15 transition-colors whitespace-nowrap"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Load Local .GLB / .STL</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf,.stl"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  sceneActionsRef.current?.loadLocalFile(file);
                }
                e.currentTarget.value = '';
              }}
            />
          </div>
        )}
      </div>

      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#090B10] p-6 text-center">
          <div>
            <p className="font-display text-2xl text-white">3D Hardware Viewport Paused</p>
            <p className="mt-2 max-w-md text-sm text-[#9CA3AF]">
              WebGL context was interrupted. Review the archival visual study and technical accession data below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
