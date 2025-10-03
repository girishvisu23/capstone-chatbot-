"use client"

import { useState, useRef, useEffect } from "react"
import { ChatHeader } from "./chat-header"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { QuickSuggestions } from "./quick-suggestions"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Welcome to ANDX AI Assistant! I can help you with trading signals, on-chain analytics, portfolio insights, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about "${content}". As ANDX AI Assistant, I can provide insights on AI-driven trading strategies, real-time market analysis, and tokenization opportunities. How would you like me to help you further?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="animate-fade-in">
            <ChatMessage
              message={{
                id: "typing",
                role: "assistant",
                content: "Analyzing...",
                timestamp: new Date(),
              }}
              isTyping
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 pb-6 space-y-4">
        <QuickSuggestions onSuggestionClick={handleSuggestionClick} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
