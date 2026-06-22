"use client"

import { useChartColors } from "@/lib/use-chart-colors"
import "@/lib/chart-setup"
import { Radar } from "react-chartjs-2"

interface TopicRadarChartProps {
  data: { topic: string; understanding: number; retention: number }[]
}

export function TopicRadarChart({ data }: TopicRadarChartProps) {
  const colors = useChartColors()
  return (
    <div className="w-full" style={{ height: 350 }}>
      <Radar
        data={{
          labels: data.map((d) => d.topic),
          datasets: [
            {
              label: "Understanding",
              data: data.map((d) => d.understanding),
              borderColor: colors.chart1,
              backgroundColor: colors.chart1Fill,
              pointBackgroundColor: colors.chart1,
              pointBorderColor: colors.chart1,
              pointRadius: 3,
            },
            {
              label: "Retention",
              data: data.map((d) => d.retention),
              borderColor: colors.chart2,
              backgroundColor: colors.chart2Fill,
              pointBackgroundColor: colors.chart2,
              pointBorderColor: colors.chart2,
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
            r: {
              min: 0,
              max: 100,
              ticks: { color: colors.mutedForeground, font: { size: 10 }, backdropColor: "transparent" },
              grid: { color: colors.muted },
              angleLines: { color: colors.muted },
              pointLabels: { color: colors.foreground, font: { size: 11 } },
            },
          },
        }}
      />
    </div>
  )
}
