"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything about AI trading, crypto markets, or tokenization…"
        className="w-full bg-[#1A1D21] text-white placeholder:text-[#CFCFCF]/50 rounded-xl px-5 py-4 pr-14 border-2 border-[#00E6B8]/20 focus:border-[#00E6B8] focus:outline-none focus:ring-2 focus:ring-[#00E6B8]/30 transition-all duration-300 shadow-lg"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!input.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#00E6B8] to-[#009E86] hover:from-[#00E6B8] hover:to-[#00b89a] text-white rounded-lg h-10 w-10 shadow-lg shadow-[#00E6B8]/30 hover:shadow-[#00E6B8]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
