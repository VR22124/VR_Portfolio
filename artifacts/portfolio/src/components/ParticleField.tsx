import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 1800 : 6000;

/**
 * Wireframe Architect — engineered, precise, blueprint aesthetic.
 * Four parametric surfaces sampled on a (u,v) grid so the wireframe reads
 * as an intentional draftsman's structure, not noise.
 *
 *  1. Torus knot (p,q = 2,3)
 *  2. Möbius strip
 *  3. Hyperboloid of one sheet
 *  4. Parametric wave surface (sin/cos lattice)
 */
export default function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const isReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const formations = useMemo(() => {
    const knot   = new Float32Array(PARTICLE_COUNT * 3);
    const mobius = new Float32Array(PARTICLE_COUNT * 3);
    const hyper  = new Float32Array(PARTICLE_COUNT * 3);
    const wave   = new Float32Array(PARTICLE_COUNT * 3);

    // Grid dims for surface sampling
    const uCount = Math.round(Math.sqrt(PARTICLE_COUNT * 3));
    const vCount = Math.ceil(PARTICLE_COUNT / uCount);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const iu = i % uCount;
      const iv = Math.floor(i / uCount);
      const u01 = iu / (uCount - 1);
      const v01 = iv / Math.max(1, vCount - 1);

      // 1) Torus knot (p=2, q=3) — tube sampled around the centerline
      const tK = (i / PARTICLE_COUNT) * Math.PI * 2;
      const phiK = u01 * Math.PI * 2;
      const p = 2, q = 3, Rk = 1.7, rk = 0.35;
      const cx = (Rk + rk * Math.cos(q * tK)) * Math.cos(p * tK);
      const cy = (Rk + rk * Math.cos(q * tK)) * Math.sin(p * tK);
      const cz = rk * Math.sin(q * tK);
      // small tube offset for wireframe density
      const tubeR = 0.08;
      knot[i3]     = cx + Math.cos(phiK) * tubeR;
      knot[i3 + 1] = cy + Math.sin(phiK) * tubeR;
      knot[i3 + 2] = cz;

      // 2) Möbius strip — classic parametric (u ∈ [0,2π], v ∈ [-w,w])
      const uM = u01 * Math.PI * 2;
      const vM = (v01 - 0.5) * 0.9;
      const Rm = 2.0;
      const hm = uM / 2;
      mobius[i3]     = (Rm + vM * Math.cos(hm)) * Math.cos(uM);
      mobius[i3 + 1] = vM * Math.sin(hm);
      mobius[i3 + 2] = (Rm + vM * Math.cos(hm)) * Math.sin(uM);

      // 3) Hyperboloid of one sheet — x²+z² - y² = a²
      const uH = u01 * Math.PI * 2;
      const vH = (v01 - 0.5) * 2.4;
      const aH = 1.1;
      const rH = aH * Math.cosh(vH * 0.9);
      hyper[i3]     = rH * Math.cos(uH);
      hyper[i3 + 1] = aH * Math.sinh(vH * 0.9);
      hyper[i3 + 2] = rH * Math.sin(uH);

      // 4) Parametric wave surface — lattice sin/cos plane
      const gx = (u01 - 0.5) * 6.5;
      const gz = (v01 - 0.5) * 6.5;
      wave[i3]     = gx;
      wave[i3 + 1] = Math.sin(gx * 1.1) * 0.55 + Math.cos(gz * 1.1) * 0.55;
      wave[i3 + 2] = gz;
    }

    return { knot, mobius, hyper, wave };
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

    pointsRef.current.geometry.attributes.position.array = positions;
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
