import { motion } from "framer-motion";

const items = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function SideNav() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
      className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center justify-between border-r border-border/60 bg-charcoal/70 py-8 backdrop-blur-sm"
      aria-label="Primary"
    >
      {/* Seal */}
      <a
        href="#home"
        className="group flex h-10 w-10 items-center justify-center rounded-full border border-vermilion/50 bg-vermilion/10 text-vermilion transition-colors hover:bg-vermilion/20"
        aria-label="Temple of Code — Home"
      >
        <span className="font-jp text-sm leading-none">虎</span>
      </a>

      {/* Nav items — vertical rotated labels for editorial feel */}
      <nav className="flex flex-col items-center gap-8">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group relative flex items-center"
          >
            <span
              className="text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground transition-colors duration-500 group-hover:text-ivory"
              style={{ writingMode: "vertical-rl" }}
            >
              {item.label}
            </span>
            <span className="absolute -right-2 top-1/2 h-px w-0 -translate-y-1/2 bg-amber transition-all duration-500 group-hover:w-3" />
          </a>
        ))}
      </nav>

      {/* Scroll cue */}
      <div className="flex flex-col items-center gap-3">
        <span
          className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-border to-transparent" />
      </div>
    </motion.aside>
  );
}
