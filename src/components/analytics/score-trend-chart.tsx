"use client"

import { useChartColors } from "@/lib/use-chart-colors"
import "@/lib/chart-setup"
import { Line } from "react-chartjs-2"

interface ScoreTrendChartProps {
  data: { date: string; understanding: number; retention: number }[]
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  const colors = useChartColors()
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
              borderColor: colors.chart1,
              backgroundColor: colors.chart1Fill,
              pointBackgroundColor: colors.chart1,
              pointBorderColor: colors.chart1,
              fill: true,
              tension: 0.3,
              pointRadius: 3,
              pointHoverRadius: 5,
            },
            {
              label: "Retention",
              data: data.map((d) => d.retention),
              borderColor: colors.chart2,
              backgroundColor: colors.chart2Fill,
              pointBackgroundColor: colors.chart2,
              pointBorderColor: colors.chart2,
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
              grid: { color: colors.muted },
            },
            y: {
              min: 0,
              max: 100,
              ticks: { color: colors.foreground, font: { size: 11 } },
              grid: { color: colors.muted },
            },
          },
        }}
      />
    </div>
  )
}
