"use client"

import { useRef, useCallback } from "react"

export function GridBackground({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!overlayRef.current) return
    overlayRef.current.style.background = `radial-gradient(circle 500px at ${e.clientX}px ${e.clientY}px, rgba(0,255,135,0.10) 0%, rgba(0,255,135,0.04) 30%, transparent 70%)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!overlayRef.current) return
    overlayRef.current.style.background = "transparent"
  }, [])

  return (
    <div
      className="relative min-h-screen"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: "#050505",
        backgroundImage: `
          linear-gradient(to right, rgba(0,255,135,0.055) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,255,135,0.055) 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
      }}
    >
      {/* Spotlight neon — segue o mouse */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-75"
      />

      {/* Conteúdo acima do spotlight */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
