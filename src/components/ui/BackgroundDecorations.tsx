"use client";

import React, { useMemo } from "react";
import {
  Cat,
  Dog,
  Rabbit,
  Bird,
  Turtle,
  Snail,
  PawPrint,
  Star,
  Cloud,
  Moon,
  Sun,
  Zap,
  Sparkles,
} from "lucide-react";

interface BackgroundElement {
  Icon: React.ElementType;
  color: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rot: string;
  delay: string;
  size?: string;
  bg?: string;
}

export function BackgroundDecorations({
  density = "medium",
}: {
  density?: "high" | "medium" | "low";
}) {
  const elements: BackgroundElement[] = useMemo(() => {
    const allElements: BackgroundElement[] = [
      // Top Left Area
      {
        Icon: Cat,
        color: "text-orange-400 dark:text-orange-300",
        bg: "bg-white/80 dark:bg-slate-900/80 border-orange-200 dark:border-orange-900",
        top: "4%",
        left: "3%",
        rot: "-10deg",
        delay: "0ms",
      },
      {
        Icon: Cloud,
        color: "text-sky-400 dark:text-sky-300",
        bg: "bg-white/80 dark:bg-slate-900/80 border-sky-200 dark:border-sky-900",
        top: "14%",
        left: "14%",
        rot: "0deg",
        delay: "2000ms",
        size: "w-10 h-10",
      },
      {
        Icon: Sparkles,
        color: "text-emerald-500 dark:text-emerald-400",
        bg: "bg-white/80 dark:bg-slate-900/80 border-emerald-200 dark:border-emerald-900",
        top: "22%",
        left: "6%",
        rot: "12deg",
        delay: "1200ms",
      },

      // Top Right Area
      {
        Icon: Dog,
        color: "text-amber-500 dark:text-amber-400",
        bg: "bg-white/80 dark:bg-slate-900/80 border-amber-200 dark:border-amber-900",
        top: "6%",
        right: "12%",
        rot: "10deg",
        delay: "1500ms",
      },
      {
        Icon: Sun,
        color: "text-yellow-500 dark:text-yellow-400",
        bg: "bg-white/80 dark:bg-slate-900/80 border-yellow-200 dark:border-yellow-900",
        top: "4%",
        right: "4%",
        rot: "0deg",
        delay: "3000ms",
        size: "w-9 h-9",
      },
      {
        Icon: Star,
        color: "text-amber-400 dark:text-amber-300",
        bg: "bg-white/80 dark:bg-slate-900/80 border-amber-200 dark:border-amber-900",
        top: "18%",
        right: "18%",
        rot: "45deg",
        delay: "800ms",
        size: "w-6 h-6",
      },

      // Left Middle
      {
        Icon: Turtle,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-white/80 dark:bg-slate-900/80 border-emerald-200 dark:border-emerald-900",
        top: "42%",
        left: "2%",
        rot: "12deg",
        delay: "500ms",
      },
      {
        Icon: Snail,
        color: "text-rose-500 dark:text-rose-400",
        bg: "bg-white/80 dark:bg-slate-900/80 border-rose-200 dark:border-rose-900",
        top: "62%",
        left: "5%",
        rot: "-8deg",
        delay: "2500ms",
      },

      // Right Middle
      {
        Icon: Bird,
        color: "text-teal-500 dark:text-teal-400",
        bg: "bg-white/80 dark:bg-slate-900/80 border-teal-200 dark:border-teal-900",
        top: "38%",
        right: "3%",
        rot: "-15deg",
        delay: "1800ms",
      },
      {
        Icon: Rabbit,
        color: "text-purple-500 dark:text-purple-400",
        bg: "bg-white/80 dark:bg-slate-900/80 border-purple-200 dark:border-purple-900",
        top: "58%",
        right: "6%",
        rot: "10deg",
        delay: "2800ms",
      },

      // Bottom Area
      {
        Icon: PawPrint,
        color: "text-amber-500 dark:text-amber-400",
        bg: "bg-white/80 dark:bg-slate-900/80 border-amber-200 dark:border-amber-900",
        bottom: "8%",
        left: "4%",
        rot: "15deg",
        delay: "500ms",
      },
      {
        Icon: Zap,
        color: "text-yellow-500 dark:text-yellow-400",
        bg: "bg-white/80 dark:bg-slate-900/80 border-yellow-200 dark:border-yellow-900",
        bottom: "12%",
        right: "8%",
        rot: "10deg",
        delay: "200ms",
        size: "w-7 h-7",
      },
      {
        Icon: Moon,
        color: "text-indigo-400 dark:text-indigo-300",
        bg: "bg-white/80 dark:bg-slate-900/80 border-indigo-200 dark:border-indigo-900",
        bottom: "5%",
        right: "2%",
        rot: "-15deg",
        delay: "3500ms",
        size: "w-8 h-8",
      },
    ];

    if (density === "low") {
      return allElements.slice(0, 6);
    }
    if (density === "medium") {
      return allElements.slice(0, 10);
    }
    return allElements;
  }, [density]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none hidden md:block">
      {elements.map((el, i) => {
        const Icon = el.Icon;
        return (
          <div
            key={i}
            className="absolute animate-float transition-all duration-1000"
            style={{
              top: el.top,
              left: el.left,
              right: el.right,
              bottom: el.bottom,
              animationDelay: el.delay,
            }}
          >
            <div
              className={`backdrop-blur-md p-3 rounded-2xl shadow-lg border-2 hover:scale-110 transition-transform ${el.bg}`}
              style={{ transform: `rotate(${el.rot})` }}
            >
              <Icon className={`${el.size || "w-8 h-8"} ${el.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
