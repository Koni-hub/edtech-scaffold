"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PanelLeft, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { useSidebar } from "@/components/layout/sidebar"
import { SearchPalette } from "@/components/shared/search-palette"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const router = useRouter()
  const { setOpen } = useSidebar()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [displayName, setDisplayName] = useState("User")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle()
      if (profile?.display_name) {
        setDisplayName(profile.display_name)
      } else if (user.user_metadata?.display_name) {
        setDisplayName(user.user_metadata.display_name)
      }
    }
    loadUser()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
      >
        <PanelLeft className="size-5" />
      </Button>

      <div className="flex-1" />

      <SearchPalette />
      <ThemeToggle />

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 rounded-full p-1 hover:bg-muted"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border bg-popover p-1 shadow-md">
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
              <User className="size-4" />
              <span className="truncate">{displayName}</span>
            </div>
            <hr className="my-1" />
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
