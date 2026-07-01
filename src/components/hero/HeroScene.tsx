import { motion } from "framer-motion";
import heroTemple from "@/assets/hero-temple.jpg";

/**
 * HeroScene
 *
 * Placeholder container for the future React Three Fiber cinematic
 * environment (temple, lake, mountains, cherry blossoms, lanterns, fog).
 *
 * The layout, aspect ratio and atmospheric framing are already established
 * here so the R3F <Canvas /> can drop in without any surrounding changes.
 * Replace the <img /> with <Canvas /> when the 3D scene is ready.
 */
export function HeroScene() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      data-scene-slot="hero"
    >
      {/* Future R3F <Canvas> mounts here. Placeholder still image below. */}
      <motion.img
        src={heroTemple}
        alt=""
        aria-hidden="true"
        width={1280}
        height={1600}
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] as const }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Cinematic grading — left vignette blends into content panel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, var(--charcoal) 0%, color-mix(in oklab, var(--charcoal) 60%, transparent) 22%, transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--charcoal) 45%, transparent) 0%, transparent 30%, transparent 70%, color-mix(in oklab, var(--charcoal) 70%, transparent) 100%)",
        }}
      />

      {/* Subtle grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}
