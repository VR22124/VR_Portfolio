import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 1800 : 6000;

/**
 * Wireframe Architect — engineered, precise, blueprint aesthetic.
 * Every formation is sampled on a clean (u,v) grid so the wireframe reads
 * as a deliberate draftsman's structure, not noise.
 *
 *  0. Hero    — Latitude/longitude sphere (a cosmic globe)
 *  1. Journey — Torus knot as a tube (a woven path)
 *  2. Skills  — Hyperboloid of one sheet
 *  3. Projects— Parametric wave surface
 */
export default function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const isReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const formations = useMemo(() => {
    const sphere = new Float32Array(PARTICLE_COUNT * 3);
    const knot   = new Float32Array(PARTICLE_COUNT * 3);
    const hyper  = new Float32Array(PARTICLE_COUNT * 3);
    const wave   = new Float32Array(PARTICLE_COUNT * 3);

    const uCount = Math.round(Math.sqrt(PARTICLE_COUNT));
    const vCount = Math.ceil(PARTICLE_COUNT / uCount);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const iu = i % uCount;
      const iv = Math.floor(i / uCount);
      const u01 = iu / uCount;
      const v01 = iv / Math.max(1, vCount - 1);

      // 0) Globe — latitude/longitude wireframe sphere
      const lon = u01 * Math.PI * 2;
      const lat = (v01 - 0.5) * Math.PI;
      const Rs = 2.1;
      sphere[i3]     = Rs * Math.cos(lat) * Math.cos(lon);
      sphere[i3 + 1] = Rs * Math.sin(lat);
      sphere[i3 + 2] = Rs * Math.cos(lat) * Math.sin(lon);

      // 1) Torus knot (p=2, q=3) tube — v along centerline, u wraps tube
      const tK = v01 * Math.PI * 2;
      const phiK = u01 * Math.PI * 2;
      const p = 2, q = 3, Rk = 1.5, rk = 0.5, tubeR = 0.2;
      const ccos = Math.cos(q * tK), csin = Math.sin(q * tK);
      const px = (Rk + rk * ccos) * Math.cos(p * tK);
      const py = (Rk + rk * ccos) * Math.sin(p * tK);
      const pz = rk * csin;
      const dxdt = -p * (Rk + rk * ccos) * Math.sin(p * tK) - rk * q * csin * Math.cos(p * tK);
      const dydt =  p * (Rk + rk * ccos) * Math.cos(p * tK) - rk * q * csin * Math.sin(p * tK);
      const dzdt =  rk * q * ccos;
      const tLen = Math.hypot(dxdt, dydt, dzdt) || 1;
      const Tx = dxdt / tLen, Ty = dydt / tLen, Tz = dzdt / tLen;
      let Nx = -Ty, Ny = Tx, Nz = 0;
      const nLen = Math.hypot(Nx, Ny, Nz) || 1;
      Nx /= nLen; Ny /= nLen; Nz /= nLen;
      const Bx = Ty * Nz - Tz * Ny;
      const By = Tz * Nx - Tx * Nz;
      const Bz = Tx * Ny - Ty * Nx;
      const cphi = Math.cos(phiK) * tubeR, sphi = Math.sin(phiK) * tubeR;
      knot[i3]     = px + cphi * Nx + sphi * Bx;
      knot[i3 + 1] = py + cphi * Ny + sphi * By;
      knot[i3 + 2] = pz + cphi * Nz + sphi * Bz;

      // 2) Hyperboloid of one sheet
      const uH = u01 * Math.PI * 2;
      const vH = (v01 - 0.5) * 2.4;
      const aH = 1.1;
      const rH = aH * Math.cosh(vH * 0.9);
      hyper[i3]     = rH * Math.cos(uH);
      hyper[i3 + 1] = aH * Math.sinh(vH * 0.9);
      hyper[i3 + 2] = rH * Math.sin(uH);

      // 3) Parametric wave surface
      const gx = (u01 - 0.5) * 6.5;
      const gz = (v01 - 0.5) * 6.5;
      wave[i3]     = gx;
      wave[i3 + 1] = Math.sin(gx * 1.1) * 0.55 + Math.cos(gz * 1.1) * 0.55;
      wave[i3 + 2] = gz;
    }

    return { sphere, knot, hyper, wave };
  }, []);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);


  useFrame((state) => {
    if (!pointsRef.current) return;

    const p = isReducedMotion ? 0 : scrollProgress.current;
    const smoothstep = (t: number) => t * t * (3 - 2 * t);
    const time = state.clock.elapsedTime;

    const stages = [formations.knot, formations.mobius, formations.hyper, formations.wave];
    const stageCount = stages.length - 1;
    const stageProgress = p * stageCount;
    const stageIndex = Math.min(Math.floor(stageProgress), stageCount - 1);
    const localT = smoothstep(stageProgress - stageIndex);
    const A = stages[stageIndex];
    const B = stages[stageIndex + 1];

    // Micro-breath so wireframe feels alive without losing structure
    const breath = Math.sin(time * 0.5) * 0.005;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = A[i3]     + (B[i3]     - A[i3])     * localT;
      positions[i3 + 1] = A[i3 + 1] + (B[i3 + 1] - A[i3 + 1]) * localT + breath;
      positions[i3 + 2] = A[i3 + 2] + (B[i3 + 2] - A[i3 + 2]) * localT;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Deliberate slow rotation — reads as an architectural model on a turntable
    pointsRef.current.rotation.y = time * 0.06;
    pointsRef.current.rotation.x = -0.25 + Math.sin(time * 0.12) * 0.06 + p * 0.35;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#d4ff4f"
        sizeAttenuation
        transparent
        opacity={0.82}
        depthWrite={false}
      />
    </points>
  );
}
