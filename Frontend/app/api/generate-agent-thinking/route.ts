import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { agentName, agentRole, userPrompt } = await request.json()

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are ${agentName}, a ${agentRole}. Generate a stream of consciousness reasoning process as you think about the task. Write in first person, be detailed, show your thought process step by step. Use natural language, show your reasoning flow.`
        },
        {
          role: "user",
          content: `User's request: ${userPrompt}\n\nThink out loud about how you will approach this task. Show your reasoning process in a continuous stream of thoughts.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 500,
    })

    const thinking = completion.choices[0]?.message?.content || "Thinking about the task..."

    return NextResponse.json({ thinking })
  } catch (error) {
    console.error("[Thinking] Error:", error)
    return NextResponse.json(
      { error: "Failed to generate thinking" },
      { status: 500 }
    )
  }
}
