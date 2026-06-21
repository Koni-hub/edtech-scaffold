import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar, SidebarProvider } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/dashboard")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 p-3 sm:p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
