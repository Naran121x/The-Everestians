import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import {
  AlertTriangle,
  Box,
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
  Loader2,
  RotateCcw,
  Sparkles,
  Upload,
} from 'lucide-react';
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

interface LocalGlbConfig {
  path: string;
  label: string;
  credit: string;
  sourceUrl: string;
}

const LOCAL_NASA_GLBS: Record<string, LocalGlbConfig> = {
  'apollo-lm': {
    path: './models/apollo-lunar-module.glb',
    label: 'Official NASA GLB · Descent Stage Isolated',
    credit: 'NASA 3D Resources (Apollo Lunar Module)',
    sourceUrl: 'https://science.nasa.gov/3d-resources/apollo-lunar-module/',
  },
  'opportunity-rover': {
    path: './models/opportunity-mer-b.glb',
    label: 'Official NASA GLB · MER-B Static Mesh',
    credit: 'NASA / JPL-Caltech / NASA Science VTAD (MER_static)',
    sourceUrl: 'https://science.nasa.gov/resource/mars-exploration-rovers-3d-model/',
  },
};

type ModelSource = 'loading' | 'official-glb' | 'procedural' | 'user-upload';

export function Exhibit3DViewport({ exhibit }: Exhibit3DViewportProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const localGlbConfig = LOCAL_NASA_GLBS[exhibit.id] ?? null;

  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [hudHidden, setHudHidden] = useState(false);
  const [showAscentStage, setShowAscentStage] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<HotspotAnnotation | null>(
    exhibit.hotspots[0] ?? null
  );
  const [modelSource, setModelSource] = useState<ModelSource>(
    localGlbConfig ? 'loading' : 'procedural'
  );
  const [loadingPercent, setLoadingPercent] = useState<number | null>(null);
  const [loadMessage, setLoadMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [projectedHotspots, setProjectedHotspots] = useState<
    Array<{ hotspot: HotspotAnnotation; x: number; y: number; visible: boolean }>
  >([]);

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;
  const wireframeRef = useRef(wireframe);
  wireframeRef.current = wireframe;
  const showAscentRef = useRef(showAscentStage);
  showAscentRef.current = showAscentStage;
  const modelSourceRef = useRef<ModelSource>(modelSource);
  modelSourceRef.current = modelSource;

  const sceneActionsRef = useRef<{
    resetCamera: () => void;
    focusHotspot: (h: HotspotAnnotation) => void;
    loadLocalFile: (file: File) => void;
    toggleWireframe: (enabled: boolean) => void;
    setApolloAscentVisible: (visible: boolean) => void;
  } | null>(null);

  useEffect(() => {
    setActiveHotspot(exhibit.hotspots[0] ?? null);
    setShowAscentStage(false);
    setLoadMessage(null);
    setLoadError(null);
    setLoadingPercent(null);
    setModelSource(LOCAL_NASA_GLBS[exhibit.id] ? 'loading' : 'procedural');
  }, [exhibit]);

  useEffect(() => {
    sceneActionsRef.current?.toggleWireframe(wireframe);
  }, [wireframe]);

  useEffect(() => {
    if (exhibit.id === 'apollo-lm') {
      sceneActionsRef.current?.setApolloAscentVisible(showAscentStage);
    }
  }, [showAscentStage, exhibit.id]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let cancelled = false;
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
    scene.fog = new THREE.FogExp2(bgHex, 0.042);

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 80);
    const defaultCamPos =
      exhibit.id === 'apollo-lm'
        ? new THREE.Vector3(2.8, 1.55, 3.0)
        : exhibit.id === 'opportunity-rover'
          ? new THREE.Vector3(2.5, 1.45, -2.5)
          : new THREE.Vector3(2.9, 1.9, 3.2);
    const defaultTarget =
      exhibit.id === 'apollo-lm'
        ? new THREE.Vector3(0, 0.38, 0)
        : new THREE.Vector3(0, 0.45, 0);
    camera.position.copy(defaultCamPos);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
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
    controls.minDistance = 1.25;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI * 0.54;

    // Three-point studio lighting + environment tint
    const keyColor =
      exhibit.targetBody === 'mars' ? 0xffdfb8 : exhibit.targetBody === 'moon' ? 0xffffff : 0xe0f2fe;
    const keyLight = new THREE.DirectionalLight(keyColor, 2.5);
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
      0.95
    );
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(
      exhibit.targetBody === 'deep-space' ? 0x67b7d1 : 0xfde68a,
      1.15
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

    let loadedModelRoot: THREE.Object3D | null = null;

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

    const normalizeVisibleObject = (obj: THREE.Object3D) => {
      obj.scale.set(1, 1, 1);
      obj.position.set(0, 0, 0);
      obj.updateMatrixWorld(true);

      const box = new THREE.Box3();
      const childBox = new THREE.Box3();
      let hasMesh = false;
      obj.traverse((c) => {
        if (c instanceof THREE.Mesh && c.visible) {
          childBox.setFromObject(c);
          box.union(childBox);
          hasMesh = true;
        }
      });
      if (!hasMesh) {
        box.setFromObject(obj);
      }

      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2.2 / maxDim;
      obj.scale.setScalar(scale);
      obj.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
      obj.updateMatrixWorld(true);
    };

    const mountObjectOnPedestal = (obj: THREE.Object3D, source: ModelSource) => {
      while (modelRoot.children.length > 0) {
        const child = modelRoot.children[0];
        modelRoot.remove(child);
        disposeObject3D(child);
      }
      loadedModelRoot = obj;
      obj.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      normalizeVisibleObject(obj);
      modelRoot.add(obj);
      applyWireframe(wireframeRef.current);
      modelSourceRef.current = source;
      setModelSource(source);
    };

    const setProceduralModel = () => {
      while (modelRoot.children.length > 0) {
        const child = modelRoot.children[0];
        modelRoot.remove(child);
        disposeObject3D(child);
      }
      loadedModelRoot = null;
      const meshGroup = buildProceduralSpacecraft(exhibit.id);
      modelRoot.add(meshGroup);
      applyWireframe(wireframeRef.current);
      modelSourceRef.current = 'procedural';
      setModelSource('procedural');
    };

    const createConfiguredGltfLoader = () => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('./draco/gltf/');
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);
      return { gltfLoader, dracoLoader };
    };

    // Load verified local NASA GLBs ONLY for apollo-lm and opportunity-rover;
    // render crisp procedural hardware reconstructions for all other exhibits.
    const glbConfig = LOCAL_NASA_GLBS[exhibit.id];
    let activeDraco: DRACOLoader | null = null;

    if (glbConfig) {
      modelSourceRef.current = 'loading';
      setModelSource('loading');
      setLoadError(null);
      setLoadingPercent(0);

      const { gltfLoader, dracoLoader } = createConfiguredGltfLoader();
      activeDraco = dracoLoader;

      gltfLoader.load(
        glbConfig.path,
        (gltf) => {
          if (cancelled) {
            disposeObject3D(gltf.scene);
            return;
          }

          // For Apollo Lunar Module, inspect node bounds in raw model space to separate
          // Ascent Stage (min.y >= 2.125) from the abandoned Descent Stage (min.y < 2.125).
          if (exhibit.id === 'apollo-lm') {
            gltf.scene.updateMatrixWorld(true);
            const nodeBox = new THREE.Box3();
            gltf.scene.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                nodeBox.setFromObject(child);
                const stage = nodeBox.min.y < 2.125 ? 'descent' : 'ascent';
                child.userData.lmStage = stage;
                if (stage === 'ascent') {
                  child.visible = showAscentRef.current;
                }
              }
            });
          }

          mountObjectOnPedestal(gltf.scene, 'official-glb');
          setLoadingPercent(null);
          setLoadMessage(
            exhibit.id === 'apollo-lm'
              ? 'Ascent Stage separated · Displaying abandoned Descent Stage'
              : 'Loaded official NASA MER_static.glb'
          );
          requestRender();
        },
        (evt) => {
          if (cancelled) return;
          if (evt.total > 0) {
            setLoadingPercent(Math.min(99, Math.round((evt.loaded / evt.total) * 100)));
          }
        },
        () => {
          if (cancelled) return;
          setLoadingPercent(null);
          setLoadError(
            `Unable to load ${glbConfig.path}. Displaying procedural 3D hardware backup.`
          );
          setProceduralModel();
          requestRender();
        }
      );
    } else {
      setProceduralModel();
    }

    let scriptCamPos: THREE.Vector3 | null = null;
    let scriptTarget: THREE.Vector3 | null = null;

    controls.addEventListener('start', () => {
      scriptCamPos = null;
      scriptTarget = null;
    });

    const getHotspotWorldPosition = (h: HotspotAnnotation, out: THREE.Vector3) => {
      out.set(h.position[0], h.position[1], h.position[2]);
      if (modelSourceRef.current === 'official-glb' && loadedModelRoot) {
        out.applyMatrix4(loadedModelRoot.matrixWorld);
      } else {
        out.applyMatrix4(modelRoot.matrixWorld);
      }
      return out;
    };

    sceneActionsRef.current = {
      resetCamera: () => {
        scriptCamPos = defaultCamPos.clone();
        scriptTarget = defaultTarget.clone();
        requestRender();
      },
      focusHotspot: (h: HotspotAnnotation) => {
        const hp = getHotspotWorldPosition(h, new THREE.Vector3());
        const radial = new THREE.Vector3(hp.x, Math.max(0.25, hp.y * 0.5), hp.z);
        if (radial.lengthSq() < 0.05) {
          radial.set(1.2, 0.7, 1.4);
        }
        const offset = radial.normalize().multiplyScalar(1.85);
        offset.y = Math.max(offset.y, 0.75);
        scriptTarget = hp.clone();
        scriptCamPos = hp.clone().add(offset);
        requestRender();
      },
      toggleWireframe: (enabled: boolean) => {
        applyWireframe(enabled);
        requestRender();
      },
      setApolloAscentVisible: (visible: boolean) => {
        if (!loadedModelRoot || exhibit.id !== 'apollo-lm') return;
        loadedModelRoot.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData.lmStage === 'ascent') {
            child.visible = visible;
          }
        });
        normalizeVisibleObject(loadedModelRoot);
        setLoadMessage(
          visible
            ? 'Showing complete Lunar Module (Ascent + Descent Stages)'
            : 'Ascent Stage separated · Displaying abandoned Descent Stage'
        );
        scriptCamPos = defaultCamPos.clone();
        scriptTarget = visible ? new THREE.Vector3(0, 0.72, 0) : defaultTarget.clone();
        requestRender();
      },
      loadLocalFile: (file: File) => {
        const lower = file.name.toLowerCase();
        const objectUrl = URL.createObjectURL(file);
        if (lower.endsWith('.glb') || lower.endsWith('.gltf')) {
          const { gltfLoader, dracoLoader } = createConfiguredGltfLoader();
          gltfLoader.load(
            objectUrl,
            (gltf) => {
              mountObjectOnPedestal(gltf.scene, 'user-upload');
              setLoadError(null);
              setLoadMessage(`Loaded local file: ${file.name}`);
              URL.revokeObjectURL(objectUrl);
              dracoLoader.dispose();
              requestRender();
            },
            undefined,
            () => {
              setLoadMessage(`Could not parse ${file.name}.`);
              URL.revokeObjectURL(objectUrl);
              dracoLoader.dispose();
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
              mountObjectOnPedestal(mesh, 'user-upload');
              setLoadError(null);
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
      const src = modelSourceRef.current;
      if (src === 'loading' || src === 'user-upload') {
        setProjectedHotspots([]);
        return;
      }
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 480;
      const next = exhibit.hotspots.map((hotspot) => {
        getHotspotWorldPosition(hotspot, _proj);
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

        if (autoRotateRef.current) {
          modelRoot.rotation.y += delta * 0.25;
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

    const rotateWatcher = window.setInterval(() => {
      if (autoRotateRef.current) {
        requestRender();
      }
    }, 250);

    return () => {
      cancelled = true;
      clearInterval(rotateWatcher);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleRestored);
      activeDraco?.dispose();
      controls.dispose();
      disposeObject3D(scene);
      envTex.dispose();
      renderer.dispose();
    };
  }, [exhibit]);

  const showHotspots = !hudHidden && (modelSource === 'procedural' || modelSource === 'official-glb');

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative flex h-[440px] sm:h-[500px] lg:h-[560px] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#07090e]">
        {/* Isolated WebGL mount */}
        <div ref={mountRef} className="h-full w-full" />

        {/* Loading Progress Overlay */}
        {modelSource === 'loading' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#07090e]/92 p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#D4A359]" />
            <div className="mt-3 font-mono-tech text-xs uppercase tracking-wider text-[#D4A359]">
              Loading Official NASA 3D Model
            </div>
            <p className="mt-1.5 max-w-md text-xs text-[#CBD5E1]">
              {localGlbConfig?.credit ?? exhibit.nasa3dAsset.assetName}
            </p>
            <div className="mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-[#D4A359] transition-all duration-150"
                style={{ width: `${loadingPercent ?? 35}%` }}
              />
            </div>
            {loadingPercent !== null && (
              <div className="mt-1.5 font-mono-tech text-[11px] text-[#9CA3AF]">
                {loadingPercent}%
              </div>
            )}
          </div>
        )}

        {/* Top left explicit model provenance badge */}
        {!hudHidden && modelSource !== 'loading' && (
          <div className="pointer-events-none absolute left-4 top-4 flex max-w-[65%] flex-col items-start gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-[#090B10]/92 px-2.5 py-1 text-[11px] font-medium text-[#E5E7EB]">
              <Box className="h-3.5 w-3.5 shrink-0 text-[#D4A359]" />
              {modelSource === 'official-glb'
                ? exhibit.id === 'apollo-lm' && showAscentStage
                  ? 'Official NASA GLB · Complete Lunar Module'
                  : (localGlbConfig?.label ?? 'Loaded Official NASA 3D Mesh')
                : modelSource === 'user-upload'
                  ? 'Visitor-Loaded Local 3D Mesh'
                  : 'Procedural 3D Hardware Reconstruction'}
            </span>
            {loadMessage && (
              <span className="rounded-md border border-[#D4A359]/35 bg-[#141923]/95 px-2.5 py-1 text-[11px] text-[#F9E7C4]">
                {loadMessage}
              </span>
            )}
            {loadError && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-[#1f1610]/95 px-2.5 py-1 text-[11px] text-amber-200">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                {loadError}
              </span>
            )}
          </div>
        )}

        {/* Projected 3D Hotspot Markers */}
        {showHotspots && (
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
                  className={`pointer-events-auto absolute left-0 top-0 flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-[#D4A359] bg-[#141923] text-[#F9E7C4] z-20 shadow-lg'
                      : 'border-white/25 bg-[#090B10]/90 text-[#CBD5E1] hover:border-[#D4A359]/70 z-10'
                  }`}
                >
                  <span className="font-mono-tech text-[10px] text-[#D4A359]">{idx + 1}</span>
                  <span className="hidden sm:inline">{hotspot.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Hotspot Callout Card (desktop top-right) */}
        {showHotspots && activeHotspot && (
          <div className="absolute right-4 top-4 hidden max-w-[280px] rounded-lg border border-white/15 bg-[#0F131C]/95 p-3.5 text-left md:block">
            <div className="text-[11px] font-mono-tech uppercase tracking-wider text-[#D4A359]">
              Component Callout
            </div>
            <div className="mt-1 text-sm font-semibold text-white">{activeHotspot.label}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#CBD5E1]">
              {activeHotspot.annotation}
            </p>
            {modelSource === 'official-glb' && localGlbConfig && (
              <a
                href={localGlbConfig.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#D4A359] hover:underline"
              >
                <span>{localGlbConfig.credit}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {/* Collapsible Bottom Control Dock */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 flex w-[calc(100%-1.5rem)] max-w-[760px] -translate-x-1/2 flex-col items-center">
          <button
            type="button"
            onClick={() => setHudHidden((prev) => !prev)}
            className="pointer-events-auto mb-1.5 inline-flex min-h-[30px] items-center gap-1.5 rounded-md border border-white/15 bg-[#0F131C]/95 px-2.5 py-1 text-[11px] font-medium text-[#CBD5E1] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            {hudHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            <span>{hudHidden ? 'Show Controls' : 'Hide Controls'}</span>
          </button>

          {!hudHidden && (
            <div className="pointer-events-auto flex w-full flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-white/15 bg-[#0F131C]/95 px-2.5 py-2">
              {exhibit.id === 'apollo-lm' && modelSource === 'official-glb' && (
                <button
                  type="button"
                  onClick={() => setShowAscentStage((v) => !v)}
                  className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    !showAscentStage
                      ? 'border-[#D4A359]/60 bg-[#D4A359]/15 text-[#F9E7C4]'
                      : 'border-white/15 bg-[#1A2130] text-[#E5E7EB] hover:bg-white/10'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-[#D4A359]" />
                  <span>
                    {showAscentStage ? 'Isolate Descent Stage' : 'Show Ascent Stage'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setAutoRotate((v) => !v)}
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
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
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
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
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-md bg-[#1A2130] px-2.5 py-1.5 text-xs font-medium text-[#E5E7EB] hover:bg-white/10 transition-colors whitespace-nowrap cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset View</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-md border border-[#D4A359]/40 bg-[#141923] px-2.5 py-1.5 text-xs font-medium text-[#F9E7C4] hover:bg-[#D4A359]/15 transition-colors whitespace-nowrap cursor-pointer"
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
                WebGL context was interrupted. Review the archival visual study and technical
                accession data below.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Hotspot Selector Strip (always accessible on mobile & desktop) */}
      {(modelSource === 'procedural' || modelSource === 'official-glb') &&
        exhibit.hotspots.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-[#0F131C] p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-tech text-[11px] uppercase tracking-wider text-[#9CA3AF] mr-1">
                Inspect Components:
              </span>
              {exhibit.hotspots.map((hotspot, idx) => {
                const isActive = activeHotspot?.id === hotspot.id;
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => {
                      setActiveHotspot(hotspot);
                      sceneActionsRef.current?.focusHotspot(hotspot);
                    }}
                    className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'border-[#D4A359] bg-[#D4A359]/15 text-[#F9E7C4]'
                        : 'border-white/10 bg-[#141923] text-[#CBD5E1] hover:border-white/30'
                    }`}
                  >
                    <span className="font-mono-tech text-[10px] text-[#D4A359]">{idx + 1}</span>
                    <span>{hotspot.label}</span>
                  </button>
                );
              })}
            </div>
            {activeHotspot && (
              <div className="mt-2.5 border-t border-white/10 pt-2.5 md:hidden">
                <div className="text-xs font-semibold text-white">{activeHotspot.label}</div>
                <p className="mt-1 text-xs leading-relaxed text-[#CBD5E1]">
                  {activeHotspot.annotation}
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
