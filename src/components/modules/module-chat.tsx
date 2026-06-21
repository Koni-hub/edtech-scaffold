"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Loader2, Bot, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ModuleChatProps {
  moduleId: string
}

const RATE_LIMIT_MS = 3000

export function ModuleChat({ moduleId }: ModuleChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastSendRef = useRef(0)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || loading || cooldown) return

    const now = Date.now()
    if (now - lastSendRef.current < RATE_LIMIT_MS) {
      setCooldown(true)
      setTimeout(() => setCooldown(false), RATE_LIMIT_MS - (now - lastSendRef.current))
      return
    }

    lastSendRef.current = now
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: text }])
    setLoading(true)

    try {
      const res = await fetch(`/api/modules/${moduleId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setCooldown(true)
        setTimeout(() => setCooldown(false), 30000)
        throw new Error("Quota limit reached. Please wait 30 seconds before asking again.")
      }

      if (!res.ok) throw new Error(data.error ?? "Failed to get response")

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err instanceof Error ? err.message : String(err)}` },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, cooldown, moduleId])

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Bot size={16} />
          Module Chatbot
        </h3>
        <p className="text-xs text-muted-foreground">Ask questions about this handout</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot size={32} className="mb-2 opacity-50" />
            <p className="text-sm">Ask me anything about this module</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot size={14} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User size={14} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot size={14} />
            </div>
            <div className="rounded-lg bg-muted px-3 py-2">
              <Loader2 size={14} className="animate-spin" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={cooldown ? "Please wait..." : "Ask about this module..."}
            disabled={loading || cooldown}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim() || cooldown}>
            {cooldown ? <Clock size={16} /> : <Send size={16} />}
          </Button>
        </form>
      </div>
    </div>
  )
}
