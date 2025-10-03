"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Send, SlidersHorizontal } from "lucide-react"
import Image from "next/image"

type ChatMessage = {
  sender: "user" | "bot"
  text: string
}

type ApiMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

const SYSTEM_PROMPT = process.env.NEXT_PUBLIC_SYSTEM_PROMPT ??
  "You are a helpful trading and crypto assistant for ANDX. Provide concise, actionable answers. Respond in plain text without using markdown, bullet points, headings, tables, emojis, or special formatting."

export default function AndxChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hello! I'm your ANDX AI Assistant. I can help you with AI trading strategies, crypto market analysis, tokenization insights, and more. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSystemPrompt, setShowSystemPrompt] = useState(false)
  const [customSystemPrompt, setCustomSystemPrompt] = useState(SYSTEM_PROMPT)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const firstScrollRef = useRef(true)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [particles, setParticles] = useState<
    Array<{
      startX: number
      startY: number
      endX: number
      endY: number
      duration: number
    }>
  >([])

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateViewport()
    window.addEventListener("resize", updateViewport)
    return () => window.removeEventListener("resize", updateViewport)
  }, [])

  useEffect(() => {
    if (!viewport.width || !viewport.height) return

    setParticles(
      Array.from({ length: 20 }, () => {
        const startX = Math.random() * viewport.width
        const startY = Math.random() * viewport.height
        return {
          startX,
          startY,
          endX: Math.random() * viewport.width,
          endY: Math.random() * viewport.height,
          duration: Math.random() * 10 + 10,
        }
      })
    )
  }, [viewport.width, viewport.height])

  const buildApiMessages = (history: ChatMessage[], latest?: string): ApiMessage[] => {
    const base: ApiMessage[] = history.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }))

    if (latest) {
      base.push({ role: "user", content: latest })
    }

    return base
  }

  const formatModelReply = (text: string) => {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/^\s*[-*•+]\s+/gm, "")
      .replace(/[*_`~]/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/>\s?/g, "")
      .replace(/\|/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const optimisticMessages: ChatMessage[] = [...messages, { sender: "user", text: trimmed }]
    setMessages(optimisticMessages)
    setInput("")
    setIsLoading(true)

    const shouldAutoScroll = (() => {
      const container = scrollContainerRef.current
      if (!container) return false
      if (firstScrollRef.current) {
        firstScrollRef.current = false
        return true
      }

      const threshold = 120
      return container.scrollHeight - container.scrollTop - container.clientHeight < threshold
    })()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt: customSystemPrompt,
          messages: buildApiMessages(messages, trimmed),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reach AI service")
      }

      const data = (await response.json()) as { reply?: string; error?: string }
      const reply = data.reply ?? data.error ?? "Sorry, something went wrong. Please try again."
      const formattedReply = formatModelReply(reply)

      setMessages((prev) => {
        const updated = [...prev, { sender: "bot", text: formattedReply }]
        if (shouldAutoScroll) {
          requestAnimationFrame(() => {
            const container = scrollContainerRef.current
            if (container) {
              container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
            }
          })
        }
        return updated
      })
    } catch (error) {
      console.error("Chat request failed", error)
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I encountered an error while retrieving information. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    void sendMessage(action)
  }

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#0f1419] to-[#0B0C10] animate-gradient-shift" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00E6B8] rounded-full opacity-30"
            initial={{
              x: particle.startX,
              y: particle.startY,
            }}
            animate={{
              y: [particle.startY, particle.endY],
              x: [particle.startX, particle.endX],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl h-[90vh] mx-4 flex flex-col rounded-3xl bg-[#0B0C10]/40 backdrop-blur-xl border border-[#00E6B8]/30 shadow-2xl shadow-[#00E6B8]/20">
        <header className="flex items-center px-6 py-5 border-b border-[#00E6B8]/30 relative">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#00E6B8] to-[#009E86] flex items-center justify-center text-black font-bold shadow-lg shadow-[#00E6B8]/50"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 230, 184, 0.5)",
                  "0 0 30px rgba(0, 230, 184, 0.8)",
                  "0 0 20px rgba(0, 230, 184, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              ⚡
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <Image src="/andx-logo.png" alt="ANDX" width={80} height={24} className="h-6 w-auto" priority />
                <span className="text-white text-sm font-medium">AI Assistant</span>
              </div>
              <p className="text-xs text-[#CFCFCF]">Powered by andx.global</p>
            </div>
          </div>
          {/* Glowing underline */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00E6B8] to-transparent opacity-60" />
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs text-[#CFCFCF] hover:text-white transition"
            onClick={() => setShowSystemPrompt((prev) => !prev)}
          >
            <SlidersHorizontal size={14} />
            System Prompt
          </button>
        </header>

        {showSystemPrompt && (
          <div className="border-b border-[#00E6B8]/20 bg-[#0B0C10]/60 px-6 py-4 text-xs text-white/80 space-y-2">
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-white/90">Current system prompt</span>
              <textarea
                value={customSystemPrompt}
                onChange={(event) => setCustomSystemPrompt(event.target.value)}
                className="h-24 rounded-xl border border-[#00E6B8]/30 bg-black/20 p-3 text-xs text-white placeholder:text-white/40 focus:border-[#00E6B8] focus:outline-none"
                placeholder="Configure the AI assistant persona..."
              />
            </label>
          </div>
        )}

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`max-w-[75%] ${msg.sender === "user" ? "ml-auto" : ""}`}
            >
              {msg.sender === "bot" ? (
                // Bot message: glassmorphism card
                <div className="p-4 rounded-2xl bg-[#1A1D21]/80 backdrop-blur-sm text-white text-sm leading-relaxed shadow-lg border border-white/5">
                  {msg.text}
                </div>
              ) : (
                // User message: glowing gradient bubble
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00E6B8] to-[#00b894] text-black font-medium text-sm leading-relaxed shadow-lg shadow-[#00E6B8]/30">
                  {msg.text}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-3 px-6 mb-4">
          {["Trading Signals", "On-Chain Analytics", "Portfolio Insights"].map((item, i) => (
            <motion.button
              key={i}
              onClick={() => handleQuickAction(item)}
              className="px-5 py-2 rounded-full border-2 border-[#00E6B8] text-[#00E6B8] text-xs font-medium hover:bg-[#00E6B8]/10 transition-all shadow-md hover:shadow-[#00E6B8]/50"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-3 px-6 py-5 border-t border-[#00E6B8]/30">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  void sendMessage(input)
                }
              }}
              placeholder="Ask me anything about AI trading, crypto markets, or tokenization…"
              className="w-full bg-[#1A1D21]/60 backdrop-blur-sm border-2 border-[#00E6B8]/60 rounded-full px-6 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00E6B8] focus:shadow-lg focus:shadow-[#00E6B8]/30 transition-all"
            />
          </div>
          <motion.button
            onClick={() => void sendMessage(input)}
            className="p-4 rounded-full bg-gradient-to-r from-[#00E6B8] to-[#009E86] text-black hover:from-[#00b894] hover:to-[#008c75] transition-all shadow-lg shadow-[#00E6B8]/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 230, 184, 0.5)",
                "0 0 30px rgba(0, 230, 184, 0.7)",
                "0 0 20px rgba(0, 230, 184, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
