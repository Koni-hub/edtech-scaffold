"use client"

import { useChartColors } from "@/lib/use-chart-colors"
import "@/lib/chart-setup"
import { Bar } from "react-chartjs-2"

interface TopicBarChartProps {
  data: { topic: string; understanding: number; retention: number }[]
}

export function TopicBarChart({ data }: TopicBarChartProps) {
  const colors = useChartColors()
  return (
    <div className="w-full h-[250px] sm:h-[300px]">
      <Bar
        data={{
          labels: data.map((d) => d.topic),
          datasets: [
            {
              label: "Understanding",
              data: data.map((d) => d.understanding),
              backgroundColor: colors.chart1Bar,
              borderColor: colors.chart1,
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: "Retention",
              data: data.map((d) => d.retention),
              backgroundColor: colors.chart2Bar,
              borderColor: colors.chart2,
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
              labels: { color: colors.foreground, font: { size: 12 } },
            },
            tooltip: {
              backgroundColor: colors.card,
              titleColor: colors.foreground,
              bodyColor: colors.mutedForeground,
              borderColor: colors.border,
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
            },
          },
          scales: {
            x: {
              ticks: { color: colors.foreground, font: { size: 11 } },
              grid: { display: false },
            },
            y: {
              min: 0,
              max: 100,
              ticks: { color: colors.foreground, font: { size: 11 }, stepSize: 25 },
              grid: { color: colors.muted },
            },
          },
        }}
      />
    </div>
  )
}
