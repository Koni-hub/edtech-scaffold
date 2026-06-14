import { BrainCircuit } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-8 text-primary" />
          <h1 className="text-2xl font-bold">LearnHealth</h1>
        </div>
        <Card className="w-full">{children}</Card>
      </div>
    </div>
  )
}
