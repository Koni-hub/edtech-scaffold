"use client"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface TopicRadarChartProps {
  data: { topic: string; understanding: number; retention: number }[]
}

export function TopicRadarChart({ data }: TopicRadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid className="stroke-muted" />
        <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11 }} className="text-muted-foreground" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Legend />
        <Radar
          name="Understanding"
          dataKey="understanding"
          stroke="#22c55e"
          fill="#22c55e"
          fillOpacity={0.2}
        />
        <Radar
          name="Retention"
          dataKey="retention"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
