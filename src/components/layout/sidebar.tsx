"use client"

import { createContext, useContext, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrainCircuit, LayoutDashboard, BookOpen, ChartNoAxesCombined, Settings, FileText, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/modules", label: "Modules", icon: BookOpen },
  { href: "/quizzes", label: "Quizzes", icon: BrainCircuit },
  { href: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/docs", label: "Documentation", icon: FileText },
]

function NavItems({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname()
  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </>
  )
}

export function Sidebar() {
  const { open, setOpen } = useSidebar()
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:border-r lg:bg-sidebar">
        <div className="flex h-14 items-center gap-2 border-b px-6">
          <BrainCircuit className="size-6 text-primary" />
          <span className="font-semibold">LearnHealth</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavItems />
        </nav>
      </aside>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar lg:hidden">
            <div className="flex h-14 items-center justify-between border-b px-6">
              <div className="flex items-center gap-2">
                <BrainCircuit className="size-6 text-primary" />
                <span className="font-semibold">LearnHealth</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              <NavItems onClick={() => setOpen(false)} />
            </nav>
          </aside>
        </>
      )}
    </>
  )
}
