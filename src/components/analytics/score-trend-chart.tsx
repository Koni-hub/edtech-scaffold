"use client"

import "@/lib/chart-setup"
import { Line } from "react-chartjs-2"

interface ScoreTrendChartProps {
  data: { date: string; understanding: number; retention: number }[]
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  return (
    <div className="w-full h-[250px] sm:h-[300px]">
      <Line
        data={{
          labels: data.map((d) => {
            const dt = new Date(d.date)
            return `${dt.getMonth() + 1}/${dt.getDate()}`
          }),
          datasets: [
            {
              label: "Understanding",
              data: data.map((d) => d.understanding),
              borderColor: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.1)",
              fill: true,
              tension: 0.3,
              pointRadius: 3,
              pointHoverRadius: 5,
            },
            {
              label: "Retention",
              data: data.map((d) => d.retention),
              borderColor: "#f59e0b",
              backgroundColor: "rgba(245,158,11,0.1)",
              fill: true,
              tension: 0.3,
              pointRadius: 3,
              pointHoverRadius: 5,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { color: "var(--foreground)", font: { size: 12 } },
            },
            tooltip: {
              backgroundColor: "var(--card)",
              titleColor: "var(--foreground)",
              bodyColor: "var(--muted-foreground)",
              borderColor: "var(--border)",
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
            },
          },
          scales: {
            x: {
              ticks: { color: "var(--foreground)", font: { size: 11 } },
              grid: { color: "var(--muted)" },
            },
            y: {
              min: 0,
              max: 100,
              ticks: { color: "var(--foreground)", font: { size: 11 } },
              grid: { color: "var(--muted)" },
            },
          },
        }}
      />
    </div>
  )
}
