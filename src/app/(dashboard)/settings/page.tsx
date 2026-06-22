"use client"

import { useState, useEffect, useCallback } from "react"
import { User, Save, Loader2, Download, Lock, Target, Sun, Moon, Monitor, Trash2, Sparkles, CreditCard, ExternalLink } from "lucide-react"
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
  const [billingTier, setBillingTier] = useState("free")
  const [billingStatus, setBillingStatus] = useState<string | null>(null)
  const [quizCount, setQuizCount] = useState(0)
  const [flashcardCount, setFlashcardCount] = useState(0)
  const [enhanceCount, setEnhanceCount] = useState(0)
  const [usageResetAt, setUsageResetAt] = useState<string | null>(null)
  const [billingLoading, setBillingLoading] = useState(false)

  const fetchProfile = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from("profiles")
      .select("display_name, goal_quizzes, goal_flashcards, subscription_tier, subscription_status, quiz_count, flashcard_count, enhance_count, usage_reset_at")
      .eq("id", user.id)
      .maybeSingle()
    if (data) {
      setDisplayName(data.display_name || "")
      setGoalQuizzes(data.goal_quizzes ?? 3)
      setGoalFlashcards(data.goal_flashcards ?? 10)
      setBillingTier(data.subscription_tier ?? "free")
      setBillingStatus(data.subscription_status)
      setQuizCount(data.quiz_count ?? 0)
      setFlashcardCount(data.flashcard_count ?? 0)
      setEnhanceCount(data.enhance_count ?? 0)
      setUsageResetAt(data.usage_reset_at)
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

  async function handleUpgrade() {
    setBillingLoading(true)
    try {
      const res = await fetch("/api/stripe/create-checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error ?? "Failed to create checkout")
    } catch {
      toast.error("Failed to start upgrade")
    }
    setBillingLoading(false)
  }

  async function handleManageBilling() {
    setBillingLoading(true)
    try {
      const res = await fetch("/api/stripe/create-portal", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error ?? "Failed to open billing portal")
    } catch {
      toast.error("Failed to open billing portal")
    }
    setBillingLoading(false)
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
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={18} />
            {billingTier === "pro" ? "Pro Plan" : "Upgrade to Pro"}
          </CardTitle>
          <CardDescription>
            {billingTier === "pro"
              ? "You're on the Pro plan. Enjoy unlimited access!"
              : "Unlock unlimited quizzes, flashcards, and content enhancements."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {billingTier === "pro" ? "Pro" : "Free"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {billingTier === "pro"
                    ? billingStatus === "active" ? "Active" : billingStatus ?? "Unknown"
                    : "Free tier"}
                </p>
              </div>
              {billingTier === "pro" ? (
                <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  $12/mo
                </span>
              )}
            </div>
          </div>

          {billingTier === "free" && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Today's Usage</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span>Quiz generations</span>
                  <span className={quizCount >= 3 ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {quizCount} / 3
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Flashcard generations</span>
                  <span className={flashcardCount >= 5 ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {flashcardCount} / 5
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Content enhances</span>
                  <span className={enhanceCount >= 3 ? "text-destructive font-medium" : "text-muted-foreground"}>
                    {enhanceCount} / 3
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            onClick={billingTier === "pro" ? handleManageBilling : handleUpgrade}
            disabled={billingLoading}
          >
            {billingLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                {billingTier === "pro" ? (
                  <><CreditCard size={16} /> Manage Billing</>
                ) : (
                  <><Sparkles size={16} /> Upgrade to Pro — $12/mo</>
                )}
              </>
            )}
          </Button>
        </CardContent>
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
