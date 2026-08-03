"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function ProductZoom({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  return (
    <div>
      <div
        ref={frameRef}
        className="relative aspect-[3/4] overflow-hidden bg-charcoal card-hairline cursor-zoom-in"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[active]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover transition-transform duration-200 ease-out"
          style={
            zooming
              ? { transform: "scale(1.9)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : { transform: "scale(1)" }
          }
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative w-20 aspect-[3/4] overflow-hidden border transition-colors ${
                active === i ? "border-gold" : "border-gold/15 opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt={`${alt} thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <p className="text-[11px] text-smoke mt-3 tracking-wide">Hover the image to zoom</p>
    </div>
  );
}
