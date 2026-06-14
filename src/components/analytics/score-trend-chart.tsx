"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface ScoreTrendChartProps {
  data: { date: string; understanding: number; retention: number }[]
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
          tickFormatter={(v) => {
            const d = new Date(v)
            return `${d.getMonth() + 1}/${d.getDate()}`
          }}
        />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} className="text-muted-foreground" />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="understanding"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Understanding"
        />
        <Line
          type="monotone"
          dataKey="retention"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Retention"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
