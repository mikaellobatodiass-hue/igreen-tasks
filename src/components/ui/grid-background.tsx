"use client"

import { useRef, useCallback } from "react"

export function GridBackground({ children }: { children: React.ReactNode }) {
  const hRef = useRef<HTMLDivElement>(null)
  const vRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (hRef.current) hRef.current.style.transform = `translateY(${e.clientY}px)`
    if (vRef.current) vRef.current.style.transform = `translateX(${e.clientX}px)`
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (hRef.current) hRef.current.style.opacity = "1"
    if (vRef.current) vRef.current.style.opacity = "1"
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (hRef.current) hRef.current.style.opacity = "0"
    if (vRef.current) vRef.current.style.opacity = "0"
  }, [])

  return (
    <div
      className="relative min-h-screen"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: "#050505",
        backgroundImage: `
          linear-gradient(to right, rgba(0,255,135,0.045) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,255,135,0.045) 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
      }}
    >
      {/* Linha horizontal neon */}
      <div
        ref={hRef}
        className="pointer-events-none fixed left-0 top-0 w-full opacity-0"
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent 0%, #00ff87 20%, #00ff87 80%, transparent 100%)",
          boxShadow: "0 0 6px 2px #00ff87, 0 0 18px 4px rgba(0,255,135,0.5), 0 0 40px 8px rgba(0,255,135,0.2)",
          transition: "opacity 120ms ease",
          zIndex: 9,
          willChange: "transform",
        }}
      />

      {/* Linha vertical neon */}
      <div
        ref={vRef}
        className="pointer-events-none fixed top-0 left-0 h-full opacity-0"
        style={{
          width: "1px",
          background: "linear-gradient(to bottom, transparent 0%, #00ff87 20%, #00ff87 80%, transparent 100%)",
          boxShadow: "0 0 6px 2px #00ff87, 0 0 18px 4px rgba(0,255,135,0.5), 0 0 40px 8px rgba(0,255,135,0.2)",
          transition: "opacity 120ms ease",
          zIndex: 9,
          willChange: "transform",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  )
}
