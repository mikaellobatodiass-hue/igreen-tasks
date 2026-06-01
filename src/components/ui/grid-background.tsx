"use client"

import { useRef, useCallback } from "react"

export function GridBackground({ children }: { children: React.ReactNode }) {
  const neonGridRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!neonGridRef.current) return
    const mask = `radial-gradient(ellipse 200px 200px at ${e.clientX}px ${e.clientY}px, black 0%, transparent 100%)`
    neonGridRef.current.style.maskImage = mask
    neonGridRef.current.style.webkitMaskImage = mask
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!neonGridRef.current) return
    neonGridRef.current.style.maskImage = "none"
    neonGridRef.current.style.webkitMaskImage = "none"
  }, [])

  return (
    <div
      className="relative min-h-screen"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: "#050505",
        // Grade base — linhas sutis sempre visíveis
        backgroundImage: `
          linear-gradient(to right, rgba(0,255,135,0.045) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,255,135,0.045) 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
      }}
    >
      {/* Grade neon intensa — visível APENAS nas linhas dentro da máscara */}
      <div
        ref={neonGridRef}
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,255,135,0.85) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,255,135,0.85) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage: "none",
          WebkitMaskImage: "none",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  )
}
