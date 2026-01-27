"use client";

import { useEffect, useState, useRef } from "react";
import { clsx } from "clsx";
import { getOppositeRunway } from "@/lib/utils";

export default function Runway({ identifier = "06L", classList }: { identifier?: string; classList?: string[] } = {}) {
  return (
    <div className={clsx("relative w-full h-32 bg-black", classList)}>
      {/* Large Start/Direction Arrow at the beginning of the runway */}
      <div className="absolute left-0 z-5 top-1/2 -translate-y-1/2">
        <div className="w-0 h-0 border-t-16 border-b-16 border-l-32 border-t-transparent border-b-transparent border-l-green-500" />
      </div>

      {/* Edge Lines */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white"></div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>

      {/* Centerline */}
      <Centerline />

      {/* Left Threshold */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-8 h-1 bg-white" />
        ))}
      </div>

      {/* Left Runway Number */}
      <div className="absolute left-14 top-1/2 -translate-y-1/2 rotate-90 bg-black text-white text-3xl font-bold">
        {identifier}
      </div>

      {/* Left Aiming Points */}
      <div className="absolute left-32 top-1/2 -translate-y-1/2 flex flex-col gap-6">
        <div className="w-12 h-2 bg-white"></div>
        <div className="w-12 h-2 bg-white"></div>
      </div>

      {/* TDZ Left */}
      <div className="absolute left-48 top-1/2 max-md:hidden -translate-y-1/2 flex flex-col gap-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-6 h-1 bg-white" />
        ))}
      </div>

      {/* TDZ Right */}
      <div className="absolute right-48 top-1/2 max-md:hidden -translate-y-1/2 flex flex-col gap-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-6 h-1 bg-white" />
        ))}
      </div>

      {/* Right Aiming Points */}
      <div className="absolute right-32 top-1/2 -translate-y-1/2 flex flex-col gap-6">
        <div className="w-12 h-2 bg-white"></div>
        <div className="w-12 h-2 bg-white"></div>
      </div>

      {/* Right Runway Number */}
      <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-black text-white text-3xl font-bold rotate-270">
        {getOppositeRunway(identifier)}
      </div>

      {/* Right Threshold */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-8 h-1 bg-white" />
        ))}
      </div>
    </div>
  );
}

function Centerline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(15);

  useEffect(() => {
    const updateCount = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const segmentWidth = 20 + 8;
        const newCount = Math.floor(width / segmentWidth * 1.2);
        setCount(newCount);
      }
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative left-0 top-1/2 -translate-y-1/2 flex w-full h-0.5 gap-2 px-2"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-4 h-full bg-white" />
      ))}
    </div>
  );
}
