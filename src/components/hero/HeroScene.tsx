/**
 * HeroScene
 *
 * Dedicated container for the future React Three Fiber cinematic
 * environment (temple, lake, mountains, cherry blossoms, lanterns, fog).
 *
 * This component is intentionally empty of visual content. It only
 * establishes:
 *   - sizing (fills its grid cell / parent)
 *   - positioning (absolute layer root for the future <Canvas />)
 *   - layering (z-index stacking context)
 *   - a neutral placeholder surface tinted with the site palette
 *
 * When the R3F scene is implemented, mount <Canvas /> inside the
 * `data-scene-root` div below. No surrounding layout changes required.
 *
 * Constraints (do not violate):
 *   - No <img> tags
 *   - No background-image / illustrations
 *   - No AI artwork
 *   - No faux-environment gradients pretending to be scenery
 */
export function HeroScene() {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-walnut/20"
      data-scene-slot="hero"
      aria-hidden="true"
    >
      {/*
        Absolute layer where the future R3F <Canvas /> mounts.
        Kept as a plain positioned container so the WebGL surface can
        drop in with `className="absolute inset-0 h-full w-full"`.
      */}
      <div
        data-scene-root="hero"
        className="absolute inset-0"
      />
    </div>
  );
}
