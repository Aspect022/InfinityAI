import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { agentName, agentRole, previousOutput, feedback, userPrompt, requirements } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    const regeneratePrompt = `You are the ${agentName} (${agentRole}).

Previous output that was rejected:
${previousOutput}

User feedback:
${feedback || "User rejected this output. Please regenerate with improvements."}

User's original prompt:
${userPrompt}

Requirements:
${requirements || "N/A"}

Please regenerate your output addressing the feedback. Return ONLY the improved output text, no markdown, no code blocks.`

    const result = await model.generateContent(regeneratePrompt)
    const responseText = result.response.text()

    return NextResponse.json({ 
      regeneratedOutput: responseText.trim(),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("[Regenerate] Error:", error)
    return NextResponse.json(
      { error: "Failed to regenerate output" },
      { status: 500 }
    )
  }
}

