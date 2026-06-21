"use client"

import { useState, useEffect } from "react"

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showIOS, setShowIOS] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

    if (isStandalone) return

    setShowIOS(isIOS)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  if (dismissed) return null

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") setDeferredPrompt(null)
    setDismissed(true)
  }

  if (deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border bg-card p-4 shadow-lg">
        <div>
          <p className="text-sm font-medium">Install Syntra</p>
          <p className="text-xs text-muted-foreground">Add to your home screen for the best experience</p>
        </div>
        <div className="ml-auto flex shrink-0 gap-2">
          <button
            onClick={() => setDismissed(true)}
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-600"
          >
            Install
          </button>
        </div>
      </div>
    )
  }

  if (showIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border bg-card p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <p className="flex-1 text-sm">
            Install Syntra on your iPhone: tap the share button{" "}
            <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-xs font-medium">Share</span>{" "}
            then <span className="font-medium">Add to Home Screen</span>.
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return null
}
