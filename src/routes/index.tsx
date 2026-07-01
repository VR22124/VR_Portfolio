import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero/Hero";
import { SideNav } from "@/components/navigation/SideNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Temple of Code — Vishnu Rohith" },
      {
        name: "description",
        content:
          "Vishnu Rohith — Software Craftsman & Full Stack Developer. A cinematic portfolio inspired by the stillness of a mountain temple.",
      },
      { property: "og:title", content: "Temple of Code — Vishnu Rohith" },
      {
        property: "og:description",
        content:
          "Software Craftsman & Full Stack Developer. Code, design, and intention meeting like still water.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SideNav />
      <Hero />
    </main>
  );
}
