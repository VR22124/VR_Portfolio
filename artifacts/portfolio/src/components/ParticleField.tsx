import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 1200 : 4000;

export default function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const isReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const formations = useMemo(() => {
    const galaxy = new Float32Array(PARTICLE_COUNT * 3);
    const wave = new Float32Array(PARTICLE_COUNT * 3);
    const knot = new Float32Array(PARTICLE_COUNT * 3);
    const vortex = new Float32Array(PARTICLE_COUNT * 3);
    const side = Math.ceil(Math.sqrt(PARTICLE_COUNT));
    const step = 7 / side;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const t = i / PARTICLE_COUNT;

      // 1) Galaxy — flat spiral disk, 3 arms, radial density falloff
      const arms = 3;
      const radiusG = Math.pow(Math.random(), 0.6) * 3.6;
      const armAngle = (i % arms) * (Math.PI * 2 / arms);
      const swirl = radiusG * 0.9 + armAngle + Math.random() * 0.25;
      galaxy[i3]     = Math.cos(swirl) * radiusG;
      galaxy[i3 + 1] = (Math.random() - 0.5) * 0.35 * (1 - radiusG / 4);
      galaxy[i3 + 2] = Math.sin(swirl) * radiusG;

      // 2) Wave — undulating sheet grid
      const gx = (i % side) * step - 3.5;
      const gz = Math.floor(i / side) * step - 3.5;
      wave[i3]     = gx;
      wave[i3 + 1] = Math.sin(gx * 0.9) * 0.6 + Math.cos(gz * 0.9) * 0.6;
      wave[i3 + 2] = gz;

      // 3) Trefoil knot — mathematical (p=2, q=3) torus knot
      const uK = t * Math.PI * 2 * 3; // 3 loops
      const p = 2, q = 3, Rk = 1.6, rk = 0.55;
      const cx = (Rk + rk * Math.cos(q * uK)) * Math.cos(p * uK);
      const cy = (Rk + rk * Math.cos(q * uK)) * Math.sin(p * uK);
      const cz = rk * Math.sin(q * uK);
      // scatter around tube slightly
      const jitter = 0.05;
      knot[i3]     = cx + (Math.random() - 0.5) * jitter;
      knot[i3 + 1] = cy + (Math.random() - 0.5) * jitter;
      knot[i3 + 2] = cz + (Math.random() - 0.5) * jitter;

      // 4) Vortex — conical spiral funnel
      const vT = t;
      const vAngle = vT * Math.PI * 2 * 10;
      const vRad = 0.15 + vT * 2.8;
      vortex[i3]     = Math.cos(vAngle) * vRad;
      vortex[i3 + 1] = (vT - 0.5) * 6;
      vortex[i3 + 2] = Math.sin(vAngle) * vRad;
    }

    return { galaxy, wave, knot, vortex };
  }, []);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    let p = isReducedMotion ? 0 : scrollProgress.current;
    const smoothstep = (t: number) => t * t * (3 - 2 * t);
    const time = state.clock.elapsedTime;

    const stages = [formations.sphere, formations.helix, formations.grid, formations.torus];
    const stageCount = stages.length - 1;
    const stageProgress = p * stageCount;
    const stageIndex = Math.min(Math.floor(stageProgress), stageCount - 1);
    const localT = smoothstep(stageProgress - stageIndex);
    const shapeA = stages[stageIndex];
    const shapeB = stages[stageIndex + 1];

    // Subtle jitter — barely perceptible, ambient breathing only
    const jitterAmp = 0.001;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const jitterPhase = i * 0.07;
      positions[i3]     = shapeA[i3]     + (shapeB[i3]     - shapeA[i3])     * localT + Math.sin(time * 0.8 + jitterPhase)       * jitterAmp;
      positions[i3 + 1] = shapeA[i3 + 1] + (shapeB[i3 + 1] - shapeA[i3 + 1]) * localT + Math.sin(time * 0.7 + jitterPhase + 1.1) * jitterAmp;
      positions[i3 + 2] = shapeA[i3 + 2] + (shapeB[i3 + 2] - shapeA[i3 + 2]) * localT + Math.sin(time * 0.6 + jitterPhase + 2.2) * jitterAmp;
    }

    pointsRef.current.geometry.attributes.position.array = positions;
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Slow, steady rotation on idle
    pointsRef.current.rotation.y = time * 0.04;
    if (!isReducedMotion) {
      pointsRef.current.rotation.x = p * Math.PI * 0.25;
    }
  });

  // Particle opacity: slightly reduced for text-heavy feel (0.7 instead of 0.85)
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
        size={0.022}
        color="#d4ff4f"
        sizeAttenuation
        transparent
        opacity={0.72}
        depthWrite={false}
      />
    </points>
  );
}
