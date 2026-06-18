"use client"

import { useEffect, useRef } from "react"

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  className?: string
}

export function Sparkline({ data, width = 120, height = 32, color = "hsl(var(--primary))", className }: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length < 2) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const stepX = width / (data.length - 1)

    ctx.clearRect(0, 0, width, height)

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, color + "40")
    gradient.addColorStop(1, color + "05")

    ctx.beginPath()
    ctx.moveTo(0, height)
    for (let i = 0; i < data.length; i++) {
      const x = i * stepX
      const y = height - ((data[i] - min) / range) * (height - 4) - 2
      if (i === 0) ctx.lineTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.beginPath()
    for (let i = 0; i < data.length; i++) {
      const x = i * stepX
      const y = height - ((data[i] - min) / range) * (height - 4) - 2
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.lineJoin = "round"
    ctx.stroke()

    const lastX = (data.length - 1) * stepX
    const lastY = height - ((data[data.length - 1] - min) / range) * (height - 4) - 2
    ctx.beginPath()
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }, [data, width, height, color])

  return <canvas ref={canvasRef} className={className} style={{ width, height }} />
}
