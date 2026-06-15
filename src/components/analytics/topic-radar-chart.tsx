"use client"

import "@/lib/chart-setup"
import { Radar } from "react-chartjs-2"

interface TopicRadarChartProps {
  data: { topic: string; understanding: number; retention: number }[]
}

export function TopicRadarChart({ data }: TopicRadarChartProps) {
  return (
    <div className="w-full" style={{ height: 350 }}>
      <Radar
        data={{
          labels: data.map((d) => d.topic),
          datasets: [
            {
              label: "Understanding",
              data: data.map((d) => d.understanding),
              borderColor: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.2)",
              pointRadius: 3,
            },
            {
              label: "Retention",
              data: data.map((d) => d.retention),
              borderColor: "#f59e0b",
              backgroundColor: "rgba(245,158,11,0.2)",
              pointRadius: 3,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
            tooltip: {
              backgroundColor: "hsl(var(--card))",
              titleColor: "hsl(var(--foreground))",
              bodyColor: "hsl(var(--muted-foreground))",
              borderColor: "hsl(var(--border))",
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
            },
          },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { color: "hsl(var(--muted-foreground))", font: { size: 10 }, backdropColor: "transparent" },
              grid: { color: "hsl(var(--muted))" },
              angleLines: { color: "hsl(var(--muted))" },
              pointLabels: { color: "hsl(var(--foreground))", font: { size: 11 } },
            },
          },
        }}
      />
    </div>
  )
}
