import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.15 },
  }),
};

export function HeroContent() {
  return (
    <div className="flex h-full flex-col justify-between px-10 py-14 lg:px-16 lg:py-20">
      {/* Top eyebrow */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="flex items-center gap-3"
      >
        <span className="h-px w-8 bg-vermilion" />
        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
          Temple of Code
        </span>
      </motion.div>

      {/* Center block */}
      <div className="max-w-xl">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mb-6 text-[11px] font-medium uppercase tracking-[0.42em] text-muted-foreground"
        >
          Software Craftsman
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] font-light leading-[0.95] tracking-tight text-ivory"
        >
          Vishnu
          <br />
          Rohith
          <span className="ml-4 align-middle font-jp text-[0.35em] font-normal text-vermilion">
            開発者
          </span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-6 flex items-center gap-4"
        >
          <span className="h-px w-10 bg-amber/70" />
          <span className="text-xs uppercase tracking-[0.32em] text-amber/90">
            Full Stack Developer
          </span>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-10 max-w-md font-serif text-lg leading-relaxed text-muted-foreground"
        >
          Crafting quiet, deliberate software — where code, design and
          intention meet like still water at the temple steps.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="mt-12"
        >
          <a
            href="#about"
            className="group relative inline-flex items-center gap-4 border border-border/80 bg-charcoal/40 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.36em] text-ivory backdrop-blur-sm transition-all duration-500 hover:border-amber/60 hover:bg-walnut/40"
          >
            <span className="relative z-10">Enter Temple</span>
            <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-vermilion/60 text-vermilion transition-transform duration-500 group-hover:translate-x-1">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 5h8m0 0L5.5 1.5M9 5 5.5 8.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-amber/10 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
          </a>
        </motion.div>
      </div>

      {/* Bottom meta */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={6}
        className="flex items-end justify-between text-[10px] uppercase tracking-[0.32em] text-muted-foreground"
      >
        <span>Est. MMXXV</span>
        <span className="font-jp text-sm normal-case tracking-normal text-ivory/70">
          静寂の中に力
        </span>
      </motion.div>
    </div>
  );
}
