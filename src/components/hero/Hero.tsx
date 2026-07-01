import { HeroContent } from "./HeroContent";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-background pl-16"
      aria-label="Hero"
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-[35fr_65fr]">
        <div className="relative z-10 order-2 lg:order-1">
          <HeroContent />
        </div>
        <div className="relative order-1 lg:order-2">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
