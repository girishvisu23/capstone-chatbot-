import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const HF_TOKEN = process.env.HF_TOKEN
const HF_BASE_URL = process.env.HF_BASE_URL ?? "https://router.huggingface.co/v1"
const DEFAULT_MODEL = process.env.HF_CHAT_MODEL ?? "Qwen/Qwen3-Next-80B-A3B-Instruct:novita"

const client = new OpenAI({
  apiKey: HF_TOKEN,
  baseURL: HF_BASE_URL,
})

export async function POST(request: NextRequest) {
  if (!HF_TOKEN) {
    console.error("Chat API error", "Missing HF_TOKEN environment variable")
    return NextResponse.json(
      { error: "Server misconfigured: missing Hugging Face token." },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { messages, systemPrompt } = body as {
      systemPrompt?: string
      messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const resolvedSystemPrompt = systemPrompt?.trim() ||
      process.env.AI_SYSTEM_PROMPT ||
      "You are a helpful trading and crypto assistant for ANDX. Provide concise, actionable answers."

    const sanitized = messages.map((message) => ({
      role: message.role,
      content: message.content.slice(0, 4000),
    }))

    const hfMessages = [
      { role: "system" as const, content: resolvedSystemPrompt },
      ...sanitized,
    ]

    const completion = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: hfMessages,
      temperature: 0.7,
      max_tokens: 512,
    })

    const reply = completion.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      throw new Error("Empty response from model")
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Chat API error", error)
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error: error.error ?? "Model request failed",
          status: error.status,
          type: error.type,
        },
        { status: error.status ?? 500 }
      )
    }
    return NextResponse.json(
      { error: "Failed to fetch response from language model" },
      { status: 500 }
    )
  }
}

