import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    // Check if GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      // Return a simple regenerated output as fallback
      console.log("[v0] GEMINI_API_KEY not found, using fallback regeneration")
      
      return NextResponse.json({ 
        regeneratedOutput: "Regenerated output based on feedback",
        timestamp: new Date().toISOString()
      })
    }
    
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    // Parse the request body
    const body = await request.text()
    let requestData;
    
    try {
      requestData = JSON.parse(body)
    } catch (parseError) {
      console.error("[Regenerate] Failed to parse request body:", body)
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }
    
    const { agentName, agentRole, previousOutput, feedback, userPrompt, requirements } = requestData

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
      { error: "Failed to regenerate output: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
