import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  pmremGenerator.dispose();
  return envTex;
}

export function disposeObject3D(root: THREE.Object3D): void {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
      obj.geometry?.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of mats) {
        if (!mat) continue;
        for (const key of Object.keys(mat)) {
          const val = (mat as unknown as Record<string, unknown>)[key];
          if (val instanceof THREE.Texture) {
            val.dispose();
          }
        }
        mat.dispose();
      }
    }
  });
}

function pseudoNoise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const a = pseudoNoise(ix, iy, seed);
  const b = pseudoNoise(ix + 1, iy, seed);
  const c = pseudoNoise(ix, iy + 1, seed);
  const d = pseudoNoise(ix + 1, iy + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, seed: number): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 4; i++) {
    value += amp * smoothNoise(x * freq, y * freq, seed + i * 17.3);
    freq *= 2.05;
    amp *= 0.5;
  }
  return value;
}

export function createMoonSurfaceTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const img = ctx.createImageData(width, height);
  const data = img.data;

  // Maria patches roughly matching nearside dark basaltic basins
  const maria = [
    { lon: 0, lat: 15, r: 22, darkness: 0.34 }, // Imbrium / Serenitatis region
    { lon: 25, lat: 5, r: 18, darkness: 0.38 }, // Tranquillitatis
    { lon: -35, lat: 0, r: 30, darkness: 0.35 }, // Oceanus Procellarum
    { lon: 45, lat: -10, r: 14, darkness: 0.3 }, // Fecunditatis
  ];

  for (let py = 0; py < height; py++) {
    const lat = 90 - (py / height) * 180;
    for (let px = 0; px < width; px++) {
      const lon = (px / width) * 360 - 180;
      const n = fbm(px * 0.015, py * 0.015, 11.7);
      const fine = pseudoNoise(px * 0.25, py * 0.25, 4.2) * 0.08;
      let shade = 0.54 + (n - 0.5) * 0.32 + fine;

      for (const m of maria) {
        const d = Math.hypot(lon - m.lon, lat - m.lat);
        if (d < m.r) {
          const factor = Math.cos((d / m.r) * (Math.PI / 2));
          shade -= factor * m.darkness * (0.7 + n * 0.4);
        }
      }

      const v = Math.max(28, Math.min(220, Math.round(shade * 235)));
      const idx = (py * width + px) * 4;
      data[idx] = v;
      data[idx + 1] = v;
      data[idx + 2] = Math.min(255, v + 3);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Subtle crater rings
  for (let i = 0; i < 85; i++) {
    const cx = pseudoNoise(i, 1, 9) * width;
    const cy = (0.1 + pseudoNoise(i, 2, 13) * 0.8) * height;
    const r = 4 + pseudoNoise(i, 3, 21) * 20;
    ctx.strokeStyle = 'rgba(220, 225, 232, 0.14)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(30, 34, 40, 0.14)';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

export function createMarsSurfaceTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const img = ctx.createImageData(width, height);
  const data = img.data;

  for (let py = 0; py < height; py++) {
    const lat = 90 - (py / height) * 180;
    for (let px = 0; px < width; px++) {
      const n = fbm(px * 0.013, py * 0.013, 33.1);
      const detail = fbm(px * 0.04, py * 0.04, 71.4);
      const polarFactor = Math.max(0, (Math.abs(lat) - 74) / 16);

      // Oxidized iron-oxide palette blended with darker basaltic plains
      const baseMix = n * 0.72 + detail * 0.28;
      let r = 132 + baseMix * 92;
      let g = 62 + baseMix * 56;
      let b = 40 + baseMix * 36;

      if (polarFactor > 0) {
        const ice = Math.min(1, polarFactor * 1.25);
        r = r * (1 - ice) + 236 * ice;
        g = g * (1 - ice) + 232 * ice;
        b = b * (1 - ice) + 228 * ice;
      }

      const idx = (py * width + px) * 4;
      data[idx] = Math.min(255, Math.round(r));
      data[idx + 1] = Math.min(255, Math.round(g));
      data[idx + 2] = Math.min(255, Math.round(b));
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Subtle canyon & crater scar accents
  ctx.strokeStyle = 'rgba(58, 24, 16, 0.28)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width * 0.25, height * 0.53);
  ctx.quadraticCurveTo(width * 0.34, height * 0.56, width * 0.43, height * 0.52);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
