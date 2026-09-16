"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
}

const ESCALA_ZOOM = 2.2;

export default function ImagenConZoom({ src, alt, className }: Props) {
  const [activo, setActivo] = useState(false);
  const [origen, setOrigen] = useState("50% 50%");

  function manejarMovimiento(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigen(`${x}% ${y}%`);
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => setActivo(true)}
      onMouseLeave={() => setActivo(false)}
      onMouseMove={manejarMovimiento}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full cursor-zoom-in object-contain transition-transform duration-150 ease-out ${className ?? ""}`}
        style={{
          transform: activo ? `scale(${ESCALA_ZOOM})` : "scale(1)",
          transformOrigin: origen,
        }}
      />
    </div>
  );
}
