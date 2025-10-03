import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
  isTyping?: boolean
}

export function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3 shadow-lg",
          isUser
            ? "bg-gradient-to-br from-[#00E6B8] to-[#009E86] text-white"
            : "bg-[#1A1D21] text-white border border-[#00E6B8]/10",
        )}
      >
        {isTyping ? (
          <div className="flex gap-1.5 items-center py-1">
            <div className="w-2 h-2 rounded-full bg-[#00E6B8] animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-[#00E6B8] animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-[#00E6B8] animate-bounce" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}
      </div>
    </div>
  )
}
