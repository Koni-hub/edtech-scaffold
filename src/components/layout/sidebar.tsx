"use client"

import { createContext, useContext, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BrainCircuit, LayoutDashboard, BookOpen, ChartNoAxesCombined, Settings, X, ChevronLeft, PanelLeft, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarContextType {
  open: boolean
  setOpen: (open: boolean) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
  collapsed: false,
  setCollapsed: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  return (
    <SidebarContext.Provider value={{ open, setOpen, collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/modules", label: "Modules", icon: BookOpen },
  { href: "/quizzes", label: "Quizzes", icon: ClipboardCheck },
  { href: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { href: "/settings", label: "Settings", icon: Settings },
]

function NavItems({ collapsed, onClick }: { collapsed?: boolean; onClick?: () => void }) {
  const pathname = usePathname()
  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              collapsed && "justify-center px-2",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && item.label}
          </Link>
        )
      })}
    </>
  )
}

export function Sidebar() {
  const { open, setOpen, collapsed, setCollapsed } = useSidebar()
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:shrink-0 lg:border-r lg:bg-sidebar transition-all duration-200",
          collapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <div className={cn(
          "flex h-14 items-center border-b",
          collapsed ? "justify-center px-0" : "gap-2 px-6"
        )}>
          <BrainCircuit className="size-6 shrink-0 text-primary" />
          {!collapsed && <span className="font-semibold">Syntra</span>}
        </div>

        <nav className={cn("flex-1 space-y-1", collapsed ? "p-2" : "p-4")}>
          <NavItems collapsed={collapsed} />
        </nav>

        <div className={cn("border-t p-2", collapsed && "flex justify-center")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
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
                <span className="font-semibold">Syntra</span>
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
