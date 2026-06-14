import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EmptyStateAction {
  label: string
  href?: string
  onClick?: () => void
}

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: EmptyStateAction
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-muted-foreground">{icon}</div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action?.href && (
        <Link href={action.href}>
          <Button>{action.label}</Button>
        </Link>
      )}
      {action?.onClick && !action?.href && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
