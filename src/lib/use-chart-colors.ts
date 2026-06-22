"use client"

import { useTheme } from "next-themes"

export interface ChartColors {
  chart1: string
  chart1Fill: string
  chart1Bar: string
  chart2: string
  chart2Fill: string
  chart2Bar: string
  foreground: string
  muted: string
  mutedForeground: string
  card: string
  border: string
}

const LIGHT: ChartColors = {
  chart1: "#22c55e",
  chart1Fill: "rgba(34, 197, 94, 0.1)",
  chart1Bar: "rgba(34, 197, 94, 0.7)",
  chart2: "#f59e0b",
  chart2Fill: "rgba(245, 158, 11, 0.1)",
  chart2Bar: "rgba(245, 158, 11, 0.7)",
  foreground: "rgb(35, 35, 35)",
  muted: "rgb(242, 242, 242)",
  mutedForeground: "rgb(130, 130, 130)",
  card: "rgb(255, 255, 255)",
  border: "rgb(229, 229, 229)",
}

const DARK: ChartColors = {
  chart1: "#6ee7b7",
  chart1Fill: "rgba(110, 231, 183, 0.15)",
  chart1Bar: "rgba(110, 231, 183, 0.65)",
  chart2: "#fcd34d",
  chart2Fill: "rgba(252, 211, 77, 0.15)",
  chart2Bar: "rgba(252, 211, 77, 0.65)",
  foreground: "rgb(250, 250, 250)",
  muted: "rgb(55, 55, 55)",
  mutedForeground: "rgb(175, 175, 175)",
  card: "rgb(38, 38, 38)",
  border: "rgba(255, 255, 255, 0.1)",
}

export function useChartColors(): ChartColors {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === "dark" ? DARK : LIGHT
}
