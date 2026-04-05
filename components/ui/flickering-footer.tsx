"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import * as Color from "color-bits";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ShieldCheck, Sparkles, BadgeCheck, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

export const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback = "rgba(180, 180, 180, 1)",
): string => {
  if (typeof window === "undefined" || !cssColor) return fallback;

  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const element = document.createElement("div");
      element.style.color = cssColor;
      document.body.appendChild(element);
      const computedColor = window.getComputedStyle(element).color;
      document.body.removeChild(element);
      return Color.formatRGBA(Color.parse(computedColor));
    }

    return Color.formatRGBA(Color.parse(cssColor));
  } catch {
    return fallback;
  }
};

export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#B4B4B4",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 120,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvasWidth: number,
      canvasHeight: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvasWidth;
      maskCanvas.height = canvasHeight;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px Geist, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, canvasWidth / (2 * dpr), canvasHeight / (2 * dpr));
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const w = squareSize * dpr;
          const h = squareSize * dpr;

          const maskData = maskCtx.getImageData(x, y, w, h).data;
          const hasText = maskData.some((value, index) => index % 4 === 0 && value > 0);

          const opacity = squares[i * rows + j] ?? 0;
          const finalOpacity = hasText ? Math.min(1, opacity * 3 + 0.4) : opacity;
          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, w, h);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let grid: { cols: number; rows: number; squares: Float32Array; dpr: number } | null = null;

    const setupCanvas = () => {
      const localWidth = width ?? container.clientWidth;
      const localHeight = height ?? container.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = localWidth * dpr;
      canvas.height = localHeight * dpr;
      canvas.style.width = `${localWidth}px`;
      canvas.style.height = `${localHeight}px`;

      const cols = Math.ceil(localWidth / (squareSize + gridGap));
      const rows = Math.ceil(localHeight / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);

      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      grid = { cols, rows, squares, dpr };
    };

    setupCanvas();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!grid || !isInView) return;

      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      for (let i = 0; i < grid.squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          grid.squares[i] = Math.random() * maxOpacity;
        }
      }

      drawGrid(ctx, canvas.width, canvas.height, grid.cols, grid.rows, grid.squares, grid.dpr);
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(setupCanvas);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      setIsInView(entry?.isIntersecting ?? false);
    });
    intersectionObserver.observe(canvas);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [drawGrid, width, height, squareSize, gridGap, maxOpacity, flickerChance, isInView]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
};

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const checkQuery = () => setValue(window.matchMedia(query).matches);
    checkQuery();

    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", checkQuery);
    window.addEventListener("resize", checkQuery);

    return () => {
      mediaQuery.removeEventListener("change", checkQuery);
      window.removeEventListener("resize", checkQuery);
    };
  }, [query]);

  return value;
}

export const Highlight = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <span className={cn("p-1 py-0.5 font-medium text-secondary", className)}>{children}</span>;
};

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  hero: {
    description:
      "AI assistant designed to streamline your digital workflows and handle mundane tasks, so you can focus on what truly matters",
  },
  footerLinks: [
    {
      title: "Company",
      links: [
        { id: 1, title: "About", url: "#" },
        { id: 2, title: "Contact", url: "#" },
        { id: 3, title: "Blog", url: "#" },
        { id: 4, title: "Story", url: "#" },
      ],
    },
    {
      title: "Products",
      links: [
        { id: 5, title: "Company", url: "#" },
        { id: 6, title: "Product", url: "#" },
        { id: 7, title: "Press", url: "#" },
        { id: 8, title: "More", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { id: 9, title: "Press", url: "#" },
        { id: 10, title: "Careers", url: "#" },
        { id: 11, title: "Newsletters", url: "#" },
        { id: 12, title: "More", url: "#" },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;

export const Component = () => {
  const tablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer
      id="footer"
      className="relative z-20 w-full border-t border-border/70 bg-background pb-0"
    >
      <div className="flex flex-col gap-10 p-10 md:flex-row md:items-center md:justify-between">
        <div className="mx-0 flex max-w-xs flex-col items-start justify-start gap-y-5">
          <Link href="/" className="flex items-center gap-2">
            <Landmark className="size-8 text-primary" />
            <p className="text-xl font-semibold text-primary">Footer</p>
          </Link>
          <p className="font-medium tracking-tight text-muted-foreground">{siteConfig.hero.description}</p>
          <div className="flex items-center gap-3 text-muted-foreground">
            <ShieldCheck className="size-5" />
            <BadgeCheck className="size-5" />
            <Sparkles className="size-5" />
          </div>
        </div>

        <div className="pt-1 md:w-1/2">
          <div className="flex flex-col items-start justify-start gap-y-5 md:flex-row md:items-start md:justify-between lg:pl-10">
            {siteConfig.footerLinks.map((column) => (
              <ul key={column.title} className="flex flex-col gap-y-2">
                <li className="mb-2 text-sm font-semibold text-primary">{column.title}</li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug text-muted-foreground"
                  >
                    <Link href={link.url}>{link.title}</Link>
                    <div className="flex size-4 translate-x-0 transform items-center justify-center rounded border border-border opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                      <ChevronRightIcon className="h-4 w-4" />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-0 mt-16 h-40 w-full bg-background md:h-56">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/30 via-background/70 to-background" />
        <div className="absolute inset-0 mx-6">
          <FlickeringGrid
            text={tablet ? "Footer" : "Streamline your workflow"}
            fontSize={tablet ? 64 : 86}
            className="h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="#6B7280"
            maxOpacity={0.3}
            flickerChance={0.1}
          />
        </div>
      </div>
    </footer>
  );
};
