"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";

export function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const cards =
          containerRef.current.querySelectorAll("[data-magic-card]");
        cards.forEach((card) => {
          const element = card as HTMLElement;
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const xPercent = (x / rect.width) * 100;
          const yPercent = (y / rect.height) * 100;

          element.style.setProperty("--mouse-x", `${xPercent}%`);
          element.style.setProperty("--mouse-y", `${yPercent}%`);
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col px-4 pt-16 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-border bg-muted px-4 py-2 text-foreground text-sm backdrop-blur-sm">
          <span className="mr-2 h-2 w-2 rounded-full bg-muted" />
          Now available for field service teams
        </div>

        <h1 className="mb-6 font-bold text-5xl text-white leading-tight md:text-6xl lg:text-7xl">
          Your Field Team.
          <br />
          <span className="bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            Elevated.
          </span>
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-foreground text-lg leading-relaxed">
          Stratos is the next-generation field management system built for
          contractors who want control, speed, and visibility — all from one
          command center.
        </p>

        <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            asChild
            className="rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/20"
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button
            className="rounded-lg border border-border px-8 py-3 font-medium text-white transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:shadow-primary/20"
            size="lg"
            variant="outline"
          >
            View Demo
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-foreground text-sm">
          <span className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-muted" />
            Scheduling
          </span>
          <span className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-muted" />
            Dispatch
          </span>
          <span className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-muted" />
            CRM
          </span>
          <span className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-muted" />
            Payments
          </span>
          <span className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-muted" />
            AI
          </span>
        </div>
      </div>

      {/* Dashboard Preview Image */}
      <div className="relative mt-24 w-full" ref={containerRef}>
        <AspectRatio className="max-w-[95vw]" ratio={21 / 9}>
          <MagicCard
            className="h-full w-full rounded-lg"
            data-magic-card=""
            gradientOpacity={0.5}
          >
            <img
              alt="Stratos Dashboard"
              className="h-full w-full rounded-lg object-cover object-top shadow-lg"
              src="/hero.png"
              style={{ position: "relative", zIndex: 10 }}
            />
          </MagicCard>
        </AspectRatio>
      </div>
    </div>
  );
}
