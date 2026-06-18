interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({ value, size = 80, strokeWidth = 6, className }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  const color =
    value >= 80 ? "stroke-green-500" :
    value >= 60 ? "stroke-amber-500" :
    "stroke-red-500"

  return (
    <div className={`relative ${className ?? ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-500 ${color}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{Math.round(value)}%</span>
      </div>
    </div>
  )
}
