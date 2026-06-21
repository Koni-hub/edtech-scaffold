"use client"

import "@/lib/chart-setup"
import { Bar } from "react-chartjs-2"

interface TopicBarChartProps {
  data: { topic: string; understanding: number; retention: number }[]
}

export function TopicBarChart({ data }: TopicBarChartProps) {
  return (
    <div className="w-full h-[250px] sm:h-[300px]">
      <Bar
        data={{
          labels: data.map((d) => d.topic),
          datasets: [
            {
              label: "Understanding",
              data: data.map((d) => d.understanding),
              backgroundColor: "rgba(34,197,94,0.7)",
              borderColor: "#22c55e",
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: "Retention",
              data: data.map((d) => d.retention),
              backgroundColor: "rgba(245,158,11,0.7)",
              borderColor: "#f59e0b",
              borderWidth: 1,
              borderRadius: 4,
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
              grid: { display: false },
            },
            y: {
              min: 0,
              max: 100,
              ticks: { color: "var(--foreground)", font: { size: 11 }, stepSize: 25 },
              grid: { color: "var(--muted)" },
            },
          },
        }}
      />
    </div>
  )
}
