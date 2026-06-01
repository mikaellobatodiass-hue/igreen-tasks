"use client"

import { useRef, useEffect, useCallback } from "react"

const GRID = 44
const GLOW_RADIUS = 160
const DOT_BASE = 1.2
const DOT_MAX = 3.5

export function GridBackground({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number>(0)
  const pulseRef = useRef<{ x: number; y: number; t: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Gera pontos que pulsam aleatoriamente (efeito "ativo")
    function spawnPulse() {
      const cols = Math.floor(window.innerWidth / GRID)
      const rows = Math.floor(window.innerHeight / GRID)
      pulseRef.current.push({
        x: (Math.floor(Math.random() * cols) + 1) * GRID,
        y: (Math.floor(Math.random() * rows) + 1) * GRID,
        t: 0,
      })
      if (pulseRef.current.length > 8) pulseRef.current.shift()
    }
    const spawnInterval = setInterval(spawnPulse, 600)

    function draw() {
      if (!canvas) return
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Atualiza pulsos aleatórios
      pulseRef.current = pulseRef.current
        .map((p) => ({ ...p, t: p.t + 0.04 }))
        .filter((p) => p.t < Math.PI)

      for (let x = GRID; x < W; x += GRID) {
        for (let y = GRID; y < H; y += GRID) {
          const dist = Math.hypot(x - mx, y - my)
          const mouseIntensity = dist < GLOW_RADIUS ? Math.pow(1 - dist / GLOW_RADIUS, 1.6) : 0

          // Pulso aleatório neste ponto
          const pulse = pulseRef.current.find((p) => p.x === x && p.y === y)
          const pulseIntensity = pulse ? Math.sin(pulse.t) * 0.6 : 0

          const intensity = Math.max(mouseIntensity, pulseIntensity)
          const radius = DOT_BASE + intensity * (DOT_MAX - DOT_BASE)
          const alpha = 0.06 + intensity * 0.94

          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)

          if (intensity > 0.05) {
            // Glow nos pontos próximos ao mouse ou pulsando
            ctx.shadowBlur = 6 + intensity * 14
            ctx.shadowColor = "#00ff87"
            ctx.fillStyle = `rgba(0,255,135,${alpha})`
          } else {
            ctx.shadowBlur = 0
            ctx.fillStyle = "rgba(0,255,135,0.07)"
          }

          ctx.fill()
        }
      }

      ctx.shadowBlur = 0
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      clearInterval(spawnInterval)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 }
  }, [])

  return (
    <div
      className="relative min-h-screen"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: "#050505" }}
    >
      {/* Grade base — linhas finas */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,255,135,0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,255,135,0.035) 1px, transparent 1px)
          `,
          backgroundSize: `${GRID}px ${GRID}px`,
        }}
      />

      {/* Canvas — pontos nas interseções com glow e pulsos */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
      />

      <div className="relative z-10">{children}</div>
    </div>
  )
}
