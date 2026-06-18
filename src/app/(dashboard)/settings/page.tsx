"use client"

import { useState, useEffect, useCallback } from "react"
import { User, Save, Loader2, Download, Lock, Target, Sun, Moon, Monitor, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [displayName, setDisplayName] = useState("")
  const [goalQuizzes, setGoalQuizzes] = useState(3)
  const [goalFlashcards, setGoalFlashcards] = useState(10)
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from("profiles")
      .select("display_name, goal_quizzes, goal_flashcards")
      .eq("id", user.id)
      .maybeSingle()
    if (data) {
      setDisplayName(data.display_name || "")
      setGoalQuizzes(data.goal_quizzes ?? 3)
      setGoalFlashcards(data.goal_flashcards ?? 10)
    }
  }, [])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError("Not authenticated"); setLoading(false); return }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        goal_quizzes: goalQuizzes,
        goal_flashcards: goalFlashcards,
      } as never)
      .eq("id", user.id)

    if (updateError) setError(updateError.message)
    else setSaved(true)
    setLoading(false)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters")
      return
    }
    setPwLoading(true)
    setPwSaved(false)
    setPwError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) setPwError(error.message)
    else { setPwSaved(true); setNewPassword("") }
    setPwLoading(false)
  }

  async function handleExportData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [modules, quizzes, attempts, topics] = await Promise.all([
      supabase.from("modules").select("id, title, category, created_at").eq("user_id", user.id),
      supabase.from("quizzes").select("id, title, difficulty, created_at").eq("user_id", user.id),
      supabase.from("quiz_attempts").select("is_correct, attempted_at").eq("user_id", user.id),
      supabase.from("topic_mastery").select("topic, understanding_score, retention_score, total_attempts, correct_attempts").eq("user_id", user.id),
    ])

    const exportData = {
      exported_at: new Date().toISOString(),
      modules: modules.data ?? [],
      quizzes: quizzes.data ?? [],
      quiz_attempts: attempts.data ?? [],
      topic_mastery: topics.data ?? [],
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `syntra-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Data exported!")
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <Card>
        <form onSubmit={handleSaveProfile}>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your display name and daily goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            {saved && <p className="text-sm text-green-500">Profile updated successfully.</p>}
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">Display name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quizzes per day</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={goalQuizzes}
                    onChange={(e) => setGoalQuizzes(Number(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Flashcards per day</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={goalFlashcards}
                    onChange={(e) => setGoalFlashcards(Number(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {loading ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={18} />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <form onSubmit={handleChangePassword}>
          <CardContent className="space-y-4">
            {pwError && <p className="text-sm text-destructive">{pwError}</p>}
            {pwSaved && <p className="text-sm text-green-500">Password updated successfully.</p>}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">New password</label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="outline" disabled={pwLoading}>
              {pwLoading ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
              {pwLoading ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={theme ?? "system"} onValueChange={(v) => setTheme(v ?? "system")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2"><Sun size={14} /> Light</div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2"><Moon size={14} /> Dark</div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2"><Monitor size={14} /> System</div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
          <CardDescription>Export your learning data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleExportData}>
            <Download size={16} />
            Export All Data (JSON)
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Downloads modules, quizzes, attempts, and topic mastery as JSON.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
