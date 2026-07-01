import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 1500 : 5000;

export default function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const isReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const formations = useMemo(() => {
    // Perfectly deterministic, sacred-geometry inspired formations.
    // Each formation uses closed-form math (Fibonacci lattice, parametric surfaces)
    // so the pattern reads as intentional, not random noise.

    const sphere = new Float32Array(PARTICLE_COUNT * 3);   // 1. Fibonacci sphere
    const helix  = new Float32Array(PARTICLE_COUNT * 3);   // 2. Double helix
    const torus  = new Float32Array(PARTICLE_COUNT * 3);   // 3. Torus (Rk,rk)
    const galaxy = new Float32Array(PARTICLE_COUNT * 3);   // 4. Logarithmic spiral galaxy

    const PHI = Math.PI * (3 - Math.sqrt(5)); // golden angle

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const t = i / (PARTICLE_COUNT - 1);

      // 1) Fibonacci sphere — even distribution on a sphere (feels like a planet/cosmos)
      const yS = 1 - t * 2;              // -1 .. 1
      const rS = Math.sqrt(1 - yS * yS);
      const thetaS = PHI * i;
      const R = 2.4;
      sphere[i3]     = Math.cos(thetaS) * rS * R;
      sphere[i3 + 1] = yS * R;
      sphere[i3 + 2] = Math.sin(thetaS) * rS * R;

      // 2) Double helix — two intertwined strands (DNA / cathedral columns)
      const strand = i % 2 === 0 ? 1 : -1;
      const uH = (Math.floor(i / 2) / (PARTICLE_COUNT / 2)) * Math.PI * 8; // 4 turns
      const rH = 1.4;
      helix[i3]     = Math.cos(uH) * rH * strand;
      helix[i3 + 1] = (uH / (Math.PI * 8) - 0.5) * 6;
      helix[i3 + 2] = Math.sin(uH) * rH * strand;

      // 3) Torus — clean donut, uniform (u,v) sampling
      const uT = t * Math.PI * 2 * 13;   // major loops
      const vT = t * Math.PI * 2 * 37;   // minor loops (coprime -> full coverage)
      const Rt = 2.0, rt = 0.65;
      torus[i3]     = (Rt + rt * Math.cos(vT)) * Math.cos(uT);
      torus[i3 + 1] = rt * Math.sin(vT);
      torus[i3 + 2] = (Rt + rt * Math.cos(vT)) * Math.sin(uT);

      // 4) Logarithmic spiral galaxy — 4 clean arms, no jitter
      const arms = 4;
      const arm = i % arms;
      const idxInArm = Math.floor(i / arms) / (PARTICLE_COUNT / arms);
      const radiusG = 0.15 + idxInArm * 3.2;
      const angleG = idxInArm * Math.PI * 3 + arm * (Math.PI * 2 / arms);
      galaxy[i3]     = Math.cos(angleG) * radiusG;
      galaxy[i3 + 1] = Math.sin(idxInArm * Math.PI * 4) * 0.15 * (1 - idxInArm);
      galaxy[i3 + 2] = Math.sin(angleG) * radiusG;
    }

    return { sphere, helix, torus, galaxy };
  }, []);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const p = isReducedMotion ? 0 : scrollProgress.current;
    const smoothstep = (t: number) => t * t * (3 - 2 * t);
    const time = state.clock.elapsedTime;

    const stages = [formations.sphere, formations.helix, formations.torus, formations.galaxy];
    const stageCount = stages.length - 1;
    const stageProgress = p * stageCount;
    const stageIndex = Math.min(Math.floor(stageProgress), stageCount - 1);
    const localT = smoothstep(stageProgress - stageIndex);
    const shapeA = stages[stageIndex];
    const shapeB = stages[stageIndex + 1];

    // Very subtle breathing — keeps forms readable
    const breath = Math.sin(time * 0.4) * 0.006;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = shapeA[i3]     + (shapeB[i3]     - shapeA[i3])     * localT;
      positions[i3 + 1] = shapeA[i3 + 1] + (shapeB[i3 + 1] - shapeA[i3 + 1]) * localT + breath;
      positions[i3 + 2] = shapeA[i3 + 2] + (shapeB[i3 + 2] - shapeA[i3 + 2]) * localT;
    }

    pointsRef.current.geometry.attributes.position.array = positions;
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Slow, deliberate orbital drift — reads as celestial, not chaotic
    pointsRef.current.rotation.y = time * 0.04;
    pointsRef.current.rotation.x = -0.2 + Math.sin(time * 0.1) * 0.05 + p * 0.3;
    pointsRef.current.rotation.z = 0;
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
        size={0.02}
        color="#d4ff4f"
        sizeAttenuation
        transparent
        opacity={0.78}
        depthWrite={false}
      />
    </points>
  );
}
